import 'mocha';
import { expect } from './expect';
import * as sinon from 'sinon';
import * as Promise from 'bluebird';
import * as _ from 'highland';
import * as uuid from 'uuid';
import { handle, Handler } from '../../src/listener';
import { Connector } from '../../src/connectors/stream';

let sandbox;

describe('listener.ts', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('handle', (done) => {
    const stub = sandbox.stub(Handler.prototype, 'handle').callsFake(() => _([1]));

    handle(EVENT, {}, (err, response) => {
      expect(stub).to.have.been.calledWith(EVENT);
      done(err);
    });
  });

  it('listen', (done) => {
    const stub = sandbox.stub(Connector.prototype, 'publish').callsFake(() => Promise.resolve({}));

    new Handler().handle(EVENT)
      // .tap(console.log)
      .collect()
      .tap((response) => {
        expect(stub).to.have.been.calledWith();
      })
      .done(done)
      ;
  });
});

const EVENT = {
  Records: [
    {
      kinesis: {
        data: new Buffer(JSON.stringify({
          id: '1',
          type: 'order-submitted',
          order: {
            id: '1',
          },
        })).toString('base64'),
      },
    },
    {
      kinesis: {
        data: new Buffer(JSON.stringify({
          id: '2',
          type: 'order-received',
          context: {
            order: {
              id: '2',
            },
          },
        })).toString('base64'),
      },
    },
  ],
};
