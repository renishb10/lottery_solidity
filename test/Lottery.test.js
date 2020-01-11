const assert = require('assert');
const ganache = require('ganache-cli'); // Test network helper
const Web3 = require('web3'); // Used to connect to the network
const provider = ganache.provider();
const web3 = new Web3(provider);
const { abi, evm } = require('../compile');

let accounts;
let lottery;
const bytecode = evm.bytecode.object;

// rinkeby.infura.io/v3/8db939d735e74eeca0343d3ed3749403

web3.currentProvider.setMaxListeners(300);

beforeEach(async () => {

    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Deploy contracts to the network using any one account
    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({ from:  accounts[0], gas: '1000000' });

        lottery.setProvider(provider)
});

describe('Lottery', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });
})