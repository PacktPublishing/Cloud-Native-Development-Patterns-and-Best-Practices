'use strict';

const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

aws.config.update({
  logger: { log: msg => console.log(msg) },
});

module.exports.command = (evt, context, callback) => {
  const userId = uuid.v4();
  const userId2 = uuid.v4();

  const params = {
    StreamName: process.env.STREAM_NAME,
    Records: [
      {
        PartitionKey: userId,
        Data: new Buffer(JSON.stringify({
          id: uuid.v1(),
          type: 'user-created',
          timestamp: Date.now(),
          user: {
            id: userId,
            name: 'Fred User'
          }
        })),
      },
      {
        PartitionKey: userId,
        Data: new Buffer(JSON.stringify({
          id: uuid.v1(),
          type: 'user-loggedIn',
          timestamp: Date.now(),
          user: {
            id: userId
          }
        })),
      },
      {
        PartitionKey: userId,
        Data: new Buffer(JSON.stringify({
          id: uuid.v1(),
          type: 'order-submitted',
          timestamp: Date.now(),
          order: {
            userId: userId
          }
        })),
      },
      {
        PartitionKey: userId2,
        Data: new Buffer(JSON.stringify({
          id: uuid.v1(),
          type: 'user-loggedIn',
          timestamp: Date.now(),
          user: {
            id: userId2
          }
        })),
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
    .filter(byType)
    .flatMap(saveEvent)
    .tap(print)
    .collect().toCallback(cb);
};

const print = uow => console.log('uow: %j', uow);

const recordToUow = r => ({
  record: r,
  event: JSON.parse(new Buffer(r.kinesis.data, 'base64'))
});

const byType = uow =>
  uow.event.type === 'user-created' ||
  uow.event.type === 'user-loggedIn' ||
  uow.event.type === 'order-submitted';

const saveEvent = uow => {
  const params = {
    TableName: process.env.EVENTS_TABLE_NAME,
    Item: {
      id: uow.event.user ? uow.event.user.id : uow.event.order.userId,
      sequence: uow.record.kinesis.sequenceNumber,
      event: uow.event,
    }
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();

  return _(db.put(params).promise()
    .then(() => uow)
  );
}

module.exports.trigger = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .tap(r => console.log('record: %j', r))
    .flatMap(getRelatedEvents)
    .map(view)
    .tap(uow => console.log('%j', uow))
    .flatMap(saveView)
    .collect().toCallback(cb);
};

const getRelatedEvents = (record) => {
  const params = {
    TableName: process.env.EVENTS_TABLE_NAME,
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'id'
    },
    ExpressionAttributeValues: {
      ':id': record.dynamodb.Keys.id.S
    }
  };

  const db = new aws.DynamoDB.DocumentClient();

  return _(db.query(params).promise()
    .then(data => ({
      record: record,
      data: data,
    }))
  );
}

const view = (uow) => {
  // create a dictionary by event type
  uow.dictionary = uow.data.Items.reduce((dictionary, item) => {
    // events are sorted by range key
    item.event.type === 'order-submitted' ?
      dictionary[item.event.type].push(item.event) :
      dictionary[item.event.type] = item.event;

    return dictionary;
  }, { // default values
      'user-created': { user: { name: undefined } },
      'user-loggedIn': { timestamp: undefined },
      'order-submitted': []
    });

  // map the fields
  uow.item = {
    id: uow.record.dynamodb.Keys.id.S,
    name: uow.dictionary['user-created'].user.name,
    lastLogin: uow.dictionary['user-loggedIn'].timestamp,
    recentOrderCount: uow.dictionary['order-submitted'].length,
  };

  return uow;
}

const saveView = (uow) => {
  const params = {
    TableName: process.env.VIEW_TABLE_NAME,
    Item: uow.item,
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();
  return _(db.put(params).promise());
};
