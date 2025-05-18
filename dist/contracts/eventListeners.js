"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEventListeners = setupEventListeners;
const contractHelper_1 = require("./contractHelper");
const logger_1 = require("../utils/logger");
function setupEventListeners(bot) {
    contractHelper_1.contract.on("SessionCompleted", async (sessionId, winners) => {
        try {
            const winnerIds = winners.map((w) => w.toString());
            for (const userId of winnerIds) {
                await bot.telegram.sendMessage(userId, `🏆 You earned rewards in session ${sessionId} on Sepolia!\n` +
                    `View details: ${(0, logger_1.formatSepoliaTxLink)(sessionId.toString())}`);
            }
        }
        catch (error) {
            console.error("Sepolia Event Error:", error);
        }
    });
    console.log("Sepolia event listeners initialized");
}
