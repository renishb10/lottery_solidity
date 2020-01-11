const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');

const bytecode = evm.bytecode.object;

// Get access to real, non-local network, using phrase & api url
const provider = new HDWalletProvider(
    'together gown urban reward oak onion symbol sadness million olive merit tank',
    'https://rinkeby.infura.io/v3/8db939d735e74eeca0343d3ed3749403'
);

const web3 = new Web3(provider);
web3.setProvider(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Account: ', accounts[0]);

    const result = await new web3.eth.Contract(abi)
        .deploy({ data: '0x' + bytecode })
        .send({ from: accounts[0] });

    console.log('Contract Deployed to: ', result.options.address);
};
deploy();
