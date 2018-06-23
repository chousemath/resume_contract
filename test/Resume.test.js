const assert = require('assert');
const ganache = require('ganache-cli');
// this is a constructor function
const Web3 = require('web3');
const mocha = require('mocha');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts;
let resume;

// const constructorOwner = 'Joseph Sungpil Choi';
// const constructorIntroduction = 'I am just a small time boy, livin in a lonely world';
// const constructorCurrentJob = 'Software Engineer';
//       1990,
//       7,
//       7

mocha.beforeEach(async () => {
  // get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // use one of the accounts to deploy a contract
  resume = await new web3.eth.Contract(JSON.parse(interface)).deploy({
    data: bytecode,
    arguments: [
      'Joseph Sungpil Choi',
      'I am just a small time boy, livin in a lonely world',
      'Software Engineer',
      1990,
      7,
      7
    ]
  }).send({
    from: accounts[0],
    gas: 1e6.toString()
  });
  resume.setProvider(provider);
});

mocha.describe('Resume', () => {
  mocha.it('deploys a contract', () => {
    assert.ok(resume.options.address);
  });
  mocha.it('initializes the contract with the values passed to the constructor', async () => {
    const owner = await resume.methods.owner().call();
    const introduction = await resume.methods.introduction().call();
    const currentJob = await resume.methods.currentJob().call();
    const birthYear = await resume.methods.birthYear().call();
    const birthMonth = await resume.methods.birthMonth().call();
    const birthDay = await resume.methods.birthDay().call();

    assert.equal(owner, 'Joseph Sungpil Choi');
  });
  mocha.it('successfully updates a person\'s introduction', () => {

  });
  mocha.it('successfully updates a person\'s current job', () => {

  });
});