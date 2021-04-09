// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;
import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/presets/ERC721PresetMinterPauserAutoId.sol";

contract NetworkStateGenesis is ERC721PresetMinterPauserAutoId {
    using SafeMath for uint256;

    string public GENESIS = "Will be populated";

  	uint256 public multiplier = 1001; 
  	uint256 public divisor = 1000; // Doing math in ETH. Multiply by 1001. Divide by 1000. Effectively 0.1% increase with each purchase.
  	uint256 public serialNumber;
  	uint256 public currentPrice = 10 ** 17; // Starting price is 0.1 ETH

  	event Purchase(address indexed addr, uint256 indexed serialNumber, uint256 price, bool BTC); // Final parameter `BTC` to indicate if purchase with BTC
    event Claim(address indexed addr); // Free claim as opposed to the actual purchase

    mapping(address => uint) public registrationTime;

    address public WBTCaddress; // On mainnet: 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599
    IERC20 public WBTC;

    address payable public multisig; // Ensure that there is enough m-of-n signatories and you are one of them to be extra sure (don't trust, verify)

    // "Network State Genesis", "NSG", "QmbtWkKnstd3Co3rWcD7woYZAKxk7yyzmf3DcGTM5fBc2N", 0x85A363699C6864248a6FfCA66e4a1A5cCf9f5567
    constructor(string memory name, string memory symbol, string memory baseURI, address payable multisigAddress, address _WBTCaddress) ERC721PresetMinterPauserAutoId(name, symbol, baseURI) public {
        multisig = multisigAddress;

        WBTCaddress = _WBTCaddress;
        WBTC = IERC20(WBTCaddress);
    }

    //////////////////////////////// 
    receive() external payable { // Fallback function
        purchase();
    }

    // ALWAYS FREE (only a gas fee) and available to everyone
    // It pays off to be early
    // The `registrationTime` will be used to calculate the reward in the future
    // TODO: fetch signature (off-chain) and store on IPFS to reduce friction and then cross-check with proof of humanity
    function freeClaim() public {
        require(registrationTime[msg.sender] == 0, "Address already registered");
        registrationTime[msg.sender] = now;
        emit Claim(msg.sender);
    }

    function purchase() payable public {
        require(msg.value >= currentPrice, "Not enough ETH. Check the current price.");
        uint256 refund = msg.value.sub(currentPrice);
        if (refund > 0) {
            msg.sender.transfer(refund);
        }       
        multisig.transfer(currentPrice);

        _mint(msg.sender, serialNumber);
        emit Purchase(msg.sender, serialNumber, currentPrice, false);
        serialNumber++;

        currentPrice = currentPrice.mul(multiplier).div(divisor); // * 11 / 10
    }

    // This is inspired by Hackers Congress Paralelní Polis: final ticket available for 1 BTC
    // Network State Genesis offers *UNLIMITED* number of NFTs for 1 BTC
    // How is that even possible? 🤔
    // As we establish multiplanetary civilisation, some of the accrued money will be put back into the circulation (recycling)
    function purchaseWithWBTC() public {
        WBTC.transferFrom(msg.sender, multisig, 10 ** 18);
        _mint(msg.sender, serialNumber);
        Purchase(msg.sender, serialNumber, 0, true);
        serialNumber++;
    }

    //////////////////////////////// MESSAGES
    // As you become the citizen of the Network State Genesis
    // This is the easiest way to voice your thoughts
    // Naturally, there will be off-chain solutions as well

    event MessagePosted(string IPFShash);

    mapping(address => string[]) public messages;

    function publishMessage(string memory IPFShash) public {
        string[] memory messagesUser = messages[msg.sender];
        if (messagesUser.length == 0) {
            messages[msg.sender] = [IPFShash];
        } else {
            messages[msg.sender].push(IPFShash);
        }

        emit MessagePosted(IPFShash);
    }

    // Need to have decidated function, see: https://ethereum.stackexchange.com/a/20838/2524
    function getMessagesLength(address addr) public view returns(uint256) {
        return messages[addr].length;
    }
}