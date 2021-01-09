pragma solidity >=0.6.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";
import "../node_modules/@chainlink/contracts/src/v0.6/interfaces/AggregatorInterface.sol";

contract Assurance is Ownable {
    using SafeMath for uint256;

    AggregatorInterface public oracle;
    address payable beneficiary; // MULTISIG
    ERC20PresetMinterPauser public BSXO;
    mapping (address => uint) public balances;

    constructor(address oracleAddress, address BSXOaddress, address payable _beneficiary) public {
        beneficiary = _beneficiary;
        BSXO = ERC20PresetMinterPauser(BSXOaddress);
        oracle = AggregatorInterface(oracleAddress);
    }

    // uint public lastTimeInterest;
    // function accrueInterest() public {
    //     // require(now - lastTimeInterest > 1 days, "Interest is accounted max 1 per day"); // ACTUALLY: does not matter, can accrue anytime

    //     uint timeSinceTheLastTime = now - lastTimeInterest;
    //     uint baseInterestRate = currentValue() > 10000000 ? 2000 : 10000; // More than $100k, the interest rate is 20%, below is 100%


    //     uint arrayLength = investorsWEIarr.length;
    //     for (uint i=0; i<arrayLength; i++) {
    //         address investorAddress = investorsWEIarr[i];
    //         uint principalUSDvalue = getUSDValueOfWEI(balances[investorAddress]);

    //         uint interestBSXO = principalUSDvalue.mul(timeSinceTheLastTime).div(365 days).mul(baseInterestRate).div(10000); // here we have dollar value

    //         uint BSXODecimals = interestBSXO.mul(10000000000000000); // here we have the the value with accurate number of decimals
    //         BSXO.mint(investorAddress, BSXODecimals);
    //     }

    //     lastTimeInterest = now;
    // }

    function getUSDValueOfWEI(uint WEI) public view returns (uint) {
        uint price = (uint)(oracle.latestAnswer());
        return WEI.mul(price).div(1000000000000000000000000); // getting the right decimals Chainlink represents data
    }

    function currentValue() public view returns(uint) {
        return getUSDValueOfWEI(address(this).balance);
    }

    receive() external payable {
        balances[msg.sender] = balances[msg.sender].add(msg.value);
    }

    function withdraw() public {
        msg.sender.transfer(balances[msg.sender]);
    }

    function closeAndBuyTheIslandOrTheCollege() public onlyOwner {
        selfdestruct(beneficiary);
    }


}