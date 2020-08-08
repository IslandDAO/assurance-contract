![](https://raw.githubusercontent.com/basexisland/assurance-contract/master/war-games.gif)

# Changing the game

**Old game**: *"not ready now, keep me in the loop, let's touch base in a couple of months"*

**New Fork Order**: it pays off to be early


### New Fork Order aka "Assurance Contract"
Wikipedia definition: https://en.wikipedia.org/wiki/Assurance_contract

> An assurance contract, also known as a provision point mechanism, or crowdaction, is a game theoretic mechanism and a financial technology that facilitates the voluntary creation of public goods and club goods in the face of collective action problems such as the free rider problem.

Medium introduction about the design principles and feature set: https://medium.com/@basexisland/assurance-contract-772fb7eb0b58

Not that short pitch `6m56s`: https://www.youtube.com/watch?v=7lO6uYdzun4

[![](https://raw.githubusercontent.com/basexisland/assurance-contract/master/new-fork-order.jpeg)](https://www.youtube.com/watch?v=7lO6uYdzun4)


# `basex.eth`

For the time being, the real funds are deployed to the `basex.eth` Gnosis Multisig and calculations happen manually in Google Docs. This is not the Amazon-traffic web site, we can totally handle 2 people who have already committed `$10k` each. You are also invited to participate in the crowdfunding.

Weekly submission of screenshots to  Twitter / Discord / GitHub / internet archive / newsletter. That is a sufficient level decentralized centralization.

[![](https://raw.githubusercontent.com/basexisland/assurance-contract/master/eloh-projects-chainlink-meme.gif)](https://superrare.co/artwork-v2/genes1s-12464)


# Testnet

* Assurance Contract: https://ropsten.etherscan.io/address/0xb95db35782ab5ee844a1faa5d5a542a88d832aff

* `$BSXO` (BaseX Operations) token: https://ropsten.etherscan.io/address/0x7976cf3cf40bb728d6e873aefcdf32002e6dd618


### Totally not audited

Getting hacked / exploited sucks.

Spending a small fortune to develop solidity code is not a priority now, pull request welcome, our resources are dedicated to shilling.

Every other week there is a notable DeFi hack: https://defiweekly.substack.com/p/insurance-mining-opyn-musings

> The going price for an audit at the moment is anywhere between $30k-$75k USD. 


# Development

## Getting code

* `git clone git@github.com:basexisland/assurance-contract.git`
* `npm install`

Packages from scratch:
* `npm install @openzeppelin/contracts --save`
* `npm install @chainlink/contracts --save`

Using [`ERC20PresetMinterPauser`](https://docs.openzeppelin.com/contracts/3.x/api/presets) preset

## Deploying via Remix

Need to have [`solidity-flattener`](https://github.com/poanetwork/solidity-flattener) installed

`npm start ~/Stuff/assurance-contract/node_modules/@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol`

Deploy the `$BSXO` token

`npm start ~/Stuff/assurance-contract/contracts/Assurance.sol`

> "Multiple SPDX license identifiers found in source file."

Just remove globally that line from the concatenated file.

Deploy  while passing constructor parameters:
- token address
- chainlink oracle address: https://docs.chain.link/docs/reference-contracts on Ropsten `ETH/USD` is `0x8468b2bDCE073A157E560AA4D9CcF6dB1DB98507`
- beneficiary address

After deploying, set the `web3.sha3("MINTER_ROLE")`

`web3.utils.keccak256("MINTER_ROLE")` https://web3js.readthedocs.io/en/v1.2.7/web3-utils.html

### Running tests

`truffle test`

```
    ✓ Can calculate money invested in ETH (141ms)
    ✓ Can calculate money invested in USD (265ms)
    ✓ Can calculate money invested in ETH and USD (237ms)
    ✓ Can generate interest when one guy send ETH (120ms)
    ✓ Can generate interest when two guys send USD (above $100k) (181ms)
    ✓ Can generate when guys send ETH and USD, initially at 100% APR and then 20% APR only, total mix and match (414ms)
```

See also list of [issues](https://github.com/basexisland/assurance-contract/issues), **TLDR:** very early days, minimal feature set, loads of known issues.


## Prizes

Yes please!

> A Great DAO tool $1000
> That useful thing for DAOs you’ve been thinking about, or at least an MVP of it. $1000 & a chance at further funding.

## Use cases

* BaseX island
* College 1: https://twitter.com/lay2000lbs/status/1282488258535055360
* College 2: https://www.codwell.org/
* Special Economic Zone near Baikonur Cosmodrome in Kazakhstan, it's easier than you think, you can literally connect with guys from **Ministry of Digital Development, Innovation and Aerospace Industry** on [LinkedIn](https://www.linkedin.com/search/results/all/?keywords=%22Ministry%20of%20Digital%20Development%2C%20Innovation%20and%20Aerospace%20Industry%22)
* Something in Liberland
* Seastading Institute: https://www.seasteading.org/active-projects/

Personal note: `meta network`. I do not have enough money to put `$10k` into each of the projects but I can put `$10k` into `meta-network`, knowing that regardless of the actual location I'll move there in full confidence.

![](https://raw.githubusercontent.com/basexisland/assurance-contract/master/sez.gif)

For the purpose of jurisdiction, we always assume 0% as a baseline: https://sez.kz/en/

## Paradigm shift 

Related project: E-Estonia Voluntary Tax P2P Personal Tokens UBI Blockchain DAO - here we are change game theory too, your feedback is greatly appreciated. [Google Doc](https://docs.google.com/document/d/1AR4npthWvszwFqXmwJ1QMvgAu4hgyquThzphOk0kVfY/edit?usp=sharing)

**From:** *“taxation is a theft”* 

**To:**  *“monthly subscription for governance services”*

## Next steps

Currently 100% focus on the BaseX: https://basexisland.com/trip

After the conference and due-dilligence trip we will have more information how to progress further...

Network of special economic zones, new model of the global government, new unified law, new operating system for humanity.

[![](https://raw.githubusercontent.com/basexisland/assurance-contract/master/eloh-projects-superrare-meme.gif)](https://superrare.co/artwork-v2/2hunnetpercent-12639)
