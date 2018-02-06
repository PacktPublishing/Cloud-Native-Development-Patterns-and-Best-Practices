import 'mocha';
import { expect } from './expect';
import * as sinon from 'sinon';
import * as Promise from 'bluebird';
import * as uuid from 'uuid';
import { handle, Handler } from '../../src/get';
import { Connector } from '../../src/connectors/database';

let sandbox;

describe('get.ts', () => {
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

  it('get', () => {
    const stub = sandbox.stub(Connector.prototype, 'getById').callsFake(() => Promise.resolve({
      id: '00000000-0000-0000-0000-000000000000',
      status: 'submitted',
    }));

    return new Handler().handle(EVENT)
      // .tap(console.log)
      .tap((response) => {
        expect(stub).to.have.been.calledWith(EVENT.pathParameters.id);
        expect(response).to.deep.equal({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Cache-Control': 'max-age=3',
          },
          body: JSON.stringify({
            id: '00000000-0000-0000-0000-000000000000',
            status: 'submitted',
          }),
        });
      })
      ;
  });

  it('get 404', () => {
    const stub = sandbox.stub(Connector.prototype, 'getById').callsFake(() => Promise.resolve());

    return new Handler().handle(EVENT)
      // .tap(console.log)
      .tap((response) => {
        expect(stub).to.have.been.calledWith(EVENT.pathParameters.id);
        expect(response).to.deep.equal({
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Cache-Control': 'max-age=3',
          },
          body: JSON.stringify(undefined),
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
  httpMethod: 'GET',
};
