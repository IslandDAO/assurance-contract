pragma solidity >=0.6.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";
import "../node_modules/@chainlink/contracts/src/v0.6/interfaces/AggregatorInterface.sol";

contract Assurance is Ownable {
    using SafeMath for uint256;

    AggregatorInterface public oracle;
    address payable beneficiary; // MULTISIG
    ERC20PresetMinterPauser public islandToken;
    mapping (address => uint) public balances;

    constructor(address oracleAddress, address BSXOaddress, address payable _beneficiary) public {
        beneficiary = _beneficiary;
        islandToken = ERC20PresetMinterPauser(BSXOaddress);
        oracle = AggregatorInterface(oracleAddress);
    }

    function getUSDValueOfWEI(uint WEI) public view returns (uint) {
        uint price = (uint)(oracle.latestAnswer());
        return WEI.mul(price).div(1000000000000000000000000); // getting the right decimals, this is how ChainLink represents data
    }

    function currentValue() public view returns(uint) {
        return getUSDValueOfWEI(address(this).balance);
    }

    receive() external payable {
        deposit();
        // balances[msg.sender] = balances[msg.sender].add(msg.value);
    }

    function deposit() public payable {
        islandToken.mint(msg.sender, msg.value);
    }

    function withdraw() public {
        // msg.sender.transfer(balances[msg.sender]);
    }

    function closeAndBuyTheIslandOrTheCollege() public onlyOwner {
        selfdestruct(beneficiary);
    }


}