pragma solidity >=0.6.0;

import "../node_modules/@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";
import "../node_modules/@openzeppelin/contracts/presets/ERC721PresetMinterPauserAutoId.sol";

// By placing this `.sol` file in "contracts" it will make it compiled in "artifacts"
// In that way we can access it in the tests
contract IslandToken is ERC20PresetMinterPauser {
    constructor(string memory name, string memory symbol) public ERC20PresetMinterPauser(name, symbol) {

    }
}

// Dummy contract for testing purposes: rescuing ERC20 from the contract
contract DAI_DUMMY is ERC20PresetMinterPauser {
    constructor(string memory name, string memory symbol) public ERC20PresetMinterPauser(name, symbol) {

    }

    function dummy() public view returns(string memory) { // Generating a different ABI
        return "42";
    }
}

// Dummy contract for testing purposes: rescuing NFT721 from the contract
contract CryptoKitties_DUMMY is ERC721PresetMinterPauserAutoId {
    constructor(string memory name, string memory symbol, string memory baseURI) public ERC721PresetMinterPauserAutoId(name, symbol, baseURI) {

    }
}