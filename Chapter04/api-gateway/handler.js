'use strict';

const aws = require('aws-sdk');
const uuid = require('uuid');

aws.config.update({
  logger: { log: msg => console.log(msg) },
});

module.exports.save = (event, context, callback) => {
  console.log(JSON.stringify(event, null, 2));

  const body = JSON.parse(event.body);

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: Object.assign(
      {
        id: event.pathParameters.id,
        // lastModifiedBy: event.requestContext.authorizer.claims['cognito:username'],
      },
      body
    )
  };

  const db = new aws.DynamoDB.DocumentClient();

  db.put(params).promise()
    .then((result) => {
      // console.log(result);
      callback(null, {
          statusCode: 200,
          headers: {
            'access-control-allow-origin': '*', // CORS support
            'cache-control': 'no-cache',
          },
        });
    }, (err) => {
      callback(err);
    });
};

module.exports.get = (event, context, callback) => {
  const id = event.pathParameters.id;

  const db = new aws.DynamoDB.DocumentClient();
  
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: id,
    },
  };

  db.get(params).promise()
    .then((data) => {
      // console.log(data);
      callback(null, {
        statusCode: 200,
        headers: {
          'access-control-allow-origin': '*',
          'cache-control': 'max-age=3',
        },
        body: JSON.stringify(data),
      });
    }, (err) => {
      callback(err);
    });
};

module.exports.delete = (event, context, callback) => {
  const id = event.pathParameters.id;

  const db = new aws.DynamoDB.DocumentClient();
  
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: id,
    },
  };

  db.delete(params).promise()
    .then((result) => {
      console.log(result);
      callback(null, {
        statusCode: 204,
        headers: {
          'access-control-allow-origin': '*',
          'cache-control': 'no-cache',
        },
      });
    }, (err) => {
      callback(err);
    });
};

module.exports.echo = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // CORS support
      'Cache-Control': 'max-age=3',
    },
    body: JSON.stringify({
      message: 'Success',
      input: event,
      // claims: event.requestContext.authorizer.claims,
    }),
  };

  callback(null, response);
};

