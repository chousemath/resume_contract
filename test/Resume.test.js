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

const _owner = 'Joseph Sungpil Choi';
const _introduction = 'I am just a small time boy, livin in a lonely world';
const _currentJob = 'Software Engineer';
const _currentAddress = '2761 Millers Way Drive, Ellicott City, Maryland, 21043';
const _currentEmail = 'jo@beepb00p.club';
const _currentPhone = '01068513003';
const _birthYear = 1990;
const _birthMonth = 7;
const _birthDay = 7;

mocha.beforeEach(async () => {
  // get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // use one of the accounts to deploy a contract
  resume = await new web3.eth.Contract(JSON.parse(interface)).deploy({
    data: bytecode,
    arguments: [
      _owner,
      _introduction,
      _currentJob,
      _currentAddress,
      _currentPhone,
      _currentEmail,
      _birthYear,
      _birthMonth,
      _birthDay
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
    const currentAddress = await resume.methods.currentAddress().call();
    const currentPhone = await resume.methods.currentPhone().call();
    const currentEmail = await resume.methods.currentEmail().call();
    const birthYear = await resume.methods.birthYear().call();
    const birthMonth = await resume.methods.birthMonth().call();
    const birthDay = await resume.methods.birthDay().call();

    assert.equal(owner, _owner);
    assert.equal(introduction, _introduction);
    assert.equal(currentJob, _currentJob);
    assert.equal(currentAddress, _currentAddress);
    assert.equal(currentPhone, _currentPhone);
    assert.equal(currentEmail, _currentEmail);
    assert.equal(birthYear, _birthYear);
    assert.equal(birthMonth, _birthMonth);
    assert.equal(birthDay, _birthDay);
  });

  mocha.it('successfully updates a person\'s current address', async () => {
    const newAddress = '373 Gangnam-daero Seocho-gu Seoul';
    await resume.methods.setCurrentAddress(newAddress).send({ from: accounts[0] });
    const currentAddress = await resume.methods.currentAddress().call();
    assert.equal(currentAddress, newAddress);
  });
  
  mocha.it('successfully updates a person\'s current job', async () => {
    const newJob = 'Senior Software Engineer';
    await resume.methods.setCurrentJob(newJob).send({ from: accounts[0] });
    const currentJob = await resume.methods.currentJob().call();
    assert.equal(currentJob, newJob);
  });

  mocha.it('successfully updates a person\'s introduction', async () => {
    const newIntroduction = 'i am a new introduction';
    await resume.methods.setIntroduction(newIntroduction).send({ from: accounts[0] });
    const introduction = await resume.methods.introduction().call();
    assert.equal(introduction, newIntroduction);
  });
});