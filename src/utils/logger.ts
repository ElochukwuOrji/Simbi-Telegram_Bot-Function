// SEPOLIA-SPECIFIC LOGGER UTILITIES
type SepoliaNetwork = 'sepolia'; // Only Sepolia supported

interface NetworkConfig {
  etherscanUrl: string;
  name: string;
  chainId: number;
}

const SEPOLIA_CONFIG: NetworkConfig = {
  etherscanUrl: 'https://sepolia.etherscan.io',
  name: 'Sepolia Testnet',
  chainId: 11155111
};

/**
 * Formats an Etherscan transaction link for Sepolia
 * @param txHash Transaction hash
 * @returns Complete Sepolia Etherscan URL
 */
export function formatSepoliaTxLink(txHash: string): string {
  return `${SEPOLIA_CONFIG.etherscanUrl}/tx/${txHash}`;
}

/**
 * Formats an Etherscan address link for Sepolia
 * @param address Wallet or contract address
 * @returns Complete Sepolia Etherscan URL
 */
export function formatSepoliaAddressLink(address: string): string {
  return `${SEPOLIA_CONFIG.etherscanUrl}/address/${address}`;
}

/**
 * Enhanced Sepolia contract interaction logger
 * @param method Contract method name
 * @param params Method parameters
 * @param txHash Optional transaction hash
 */
export function logSepoliaInteraction(
  method: string, 
  params: Record<string, any>,
  txHash?: string
): void {
  console.log(`\n[${new Date().toISOString()}]`);
  console.log(`[${SEPOLIA_CONFIG.name}] Contract Method: ${method}`);
  console.log('Parameters:', JSON.stringify(params, null, 2));
  
  if (txHash) {
    console.log('Transaction Link:', formatSepoliaTxLink(txHash));
  }
}

/**
 * Formats Sepolia-specific errors
 * @param error Error object
 * @returns Human-readable error message
 */
export function formatSepoliaError(error: any): string {
  if (!error) return 'Unknown error occurred';
  
  let message = error.reason || error.message || 'Contract interaction failed';
  
  // Handle common Sepolia-specific cases
  if (error.code === 'INSUFFICIENT_FUNDS') {
    message = 'Insufficient SepoliaETH for gas (get test ETH from faucet)';
  } else if (error.code === 'NETWORK_ERROR') {
    message = 'Network connection to Sepolia failed';
  }
  
  if (error.transactionHash) {
    message += `\nTX Hash: ${error.transactionHash}`;
  }
  
  return message;
}

/**
 * Gets Sepolia network configuration
 */
export function getSepoliaConfig(): NetworkConfig {
  return SEPOLIA_CONFIG;
}