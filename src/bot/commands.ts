import { Context } from "telegraf";
import { createGroup, stake } from "../contracts/contractHelper";
import { 
  formatSepoliaTxLink,
  logSepoliaInteraction,
  formatSepoliaError
} from "../utils/logger";

export async function handleCreateGroup(ctx: Context) {
  try {
    if (ctx.chat?.type !== 'private') {
      return ctx.reply('Please use this command in a private chat with the bot');
    }

    const userId = ctx.from?.id.toString();
    if (!userId) throw new Error('Unable to get user ID');

    let stakeAmount = 20;
    if (ctx.message && 'text' in ctx.message && typeof ctx.message.text === 'string') {
      const parts = ctx.message.text.split(' ');
      stakeAmount = parseFloat(parts[1]) || 20;
    }
    const { txHash, gasUsed } = await createGroup({
      participants: [userId],
      stakeAmount,
      durationSeconds: 3600
    });

    // Log to console
    logSepoliaInteraction('createGroup', {
      userId,
      stakeAmount,
      gasUsed
    }, txHash);

    // Respond to user
    await ctx.replyWithMarkdown(`
✅ *Group Created on Sepolia Testnet!*

• *Stake Amount:* ${stakeAmount} tokens
• *Gas Used:* ${gasUsed} gwei
• [View Transaction](${formatSepoliaTxLink(txHash)})
    `);

  } catch (error: any) {
    const errorMessage = formatSepoliaError(error);
    console.error('Sepolia Contract Error:', error);
    await ctx.reply(`❌ Error: ${errorMessage}`);
  }
}

export async function handleStake(ctx: Context) {
  try {
    if (ctx.chat?.type !== 'private') {
      return ctx.reply('Please use this command in a private chat with the bot');
    }

    const userId = ctx.from?.id.toString();
    if (!userId) throw new Error('Unable to get user ID');

    // Implement your stake logic here
    // For example:
    const { txHash, gasUsed } = await stake({
      userId,
      amount: 10 // Default stake amount or parse from message
    });

    logSepoliaInteraction('stake', {
      userId,
      amount: 10,
      gasUsed
    }, txHash);

    await ctx.replyWithMarkdown(`
✅ *Stake Successful on Sepolia Testnet!*

• *Amount Staked:* 10 tokens
• *Gas Used:* ${gasUsed} gwei
• [View Transaction](${formatSepoliaTxLink(txHash)})
    `);

  } catch (error: any) {
    const errorMessage = formatSepoliaError(error);
    console.error('Sepolia Contract Error:', error);
    await ctx.reply(`❌ Error: ${errorMessage}`);
  }
}