const { expectThrow, increaseTime, latestTime, toWei, fromWei } = require('./helpers');

const NSG = artifacts.require('NetworkStateGenesis')
const WBTC = artifacts.require('WBTC')

contract('Netowrk State Genesis', async function(accounts) {

    const creator = accounts[0]
    const guy1 = accounts[1];
    const guy2 = accounts[2];
    const guy3 = accounts[3];
    const guy4 = accounts[4];
    const beneficiary = accounts[5];

    const days = 24 * 60 * 60;

    let nsg;
    let wbtc;
    

    beforeEach(async function() {
        wbtc = await WBTC.new("Wrapped Bitcoin Token", "WBTC", { from: creator });
        nsg = await NSG.new("Network State Genesis", "NSG", "genesis.re", beneficiary, wbtc.address, { from: creator });     
    })

    it('Can purchase NFT with ETH', async () => {
        await nsg.sendTransaction({ value: toWei("0.1"), from: guy1 });
        let balanceAfter = await web3.eth.getBalance(beneficiary);
        assert.equal(balanceAfter.toString(), toWei("100.1"), "Beneficiary should have 100.1 ETH after the NFT purchase");
    });


  })