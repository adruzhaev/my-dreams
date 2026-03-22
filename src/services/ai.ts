import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

import { aiConfig } from "../config/ai";
import { Message } from "../types/context";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function interpretDream(dream: string): Promise<string> {
  const response = await client.messages.create({
    model: aiConfig.model,
    max_tokens: aiConfig.maxTokens,
    system: [
      {
        type: "text",
        text: aiConfig.systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: `I had this dream: ${dream}` }],
  });

  return response.content[0].type === "text"
    ? response.content[0].text
    : (() => {
        throw new Error("Unexpected response type from Claude");
      })();
}

export async function followUpDream(messages: Message[]): Promise<string> {
  const response = await client.messages.create({
    model: aiConfig.model,
    max_tokens: aiConfig.maxTokens,
    system: [
      {
        type: "text",
        text: aiConfig.followUpSystemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
  });

  return response.content[0].type === "text"
    ? response.content[0].text
    : (() => {
        throw new Error("Unexpected response type from Claude");
      })();
}

export async function generateBatchAnalysis(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: aiConfig.model,
    max_tokens: 2000,
    system: [
      {
        type: "text",
        text: aiConfig.batchAnalysisSystemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].type === "text"
    ? response.content[0].text
    : (() => {
        throw new Error("Unexpected response type from Claude");
      })();
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

export async function generateImage(dream: string): Promise<string> {
  const prompt = `
    This is a dream description. Don't use any words, rely on a dream a base of the image. 
    Image should not be realistic, use minimalistic approach. Here is the dream: ${dream}.
  `;

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
  });

  const url = response.data?.[0]?.url;
  if (!url) throw new Error("No image URL returned from DALL-E");
  return url;
}
