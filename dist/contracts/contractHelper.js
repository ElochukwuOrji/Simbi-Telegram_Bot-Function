"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stake = exports.createGroup = exports.contract = void 0;
const ethers_1 = require("ethers");
const dotenv_1 = __importDefault(require("dotenv"));
const SimbiToken_json_1 = __importDefault(require("./abis/SimbiToken.json"));
const logger_1 = require("../utils/logger");
dotenv_1.default.config();
// Initialize provider and wallet
const provider = new ethers_1.ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers_1.Wallet(process.env.BOT_WALLET_PRIVATE_KEY, provider);
// Contract instance
exports.contract = new ethers_1.Contract(process.env.CONTRACT_ADDRESS, SimbiToken_json_1.default, wallet);
const createGroup = async ({ participants, stakeAmount, durationSeconds = 3600 }) => {
    try {
        const tx = await exports.contract.createSession(participants, (0, ethers_1.parseUnits)(stakeAmount.toString(), 18), durationSeconds, { gasLimit: 300000 });
        const receipt = await tx.wait();
        (0, logger_1.logSepoliaInteraction)('createSession', {
            participants,
            stakeAmount,
            durationSeconds,
            gasUsed: receipt.gasUsed.toString()
        }, tx.hash);
        return {
            txHash: tx.hash,
            gasUsed: (0, ethers_1.formatUnits)(receipt.gasUsed, 'gwei')
        };
    }
    catch (error) {
        console.error("Sepolia Contract Error:", error);
        throw new Error("Failed to create group");
    }
};
exports.createGroup = createGroup;
const stake = async ({ userId, amount, groupId = "0" }) => {
    try {
        const tx = await exports.contract.stake(userId, (0, ethers_1.parseUnits)(amount.toString(), 18), { gasLimit: 300000 });
        const receipt = await tx.wait();
        (0, logger_1.logSepoliaInteraction)('stake', {
            userId,
            amount,
            gasUsed: receipt.gasUsed.toString()
        }, tx.hash);
        return {
            txHash: tx.hash,
            gasUsed: (0, ethers_1.formatUnits)(receipt.gasUsed, 'gwei')
        };
    }
    catch (error) {
        console.error("Sepolia Contract Error:", error);
        throw new Error("Failed to stake tokens");
    }
};
exports.stake = stake;
