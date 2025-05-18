import { ethers, JsonRpcProvider, Wallet, formatUnits, parseUnits } from "ethers";
import dotenv from "dotenv";
import SimbiToken from "./abis/SimbiToken.json" assert { type: "json" };
import { logSepoliaInteraction } from "../utils/logger";

dotenv.config();

// Sepolia-specific provider setup
const provider = new JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new Wallet(process.env.BOT_WALLET_PRIVATE_KEY!, provider);

export const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS!,
  SimbiToken,
  wallet
);

interface CreateGroupParams {
  participants: string[];
  stakeAmount: number;
  durationSeconds?: number;
}

export const createGroup = async ({
  participants,
  stakeAmount,
  durationSeconds = 3600
}: CreateGroupParams) => {
  try {
    const tx = await contract.createSession(
      participants,
      parseUnits(stakeAmount.toString(), 18),
      durationSeconds,
      { gasLimit: 300000 }
    );
    
    const receipt = await tx.wait();
    
    logSepoliaInteraction('createSession', {
      participants,
      stakeAmount,
      durationSeconds,
      gasUsed: receipt.gasUsed.toString()
    }, tx.hash);

    return {
      txHash: tx.hash,
      gasUsed: formatUnits(receipt.gasUsed, 'gwei')
    };
  } catch (error) {
    console.error('Sepolia Contract Error:', error);
    throw error;
  }
};

interface StakeParams {
  userId: string;
  amount: number;
  groupId?: string; // Optional if you're using group IDs
}

export const stake = async ({
  userId,
  amount,
  groupId = "0" // Default or parse from input
}: StakeParams) => {
  try {
    // Assuming your contract has a stake function
    // Adjust this based on your actual contract ABI
    const tx = await contract.stake(
      userId, // or groupId if that's what your contract expects
      parseUnits(amount.toString(), 18),
      { gasLimit: 300000 }
    );
    
    const receipt = await tx.wait();
    
    logSepoliaInteraction('stake', {
      userId,
      amount,
      gasUsed: receipt.gasUsed.toString()
    }, tx.hash);

    return {
      txHash: tx.hash,
      gasUsed: formatUnits(receipt.gasUsed, 'gwei')
    };
  } catch (error) {
    console.error('Sepolia Contract Error:', error);
    throw error;
  }
};