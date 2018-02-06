const request = require('supertest');

const supertest = require('supertest');
const endpoint = process.env.ENDPOINT ? process.env.ENDPOINT : 'http://localhost:3000';
const client = supertest(endpoint);

describe('api-gateway', () => {
    it('GET', () => {
        return client
            .get('/items/00000000-0000-0000-0000-000000000000')
            .expect((res) => {
                console.log(JSON.stringify(res, null, 2));
            })
            .expect(200);
    });
});