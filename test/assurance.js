const { expectThrow, increaseTime, latestTime, toWei, fromWei } = require('./helpers');

const Assurance = artifacts.require('Assurance')
const MockAggregator = artifacts.require('MockAggregator')
const IslandToken = artifacts.require('IslandToken');

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

    beforeEach(async function() {
        oracle = await MockAggregator.new(8, 39145000000, { from: creator });

        islandToken = await IslandToken.new("Island Token", "ISLAND", { from: creator });

        assurance = await Assurance.new(oracle.address, islandToken.address, beneficiary, { from: creator });     
        
        await islandToken.grantRole(web3.utils.keccak256("MINTER_ROLE"), assurance.address, { from: creator });
        await islandToken.grantRole(web3.utils.keccak256("PAUSER_ROLE"), assurance.address, { from: creator });
    })

    it('Can calculate money invested in ETH', async () => {
        await assurance.sendTransaction({ value: toWei("0.05"), from: guy1 });
        await assurance.sendTransaction({ value: toWei("0.17"), from: guy2 });

        let balance = await assurance.currentValue.call();
        assert.equal(balance.toString(), 8611, "0.22 ETH at $391.45 shold be $86.11");
    });

    // it('Can generate interest when one guy send ETH', async () => {
    //     await assurance.sendTransaction({ value: toWei("99"), from: guy1 });

    //     await increaseTime(2 * days);
        
    //     await assurance.accrueInterest();

    //     // 99 ETH at $391.45 is $38,753.55
    //     // 2 days of interest at 100% per year (we are below $100k) equals to $212.34 worth of $BSXO of interest
    //     // 38,753.55 / 365 * 2 = 212.34 intuitively makes sense to me :) 

    //     let BSXObalance = await BSXO.balanceOf(guy1);
    //     let BSXObalanceFromWEI = fromWei(BSXObalance);
    //     assert.equal(BSXObalanceFromWEI, "212.34", "It should be exactly 212.34 BSXO");
    // });

    // it('Can generate interest when two guys send USD (above $100k)', async () => {
    //     await assurance.manuallyDeposit(guy1, "ipfs_hash", 10000000, { from: creator });
    //     await assurance.manuallyDeposit(guy2, "ipfs_hash", 20000000, { from: creator });

    //     await increaseTime(7 * days);
        
    //     await assurance.accrueInterest();

    //     // $100k and $200k
    //     // 7 days of interest at 20% per year (above $100k) 
    //     // 100000 * 0.2 * 7 / 365 = 383.56
    //     // 200000 * 0.2 * 7 / 365 = 767.12

    //     let BSXObalance1 = await BSXO.balanceOf(guy1);
    //     let BSXObalanceFromWEI1 = fromWei(BSXObalance1);
    //     assert.equal(BSXObalanceFromWEI1, "383.56", "Should be exactly 383.56");

    //     let BSXObalance2 = await BSXO.balanceOf(guy2);
    //     let BSXObalanceFromWEI2 = fromWei(BSXObalance2);
    //     assert.equal(BSXObalanceFromWEI2, "767.12", "Should be exacttly 767.12");
    // });

    // THIS TEST IS NOT WORKING
    // FOR SOME REASON "expectThrow" FAILS :(

    // it('BSXO pausing works', async () => {
    //     await BSXO.pause({ from: creator });
    //     await assurance.sendTransaction({ value: toWei("1"), from: guy2 });
    //     await increaseTime(10 * days);
    //     await expectThrow( await assurance.accrueInterest() );
    //     await assurance.chuckNorrisSaidOK({from: creator });
    //     await assurance.accrueInterest();
    //     await BSXO.transfer(guy3, 1, { from: guy2 })
    //     let BSXObalance3 = await BSXO.balanceOf(guy3);
    //     assert.equal(BSXObalance3, 1, "Guy 2 should exactly 1 tiny fraction of a token");
    // });


    // it('Can generate when guys send ETH and USD, initially at 100% APR and then 20% APR only, total mix and match', async () => {
    //     await assurance.manuallyDeposit(guy4, "ipfs_hash", 5000000, { from: creator }); // guy1 run out of ETH in one of the previous tests
    //     await assurance.sendTransaction({ value: toWei("50"), from: guy2 });

    //     await increaseTime(7 * days);
    //     await assurance.accrueInterest();

    //     // $50k and 50 ETH
    //     // 7 days of interest at 100% per year (below $100k) 
    //     // 5000000 * 7 / 365 = 958.90
    //     // 50ETH * 391.45 * 7 / 365 = 375.36

    //     let BSXObalance1 = await BSXO.balanceOf(guy4);
    //     let BSXObalanceFromWEI1 = fromWei(BSXObalance1);
    //     assert.equal(BSXObalanceFromWEI1, "958.9", "Should be exactly 958.9"); // for display reasons prefer 958.90 but close enough LOL

    //     let BSXObalance2 = await BSXO.balanceOf(guy2);
    //     let BSXObalanceFromWEI2 = fromWei(BSXObalance2);
    //     assert.equal(BSXObalanceFromWEI2, "375.36", "Should be exacttly 375.36");

    //     /////// PHASE 2
    //     // We need to do some math now
    //     // Loads of things changed
    //     // 10 ETH from guy who already put $50k
    //     // $10k from a guy who already put 50 ETH
    //     await assurance.sendTransaction({ value: toWei("10"), from: guy4 });
    //     await assurance.manuallyDeposit(guy2, "ipfs_hash", 1000000, { from: creator });

    //     oracle.updateAnswer(140000000000); // now ETH is at $1400 ATH

    //     await increaseTime(10 * days);
    //     await assurance.accrueInterest();
        
    //     // 5000000 * 0.2 * 10 / 365 = 273.97
    //     // 10ETH * 1400.00 * 10 / 365 = 76.71
    //     // 958.9 (from the previous one) + 273.97 + 76.71 = 1,309.58

    //     BSXObalance1 = await BSXO.balanceOf(guy4);
    //     BSXObalanceFromWEI1 = fromWei(BSXObalance1);
    //     assert.equal(BSXObalanceFromWEI1, "1309.58", "Should be exactly 1309.58");

    //     // 50ETH * 1400.00 * 10 / 365 = 383.56
    //     // 1000000 * 0.2 * 10 / 365 = 54.79
    //     // 375.36 + 383.56 + 54.79 = 813.71
    //     BSXObalance2 = await BSXO.balanceOf(guy2);
    //     BSXObalanceFromWEI2 = fromWei(BSXObalance2);
    //     assert.equal(BSXObalanceFromWEI2, "813.71", "Should be exacttly 813.71");
    // });


    // THIS TEST ALSO DOES NOT WORK :(
    // FOR SOME REASON BALANCE DOES NOT INCREASES

    // it('Can self destruct and return ETH to the beneficiary', async () => {
    //     await expectThrow( assurance.closeAndBuyTheIslandOrTheCollege({ from: guy1 }) );
    //     await assurance.sendTransaction({ value: toWei("10"), from: guy2 }); 
    //     await assurance.closeAndBuyTheIslandOrTheCollege({ from: creator });
    //     let beneficiaryBalance = await web3.eth.getBalance(beneficiary)
    //     let beneficiaryBalanceFromWei = fromWei(beneficiaryBalance)
    //     assert.equal(beneficiaryBalanceFromWei, 110, "beneficiary should should have now exactly 110 ETH");
    // });


  })