import { db, sql } from "../db";
import { dreams, interpretations } from "../db/schema";
import { and, desc, eq, gte } from "drizzle-orm";
import { findOrCreateUser } from "./user";
import { Interpretation } from "../utils/parse";
import { generateEmbedding } from "./ai";

function buildEmbeddingText(
  dreamText: string,
  interpretation: Interpretation,
): string {
  const parts = [`Dream: ${dreamText}`];
  if (interpretation.themes.length > 0)
    parts.push(`Themes: ${interpretation.themes.join(", ")}`);
  if (interpretation.emotions.length > 0)
    parts.push(`Emotions: ${interpretation.emotions.join(", ")}`);
  if (interpretation.symbols.length > 0)
    parts.push(`Symbols: ${interpretation.symbols.join(", ")}`);
  parts.push(`Jungian: ${interpretation.jungian}`);
  parts.push(`Freudian: ${interpretation.freudian}`);
  parts.push(`Symbolic: ${interpretation.symbolic}`);
  return parts.join("\n");
}

export async function saveDream(
  telegramUserId: number,
  username: string | undefined,
  dreamText: string,
  interpretation: Interpretation,
  rawResponse: string,
) {
  const user = await findOrCreateUser(telegramUserId, username);

  const embeddingText = buildEmbeddingText(dreamText, interpretation);
  const embedding = await generateEmbedding(embeddingText);

  const [dream] = await db
    .insert(dreams)
    .values({ userId: user.telegramUserId, dream: dreamText, embedding })
    .returning();

  await db.insert(interpretations).values({
    dreamId: dream.id,
    rawResponse,
    ...interpretation,
  });

  return dream;
}

export type SearchResult = {
  id: number;
  dream: string;
  createdAt: string;
  jungian: string;
  themes: string[];
  emotions: string[];
};

export async function searchDreams(
  telegramUserId: number,
  query: string,
  limit = 5,
): Promise<SearchResult[]> {
  const queryEmbedding = await generateEmbedding(query);
  const vectorStr = `[${queryEmbedding.join(",")}]`;

  const results = await sql<SearchResult[]>`
    SELECT d.id, d.dream, d.created_at AS "createdAt",
           i.jungian, i.themes, i.emotions
    FROM dreams d
    JOIN interpretations i ON i.dream_id = d.id
    WHERE d.user_id = ${telegramUserId} AND d.embedding IS NOT NULL
    ORDER BY d.embedding <=> ${vectorStr}::vector
    LIMIT ${limit}
  `;

  return results;
}

export async function getDreamsForReport(telegramUserId: number, days: number) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return db
    .select({
      dream: dreams.dream,
      createdAt: dreams.createdAt,
      jungian: interpretations.jungian,
      freudian: interpretations.freudian,
      symbolic: interpretations.symbolic,
      symbols: interpretations.symbols,
      emotions: interpretations.emotions,
      themes: interpretations.themes,
    })
    .from(dreams)
    .innerJoin(interpretations, eq(interpretations.dreamId, dreams.id))
    .where(and(eq(dreams.userId, telegramUserId), gte(dreams.createdAt, since)))
    .orderBy(dreams.createdAt);
}

export async function getRecentDreams(telegramUserId: number, limit = 10) {
  return db
    .select({
      id: dreams.id,
      dream: dreams.dream,
      createdAt: dreams.createdAt,
      jungian: interpretations.jungian,
      freudian: interpretations.freudian,
      symbolic: interpretations.symbolic,
    })
    .from(dreams)
    .innerJoin(interpretations, eq(interpretations.dreamId, dreams.id))
    .where(eq(dreams.userId, telegramUserId))
    .orderBy(desc(dreams.createdAt))
    .limit(limit);
}
