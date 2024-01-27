/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-toolbox')
require('@nomicfoundation/hardhat-chai-matchers')
require('hardhat-deploy')
require('dotenv').config()

const celo_alfajores_rpc = process.env.celo_alfajores_rpc // celo alfajores rpc url
const celo_mainnet_rpc = process.env.celo_mainnet_rpc // celo mainnet rpc
const private_key = process.env.private_key // private key

module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "hardhat",
  networks: {
      hardhat: {
          chainId: 31337,
      },
      alfajores: {
        url: celo_alfajores_rpc,
        accounts: [private_key],
        chainId: 44787
      },
        celo: {
        url: celo_mainnet_rpc,
        accounts: [private_key],
        chainId: 42220
      }
    },
    namedAccounts: {
      deployer: {
          default: 0, 
          1: 0, 
      },     
  },
};
