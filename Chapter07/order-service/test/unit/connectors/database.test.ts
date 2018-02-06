import 'mocha';
import { expect } from 'chai';
const AWS = require('aws-sdk-mock');
import { Connector } from '../../../src/connectors/database';

describe('database.ts', () => {
  it('save', () => {
    AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      expect(params).to.deep.equal({
        TableName: 'orders',
        Item: {
          id: '00000000-0000-0000-0000-000000000000',
          status: 'submitted',
        },
      });

      callback(null, {});
    });

    return new Connector('orders').save({
      id: '00000000-0000-0000-0000-000000000000',
      status: 'submitted',
    })
      .then(data => expect(data).to.deep.equal({}))
      ;
  });

  it('getById', () => {
    AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
      expect(params).to.deep.equal({
        TableName: 'orders',
        Key: {
          id: '00000000-0000-0000-0000-000000000000',
        },
      });

      callback(null, {
        Item: {
          id: '00000000-0000-0000-0000-000000000000',
          status: 'submitted',
        },
      });
    });

    return new Connector('orders').getById('00000000-0000-0000-0000-000000000000')
      .then(data => expect(data).to.deep.equal({
        id: '00000000-0000-0000-0000-000000000000',
        status: 'submitted',
      }));
  });

  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });
});
