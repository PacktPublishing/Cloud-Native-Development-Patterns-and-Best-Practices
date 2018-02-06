'use strict';

const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.command = (evt, context, callback) => {
  const item = {
    id: uuid.v4(),
    name: 'Cloud Native Development Patterns and Best Practices',
  };

  const first = {
    id: uuid.v1(),
    type: 'item-created',
    timestamp: Date.now(),
    item: Object.assign(
      {},
      item,
      {
        description: 'via created event',
      })
  };

  const second = {
    id: uuid.v1(),
    type: 'item-updated',
    timestamp: Date.now() + 1000,
    item: Object.assign(
      {},
      item,
      {
        description: 'via updated event',
      })
  };

  const params = {
    StreamName: process.env.STREAM_NAME,
    Records: [
      {
        PartitionKey: second.item.id,
        Data: new Buffer(JSON.stringify(second)),
      },
      {
        PartitionKey: first.item.id,
        Data: new Buffer(JSON.stringify(first)),
      },
    ]
  };

  console.log('params: %j', params);

  const kinesis = new aws.Kinesis();

  kinesis.putRecords(params).promise()
    .then(resp => callback(null, resp))
    .catch(err => callback(err));
};

module.exports.consumer = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToUow)
    .tap(print)
    .filter(forItemCreateOrUpdated)
    .flatMap(save)
    .tap(print)
    .collect().toCallback(cb);
};

const print = uow => console.log('uow: %j', uow);

const recordToUow = r => ({
  record: r,
  event: JSON.parse(new Buffer(r.kinesis.data, 'base64'))
});

const forItemCreateOrUpdated = uow => uow.event.type === 'item-created' || uow.event.type === 'item-updated';

const save = uow => {
  const params = {
    TableName: process.env.VIEW_TABLE_NAME,
    Item: {
      // map the identifier
      id: uow.event.item.id,

      // map the fields needed for the view
      name: uow.event.item.name,
      description: uow.event.item.description,
      
      // include the timestamp
      oplock: uow.event.timestamp,
    },
    // attribute_not_exists accounts for inserts
    ConditionExpression: 'attribute_not_exists(#oplock) OR #oplock < :timestamp',
    ExpressionAttributeNames: {
      '#oplock': 'oplock'
    },
    ExpressionAttributeValues: {
      ':timestamp': uow.event.timestamp
    },
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();

  return _(db.put(params).promise()
    .catch(err => {
      console.log(err);
      if (err.code !== 'ConditionalCheckFailedException') {
        err.uow = uow;
        throw err;
      }
    })
    .then(() => uow)
  );
}
