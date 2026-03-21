import "dotenv/config";

import { Bot } from "grammy";
import { run } from "@grammyjs/runner";
import { startHandler } from "./handlers/start";
import { dreamHandler } from "./handlers/dream";
import { voiceHandler } from "./handlers/voice";

import { loggerMiddleware } from "./middleware/logger";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.use(loggerMiddleware);

bot.command("start", startHandler);
bot.on("message:text", dreamHandler);
bot.on("message:voice", voiceHandler);

bot.catch((err) => {
  const ctx = err.ctx;
  console.error("Unhandled error:", {
    error: err.error,
    update: ctx.update,
  });

  ctx.reply("😵 Something went wrong. Please try again.").catch(() => {});
});

const runner = run(bot);
console.log("Dream bot is running...");

process.once("SIGINT", () => runner.stop());
process.once("SIGTERM", () => runner.stop());
