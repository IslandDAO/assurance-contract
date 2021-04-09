const NetworkStateGenesis = artifacts.require('NetworkStateGenesis')
const multisig = "0x21b3aE2c33605D20E005A56346Ff0C82Bb84fc74"; // Gnosis Safe: https://rinkeby.gnosis-safe.io/app/#/safes/0x21b3aE2c33605D20E005A56346Ff0C82Bb84fc74/balances

module.exports = async function (deployer) {
    // Rinkeby: https://rinkeby.etherscan.io/address/0xa8010a0351520229e0783e68484f6fba95867f60#code
    const WBTCaddress = "0xa8010A0351520229E0783e68484F6fBa95867F60";
    const cutoffTimestamp = 1625443200;

    await deployer.deploy(NetworkStateGenesis, "Network State Genesis", "🔮", multisig, WBTCaddress, cutoffTimestamp);
};