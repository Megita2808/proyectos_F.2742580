import { Given, When, Then } from '@cucumber/cucumber';
import axios from 'axios';
import { expect } from 'chai';

let endpoint;
let response;

Given('I have the endpoint {string}', (url) => {
  endpoint = url;
});

When('I send a GET request to the endpoint', async () => {
  try {
    response = await axios.get(endpoint);
  } catch (err) {
    response = err.response;
  }
});

Then('the response status should be {int}', (status) => {
  expect(response.status).to.equal(status);
});

Then('the response body should contain a list of products', () => {
  expect(response.data.body).to.be.an('array');
  expect(response.data.body.length).to.be.greaterThan(0);
});

Then('the first product should have a {string} property', function (property) {
  expect(response.data.body.length).to.be.greaterThan(0);
  expect(response.data.body[0]).to.have.property(property);
});

Then('the disponibility of all products should not be negative', () => {
  const products = response.data.body;
  const hasNegativeDisponibility = products.some((product) => product.disponibility < 0);
  expect(hasNegativeDisponibility).to.be.false;
});