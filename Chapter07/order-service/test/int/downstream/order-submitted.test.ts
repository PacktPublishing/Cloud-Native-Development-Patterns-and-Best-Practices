import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as uuid from 'uuid';
import * as _ from 'highland';
import * as aws from 'aws-sdk';

import { handle } from '../../../src/trigger';

const EVENT = require('../../../fixtures/downstream/order-submitted.json');

let sandbox;

describe('trigger', () => {
  before(() => {
    process.env.STREAM_NAME = 'cndp-event-stream';

    aws.config.update({
      region: 'us-east-1',
    });

    const replay = require('baton-vcr-replay-for-aws-sdk');
    replay.fixtures = './fixtures/downstream';
    // console.log(`Replay mode = ${replay.mode}`);
  });

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should publish order-submitted', (done) => {
    sandbox.stub(uuid, 'v1').callsFake(() => {
      // hold the event id constant
      return '00000000-0000-0000-0000-000000000001';
    });

    handle(EVENT, {}, done);
  });

});

