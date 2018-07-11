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
    // a non-collaborator trying to add a new collaborator should throw an error
    try {
      await resume.methods.addCollaborator(accounts[2]).send({ from: accounts[1], gas: 1000000 });
      assert(false);
    } catch (err) {
      assert(err);
    }

    const collaboratorStatus = await resume.methods.isCollaborator(accounts[1]).call();
    assert.equal(collaboratorStatus, false);
    // test to make sure that the contract manager can add a collaborator
    await resume.methods.addCollaborator(accounts[1]).send({ from: accounts[0], gas: 1000000 });
    const collaboratorStatus2 = await resume.methods.isCollaborator(accounts[1]).call();
    assert.equal(collaboratorStatus2, true);
    const collaboratorStatus3 = await resume.methods.isCollaborator(accounts[2]).call();
    assert.equal(collaboratorStatus3, false);
    // test to make sure that a collaborator can add another collaborator
    await resume.methods.addCollaborator(accounts[2]).send({ from: accounts[1], gas: 1000000 });
    const collaboratorStatus4 = await resume.methods.isCollaborator(accounts[2]).call();
    assert.equal(collaboratorStatus4, true);
  });

  it('successfully updates a person\'s name', async () => {
    const newName = 'Jay Park The Third';
    const newNameBytes32 = web3.utils.utf8ToHex(newName);
    const oldName = await resume.methods.getName(accounts[1]).call();
    assert.notEqual(oldName, newNameBytes32);
    const usersBefore = await resume.methods.getUsers().call();
    await resume.methods.setName(newNameBytes32).send({ from: accounts[1], gas: 1000000 });
    assert.notEqual(await resume.methods.getUpdateDate(accounts[1]).call(), 0);
    const name = await resume.methods.getName(accounts[1]).call();
    assert.equal(name, web3.utils.padRight(newNameBytes32, 64));
    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
    await resume.methods.deleteName().send({ from: accounts[1], gas: 1000000 });
    const nameAfterDelete = await resume.methods.getName(accounts[1]).call();
    assert.notEqual(nameAfterDelete, name);
  });

  it('only adds a user\'s address to the list of users if first time user', async () => {
    const newName = 'Jay Park The Third';
    const newNameBytes32 = web3.utils.utf8ToHex(newName);
    const usersBefore = await resume.methods.getUsers().call();
    await resume.methods.setName(newNameBytes32).send({ from: accounts[1], gas: 1000000 });
    assert.notEqual(await resume.methods.getUpdateDate(accounts[1]).call(), 0);
    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
    await resume.methods.setName(newNameBytes32).send({ from: accounts[1], gas: 1000000 });
    const usersAfter2 = await resume.methods.getUsers().call();
    assert.equal(usersAfter2.length, usersAfter.length);
  });

  it('successfully updates a person\'s position', async () => {
    const newPosition = 'Senior Software Engineer';
    const newPositionBytes32 = web3.utils.utf8ToHex(newPosition);
    const oldPosition = await resume.methods.getPosition(accounts[1]).call();
    assert.notEqual(oldPosition, newPositionBytes32);
    const usersBefore = await resume.methods.getUsers().call();
    await resume.methods.setPosition(newPositionBytes32).send({ from: accounts[1], gas: 1000000 });
    assert.notEqual(await resume.methods.getUpdateDate(accounts[1]).call(), 0);
    const position = await resume.methods.getPosition(accounts[1]).call();
    assert.equal(position, web3.utils.padRight(newPositionBytes32, 64));
    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
    await resume.methods.deletePosition().send({ from: accounts[1], gas: 1000000 });
    const positionAfterDelete = await resume.methods.getPosition(accounts[1]).call();
    assert.notEqual(positionAfterDelete, position);
  });

  it('successfully updates a person\'s phone number', async () => {
    const newPhone = '020-1234-1141';
    const newPhoneBytes32 = web3.utils.utf8ToHex(newPhone);
    const oldPhone = await resume.methods.getPhone(accounts[1]).call();
    assert.notEqual(oldPhone, newPhoneBytes32);
    const usersBefore = await resume.methods.getUsers().call();
    await resume.methods.setPhone(newPhoneBytes32).send({ from: accounts[1], gas: 1000000 });
    assert.notEqual(await resume.methods.getUpdateDate(accounts[1]).call(), 0);
    const phone = await resume.methods.getPhone(accounts[1]).call();
    assert.equal(phone, web3.utils.padRight(newPhoneBytes32, 64));
    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
    await resume.methods.deletePhone().send({ from: accounts[1], gas: 1000000 });
    const phoneAfterDelete = await resume.methods.getPhone(accounts[1]).call();
    assert.notEqual(phoneAfterDelete, phone);
  });

  it('successfully updates a person\'s email address', async () => {
    const newEmail = '5a3s5d3fl5kj@beepb00p.club';
    const newEmailBytes32 = web3.utils.utf8ToHex(newEmail);
    const oldEmail = await resume.methods.getEmail(accounts[1]).call();
    assert.notEqual(oldEmail, newEmailBytes32);
    const usersBefore = await resume.methods.getUsers().call();
    await resume.methods.setEmail(newEmailBytes32).send({ from: accounts[1], gas: 1000000 });
    assert.notEqual(await resume.methods.getUpdateDate(accounts[1]).call(), 0);
    const email = await resume.methods.getEmail(accounts[1]).call();
    assert.equal(email, web3.utils.padRight(newEmailBytes32, 64));
    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
    await resume.methods.deleteEmail().send({ from: accounts[1], gas: 1000000 });
    const emailAfterDelete = await resume.methods.getEmail(accounts[1]).call();
    assert.notEqual(emailAfterDelete, email);
  });

  it('successfully updates a person\'s home address (street)', async () => {
    // const newAddress = '서울특별시 서초구 반포대로 58, 101동 501호';
    const newAddress = 'STS-SCG-BPDR-58-101D-501H';
    const newAddressBytes32 = web3.utils.utf8ToHex(newAddress);
    const oldAddress = await resume.methods.getAddressStreet(accounts[1]).call();
    assert.notEqual(oldAddress, newAddressBytes32);
    const usersBefore = await resume.methods.getUsers().call();
    await resume.methods.setAddressStreet(newAddressBytes32).send({ from: accounts[1], gas: 1000000 });
    assert.notEqual(await resume.methods.getUpdateDate(accounts[1]).call(), 0);
    const address = await resume.methods.getAddressStreet(accounts[1]).call();
    assert.equal(address, web3.utils.padRight(newAddressBytes32, 64));
    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
    await resume.methods.deleteAddressStreet().send({ from: accounts[1], gas: 1000000 });
    const addressAfterDelete = await resume.methods.getAddressStreet(accounts[1]).call();
    assert.notEqual(addressAfterDelete, address);
  });

  it('successfully updates a person\'s home address (city)', async () => {
    const newAddress = 25;
    const oldAddress = await resume.methods.getAddressCity(accounts[1]).call();
    assert.notEqual(oldAddress, newAddress);
    const usersBefore = await resume.methods.getUsers().call();
    await resume.methods.setAddressCity(newAddress).send({ from: accounts[1], gas: 1000000 });
    assert.notEqual(await resume.methods.getUpdateDate(accounts[1]).call(), 0);
    const address = await resume.methods.getAddressCity(accounts[1]).call();
    assert.equal(address, newAddress);
    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
    await resume.methods.deleteAddressCity().send({ from: accounts[1], gas: 1000000 });
    const addressAfterDelete = await resume.methods.getAddressCity(accounts[1]).call();
    assert.notEqual(addressAfterDelete, address);
  });

  it('successfully updates a person\'s home address (region)', async () => {
    const newAddress = 13;
    const oldAddress = await resume.methods.getAddressRegion(accounts[1]).call();
    assert.notEqual(oldAddress, newAddress);
    const usersBefore = await resume.methods.getUsers().call();
    await resume.methods.setAddressRegion(newAddress).send({ from: accounts[1], gas: 1000000 });
    assert.notEqual(await resume.methods.getUpdateDate(accounts[1]).call(), 0);
    const address = await resume.methods.getAddressRegion(accounts[1]).call();
    assert.equal(address, newAddress);
    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
    await resume.methods.deleteAddressRegion().send({ from: accounts[1], gas: 1000000 });
    const addressAfterDelete = await resume.methods.getAddressRegion(accounts[1]).call();
    assert.notEqual(addressAfterDelete, address);
  });

  it('successfully updates a person\'s home address (zipcode)', async () => {
    const newAddress = 84323;
    const oldAddress = await resume.methods.getAddressZipcode(accounts[1]).call();
    assert.notEqual(oldAddress, newAddress);
    const usersBefore = await resume.methods.getUsers().call();
    await resume.methods.setAddressZipcode(newAddress).send({ from: accounts[1], gas: 1000000 });
    assert.notEqual(await resume.methods.getUpdateDate(accounts[1]).call(), 0);
    const address = await resume.methods.getAddressZipcode(accounts[1]).call();
    assert.equal(address, newAddress);
    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
    await resume.methods.deleteAddressRegion().send({ from: accounts[1], gas: 1000000 });
    const addressAfterDelete = await resume.methods.getAddressRegion(accounts[1]).call();
    assert.notEqual(addressAfterDelete, address);
  });

  it('successfully updates a person\'s date of birth', async () => {
    const newDateOfBirth = new Date().getTime();
    const oldDateOfBirth = await resume.methods.getDateOfBirth(accounts[1]).call();
    assert.notEqual(oldDateOfBirth, newDateOfBirth);
    const usersBefore = await resume.methods.getUsers().call();
    await resume.methods.setDateOfBirth(newDateOfBirth).send({ from: accounts[1], gas: 1000000 });
    assert.notEqual(await resume.methods.getUpdateDate(accounts[1]).call(), 0);
    const dateOfBirth = await resume.methods.getDateOfBirth(accounts[1]).call();
    assert.equal(dateOfBirth, newDateOfBirth);
    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
    await resume.methods.deleteDateOfBirth().send({ from: accounts[1], gas: 1000000 });
    const dateOfBirthAfterDelete = await resume.methods.getDateOfBirth(accounts[1]).call();
    assert.notEqual(dateOfBirthAfterDelete, dateOfBirth);
  });

  it('successfully updates a person\'s gender', async () => {
    const newGender = 3;
    const oldGender = await resume.methods.getGender(accounts[1]).call();
    assert.notEqual(oldGender, newGender);
    const usersBefore = await resume.methods.getUsers().call();
    await resume.methods.setGender(newGender).send({ from: accounts[1], gas: 1000000 });
    assert.notEqual(await resume.methods.getUpdateDate(accounts[1]).call(), 0);
    const gender = await resume.methods.getGender(accounts[1]).call();
    assert.equal(gender, newGender);
    const usersAfter = await resume.methods.getUsers().call();
    assert.equal(usersAfter.length, usersBefore.length + 1);
    await resume.methods.deleteGender().send({ from: accounts[1], gas: 1000000 });
    const genderAfterDelete = await resume.methods.getGender(accounts[1]).call();
    assert.notEqual(genderAfterDelete, gender);
  });

  it('successfully updates a person\'s profile image', async () => {
    const originalMultihash = 'QmT6ssjTDE9neaKqBDXGhfFdVcCuh5661iQC7RwPw3RNGj';
    const newIpfsHash = multihash.getBytes32FromMultihash(originalMultihash);
    await resume.methods.setProfileImage(newIpfsHash.digest, newIpfsHash.hashFunction, newIpfsHash.size).send({
      from: accounts[1], gas: 1000000
    });
    const ipfsHash = await resume.methods.getProfileImage(accounts[1]).call();
    assert.equal(multihash.getMultihashFromContractResponse(ipfsHash), originalMultihash);
  });

  it('successfully uploads a person\'s document', async () => {
    const originalMultihash = 'QmT6ssjTDE9neaKqBDXGhfFdVcCuh5661iQC7RwPw3RNGj';
    const newIpfsHash = multihash.getBytes32FromMultihash(originalMultihash);
    const originalTitle = 'My Document V1';
    const title = web3.utils.utf8ToHex(originalTitle);
    const documentCountBefore = parseInt(await resume.methods.getDocumentCount(accounts[1]).call());
    await resume.methods.addDocument(title, newIpfsHash.digest, newIpfsHash.hashFunction, newIpfsHash.size).send({
      from: accounts[1],
      gas: 1000000
    });
    const documentCountAfter = parseInt(await resume.methods.getDocumentCount(accounts[1]).call());
    assert.equal(documentCountAfter, documentCountBefore + 1);
    const ipfsHash = await resume.methods.getDocument(accounts[1], 0).call();
    assert.equal(multihash.getMultihashFromContractResponse(ipfsHash), originalMultihash);
    assert.equal(web3.utils.hexToUtf8(ipfsHash.title), originalTitle);

    await resume.methods.deleteDocument(0).send({ from: accounts[1], gas: 1000000 });
    const ipfsHashAfterDelete = await resume.methods.getDocument(accounts[1], 0).call();
    assert.notEqual(multihash.getMultihashFromContractResponse(ipfsHashAfterDelete), originalMultihash);
    assert.notEqual(web3.utils.hexToUtf8(ipfsHashAfterDelete.title), originalTitle);
  });

  it('successfully uploads a person\'s experience', async () => {
    const companyNameOriginal = 'The Greatest Company';
    const companyName = web3.utils.utf8ToHex(companyNameOriginal);
    const positionOriginal = 'Chief Iguana';
    const position = web3.utils.utf8ToHex(positionOriginal);
    const startDate = 12345;
    const endDate = 345666;
    const experienceCountBefore = parseInt(await resume.methods.getExperienceCount(accounts[1]).call());
    await resume.methods.addExperience(companyName, position, startDate, endDate).send({
      from: accounts[1],
      gas: 1000000
    });
    const experienceCountAfter = parseInt(await resume.methods.getExperienceCount(accounts[1]).call());
    assert.equal(experienceCountAfter, experienceCountBefore + 1);
    const exp = await resume.methods.getExperience(accounts[1], 0).call();
    assert.equal(web3.utils.hexToUtf8(exp.companyName), companyNameOriginal);
    assert.equal(web3.utils.hexToUtf8(exp.position), positionOriginal);
    assert.equal(exp.startDate, startDate);
    assert.equal(exp.endDate, endDate);
    await resume.methods.deleteExperience(0).send({
      from: accounts[1],
      gas: 1000000
    });
    const exp2 = await resume.methods.getExperience(accounts[1], 0).call();
    assert.notEqual(web3.utils.hexToUtf8(exp2.companyName), companyNameOriginal);
    assert.notEqual(web3.utils.hexToUtf8(exp2.position), positionOriginal);
    assert.notEqual(exp2.startDate, startDate);
    assert.notEqual(exp2.endDate, endDate);
  });

  it('successfully uploads a new organization for a person', async () => {
    const organizationNameOriginal = 'The Best Organization';
    const organizationName = web3.utils.utf8ToHex(organizationNameOriginal);
    // Note that here, I actually use the utf8ToHex method instead of the
    // numberToHex method, for some reason, the web3 numberToHex cannot accept
    // a decimal value
    const latitudeOriginal = (37.5326).toString();
    const longitudeOriginal = (127.024612).toString();
    const latitude = web3.utils.utf8ToHex(latitudeOriginal);
    const longitude = web3.utils.utf8ToHex(longitudeOriginal);
    const organizationCountBefore = parseInt(await resume.methods.getOrganizationCount(accounts[1]).call());
    await resume.methods.addOrganization(organizationName, latitude, longitude).send({
      from: accounts[1],
      gas: 1000000
    });
    const organizationCountAfter = parseInt(await resume.methods.getOrganizationCount(accounts[1]).call());
    assert.equal(organizationCountAfter, organizationCountBefore + 1);
    const org = await resume.methods.getOrganization(accounts[1], 0).call();
    assert.equal(web3.utils.hexToUtf8(org.name), organizationNameOriginal);
    assert.equal(web3.utils.hexToUtf8(org.latitude), latitudeOriginal);
    assert.equal(web3.utils.hexToUtf8(org.longitude), longitudeOriginal);
    await resume.methods.deleteOrganization(0).send({
      from: accounts[1],
      gas: 1000000
    });
    const org2 = await resume.methods.getOrganization(accounts[1], 0).call();
    assert.notEqual(web3.utils.hexToUtf8(org2.name), organizationNameOriginal);
    assert.notEqual(web3.utils.hexToNumber(org2.latitude), latitudeOriginal);
    assert.notEqual(web3.utils.hexToNumber(org2.longitude), longitudeOriginal);
  });

  it('successfully allows a manager or collaborator to confirm an applicant`\s profile', async () => {
    // a non-manager/non-collaborator should not be able to set a confirmation date
    try {
      await resume.methods.setConfirmationDate(accounts[3]).send({ from: accounts[1], gas: 1000000 });
      assert(false);
    } catch (err) {
      assert(err);
    }
    await resume.methods.setConfirmationDate(accounts[3]).send({ from: accounts[0], gas: 1000000 });
    const confirmedAt = await resume.methods.getConfirmationDate(accounts[3]).call();
    const now = Math.floor(Date.now() / 1000);
    assert.equal(confirmedAt > (now - 120) && confirmedAt <= now, true);
  });
});