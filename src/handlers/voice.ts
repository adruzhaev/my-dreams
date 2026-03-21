import { Context } from "grammy";
import Anthropic from "@anthropic-ai/sdk";
import { transcribeVoice } from "../services/transcription";
import { interpretDream } from "../services/ai";
import { saveDream } from "../services/dream";
import { parseInterpretation } from "../utils/parse";
import { generateDreamImage } from "./image";

const processingUsers = new Set<number>();

export async function voiceHandler(ctx: Context) {
  const fileId = ctx.message?.voice?.file_id;
  const userId = ctx.from?.id;
  const username = ctx.from?.username;

  if (!fileId || !userId) return;

  if (processingUsers.has(userId)) return;

  processingUsers.add(userId);
  await ctx.reply("🎙️ Transcribing your dream...");

  try {
    const dream = await transcribeVoice(ctx.api, fileId);
    await ctx.reply("🔮 Interpreting your dream...");

    const rawResponse = await interpretDream(dream);
    const { jungian, freudian, symbolic } = parseInterpretation(rawResponse);

    const dreamRecord = await saveDream(
      userId,
      username,
      dream,
      jungian,
      freudian,
      symbolic,
      rawResponse,
    );
    await ctx.reply(rawResponse, { parse_mode: "Markdown" });

    await generateDreamImage(ctx, dream, dreamRecord.id);
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      await ctx.reply(`⚠️ AI error: ${error.error?.error?.message}`);
    } else {
      await ctx.reply("😵 Something unexpected happened. Please try again.");
    }
  } finally {
    processingUsers.delete(userId);
  }
}
