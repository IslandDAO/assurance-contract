const { projectId, privateKey, etherscanAPI } = require('./secrets.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  mocha: {
    enableTimeouts: false
  },
  networks: {
    rinkeby: {
      provider: () => new HDWalletProvider([privateKey], `https://rinkeby.infura.io/v3/${projectId}`),
      network_id: 4,       // Ropsten's id
      gas: 10000000,        // Ropsten has a lower block limit than mainnet
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    ropsten: {
      provider: () => new HDWalletProvider([privateKey], `https://ropsten.infura.io/v3/${projectId}`),
      network_id: 3,       // Ropsten's id
      gas: 8000000,        // Ropsten has a lower block limit than mainnet
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    kovan: {
      provider: () => new HDWalletProvider([privateKey], `https://kovan.infura.io/v3/${projectId}`),
      network_id: 42,       // Ropsten's id
      gas: 12500000,        // Ropsten has a lower block limit than mainnet
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },

   },

  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.6.0",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 200
       },
      }
    },
  },

  plugins: [
    'truffle-plugin-verify'
  ],

  api_keys: {
    etherscan: etherscanAPI
  }

 };