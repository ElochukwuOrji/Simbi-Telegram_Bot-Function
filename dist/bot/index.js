"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const dotenv_1 = __importDefault(require("dotenv"));
const commands_1 = require("./commands");
const eventListeners_1 = require("../contracts/eventListeners");
dotenv_1.default.config();
if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN must be provided");
}
const bot = new telegraf_1.Telegraf(process.env.TELEGRAM_BOT_TOKEN);
// Register commands
bot.command('creategroup', commands_1.handleCreateGroup);
bot.command('stake', commands_1.handleStake);
// bot.command('claim', handleClaim);
// Error handling
bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}:`, err);
    ctx.reply('An error occurred while processing your request');
});
// Start the bot
bot.launch().then(() => {
    console.log('Bot started');
    (0, eventListeners_1.setupEventListeners)(bot);
});
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
