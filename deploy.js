const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const config = require('./config.json');
const provider = new HDWalletProvider(config.accountMnemonic, config.nodeLink);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const result = await new web3.eth.Contract(JSON.parse(interface)).deploy({
    data: '0x' + bytecode,
    arguments: [
      '0123456789',
      'John Speagul Chan',
      'I am an aspiring blockchain engineer',
      'Software Engineer',
      '373 Gangnam-daero Seocho-gu Seoul',
      '0201231234',
      'gloopglop@beepb00p.club',
      1989,
      4,
      3,
      1
    ]
  }).send({
    gas: 5e6.toString(),
    from: accounts[0]
  });
  console.log('\n\n\n>>> ', result.options.address);
};
deploy().then(() => console.log('\nfinished deploying contract!')).catch(err => console.log(err));