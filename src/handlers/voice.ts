import Anthropic from "@anthropic-ai/sdk";
import { transcribeVoice } from "../services/transcription";
import { interpretDream } from "../services/ai";
import { saveDream } from "../services/dream";
import { parseInterpretation, formatInterpretation } from "../utils/parse";
import { generateDreamImage } from "./image";
import { MyContext } from "../types/context";

const processingUsers = new Set<number>();

export async function voiceHandler(ctx: MyContext) {
  const fileId = ctx.message?.voice?.file_id;
  const userId = ctx.from?.id;
  const username = ctx.from?.username;

  if (!fileId || !userId) return;

  if (processingUsers.has(userId)) return;

  processingUsers.add(userId);
  await ctx.reply(ctx.t("transcribing"));

  try {
    const dream = await transcribeVoice(ctx.api, fileId);
    await ctx.reply(ctx.t("interpreting"));

    const rawResponse = await interpretDream(dream);
    const interpretation = parseInterpretation(rawResponse);
    const formatted = formatInterpretation(interpretation);

    const dreamRecord = await saveDream(
      userId,
      username,
      dream,
      interpretation,
      rawResponse,
    );

    ctx.session.messages = [
      { role: "user", content: `I had this dream: ${dream}` },
      { role: "assistant", content: formatted },
    ];
    ctx.session.dreamId = dreamRecord.id;

    await ctx.reply(formatted, { parse_mode: "Markdown" });

    await generateDreamImage(ctx, dream, dreamRecord.id);
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      await ctx.reply(
        ctx.t("error-ai", { message: error.error?.error?.message }),
      );
    } else {
      console.error("Unexpected error in voiceHandler:", error);
      await ctx.reply(ctx.t("error-unexpected"));
    }
  } finally {
    processingUsers.delete(userId);
  }
}
