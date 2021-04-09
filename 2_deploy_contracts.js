// const IslandToken = artifacts.require('IslandToken');
// const StakedToken = artifacts.require('StakedToken');
// const Assurance = artifacts.require('Assurance')

// const beneficiary = "0x901CF8126c5F71f904086491FA71Ec47B5E5505d"; // MetaMask 4
// const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"; // web3.sha3("MINTER_ROLE")
// const days = 24 * 60 * 60; 

// module.exports = async function (deployer) {
    
//     await deployer.deploy(IslandToken, "Island Token", "ISLAND");
//     await deployer.deploy(StakedToken, "Island Token Staked", "STAKED");

//     const islandToken = await IslandToken.deployed();
//     const stakedToken = await StakedToken.deployed();

//     // Price Oracle ETH / USD: https://docs.chain.link/docs/ethereum-addresses#rinkeby
//     const oracleAddress = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e";

//     await deployer.deploy(Assurance, oracleAddress, islandToken.address, stakedToken.address, beneficiary, 30 * days);

//     const assurance = await Assurance.deployed();

//     await islandToken.grantRole(MINTER_ROLE, assurance.address);
//     await stakedToken.grantRole(MINTER_ROLE, assurance.address);

//     // UNSURE HOW TO REMOVE THE ROLE "MINTER" and "ADMIN"
//     // await islandToken.renounceRole(MINTER_ROLE, deployer.address);
// };