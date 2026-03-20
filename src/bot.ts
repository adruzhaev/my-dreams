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

run(bot);
console.log("Dream bot is running...");
