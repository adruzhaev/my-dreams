import "dotenv/config";

import { Bot, session } from "grammy";
import { run } from "@grammyjs/runner";
import { I18n } from "@grammyjs/i18n";
import { startHandler } from "./handlers/start";
import { dreamHandler } from "./handlers/dream";
import { voiceHandler } from "./handlers/voice";
import { searchHandler } from "./handlers/search";
import { loggerMiddleware } from "./middleware/logger";
import { PostgresSessionStorage } from "./db/session-storage";
import { MyContext, SessionData } from "./types/context";

const bot = new Bot<MyContext>(process.env.TELEGRAM_BOT_TOKEN!);

const i18n = new I18n<MyContext>({
  defaultLocale: "en",
  directory: "locales",
});

bot.use(i18n);
bot.use(
  session<SessionData, MyContext>({
    initial: () => ({ messages: [], dreamId: null }),
    storage: new PostgresSessionStorage(),
  }),
);

bot.use(loggerMiddleware);

bot.command("start", startHandler);
bot.command("search", searchHandler);
bot.on("message:text", dreamHandler);
bot.on("message:voice", voiceHandler);

bot.callbackQuery("new_dream", async (ctx) => {
  const { session, answerCallbackQuery, reply } = ctx;

  session.messages = [];
  session.dreamId = null;
  await answerCallbackQuery();
  await reply(ctx.t("new-dream-ready"));
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error("Unhandled error:", {
    error: err.error,
    update: ctx.update,
  });

  ctx.reply(ctx.t("error-global")).catch(() => {});
});

const runner = run(bot);
console.log("Dream bot is running...");

process.once("SIGINT", () => runner.stop());
process.once("SIGTERM", () => runner.stop());
