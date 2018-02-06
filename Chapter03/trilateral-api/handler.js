'use strict';

module.exports.command = (event, context, callback) => {
  console.log('event: %j', event);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'Cloud Native Development Patterns and Best Practices! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);
};

module.exports.query = (event, context, callback) => {
  console.log('event: %j', event);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'Cloud Native Development Patterns and Best Practices! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);
};

module.exports.publish = (event, context, callback) => {
  console.log('event: %j', event);
  callback();
};

module.exports.consume = (event, context, cb) => {
  console.log('event: %j', event);
  callback();
};
