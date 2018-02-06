import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as uuid from 'uuid';
import * as _ from 'highland';
import * as aws from 'aws-sdk';

import * as relay from 'baton-event-relay';

import { handle } from '../../../src/listener';
import * as utils from '../../../src/utils';

let sandbox;

describe('order-submitted-relay', () => {
  before(() => {
    process.env.STREAM_NAME = 'cndp-event-stream';

    aws.config.update({
      region: 'us-east-1',
    });

    const replay = require('baton-vcr-replay-for-aws-sdk');
    // console.log(`Replay mode = ${replay.mode}`);
  });

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should process the order-submitted event', (done) => {
    const rec = relay(`./fixtures/upstream/order-submitted`);

    sandbox.stub(uuid, 'v1').callsFake(() => {
      // hold the event id constant
      return '00000000-0000-0000-0000-000000000002';
    });

    sandbox.stub(utils, 'now').callsFake(() => {
      // hold the timestamp constant
      return 1512975699218;
    });

    // clock = sandbox.useFakeTimers(new Date(1512975699218), 'Date');

    handle(rec.event, {}, done);
  });
});

