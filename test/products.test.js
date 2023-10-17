const chai = require('chai');
const supertest = require('supertest');
const { faker } = require('@faker-js/faker/locale/es');

const expect = chai.expect;

const requester = supertest(process.env.PROJECT_URL);

describe('Testing Products endpoint', () => {
  it('Check get all products -> GET /api/products', async () => {
    const response = await requester.get('/api/products');
    expect(response.status).to.eql(200);
    expect(response.body.status).to.eql('success');
    expect(response.body.payload).to.be.an('array');
  });

  it('Checking product creation -> POST /api/products', async () => {
    const productMocked = {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price({ min: 100, max: 7000, dec: 0 }),
      thumbnails: [faker.image.avatarGitHub()],
      code: `a${faker.finance.pin(4)}`,
      stock: faker.number.int({ max: 100 }),
      category: faker.commerce.department(),
      owner: faker.internet.email(),
    };

    const response = await requester.post('/api/products').send(productMocked);

    expect(response.status).to.eql(200);
    expect(response.body.status).to.eql('success');
    expect(response.body.payload).to.be.an('object');
  });

  it('Check get one product -> GET /api/products/:id', async () => {
    const response = await requester.get('/api/products/64928e365223d60aee238528');

    expect(response.status).to.eql(200);
    expect(response.body.success).to.eql(true);
    expect(response.body.payload).to.be.an('object');
  });
});
