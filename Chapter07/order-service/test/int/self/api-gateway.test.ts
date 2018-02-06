import 'mocha';
import { expect } from 'chai';

import * as supertest from 'supertest';

const endpoint = process.env.ENDPOINT ? process.env.ENDPOINT : 'http://localhost:3000';
const client = supertest(endpoint);

describe('api-gateway', () => {

  it('PUT submit', () => {
    return client.put('/orders/00000000-0000-0000-0000-000000000000/submit')
      //   .set('Authorization', JWT)
      .send({
        id: '00000000-0000-0000-0000-000000000000',
      })
      .expect((res) => {
        console.log('RES: %s', JSON.stringify(res, null, 2));
        expect(res.headers).to.not.have.property('location');
      })
      .expect(200)
      ;
  });

  it('GET by id', () => {
    return client.get('/orders/00000000-0000-0000-0000-000000000000')
      // .set('Authorization', JWT)
      .expect((res) => {
        console.log('RES: %s', JSON.stringify(res, null, 2));
        expect(res.body.id).to.equal('00000000-0000-0000-0000-000000000000');
        expect(res.body.status).to.equal('submitted');
      })
      .expect(200)
      ;
  });

});
