const IslandToken = artifacts.require('IslandToken');
const Assurance = artifacts.require('Assurance')

const beneficiary = "0x901CF8126c5F71f904086491FA71Ec47B5E5505d"; // MetaMask 4
 
module.exports = async function (deployer) {
    
    await deployer.deploy(IslandToken, "Island Token hack the planet(s) <img src=x onerror=alert(🦄)>", "ISLAND");

    const islandToken = await IslandToken.deployed();

    // Price Oracle ETH / USD: https://docs.chain.link/docs/ethereum-addresses#rinkeby
    const oracleAddress = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e";

    await deployer.deploy(Assurance, oracleAddress, islandToken.address, beneficiary);

};