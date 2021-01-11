pragma solidity >=0.6.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";
import "../node_modules/@chainlink/contracts/src/v0.6/interfaces/AggregatorInterface.sol";

contract Assurance is Ownable {
    using SafeMath for uint256;

    AggregatorInterface public oracle;
    address payable beneficiary; // MULTISIG. Ensure that there is enough m-of-n signatories and you are one of them to be extra sure 👍 (don't trust, verify)
    ERC20PresetMinterPauser public islandToken; // On Etherscan read contract and verify that `getRoleMemberCount` for MINTER_ROLE is exactly 1 (only this contract can mint)


    event Deposit(address user, uint amount);
    event Witdrawal(address user, uint amount);


    constructor(address oracleAddress, address islandTokenAddress, address payable _beneficiary) public {
        beneficiary = _beneficiary;
        islandToken = ERC20PresetMinterPauser(islandTokenAddress);
        oracle = AggregatorInterface(oracleAddress);
    }

    function getUSDValueOfWEI(uint WEI) public view returns (uint) {
        uint price = (uint)(oracle.latestAnswer());
        return WEI.mul(price).div(1000000000000000000000000); // Getting the right decimals, this is how ChainLink represents thedata
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
        // TODO: require tokens approval
        // msg.sender.transfer(balances[msg.sender]);
    }

    function closeAndBuyTheIslandOrTheCollege() public onlyOwner {
        selfdestruct(beneficiary);
    }


}