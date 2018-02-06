'use strict';

const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.command = (event, context, callback) => {
  const item = {
    id: uuid.v4(),
    name: 'Cloud Native Development Patterns and Best Practices',
    description: 'Practical architectural patterns for building modern distributed cloud native systems',
  };

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: item,
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();

  db.put(params).promise()
    .then(resp => callback(null, resp))
    .catch(err => callback(err));
};

module.exports.trigger = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .tap(r => console.log('record: %j', r))
    .flatMap(putObject)
    .collect().toCallback(cb);
};

const putObject = (record) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `items/${record.dynamodb.Keys.id.S}`,
    Body: JSON.stringify(record.dynamodb.NewImage),
  };

  console.log('params: %j', params);

  const db = new aws.S3();
  return _(db.putObject(params).promise());
};
