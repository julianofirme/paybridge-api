const { faker } = require('@faker-js/faker');
const { v7: uuid } = require('uuid');

function generateRandomUser(context, events, done) {
  context.vars.userData = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(10),
    document: uuid()
  };
  return done();
}

function setJwtHeader(requestParams, context, ee, next) {
  if (context.vars.token) {
    requestParams.headers.Authorization = `Bearer ${context.vars.token}`;
  }
  return next();
}

function generateWalletData(context, events, done) {
  context.vars.walletData = {
    currencyCode: 'BRL'
  };
  return done();
}

function generateTransferData(context, events, done) {
  context.vars.transferAmount = faker.number.int({ min: 10, max: 100 });
  context.vars.transferData = {
    amount: context.vars.transferAmount,
    currencyCode: 'BRL',
    description: faker.finance.transactionDescription()
  };
  return done();
}

module.exports = {
  generateRandomUser,
  setJwtHeader,
  generateWalletData,
  generateTransferData
};
