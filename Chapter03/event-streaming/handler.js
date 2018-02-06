'use strict';

const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.publish = (evt, context, callback) => {
  const item = {
    id: uuid.v4(),
    status: 'submitted',
    name: 'Cloud Native Development Patterns and Best Practices',
    description: 'Practical architectural patterns for building modern distributed cloud native systems',
  };

  const event = {
    id: uuid.v1(),
    type: 'item-submitted',
    timestamp: Date.now(),
    tags: {
      userId: uuid.v4(),
    },
    item: item
  };

  const params = {
    StreamName: process.env.STREAM_NAME,
    PartitionKey: item.id,
    Data: new Buffer(JSON.stringify(event)),
  };

  console.log('params: %j', params);

  const kinesis = new aws.Kinesis();

  kinesis.putRecord(params).promise()
    .then(resp => callback(null, resp))
    .catch(err => callback(err));
};

module.exports.consume = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToEvent)
    .filter(forItemSubmitted)
    .tap(print)
    .collect().toCallback(cb);
};

const recordToEvent = r =>
  JSON.parse(new Buffer(r.kinesis.data, 'base64'));
const forItemSubmitted = e => e.type === 'item-submitted';
const print = e => console.log('event: %j', e);
