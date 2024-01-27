const {ethers} = require('hardhat')
const fs = require('fs')
require('dotenv').config()

module.exports = async function(){
    // automatic abi and address updates to frontend upon deployment
        console.log('-----------------updating--------frontend-------------parameters');
        const ABI = './social_frontend/app/variables/abi.json'  // abi location
        const ADDRESS = './social_frontend/app/variables/address.json' // contract address location

        const contract = await hre.ethers.getContractFactory('SocialMedia')
        const deploy = await contract.deploy()
        console.log('---------------updating-------contract-----------address');
        fs.writeFileSync(ADDRESS,JSON.stringify(deploy.address))
        console.log('--------------updated--------contract------------address');
        const abi = contract.interface.format(ethers.utils.FormatTypes.json)
        console.log('----------updating----abi---')
        fs.writeFileSync(ABI,abi)
        console.log('----------updated----abi---')

}