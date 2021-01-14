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
    const GAS_MARGIN = 0.01 * 1E18; // sometimes we send tx consuming gas, close enough

    let assurance;
    let oracle;
    let islandToken;
    let stakedToken;

    beforeEach(async function() {
        oracle = await MockAggregator.new(8, 39145000000, { from: creator });

        islandToken = await IslandToken.new("Island Token", "ISLAND", { from: creator });
        stakedToken = await IslandToken.new("Staked Token", "STAKED", { from: creator });

        assurance = await Assurance.new(oracle.address, islandToken.address, stakedToken.address, beneficiary, 30 * days, { from: creator });     
        
        await islandToken.grantRole(web3.utils.keccak256("MINTER_ROLE"), assurance.address, { from: creator });
        await islandToken.grantRole(web3.utils.keccak256("PAUSER_ROLE"), assurance.address, { from: creator });

        await stakedToken.grantRole(web3.utils.keccak256("MINTER_ROLE"), assurance.address, { from: creator });
        await stakedToken.grantRole(web3.utils.keccak256("PAUSER_ROLE"), assurance.address, { from: creator });
    })

    it('Can deposit ETH and mint tokens', async () => {
        await assurance.sendTransaction({ value: toWei("0.05"), from: guy1 });

        let balance = await islandToken.balanceOf.call(guy1);
        assert.equal(balance.toString(), toWei("0.05"), "Guy 1 should have 0.05 of the Island token as sent 0.05 ETH");
    });

    it('Can withdraw ETH by burning tokens', async () => {
        await assurance.sendTransaction({ value: toWei("0.05"), from: guy1 });

        await islandToken.approve(assurance.address, toWei("0.04"), { from: guy1 });

        let guyBalance = await web3.eth.getBalance(guy1);
        await assurance.withdraw(toWei("0.03"), {from : guy1});
        let guyBalanceAfter = await web3.eth.getBalance(guy1);

        assert.closeTo(parseFloat(fromWei(guyBalance)) + 0.03, parseFloat(fromWei(guyBalanceAfter)), GAS_MARGIN, "After withdraw should have more amount");
    });

    it('Can stake Island token and receive Staked (and back again)', async () => {
        await assurance.sendTransaction({ value: toWei("0.05"), from: guy1 });
        await islandToken.approve(assurance.address, toWei("0.05"), { from: guy1 });
        await assurance.stake(toWei("0.05"), {from : guy1 });

        let balance = await stakedToken.balanceOf.call(guy1);
        assert.equal(fromWei(balance.toString()), "0.05", "The balance of staked tokens should be 0.05")

        await stakedToken.approve(assurance.address, toWei("0.03"), { from: guy1 });
        await assurance.unstake(toWei("0.03"), { from: guy1 });

        let balanceIsland = await islandToken.balanceOf.call(guy1);
        assert.equal(fromWei(balanceIsland.toString()), "0.03", "Guy should have 0.03 of the Island token");

        let balanceStaked = await stakedToken.balanceOf.call(guy1);
        assert.equal(fromWei(balanceStaked.toString()), "0.02", "Guy should have 0.02 of the Staked token")
    });

    it('Can calculate money invested in ETH', async () => {
        await assurance.sendTransaction({ value: toWei("0.05"), from: guy1 });
        await assurance.sendTransaction({ value: toWei("0.17"), from: guy2 });

        let balance = await assurance.currentValue.call();
        assert.equal(balance.toString(), 8611, "0.22 ETH at $391.45 shold be $86.11");
    });

    it('Calculate price in WEI correctly', async () => {
        await oracle.updateAnswer(140000000000); // now ETH is at $1400 ATH
        let balance = await assurance.getUSDValueOfWEI.call(toWei("0.1"));
        assert.equal(balance.toString(), 14000); // $140 in cents
    });

    it('Does not allow to initiate withdrawal initially', async () => {
        await expectThrow(assurance.initiateWithdrawal(), {from: beneficiary});
    })

    it('Allows to initiate withdrawal after $1m in deposits', async () => {
        await assurance.sendTransaction({ value: toWei("99"), from: guy1 });
        await oracle.updateAnswer(2100000000000); // now ETH is at $21000

        await expectThrow(assurance.initiateWithdrawal({from: guy1 }));
        await assurance.initiateWithdrawal({from: beneficiary})

        await expectThrow(assurance.initiateWithdrawal({from: beneficiary})); // cannot initiate more than once
    })

    it('Allows to to finalize after 30 days', async () => {
        await assurance.sendTransaction({ value: toWei("99"), from: guy2 });
        await oracle.updateAnswer(2100000000000); // now ETH is at $21000

        await assurance.initiateWithdrawal({from: beneficiary})

        await expectThrow(assurance.finalizeWithdrawal({from: beneficiary})) // too fast

        await increaseTime(30.5 * days);

        let balanceBefore = await web3.eth.getBalance(beneficiary);
        await assurance.finalizeWithdrawal({from: beneficiary});
        let balanceAfter = await web3.eth.getBalance(beneficiary);
        assert.closeTo(parseFloat(balanceBefore.toString()) + parseFloat(toWei("99")), parseFloat(balanceAfter.toString()), GAS_MARGIN, "Beneficiary should have received money (100 ETH from Truffle test runner)");
    });

    if('Does not allow to finalize when balance goes down but allows to start again', async () => {
        await assurance.sendTransaction({ value: toWei("99"), from: guy2 });
        await oracle.updateAnswer(2100000000000); // now ETH is at $21000

        await assurance.initiateWithdrawal({from: beneficiary})

        await increaseTime(30.5 * days);

        await oracle.updateAnswer(900000000000); // now ETH is at $9000 ATH

        let balanceBefore = await web3.eth.getBalance(beneficiary);
        await assurance.finalizeWithdrawal({from: beneficiary});
        let balanceAfter = await web3.eth.getBalance(beneficiary);
        assert.closeTo(parseFloat(balanceBefore.toString()), parseFloat(balanceAfter.toString()), GAS_MARGIN, "Beneficiary should have only 100 from Truffle");
    
        let withhdrawalInitiated = await assurance.withhdrawalInitiated.call();
        assert.equal(withhdrawalInitiated, false, "withhdrawalInitiated should be in `false` state");
    });

    it('Can rescue ERC20', async () => {
        dai = await DAI.new("DAI dummy", "DAI", { from: creator });
        await dai.mint(guy1, toWei("1000"), { from: creator });

        await dai.transfer(assurance.address, toWei("800"), { from: guy1 });

        await assurance.rescueERC20(dai.address, {from: beneficiary});

        let beneficiaryDAIbalance = await dai.balanceOf(beneficiary);

        assert.equal(beneficiaryDAIbalance, toWei("800"), "Beneficiary should have rescued 800 DAI");
    });

    it('Can rescue NFT721', async () => {
        kitties = await CryptoKitties.new("Crypto Kitties", "CK", "https://genesis.re", { from: creator });
        await kitties.mint(guy1, {from: creator });

        await kitties.transferFrom(guy1, assurance.address, 0, { from: guy1 });

        await assurance.rescueNFT721(kitties.address, 0, { from: beneficiary });
        
        assert.equal(await kitties.ownerOf(0), beneficiary, "beneficiary should be the owner of kitty.");
    });




  })