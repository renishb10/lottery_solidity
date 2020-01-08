const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

let accounts;
let inbox;
const bytecode = evm.bytecode.object;

web3.currentProvider.setMaxListeners(300);

beforeEach(async () => {

    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Deploy contracts to the network using any one account
    inbox = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode, arguments: ['Hi There!'] })
        .send({ from:  accounts[0], gas: '1000000' });
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });
})