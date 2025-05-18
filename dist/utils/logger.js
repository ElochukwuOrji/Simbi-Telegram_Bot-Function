"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSepoliaTxLink = formatSepoliaTxLink;
exports.formatSepoliaAddressLink = formatSepoliaAddressLink;
exports.logSepoliaInteraction = logSepoliaInteraction;
exports.formatSepoliaError = formatSepoliaError;
exports.getSepoliaConfig = getSepoliaConfig;
const SEPOLIA_CONFIG = {
    etherscanUrl: 'https://sepolia.etherscan.io',
    name: 'Sepolia Testnet',
    chainId: 11155111
};
/**
 * Formats an Etherscan transaction link for Sepolia
 * @param txHash Transaction hash
 * @returns Complete Sepolia Etherscan URL
 */
function formatSepoliaTxLink(txHash) {
    return `${SEPOLIA_CONFIG.etherscanUrl}/tx/${txHash}`;
}
/**
 * Formats an Etherscan address link for Sepolia
 * @param address Wallet or contract address
 * @returns Complete Sepolia Etherscan URL
 */
function formatSepoliaAddressLink(address) {
    return `${SEPOLIA_CONFIG.etherscanUrl}/address/${address}`;
}
/**
 * Enhanced Sepolia contract interaction logger
 * @param method Contract method name
 * @param params Method parameters
 * @param txHash Optional transaction hash
 */
function logSepoliaInteraction(method, params, txHash) {
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
function formatSepoliaError(error) {
    if (!error)
        return 'Unknown error occurred';
    let message = error.reason || error.message || 'Contract interaction failed';
    // Handle common Sepolia-specific cases
    if (error.code === 'INSUFFICIENT_FUNDS') {
        message = 'Insufficient SepoliaETH for gas (get test ETH from faucet)';
    }
    else if (error.code === 'NETWORK_ERROR') {
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
function getSepoliaConfig() {
    return SEPOLIA_CONFIG;
}
