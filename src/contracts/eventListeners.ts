import { Telegraf } from "telegraf";
import { contract } from "./contractHelper";
import { formatSepoliaTxLink } from "../utils/logger";

export function setupEventListeners(bot: Telegraf) {
  contract.on("SessionCompleted", async (sessionId, winners) => {
    try {
      const winnerIds = winners.map((w: any) => w.toString());
      
      for (const userId of winnerIds) {
        await bot.telegram.sendMessage(
          userId,
          `🏆 You earned rewards in session ${sessionId} on Sepolia!\n` +
          `View details: ${formatSepoliaTxLink(sessionId.toString())}`
        );
      }
    } catch (error) {
      console.error("Sepolia Event Error:", error);
    }
  });

  console.log("Sepolia event listeners initialized");
}