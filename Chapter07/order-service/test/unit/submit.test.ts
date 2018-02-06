import 'mocha';
import { expect } from './expect';
import * as sinon from 'sinon';
import * as Promise from 'bluebird';
import * as uuid from 'uuid';
import { handle, Handler } from '../../src/submit';
import { Connector } from '../../src/connectors/database';

let sandbox;

describe('submit.ts', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('handle', (done) => {
    const stub = sandbox.stub(Handler.prototype, 'handle').callsFake(() => Promise.resolve({}));

    handle(EVENT, {}, (err, response) => {
      expect(stub).to.have.been.calledWith(EVENT);
      done(err);
    });
  });

  it('submit', () => {
    const stub = sandbox.stub(Connector.prototype, 'save').callsFake(() => Promise.resolve({}));

    return new Handler().handle(EVENT)
      // .tap(console.log)
      .tap((response) => {
        expect(stub).to.have.been.calledWith(JSON.parse(EVENT.body));
        expect(response).to.deep.equal({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Cache-Control': 'no-cache',
          },
        });
      })
      ;
  });
});

const EVENT = {
  pathParameters: {
    id: '00000000-0000-0000-0000-000000000000',
  },
  resource: '/orders',
  httpMethod: 'PUT',
  body: '{"id": "00000000-0000-0000-0000-000000000000","status":"submitted"}',
};
