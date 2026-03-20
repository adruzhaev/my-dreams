import { Context } from "grammy";
import Anthropic from "@anthropic-ai/sdk";
import { interpretDream } from "../services/ai";

export async function dreamHandler(ctx: Context) {
  const dream = ctx.message?.text;
  if (!dream) return;

  await ctx.reply("🔮 Interpreting your dream...");

  try {
    const interpretation = await interpretDream(dream);
    await ctx.reply(interpretation);
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      const userMessage = `⚠️ AI error: ${error.error?.error?.message}`;
      await ctx.reply(userMessage);
    } else {
      await ctx.reply("😵 Something unexpected happened. Please try again.");
    }
  }
}
