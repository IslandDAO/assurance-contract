# New Fork Order aka "Assurance Contract"

Medium introduction: https://medium.com/@basexisland/assurance-contract-772fb7eb0b58

Fork The World is 100% aligned with the vision of the BaseX

Quick pitch: https://www.youtube.com/watch?v=7lO6uYdzun4

(https://www.youtube.com/watch?v=7lO6uYdzun4)[![](https://raw.githubusercontent.com/basexisland/assurance-contract/master/new-fork-order.jpeg)]

# `basex.eth`

For the time being, the real funds are deployed Gnosis Multisig and calculations happen in Google Docs.


# Testnet Only


* Assurance: https://ropsten.etherscan.io/address/0xb95db35782ab5ee844a1faa5d5a542a88d832aff#code

* BSXO (BaseX Operations) token: https://ropsten.etherscan.io/address/0x7976cf3cf40bb728d6e873aefcdf32002e6dd618



### Totally not audited

Getting hacked / exploited sucks.

Spending small fortune to develop solidity code.

https://defiweekly.substack.com/p/insurance-mining-opyn-musings


> The going price for an audit at the moment is anywhere between $30k-$75k USD. 


### Easier in Google Docs
Jurisdiction of Google Docs

Weekly submission to Twitter / Discord / GitHub / internet archive / newsletter 



# Development

### Getting code

`git clone git@github.com:basexisland/assurance-contract.git`
`npm install`

Packages from scratch:
* `npm install @openzeppelin/contracts --save`
* `npm install @chainlink/contracts --save`

Using [`ERC20PresetMinterPauser`](https://docs.openzeppelin.com/contracts/3.x/api/presets)


### Deploying via Remix

Need to have [`solidity-flattener`](https://github.com/poanetwork/solidity-flattener) installed

`npm start ~/Stuff/assurance-contract/node_modules/@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol`

Deploy to Ropsten

`npm start ~/Stuff/assurance-contract/contracts/Assurance.sol`

> "Multiple SPDX license identifiers found in source file."

Just remove globally that line

Deploy to Ropsten while passing constructor parameters:
- token 
- chainlink oracle: https://docs.chain.link/docs/reference-contracts on Ropsten `ETH/USD` is `0x8468b2bDCE073A157E560AA4D9CcF6dB1DB98507`
- beneficiary address

After deploying, set the `web3.sha3("MINTER_ROLE")`

web3.utils.keccak256("MINTER_ROLE") (https://web3js.readthedocs.io/en/v1.2.7/web3-utils.html)




### Running tests
```
    ✓ Can calculate money invested in ETH (141ms)
    ✓ Can calculate money invested in USD (265ms)
    ✓ Can calculate money invested in ETH and USD (237ms)
    ✓ Can generate interest when one guy send ETH (120ms)
    ✓ Can generate interest when two guys send USD (above $100k) (181ms)
    ✓ Can generate when guys send ETH and USD, initially at 100% APR and then 20% APR only, total mix and match (414ms)
```

### Known limitations

So many to list, total proof of concept, experiment.

Limit the number of USD / ETH otheriwse run out of gas

No withdrawing Widrawing, keep track of the array


You put $10k worth of EHT

Interest accounted from principal

Did not implement the floor - absolutely willing to do it

The way how rounding is done, if your contribution is less than `$0.01` then it sends `$0.00` worth of `$BSXO`


### Next steps: operating system for humanity and rarning income

If Latitude59 and BaseX will not show a major progress, I will finetune my strategy.

Less real-estate, island, houses, more new model of government, new incentives, new operating system for humanity:

Skilled and able developer.

Coding skills are going towards marketing automation 

Passionate about adoption, usability, user experience.

