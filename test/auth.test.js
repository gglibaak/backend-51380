const chai = require('chai');
const supertest = require('supertest');
const { faker } = require('@faker-js/faker/locale/es');

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing Auth endpoint', () => {
  const userMocked = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    age: faker.number.int({ max: 100 }),
  };
  it('Checking user registration -> POST /auth/register', async () => {
    const response = await requester.post('/auth/register').send(userMocked);

    expect(response.status).to.eql(302);
    expect(response.redirect).to.eql(true);
    expect(response.header.location).to.eql('/products');
  });

  it('Checking user login -> POST /auth/login', async () => {
    const userTest = {
      email: userMocked.email,
      password: userMocked.password,
    };

    const response = await requester.post('/auth/login').send(userTest);

    expect(response.status).to.eql(302);
    expect(response.redirect).to.eql(true);
    expect(response.header.location).to.eql('/products');
  });

  it('Checking user logout -> GET /auth/logout', async () => {
    const response = await requester.get('/auth/logout');

    expect(response.status).to.eql(302);
    expect(response.redirect).to.eql(true);
    expect(response.header.location).to.eql('/auth/login');
  });
});
