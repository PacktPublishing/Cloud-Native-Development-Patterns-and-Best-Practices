'use strict';

const aws = require('aws-sdk');
const uuid = require('uuid');

module.exports.publish = (evt, context, callback) => {
  const item = {
    id: uuid.v4(),
    name: 'Cloud Native Development Patterns and Best Practices',
    description: 'Practical architectural patterns for building modern distributed cloud native systems',
  };

  const event = {
    id: uuid.v1(),
    type: 'item-inserted',
    timestamp: Date.now(),
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
