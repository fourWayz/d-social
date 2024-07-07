/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-toolbox')
require('@nomicfoundation/hardhat-chai-matchers')
require('hardhat-deploy')
require('dotenv').config()

const private_key = process.env.kura_private_key // private key

module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "hardhat",
  networks: {
      hardhat: {
          chainId: 31337,
      },
      kura: {
        url: 'https://rpc-kura.cross.technology',
        accounts: [private_key],
        chainId : 5555
    },
    },
    namedAccounts: {
      deployer: {
          default: 0, 
          1: 0, 
      },     
  },
};
