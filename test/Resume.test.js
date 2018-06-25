const assert = require('assert');
const ganache = require('ganache-cli');
// this is a constructor function
const Web3 = require('web3');
const mocha = require('mocha');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');
const multihash = require('./multihash');
// require('events').EventEmitter.defaultMaxListeners = 50;

let accounts;
let resume;
let resume2;
let resume3;

beforeEach(async () => {
  // get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // use one of the accounts to deploy a contract
  resume = await new web3.eth.Contract(JSON.parse(interface)).deploy({
    data: bytecode,
    arguments: []
  }).send({
    from: accounts[0],
    gas: '6700000',
    gasPrice: '2000000000'
  });
  resume2 = await new web3.eth.Contract(JSON.parse(interface)).deploy({
    data: bytecode,
    arguments: []
  }).send({
    from: accounts[1],
    gas: '6700000',
    gasPrice: '2000000000'
  });
  resume3 = await new web3.eth.Contract(JSON.parse(interface)).deploy({
    data: bytecode,
    arguments: []
  }).send({
    from: accounts[2],
    gas: '6700000',
    gasPrice: '2000000000'
  });
  resume.setProvider(provider);
});

describe('Resume', () => {
  it('deploys a contract', () => {
    assert.ok(resume.options.address);
  });
  it('initializes the contract with the values passed to the constructor', async () => {
    const manager = await resume.methods.manager().call();
    const manager2 = await resume2.methods.manager().call();
    const manager3 = await resume3.methods.manager().call();

    assert.equal(manager, accounts[0]);
    assert.equal(manager2, accounts[1]);
    assert.equal(manager3, accounts[2]);
  });

  it('successfully adds a collaborator if manager or a collaborator', async () => {
    const collaboratorStatus = await resume.methods.isCollaborator(accounts[1]).call();
    assert.equal(collaboratorStatus, false);
    // test to make sure that the contract manager can add a collaborator
    await resume.methods.addCollaborator(accounts[1]).send({ from: accounts[0] });
    const collaboratorStatus2 = await resume.methods.isCollaborator(accounts[1]).call();
    assert.equal(collaboratorStatus2, true);
    const collaboratorStatus3 = await resume.methods.isCollaborator(accounts[2]).call();
    assert.equal(collaboratorStatus3, false);
    // test to make sure that a collaborator can add another collaborator
    await resume.methods.addCollaborator(accounts[2]).send({ from: accounts[1] });
    const collaboratorStatus4 = await resume.methods.isCollaborator(accounts[2]).call();
    assert.equal(collaboratorStatus4, true);
  });

  it('successfully updates a person\'s name', async () => {
    const newName = 'Jay Park';
    const oldName = await resume.methods.getName(accounts[1]).call();
    assert.equal(oldName === newName, false);

    const usersBefore = await resume.methods.getUsers().call();

    await resume.methods.setName(newName).send({ from: accounts[1] });
    const name = await resume.methods.getName(accounts[1]).call();
    assert.equal(name, newName);

    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
  });

  it('successfully updates a person\'s description', async () => {
    const newDecription = 'At vero eos';
    const oldDescription = await resume.methods.getDescription(accounts[1]).call();
    assert.equal(oldDescription === newDecription, false);

    const usersBefore = await resume.methods.getUsers().call();

    await resume.methods.setDescription(newDecription).send({ from: accounts[1] });
    const description = await resume.methods.getDescription(accounts[1]).call();
    assert.equal(description, newDecription);

    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
  });

  it('successfully updates a person\'s position', async () => {
    const newPosition = 'Senior Software Engineer';
    const oldPosition = await resume.methods.getPosition(accounts[1]).call();
    assert.equal(oldPosition === newPosition, false);

    const usersBefore = await resume.methods.getUsers().call();

    await resume.methods.setPosition(newPosition).send({ from: accounts[1] });
    const position = await resume.methods.getPosition(accounts[1]).call();
    assert.equal(position, newPosition);

    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);

    await resume.methods.deletePosition().send({ from: accounts[1] });
    const positionAfterDelete = await resume.methods.getPosition(accounts[1]).call();
    assert.equal(positionAfterDelete === position, false);
  });

  it('successfully updates a person\'s phone number', async () => {
    const newPhone = '123456789';
    const oldPhone = await resume.methods.getPhone(accounts[1]).call();
    assert.equal(oldPhone === newPhone, false);

    const usersBefore = await resume.methods.getUsers().call();

    await resume.methods.setPhone(newPhone).send({ from: accounts[1] });
    const phone = await resume.methods.getPhone(accounts[1]).call();
    assert.equal(phone, newPhone);

    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
  });

  it('successfully updates a person\'s email address', async () => {
    const newEmail = 'asdflkj@beepb00p.club';
    const oldEmail = await resume.methods.getEmail(accounts[1]).call();
    assert.equal(oldEmail === newEmail, false);

    const usersBefore = await resume.methods.getUsers().call();

    await resume.methods.setEmail(newEmail).send({ from: accounts[1] });
    const email = await resume.methods.getEmail(accounts[1]).call();
    assert.equal(email, newEmail);

    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
  });

  it('successfully updates a person\'s date of birth', async () => {
    const newDateOfBirth = new Date().getTime();
    const oldDateOfBirth = await resume.methods.getDateOfBirth(accounts[1]).call();
    assert.equal(oldDateOfBirth === newDateOfBirth, false);

    const usersBefore = await resume.methods.getUsers().call();

    await resume.methods.setDateOfBirth(newDateOfBirth).send({ from: accounts[1] });
    const dateOfBirth = await resume.methods.getDateOfBirth(accounts[1]).call();
    assert.equal(dateOfBirth, newDateOfBirth);

    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
  });

  it('successfully updates a person\'s gender', async () => {
    const newGender = 3;
    const oldGender = await resume.methods.getGender(accounts[1]).call();
    assert.equal(oldGender === newGender, false);

    const usersBefore = await resume.methods.getUsers().call();

    await resume.methods.setGender(newGender).send({ from: accounts[1] });
    const gender = await resume.methods.getGender(accounts[1]).call();
    assert.equal(gender, newGender);

    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
  });

  it('successfully updates a person\'s profile image', async () => {
    const originalMultihash = 'QmT6ssjTDE9neaKqBDXGhfFdVcCuh5661iQC7RwPw3RNGj';
    const newIpfsHash = multihash.getBytes32FromMultihash(originalMultihash);
    await resume.methods.setProfileImage(newIpfsHash.digest, newIpfsHash.hashFunction, newIpfsHash.size).send({
      from: accounts[1]
    });
    const ipfsHash = await resume.methods.getProfileImage(accounts[1]).call();
    assert.equal(multihash.getMultihashFromContractResponse(ipfsHash), originalMultihash);
  });

  it('successfully allows a manager or collaborator to confirm an applicant`\s profile', async () => {
    await resume.methods.setConfirmationDate(accounts[3]).send({ from: accounts[0] });
    const confirmedAt = await resume.methods.getConfirmationDate(accounts[3]).call();
    const now = Math.floor(Date.now() / 1000);
    console.log(confirmedAt, now);
    assert.equal(confirmedAt > (now - 120) && confirmedAt <= now, true);
  });
});