const assert = require('assert');
const ganache = require('ganache-cli');
// this is a constructor function
const Web3 = require('web3');
const mocha = require('mocha');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let resume;

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
});

mocha.describe('Resume', () => {
  mocha.it('deploys a contract', () => {
    // use one of the accounts to deploy the contract
    console.log(resume);
  });
});


// let car;
// mocha.beforeEach(() => {
//   car = new Car();
// });
// mocha.describe('Car', () => {
//   mocha.it('should return stopped when parked', () => {
//     assert.equal(car.park(), 'stopped');
//   });
//   mocha.it('should return vroom when being drived', () => {
//     assert.equal(car.drive(), 'vroom');
//   });
// });