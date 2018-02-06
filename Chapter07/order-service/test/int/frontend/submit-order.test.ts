import 'mocha';
import { expect } from 'chai';

import * as supertest from 'supertest';
import * as relay from 'baton-request-relay';

const endpoint = process.env.ENDPOINT ? process.env.ENDPOINT : 'http://localhost:3000';
const client = supertest(endpoint);

const EXCLUDE_HEADERS = ['date'];

describe('submit-order-relay', () => {

  it('should relay the submit-order request', () => {
    const rec = relay(`./fixtures/frontend/submit-order`);

    // make the request with the method, path, headers and body
    return client[rec.request.method](rec.request.path)
      .set(rec.request.headers)
      .send(rec.request.body)

      .expect(rec.response.statusCode)
      .expect(rec.response.body)
      // .expect((res) => {
      //   Object.keys(test.response.headers)
      //     .forEach((key) => {
      //       if (EXCLUDE_HEADERS.indexOf(key) === -1) {
      //         expect(key + ':' + res.headers[key]).to.equal(key + ':' + test.response.headers[key]);
      //       }
      //     });
      // })
      ;
  });
});
