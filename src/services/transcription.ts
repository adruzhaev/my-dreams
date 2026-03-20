import OpenAI from "openai";
import { Api } from "grammy";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function transcribeVoice(
  api: Api,
  fileId: string,
): Promise<string> {
  const file = await api.getFile(fileId);
  const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN!}/${file.file_path}`;

  const response = await fetch(fileUrl);
  const buffer = await response.arrayBuffer();
  const audioFile = new File([buffer], "voice.ogg", { type: "audio/ogg" });

  const transcription = await client.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
  });

  return transcription.text;
}
