const request = require('supertest');

const supertest = require('supertest');
const endpoint = process.env.ENDPOINT ? process.env.ENDPOINT : 'http://localhost:3000';
const client = supertest(endpoint);

const JWT = 'put test JWT here';

describe('api-gateway', () => {
    it('PUT', () => {
        return client.put('/items/00000000-0000-0000-0000-000000000000')
            .set('Authorization', JWT)
            .send({
                name: 'item1',
                description: 'This is thing one of two.',
            })
            .expect((res) => {
                console.log(JSON.stringify(res, null, 2));
            })
            .expect(200);
    });
    it('GET', () => {
        return client
            .get('/items/00000000-0000-0000-0000-000000000000')
            .set('Authorization', JWT)
            .expect((res) => {
                console.log(JSON.stringify(res, null, 2));
                console.log('cache-control: ', res.headers['cache-control']);
            })
            .expect(200);
    });
});