const { expectThrow, increaseTime, latestTime, toWei, fromWei } = require('./helpers');

const NSG = artifacts.require('NetworkStateGenesis')
const WBTC = artifacts.require('WBTC')

contract('Network State Genesis', async function(accounts) {

    const creator = accounts[0]
    const guy1 = accounts[1];
    const guy2 = accounts[2];
    const guy3 = accounts[3];
    const guy4 = accounts[4];
    const beneficiary = accounts[5];

    const days = 24 * 60 * 60;
    const GAS_MARGIN = 0.01 * 10e18;

    let nsg;
    let wbtc;
    
    beforeEach(async function() {
        wbtc = await WBTC.new("Wrapped Bitcoin Token", "WBTC", { from: creator });
        nsg = await NSG.new("Network State Genesis", "NSG", "genesis.re", beneficiary, wbtc.address, { from: creator });     
    })

    it('Can purchase NFT with ETH', async () => {
        await nsg.sendTransaction({ value: toWei("0.1"), from: guy1 });
        let balanceAfterBeneficiary = await web3.eth.getBalance(beneficiary);
        assert.equal(balanceAfterBeneficiary.toString(), toWei("100.1"), "Beneficiary should have 100.1 ETH after the NFT purchase");

        let owner = await nsg.ownerOf(0);
        assert.equal(owner, guy1, "It should be guy1 who owns the NFT with the ID 0");

        await expectThrow( nsg.sendTransaction({ value: toWei("0.1"), from: guy2 }) ); // too little, price increased by 0.1%
        await nsg.sendTransaction({ value: toWei("0.2"), from: guy2 });
        let balanceAfterGuy2 = await web3.eth.getBalance(guy2);

        assert.closeTo(parseFloat(balanceAfterGuy2.toString()), parseFloat(toWei("99.9")), GAS_MARGIN, "Beneficiary should have only 100 from Truffle");

        owner = await nsg.ownerOf(1);
        assert.equal(owner, guy2, "It should be guy2 who owns the NFT with the ID 1");    
    });

    it('Can purchase NFT with WBTC', async() => {
        await wbtc.mint(guy1, toWei("1"), {from: creator})
        await wbtc.approve(nsg.address, toWei("1"), {from: guy1 })
        await nsg.purchaseWithWBTC({from: guy1});

        let balanceBeneficiaryWBTC = await wbtc.balanceOf(beneficiary);
        assert.equal(parseFloat(balanceBeneficiaryWBTC.toString()), parseFloat(toWei("1")), "Beneficiary should have exactly 1 BTC");

        assert.equal(await nsg.ownerOf(0), guy1, "It should be guy1 who owns the NFT with the ID 0 (purchased with WBTC)");
    })

  })