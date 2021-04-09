// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

import "../node_modules/@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";

// By placing this `.sol` file in "contracts" it will make it compiled in "artifacts"
// In that way we can access it in the tests
// Of course this is a hack, but it works for me and ETH tooling is getting better
// Pretty sure one day I'll remove this file, obviously
contract WBTC is ERC20PresetMinterPauser {
    constructor(string memory name, string memory symbol) public ERC20PresetMinterPauser(name, symbol) {

    }
}