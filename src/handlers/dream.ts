import { Context } from "grammy";
import Anthropic from "@anthropic-ai/sdk";
import { interpretDream } from "../services/ai";
import { saveDream } from "../services/dream";
import { parseInterpretation, formatInterpretation } from "../utils/parse";
import { generateDreamImage } from "./image";

const processingUsers = new Set<number>();

export async function dreamHandler(ctx: Context) {
  const dream = ctx.message?.text;
  const userId = ctx.from?.id;
  const username = ctx.from?.username;

  if (!dream || !userId) return;

  if (processingUsers.has(userId)) return;

  processingUsers.add(userId);
  await ctx.reply("🔮 Interpreting your dream...");

  try {
    const rawResponse = await interpretDream(dream);
    const interpretation = parseInterpretation(rawResponse);

    const dreamRecord = await saveDream(userId, username, dream, interpretation, rawResponse);
    await ctx.reply(formatInterpretation(interpretation), { parse_mode: "Markdown" });

    await generateDreamImage(ctx, dream, dreamRecord.id);
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      const userMessage = `⚠️ AI error: ${error.error?.error?.message}`;
      await ctx.reply(userMessage);
    } else {
      console.error("Unexpected error in dreamHandler:", error);
      await ctx.reply("😵 Something unexpected happened. Please try again.");
    }
  } finally {
    processingUsers.delete(userId);
  }
}
