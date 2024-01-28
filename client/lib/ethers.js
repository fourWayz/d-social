import { ethers } from 'ethers';

export function getEthersProvider() {
  // Check if MetaMask is installed and enabled
  if (window.ethereum) {
    // Use MetaMask's injected provider
    return new ethers.providers.Web3Provider(window.ethereum);
  } else {
    // Fall back to a JSON-RPC provider
    return new ethers.providers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
  }
}
