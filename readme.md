# Island DAO



### Tokenomics

1,000,000,000 Total Supply
17% team, suppliers, contractors, services (during the fundraise)
17% during the build
50% community crowdfunding
5% ecosystem development fund
5% airdrop
1% Ross Ulbricht legal fund
5% reserve, contingencies, rainy day




# Development

### Running tests

`truffle test`

```
    ✓ Can deposit ETH and mint tokens (63ms)
    ✓ Can withdraw ETH by burning tokens (139ms)
    ✓ Can calculate money invested in ETH (114ms)
    ✓ Calculate price in WEI correctly (50ms)
    ✓ Does not allow to initiate withdrawal initially
    ✓ Allows to initiate withdrawal after $1m in deposits (168ms)
    ✓ Allows to to finalize after 30 days (201ms)
    ✓ Can rescue ERC20 (209ms)
    ✓ Can rescue NFT721 (234ms)
```


### Verifying on Etherscan

```
truffle run verify IslandToken Assurance --network rinkeby
Verifying IslandToken
Pass - Verified: https://rinkeby.etherscan.io/address/0x...#contracts
Verifying Assurance
Pass - Verified: https://rinkeby.etherscan.io/address/0x...C#contracts
Successfully verified 2 contract(s).
```