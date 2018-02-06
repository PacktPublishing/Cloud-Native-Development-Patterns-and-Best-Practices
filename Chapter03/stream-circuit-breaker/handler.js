'use strict';

const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.publish = (evt, context, callback) => {
  const goodEvent = {
    id: uuid.v1(),
    type: 'item-created',
    timestamp: Date.now(),
    item: {
      id: uuid.v4(),
      name: 'Cloud Native Development Patterns and Best Practices',
      description: 'Practical architectural patterns for building modern distributed cloud native systems',
    }
  };

  const invalidItemEvent = {
    id: uuid.v1(),
    type: 'item-created',
    timestamp: Date.now(),
    item: {
      id: uuid.v4(),
      description: 'no name provided',
    }
  };

  const badRecordEvent = {
    id: uuid.v1(),
    type: 'item-updated',
    timestamp: Date.now(),
    item: {
      name: 'no id specified'
    }
  };

  const params = {
    StreamName: process.env.STREAM_NAME,
    Records: [
      {
        PartitionKey: goodEvent.item.id,
        Data: new Buffer(JSON.stringify(goodEvent)),
      },
      {
        PartitionKey: invalidItemEvent.item.id,
        Data: new Buffer(JSON.stringify(invalidItemEvent)),
      },
      {
        PartitionKey: uuid.v4(),
        Data: new Buffer(JSON.stringify(badRecordEvent)),
      },
    ]
  };

  console.log('params: %j', params);

  const kinesis = new aws.Kinesis();

  kinesis.putRecords(params).promise()
    .then(resp => callback(null, resp))
    .catch(err => callback(err));
};

module.exports.consume = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToUow)
    .tap(print)
    .filter(forItemCreateOrUpdated)
    .tap(validate)
    .tap(randomError)
    .ratelimit(3, 30)
    .map(save)
    .parallel(3)
    .errors(errors)
    .collect()
    .toCallback(cb);
};

const print = uow => console.log('uow: %j', uow);

const recordToUow = r => ({
  record: r,
  event: JSON.parse(new Buffer(r.kinesis.data, 'base64'))
});

const forItemCreateOrUpdated = uow => uow.event.type === 'item-created' || uow.event.type === 'item-updated';

const validate = uow => {
  if (uow.event.item.name === undefined) {
    const err = new Error('Validation Error: name is required');
    err.uow = uow;
    throw err;
  }
}

const randomError = () => {
  if (Math.floor((Math.random() * 5) + 1) === 3) {
    // unhandled
    throw new Error('Random Error');
  }
}

const save = uow => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: uow.event.item,
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient({ 
    httpOptions: { timeout: 1000 } 
  });

  return _(db.put(params).promise()
    .catch(err => {
      err.uow = uow;
      throw err;
    }));
}

const errors = (err, push) => {
  if (err.uow) {
    // handled exceptions are adorned with the uow in error
    push(null, publish({
      type: 'fault',
      timestamp: Date.now(),
      tags: {
        functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
      },
      err: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
      uow: err.uow,
    }));
  } else {
    // rethrow unhandled errors to stop processing
    push(err);
  }
}

const publish = event => {
  const params = {
    StreamName: process.env.STREAM_NAME,
    PartitionKey: uuid.v4(),
    Data: new Buffer(JSON.stringify(event)),
  };

  console.log('params: %j', params);

  const kinesis = new aws.Kinesis({ 
    httpOptions: { timeout: 1000 } 
  });
  return _(kinesis.putRecord(params).promise());
}