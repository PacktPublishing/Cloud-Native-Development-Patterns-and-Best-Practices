import 'mocha';
import * as supertest from 'supertest';

const endpoint = process.env.ENDPOINT ? process.env.ENDPOINT : 'http://0.0.0.0:3000';
const client = supertest(endpoint);
const replay = require('replay'); // start vcr

describe('submit-order', () => {
  it('should submit the order', () => {
    const ID = '00000000-0000-0000-0000-000000000000';
    return client.put(`/orders/${ID}/submit`)
      .send({
        id: ID,
      })
      .expect(200)
      ;
  });
});
