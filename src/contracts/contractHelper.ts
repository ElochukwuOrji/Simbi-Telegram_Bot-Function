import { ethers, parseUnits, formatUnits, Wallet, Contract } from "ethers";
import dotenv from "dotenv";
import SimbiToken from "./abis/SimbiToken.json";
import { logSepoliaInteraction } from "../utils/logger";

dotenv.config();

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new Wallet(process.env.BOT_WALLET_PRIVATE_KEY!, provider);

// Contract instance
export const contract = new Contract(
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
}: CreateGroupParams): Promise<{ txHash: string; gasUsed: string }> => {
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
    console.error("Sepolia Contract Error:", error);
    throw new Error("Failed to create group");
  }
};

interface StakeParams {
  userId: string;
  amount: number;
  groupId?: string;
}

export const stake = async ({
  userId,
  amount,
  groupId = "0"
}: StakeParams): Promise<{ txHash: string; gasUsed: string }> => {
  try {
    const tx = await contract.stake(
      userId,
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
    console.error("Sepolia Contract Error:", error);
    throw new Error("Failed to stake tokens");
  }
};