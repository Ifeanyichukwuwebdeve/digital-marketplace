require("@nomiclabs/hardhat-waffle")
require('dotenv').config()
const fs = require('fs')
const privateKey = process.env.AccountPrivateKey
const projectId = 'bbd9c161974042a88dbe5df4cae47575'

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}