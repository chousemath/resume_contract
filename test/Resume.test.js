const assert = require('assert');
const ganache = require('ganache-cli');
// this is a constructor function
const Web3 = require('web3');
const mocha = require('mocha');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');
// require('events').EventEmitter.defaultMaxListeners = 50;

let accounts;
let resume;
let resume2;
let resume3;

const _uuid = '0123456789';
const _ownerName = 'Joseph Sungpil Choi';
const _introduction = 'I am just a small time boy, livin in a lonely world';
const _currentJob = 'Software Engineer';
const _currentAddress = '2761 Millers Way Drive, Ellicott City, Maryland, 21043';
const _currentPhone = '01068513003';
const _currentEmail = 'jo@beepb00p.club';
const _birthYear = 1990;
const _birthMonth = 7;
const _birthDay = 7;
const _gender = 1;
const _gender2 = 2;
const _gender3 = 3;

mocha.beforeEach(async () => {
  // get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // use one of the accounts to deploy a contract
  resume = await new web3.eth.Contract(JSON.parse(interface)).deploy({
    data: bytecode,
    arguments: [
      _uuid,
      _ownerName,
      _introduction,
      _currentJob,
      _currentAddress,
      _currentPhone,
      _currentEmail,
      _birthYear,
      _birthMonth,
      _birthDay,
      _gender
    ]
  }).send({
    from: accounts[0],
    gas: 4e6.toString()
  });
  resume2 = await new web3.eth.Contract(JSON.parse(interface)).deploy({
    data: bytecode,
    arguments: [
      _uuid,
      _ownerName,
      _introduction,
      _currentJob,
      _currentAddress,
      _currentPhone,
      _currentEmail,
      _birthYear,
      _birthMonth,
      _birthDay,
      _gender2
    ]
  }).send({
    from: accounts[1],
    gas: 4e6.toString()
  });
  resume3 = await new web3.eth.Contract(JSON.parse(interface)).deploy({
    data: bytecode,
    arguments: [
      _uuid,
      _ownerName,
      _introduction,
      _currentJob,
      _currentAddress,
      _currentPhone,
      _currentEmail,
      _birthYear,
      _birthMonth,
      _birthDay,
      _gender3
    ]
  }).send({
    from: accounts[2],
    gas: 4e6.toString()
  });
  resume.setProvider(provider);
});

mocha.describe('Resume', () => {
  mocha.it('deploys a contract', () => {
    assert.ok(resume.options.address);
  });
  mocha.it('initializes the contract with the values passed to the constructor', async () => {
    const uuid = await resume.methods.uuid().call();
    const ownerName = await resume.methods.ownerName().call();
    const introduction = await resume.methods.introduction().call();
    const currentJob = await resume.methods.currentJob().call();
    const currentAddress = await resume.methods.currentAddress().call();
    const currentPhone = await resume.methods.currentPhone().call();
    const currentEmail = await resume.methods.currentEmail().call();
    const birthYear = await resume.methods.birthYear().call();
    const birthMonth = await resume.methods.birthMonth().call();
    const birthDay = await resume.methods.birthDay().call();
    const gender = await resume.methods.gender().call();
    const gender2 = await resume2.methods.gender().call();
    const gender3 = await resume3.methods.gender().call();

    assert.equal(uuid, _uuid);
    assert.equal(ownerName, _ownerName);
    assert.equal(introduction, _introduction);
    assert.equal(currentJob, _currentJob);
    assert.equal(currentAddress, _currentAddress);
    assert.equal(currentPhone, _currentPhone);
    assert.equal(currentEmail, _currentEmail);
    assert.equal(birthYear, _birthYear);
    assert.equal(birthMonth, _birthMonth);
    assert.equal(birthDay, _birthDay);
    assert.equal(gender, _gender);
    assert.equal(gender2, _gender2);
    assert.equal(gender3, _gender3);
  });

  mocha.it('successfully updates a person\'s current address', async () => {
    const newAddress = '373 Gangnam-daero Seocho-gu Seoul';
    await resume.methods.setCurrentAddress(newAddress).send({ from: accounts[0] });
    const currentAddress = await resume.methods.currentAddress().call();
    assert.equal(currentAddress, newAddress);
  });

  mocha.it('successfully updates a person\'s current job', async () => {
    const newEmail = 'testcase@beepb00p.club';
    await resume.methods.setCurrentEmail(newEmail).send({ from: accounts[0] });
    const currentEmail = await resume.methods.currentEmail().call();
    assert.equal(currentEmail, newEmail);
  });
  
  mocha.it('successfully updates a person\'s current job', async () => {
    const newJob = 'Senior Software Engineer';
    await resume.methods.setCurrentJob(newJob).send({ from: accounts[0] });
    const currentJob = await resume.methods.currentJob().call();
    assert.equal(currentJob, newJob);
  });

  mocha.it('successfully updates a person\'s current phone number', async () => {
    const newPhone = '021233003';
    await resume.methods.setCurrentPhone(newPhone).send({ from: accounts[0] });
    const currentPhone = await resume.methods.currentPhone().call();
    assert.equal(currentPhone, newPhone);
  });

  mocha.it('successfully updates a person\'s current gender', async () => {
    const newGender = 3;
    await resume.methods.setGender(newGender).send({ from: accounts[0] });
    const currentGender = await resume.methods.gender().call();
    assert.equal(currentGender, newGender);
  });

  mocha.it('successfully updates a person\'s introduction', async () => {
    const newIntroduction = 'i am a new introduction';
    await resume.methods.setIntroduction(newIntroduction).send({ from: accounts[0] });
    const introduction = await resume.methods.introduction().call();
    assert.equal(introduction, newIntroduction);
  });

  mocha.it('successfully updates a person\'s name', async () => {
    const newOwnerName = 'Steven Yuen';
    await resume.methods.setOwnerName(newOwnerName).send({ from: accounts[0] });
    const ownerName = await resume.methods.ownerName().call();
    assert.equal(ownerName, newOwnerName);
  });
});