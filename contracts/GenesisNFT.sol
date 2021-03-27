// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;
import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/presets/ERC721PresetMinterPauserAutoId.sol";

contract NetworkStateGenesis is ERC721PresetMinterPauserAutoId {
    using SafeMath for uint256;

    string public GENESIS= "Will be populated";


    address payable public multisig; // MULTISIG. Ensure that there is enough m-of-n signatories and you are one of them to be extra sure (don't trust, verify)

    event Deposit(address user, uint amount);
    event Withdrawal(address user, uint amount);
    event Stake(address user, uint amount);
    event Unstake(address user, uint amount);

    // "Network State Genesis", "NSG", "QmbtWkKnstd3Co3rWcD7woYZAKxk7yyzmf3DcGTM5fBc2N", 0x85A363699C6864248a6FfCA66e4a1A5cCf9f5567
    constructor(string memory name, string memory symbol, string memory baseURI, address payable multisigAddress) ERC721PresetMinterPauserAutoId(name, symbol, baseURI) public {
        multisig = multisigAddress;

        // TODO: move the ownership
        // transferOwnership(multisig);
    }

    //////////////////////////////// DEPOSITS AND WITHDRAWALS
    receive() external payable { // Fallback function, sending directly to the contract

    }

    event MessagePosted(string IPSFhash);

    mapping(address => string[]) public messages;

    function getMessagesLength(address addr) public view returns(uint256) {
        return messages[addr].lenght;
    }

    function publishMessage(string memory IPFShash) public {
        string[] memory messagesUser = messages[msg.sender];
        if (messagesUser.length == 0) {
            messages[msg.sender] = [IPFShash];
        } else {
            messages[msg.sender].push(IPFShash);
        }

        emit MessagePosted(IPFShash);
    }


    address WBTCaddress = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599; // MAINNET
    IERC20 WBTC = IERC20(WBTCaddress);
    uint ONE = 1 ether;

    function purchaseWithWBTC() public {
        WBTC.transferFrom(msg.sender, multisig, ONE);
    }

}