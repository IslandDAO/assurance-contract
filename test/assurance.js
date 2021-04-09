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
    
    beforeEach(async() => {
        wbtc = await WBTC.new("Wrapped Bitcoin Token", "WBTC", { from: creator });
        nsg = await NSG.new("Network State Genesis", "NSG", beneficiary, wbtc.address, 1625443200, { from: creator });     
    })

    it('Can purchase NFT with ETH', async() => {
        await nsg.sendTransaction({ value: toWei("0.1"), from: guy1 });
        let balanceAfterBeneficiary = await web3.eth.getBalance(beneficiary);
        assert.equal(balanceAfterBeneficiary.toString(), toWei("100.1"), "Beneficiary should have 100.1 ETH after the NFT purchase");

        let owner = await nsg.ownerOf(0);
        assert.equal(owner, guy1, "It should be guy1 who owns the NFT with the ID 0");

        // await expectThrow( nsg.sendTransaction({ value: toWei("0.1"), from: guy2 }) ); // too little, price increased by 0.1%
        await nsg.sendTransaction({ value: toWei("0.2"), from: guy2 });
        let balanceAfterGuy2 = await web3.eth.getBalance(guy2);

        assert.closeTo(parseFloat(balanceAfterGuy2.toString()), parseFloat(toWei("99.9")), GAS_MARGIN, "Beneficiary should have only 100 from Truffle");

        owner = await nsg.ownerOf(1);
        assert.equal(owner, guy2, "It should be guy2 who owns the NFT with the ID 1");

        // Single person can buy more than 1
        await nsg.sendTransaction({ value: toWei("0.1"), from: guy1 });
        let howMany = await nsg.balanceOf.call(guy1);
        assert.equal(howMany, 2, "Guy 1 should have exactly 2 tokens.");

    });

    it('Can refund ETH when sent too much', async () => {
        let balanceBefore = await web3.eth.getBalance(guy1);
        await nsg.sendTransaction({ value: toWei("10"), from: guy1 });
        let balanceAfter = await web3.eth.getBalance(guy1);
        assert.closeTo(parseFloat(balanceBefore.toString()) - toWei("0.1"), parseFloat(balanceAfter.toString()), GAS_MARGIN, "Guy 1 should receive refund (rather than spending 10 ETH");

    });

    it('Should throw when sent too little', async() => {
        await expectThrow( nsg.sendTransaction({ value: toWei("0.09"), from: guy1 }) );
    
    });

    it('Price increase after 4th of July', async() => {
        await nsg.sendTransaction({ value: toWei("0.1"), from: guy1 });
        await increaseTime(1000 * days);
        await nsg.sendTransaction({ value: toWei("0.1"), from: guy1 }); // that should still work, first after deadline, price hasn't increased

        await expectThrow(nsg.sendTransaction({ value: toWei("0.1"), from: guy1 })); 

        let balanceAfter = await nsg.balanceOf.call(guy1);

        console.log(balanceAfter.toString());

        console.log("GUY1 should have only 2 ^^^^");


    })

    it('Can purchase NFT with WBTC', async() => {
        await wbtc.mint(guy1, toWei("1"), {from: creator})
        await wbtc.approve(nsg.address, toWei("1"), {from: guy1 })
        await nsg.purchaseWithWBTC({from: guy1});

        let balanceBeneficiaryWBTC = await wbtc.balanceOf(beneficiary);
        assert.equal(parseFloat(balanceBeneficiaryWBTC.toString()), parseFloat(toWei("1")), "Beneficiary should have exactly 1 BTC");

        assert.equal(await nsg.ownerOf(0), guy1, "It should be guy1 who owns the NFT with the ID 0 (purchased with WBTC)");
    })

    it('Can do free claim', async() => {
        let currentJavaScriptTruffleTime = new Date();
        await nsg.freeClaim({ from: guy1 });
        await expectThrow(nsg.freeClaim({ from: guy1 }));

        let blockchainTime = await nsg.registrationTime.call(guy1);
        console.log(blockchainTime.toString());
        console.log(currentJavaScriptTruffleTime);
    })

    it('Can post a message', async() => {
        await nsg.publishMessage("ipfs hash 1", { from: guy1 });
        await nsg.publishMessage("ipfs hash 2", { from: guy1 });

        let messagesLength = await nsg.getMessagesLength.call(guy1);
        assert.equal(messagesLength, 2, "There should be exactly two messages published by guy 1");

        let message = await nsg.messages.call(guy1, 1);
        console.log("Message >>>> ", message, " <<<<");
    })


  })