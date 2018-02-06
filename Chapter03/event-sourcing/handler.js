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
    .map(toEvent)
    .tap(print)
    .map(toRecord)
    .tap(print)
    .batch(25)    
    .flatMap(publish)
    .collect()
    .toCallback(cb);
};

const toEvent = record => ({
  id: uuid.v1(),
  type: `item-${record.eventName.toLowerCase()}`,
  timestamp: record.dynamodb.ApproximateCreationDateTime * 1000,
  partitionKey: record.dynamodb.Keys.id.S,
  item: {
    old: record.dynamodb.OldImage ?
      aws.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage) :
      undefined,
    new: record.dynamodb.NewImage ?
      aws.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage) :
      undefined,
  },
});

const toRecord = event => (      {
  PartitionKey: event.partitionKey,
  Data: new Buffer(JSON.stringify(event)),
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

const print = value => console.log('value: %j', value);