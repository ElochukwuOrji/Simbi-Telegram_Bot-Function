import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { handleCreateGroup, handleStake } from "./commands";
import { setupEventListeners } from "../contracts/eventListeners";

dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN must be provided");
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Register commands
bot.command('creategroup', handleCreateGroup);
bot.command('stake', handleStake);
// bot.command('claim', handleClaim);

// Error handling
bot.catch((err: any, ctx: any) => {
  console.error(`Error for ${ctx.updateType}:`, err);
  ctx.reply('An error occurred while processing your request');
});

// Start the bot
bot.launch().then(() => {
  console.log('Bot started');
  setupEventListeners(bot);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));