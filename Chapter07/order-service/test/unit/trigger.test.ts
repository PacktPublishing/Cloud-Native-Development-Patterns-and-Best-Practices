import 'mocha';
import { expect } from './expect';
import * as sinon from 'sinon';
import * as Promise from 'bluebird';
import * as uuid from 'uuid';
import * as _ from 'highland';
import { handle, Handler } from '../../src/trigger';
import { Connector } from '../../src/connectors/stream';

let sandbox;

describe('trigger.ts', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('handle', (done) => {
    const stub = sandbox.stub(Handler.prototype, 'handle').callsFake(() => _(EVENT.Records));

    handle(EVENT, {}, (err, response) => {
      expect(stub).to.have.been.calledWith(EVENT);
      done(err);
    });
  });

  it('trigger', (done) => {
    const stub = sandbox.stub(Connector.prototype, 'publish').callsFake(() => Promise.resolve({}));

    sandbox.stub(uuid, 'v1').callsFake(() => {
      return '90fddb30-d272-11e7-8a74-6d5ecc142e5f';
    });

    new Handler().handle(EVENT)
      // .tap(console.log)
      .collect()
      .tap((batch) => {
        expect(stub).to.have.been.calledWith([{
          Data: new Buffer(JSON.stringify({
            id: '90fddb30-d272-11e7-8a74-6d5ecc142e5f',
            type: 'order-submitted',
            timestamp: 1511675340000,
            partitionKey: '00000000-0000-0000-0000-000000000000',
            order: {
              id: '00000000-0000-0000-0000-000000000000',
              status: 'submitted',
            },
          })),
          PartitionKey: '00000000-0000-0000-0000-000000000000',
        }]);
      })
      .done(done)
      ;
  });
});

const EVENT = {
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
