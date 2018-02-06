import 'mocha';
import { expect } from 'chai';
const AWS = require('aws-sdk-mock');
import { Connector } from '../../../src/connectors/stream';

describe('stream.ts', () => {
  it('publish', () => {
    AWS.mock('Kinesis', 'putRecords', (params, callback) => {
      expect(params).to.deep.equal({
        StreamName: 'stream',
        Records: [{
          PartitionKey: '1',
          Data: new Buffer(JSON.stringify({ id: '1' })),
        }],
      });

      callback(null, {});
    });

    return new Connector('stream').publish([{
      PartitionKey: '1',
      Data: new Buffer(JSON.stringify({ id: '1' })),
    }])
      .then(data => expect(data).to.deep.equal({}))
      ;
  });

  afterEach(() => {
    AWS.restore('Kinesis');
  });
});
