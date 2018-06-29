const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const config = require('./config.json');
const provider = new HDWalletProvider(config.accountMnemonic, config.nodeLink);
const web3 = new Web3(provider);

console.log(interface);

const deploy = async () => {
  // const accounts = await web3.eth.getAccounts();
  const result = await new web3.eth.Contract(JSON.parse(interface)).deploy({
    data: '0x' + bytecode,
    arguments: [] // My constructor needs no arguments
  }).send({
    gas: 5e6.toString(),
    from: config.mainAccount
  });
  console.log('\n\nADDRESS:\n ', result.options.address);
};
deploy().then(() => console.log('\nfinished deploying contract!')).catch(err => console.log(err));