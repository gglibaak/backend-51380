const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect;
const requester = supertest(process.env.PROJECT_URL);

describe('Testing Carts endpoint', () => {
  let cartId;

  it('Check get all carts -> GET /api/carts', async () => {
    const response = await requester.get('/api/carts');
    expect(response.status).to.eql(200);
    expect(response.body.status).to.eql('success');
    expect(response.body.payload).to.be.an('array');
  });

  it('Checking cart creation -> POST /api/carts', async () => {
    const response = await requester.post('/api/carts').send({});
    cartId = response.body.payload._id;
    expect(response.status).to.eql(200);
    expect(response.body.status).to.eql('success');
    expect(response.body.payload).to.be.an('object');
  });

  it('Check get one cart -> GET /api/carts/:id', async () => {
    const response = await requester.get(`/api/carts/${cartId}`);
    expect(response.status).to.eql(200);
    expect(response.body.status).to.eql('success');
    expect(response.body.payload).to.be.an('object');
  });

  it('Check delete one cart -> DELETE /api/carts/:id', async () => {
    const response = await requester.delete(`/api/carts/${cartId}`);
    expect(response.status).to.eql(200);
    expect(response.body.status).to.eql('success');
    expect(response.body.payload).to.be.an('object');
  });
});
