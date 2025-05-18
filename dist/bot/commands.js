"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateGroup = handleCreateGroup;
exports.handleStake = handleStake;
const contractHelper_1 = require("../contracts/contractHelper");
const logger_1 = require("../utils/logger");
async function handleCreateGroup(ctx) {
    try {
        if (ctx.chat?.type !== 'private') {
            return ctx.reply('Please use this command in a private chat with the bot');
        }
        const userId = ctx.from?.id.toString();
        if (!userId)
            throw new Error('Unable to get user ID');
        let stakeAmount = 20;
        if (ctx.message && 'text' in ctx.message && typeof ctx.message.text === 'string') {
            const parts = ctx.message.text.split(' ');
            stakeAmount = parseFloat(parts[1]) || 20;
        }
        const { txHash, gasUsed } = await (0, contractHelper_1.createGroup)({
            participants: [userId],
            stakeAmount,
            durationSeconds: 3600
        });
        // Log to console
        (0, logger_1.logSepoliaInteraction)('createGroup', {
            userId,
            stakeAmount,
            gasUsed
        }, txHash);
        // Respond to user
        await ctx.replyWithMarkdown(`
✅ *Group Created on Sepolia Testnet!*

• *Stake Amount:* ${stakeAmount} tokens
• *Gas Used:* ${gasUsed} gwei
• [View Transaction](${(0, logger_1.formatSepoliaTxLink)(txHash)})
    `);
    }
    catch (error) {
        const errorMessage = (0, logger_1.formatSepoliaError)(error);
        console.error('Sepolia Contract Error:', error);
        await ctx.reply(`❌ Error: ${errorMessage}`);
    }
}
async function handleStake(ctx) {
    try {
        if (ctx.chat?.type !== 'private') {
            return ctx.reply('Please use this command in a private chat with the bot');
        }
        const userId = ctx.from?.id.toString();
        if (!userId)
            throw new Error('Unable to get user ID');
        // Implement your stake logic here
        // For example:
        const { txHash, gasUsed } = await (0, contractHelper_1.stake)({
            userId,
            amount: 10 // Default stake amount or parse from message
        });
        (0, logger_1.logSepoliaInteraction)('stake', {
            userId,
            amount: 10,
            gasUsed
        }, txHash);
        await ctx.replyWithMarkdown(`
✅ *Stake Successful on Sepolia Testnet!*

• *Amount Staked:* 10 tokens
• *Gas Used:* ${gasUsed} gwei
• [View Transaction](${(0, logger_1.formatSepoliaTxLink)(txHash)})
    `);
    }
    catch (error) {
        const errorMessage = (0, logger_1.formatSepoliaError)(error);
        console.error('Sepolia Contract Error:', error);
        await ctx.reply(`❌ Error: ${errorMessage}`);
    }
}
