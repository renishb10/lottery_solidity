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

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('allows multiple account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            });
            assert(false);
        } catch (error) {
            assert.ok(error);
        }
    })
})