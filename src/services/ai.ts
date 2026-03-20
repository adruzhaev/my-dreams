import Anthropic from "@anthropic-ai/sdk";
import { aiConfig } from "../config/ai";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function interpretDream(dream: string): Promise<string> {
  const response = await client.messages.create({
    model: aiConfig.model,
    max_tokens: aiConfig.maxTokens,
    system: aiConfig.systemPrompt,
    messages: [{ role: "user", content: `I had this dream: ${dream}` }],
  });

  return response.content[0].type === "text"
    ? response.content[0].text
    : "Could not interpret dream.";
}
