const { expectThrow, increaseTime, latestTime, toWei, fromWei } = require('./helpers');

const Assurance = artifacts.require('Assurance')
const MockAggregator = artifacts.require('MockAggregator')
const IslandToken = artifacts.require('IslandToken');
const DAI = artifacts.require('DAI_DUMMY');
const CryptoKitties = artifacts.require('CryptoKitties_DUMMY');

contract('Assurance contract to buy island and college', async function(accounts) {

    const creator = accounts[0]
    const guy1 = accounts[1];
    const guy2 = accounts[2];
    const guy3 = accounts[3];
    const guy4 = accounts[4];
    const beneficiary = accounts[5];

    const days = 24 * 60 * 60;

    let assurance;
    let oracle;
    let islandToken;
    let dai;
    let kitties;

    beforeEach(async function() {
        oracle = await MockAggregator.new(8, 39145000000, { from: creator });

        islandToken = await IslandToken.new("Island Token", "ISLAND", { from: creator });
        assurance = await Assurance.new(oracle.address, islandToken.address, beneficiary, 30 * days, { from: creator });     
        
        await islandToken.grantRole(web3.utils.keccak256("MINTER_ROLE"), assurance.address, { from: creator });
        await islandToken.grantRole(web3.utils.keccak256("PAUSER_ROLE"), assurance.address, { from: creator });

        dai = await DAI.new("DAI dummy", "DAI", { from: creator });
        kitties = await CryptoKitties.new("Crypto Kitties", "CK", "https://genesis.re", { from: creator });

    })

    it('Can deposit ETH and mint tokens', async () => {
        await assurance.sendTransaction({ value: toWei("0.05"), from: guy1 });

        let balance = await islandToken.balanceOf.call(guy1);
        assert.equal(balance.toString(), toWei("0.05"), "Guy 1 should have 0.05 of the Island token as sent 0.05 ETH");
    });



  })