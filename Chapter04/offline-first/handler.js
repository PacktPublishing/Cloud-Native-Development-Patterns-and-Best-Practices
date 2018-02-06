'use strict';

const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.trigger = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .flatMap(recordToUow1)
    .tap(print)
    .filter(forCognitoSync)
    .map(toEvents)
    .tap(print)
    .map(toRecord)
    .batch(25)
    .flatMap(publish)
    .collect().toCallback(cb);
};

module.exports.consumer = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToUow2)
    .tap(print)
    .filter(forCounterUpdated)
    .flatMap(square)
    .tap(print)
    .collect().toCallback(cb);
};

const print = e => console.log('event: %j', e);

const recordToUow1 = r => {
  const data = JSON.parse(new Buffer(r.kinesis.data, 'base64'));
  if (!data.kinesisSyncRecords) return _();
  return _(data.kinesisSyncRecords.map(sync => ({
    record: r,
    data: data,
    sync: sync
  })));
}

const recordToUow2 = r => {
  return {
    record: r,
    event: JSON.parse(new Buffer(r.kinesis.data, 'base64')),
  };
}

const forCognitoSync = uow => uow.sync.key === 'count';
const forCounterUpdated = uow => uow.event && uow.event.type &&
  uow.event.type === 'counter-updated';

const toEvents = uow => {
  uow.event = {
    id: uuid.v1(),
    type: `counter-updated`,
    timestamp: uow.sync.lastModifiedDate,
    partitionKey: uow.record.kinesis.partitionKey,
    tags: {
      identityPoolId: uow.data.identityPoolId,
      identityId: uow.data.identityId,
      datasetName: uow.data.datasetName
    },
    record: uow.sync
  }
  return uow;
}

const toRecord = uow => ({
  PartitionKey: uow.event.partitionKey,
  Data: new Buffer(JSON.stringify(uow.event)),
})

const publish = records => {
  const params = {
    StreamName: process.env.STREAM_NAME,
    Records: records
  };

  print(params);

  const kinesis = new aws.Kinesis();
  return _(kinesis.putRecords(params).promise());
}

const square = uow => {
  const cognitosync = new aws.CognitoSync();

  uow.params = {
    IdentityPoolId: uow.event.tags.identityPoolId,
    IdentityId: uow.event.tags.identityId,
    DatasetName: uow.event.tags.datasetName
  };

  return _(
    cognitosync.listRecords(uow.params).promise()
      .then(data => {
        uow.params.SyncSessionToken = data.SyncSessionToken;
        uow.params.RecordPatches = [{
          Key: 'squared',
          Value: String(Math.pow(Number(uow.event.record.value), 2)),
          Op: 'replace',
          SyncCount: data.DatasetSyncCount
        }];

        return cognitosync.updateRecords(uow.params).promise()
      })
  );
}