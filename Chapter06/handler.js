'use strict';

const aws = require('aws-sdk');
const uuid = require('uuid');

module.exports.get = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Cache-Control': 'max-age=3',
    },
    body: JSON.stringify({
      message: 'Success',
      input: event,
      v1: process.env.V1
    }),
  };

  callback(null, response);
};

