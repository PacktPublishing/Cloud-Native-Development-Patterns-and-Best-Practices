import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as uuid from 'uuid';
import * as _ from 'highland';
import * as aws from 'aws-sdk';

import { handle } from '../../../src/trigger';

let sandbox;

describe('trigger', () => {
  before(() => {
    process.env.STREAM_NAME = 'cndp-event-stream';

    aws.config.update({
      region: 'us-east-1',
    });

    const replay = require('baton-vcr-replay-for-aws-sdk');
    replay.fixtures = './fixtures';
    // console.log(`Replay mode = ${replay.mode}`);
  });

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('submit', (done) => {
    sandbox.stub(uuid, 'v1').callsFake(() => {
      // hold the event id constant
      return '90fddb30-d272-11e7-8a74-6d5ecc142e5f';
    });

    handle(SUBMIT_EVENT, {}, (err, res) => {
      done(err);
    });
  });

});

const SUBMIT_EVENT = {
  Records: [
    {
      eventID: '5c71a9720d173d693e144bd5686e3b32',
      eventName: 'INSERT',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'us-east-1',
      dynamodb: {
        ApproximateCreationDateTime: 1511675340,
        Keys: {
          id: {
            S: '00000000-0000-0000-0000-000000000000',
          },
        },
        NewImage: {
          id: {
            S: '00000000-0000-0000-0000-000000000000',
          },
          status: {
            S: 'submitted',
          },
        },
        SequenceNumber: '300000000015408457238',
        SizeBytes: 91,
        StreamViewType: 'NEW_AND_OLD_IMAGES',
      },
      eventSourceARN: 'arn:aws:dynamodb:us-east-1:xxxxxxxxxxxx:table/dev-cndp-order-service-orders/stream/2017-11-26T05:15:52.286',
    },
  ],
};
