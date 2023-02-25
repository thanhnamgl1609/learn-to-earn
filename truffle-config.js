
// require('dotenv').config();
// const mnemonic = process.env["MNEMONIC"];
// const infuraProjectId = process.env["INFURA_PROJECT_ID"];
 
// const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "5777",       // Any network (default: none)
    },
  },

  mocha: {
  },

  compilers: {
    solc: {
      version: "0.8.13",      // Fetch exact version from solc-bin
    }
  }
};
