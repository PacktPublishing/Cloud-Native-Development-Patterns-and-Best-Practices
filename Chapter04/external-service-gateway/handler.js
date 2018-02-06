'use strict';

const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.trigger = (extEvent, context, callback) => {
  console.log('external event: %j', extEvent);

  const event = {
    id: uuid.v1(),
    type: extEvent.triggerSource,
    timestamp: Date.now(),
    partitionKey: extEvent.userName,
    raw: extEvent,
    user: {
      id: extEvent.request.userAttributes.sub,
      username: extEvent.userName,
      email: extEvent.request.userAttributes.email,
      status: extEvent.request.userAttributes['cognito:user_status']
    }
  };

  const params = {
    StreamName: process.env.STREAM_NAME,
    PartitionKey: event.partitionKey,
    Data: new Buffer(JSON.stringify(event)),
  };

  console.log('params: %j', params);

  const kinesis = new aws.Kinesis();
  kinesis.putRecord(params).promise()
    .then(resp => callback(null, extEvent))
    .catch(err => callback(err));
};

module.exports.consumer = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToUow)
    // .tap(print)
    .filter(forUserInvited)
    .flatMap(createUser)
    // .tap(print)
    .collect().toCallback(cb);
};

const print = e => console.log('event: %j', e);

const recordToUow = r => ({
  record: r,
  event: JSON.parse(new Buffer(r.kinesis.data, 'base64'))
});

const forUserInvited = uow => uow.event.type === 'user-invited';

const createUser = uow => {
  const userPool = new aws.CognitoIdentityServiceProvider();

  uow.params = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: uow.event.user.id,
    // TemporaryPassword: 'P@ssword01',
    DesiredDeliveryMediums: ['EMAIL'],
    ForceAliasCreation: false,
    UserAttributes: [
      { Name: 'name', Value: uow.event.user.name },
      { Name: 'email', Value: uow.event.user.email },
      { Name: 'email_verified', Value: 'true' },
    ],
  };

  return _(userPool.adminCreateUser(uow.params).promise());
}

module.exports.publish = (evt, context, callback) => {
  const user = {
    id: uuid.v4(),
    email: 'fred.user@mailinator.com',
    name: 'Fred User',
  };

  const event = {
    id: uuid.v1(),
    type: 'user-invited',
    timestamp: Date.now(),
    user: user
  };

  const params = {
    StreamName: process.env.STREAM_NAME,
    PartitionKey: user.id,
    Data: new Buffer(JSON.stringify(event)),
  };

  console.log('params: %j', params);

  const kinesis = new aws.Kinesis();

  kinesis.putRecord(params).promise()
    .then(resp => callback(null, resp))
    .catch(err => callback(err));
};
