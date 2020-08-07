pragma solidity >=0.6.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";
import "../node_modules/@chainlink/contracts/src/v0.6/interfaces/AggregatorInterface.sol";

contract Assurance is Ownable {
    using SafeMath for uint256;

    address payable beneficiary;
    ERC20PresetMinterPauser public BSXO; // we assume 1 $BSXO = 1 USD
    AggregatorInterface public oracle;
    uint USD;

    mapping (address => uint) public investorsWEImap;
    mapping (address => uint) public investorsUSDmap;

    address[] investorsWEIarr;
    address[] investorsUSDarr;

    function investorsWEICount() public view returns(uint) {
        return investorsWEIarr.length;
    }

    function investorsUSDCount() public view returns(uint) {
        return investorsUSDarr.length;
    }

    event consoleLog(uint number);
    event consoleLog(int256 number);
    
    constructor(address oracleAddress, address BSXOaddress, address payable beneficiary) public {
        beneficiary = beneficiary;
        BSXO = ERC20PresetMinterPauser(BSXOaddress);
        oracle = AggregatorInterface(oracleAddress);
        lastTimeInterest = now;
    }

    uint public lastTimeInterest;
    function accrueInterest() public {
        // require(now - lastTimeInterest > 1 days, "Interest is accounted max 1 per day"); // ACTUALLY: does not matter, can accrue anytime

        uint timeSinceTheLastTime = now - lastTimeInterest;
        uint baseInterestRate = currentValue() > 10000000 ? 2000 : 10000; // More than $100k, the interest rate is 20%, below is 100%

        consoleLog(now);
        consoleLog(lastTimeInterest);
        consoleLog(timeSinceTheLastTime);
        consoleLog(baseInterestRate);

        uint arrayLength = investorsWEIarr.length;
        for (uint i=0; i<arrayLength; i++) {
            address investorAddress = investorsWEIarr[i];
            uint principalUSDvalue = getUSDValueOfWEI(investorsWEImap[investorAddress]);

            uint interestBSXO = principalUSDvalue.mul(timeSinceTheLastTime).div(365 days).mul(baseInterestRate).div(10000); // here we have dollar value
            consoleLog(interestBSXO);

            uint BSXODecimals = interestBSXO.mul(10000000000000000); // here we have the the value with accurate number of decimals
            BSXO.mint(investorAddress, BSXODecimals);
        }

        arrayLength = investorsUSDarr.length;
        for (uint i=0; i<arrayLength; i++) {
            address investorAddress = investorsUSDarr[i];
            uint principalUSDvalue = investorsUSDmap[investorAddress];

            uint interestBSXO = principalUSDvalue.mul(timeSinceTheLastTime).div(365 days).mul(baseInterestRate).div(10000);
            consoleLog(interestBSXO);

            uint BSXODecimals = interestBSXO.mul(10000000000000000); // here we have the the value with accurate number of decimals
            BSXO.mint(investorAddress, BSXODecimals);
        }

        lastTimeInterest = now;
    }

    function getUSDValueOfWEI(uint WEI) public returns (uint) {
        uint price = (uint)(oracle.latestAnswer());
        return WEI.div(1 finney).mul(price).div(1000000000);
    }

    function currentValue() public returns(uint) {
        return getUSDValueOfWEI(address(this).balance).add(USD);
    }

    function manuallyDeposit(address benefactor, string memory proof, uint amount) public onlyOwner {
        if(investorsUSDmap[benefactor] == 0) {
            investorsUSDarr.push(benefactor); // keeping unique count of investors in the array
        }

        investorsUSDmap[benefactor] = investorsUSDmap[benefactor].add(amount);
        USD = USD.add(amount);
    }

    receive() external payable {
        if(investorsWEImap[msg.sender] == 0) {
            investorsWEIarr.push(msg.sender); // keeping unique count of investors in the array
        }
        investorsWEImap[msg.sender] = investorsWEImap[msg.sender].add(msg.value);
    }

    function closeAndBuyTheIslandOrTheCollege() public onlyOwner {
        selfdestruct(beneficiary);
    }

    function chuckNorrisSaidOK() public onlyOwner {
        BSXO.unpause();
    }

}