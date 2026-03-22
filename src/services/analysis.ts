import { getDreamsForReport } from "./dream";
import { generateBatchAnalysis } from "./ai";

type BatchAnalysis = {
  jungian: string;
  freudian: string;
  symbolic: string;
  overall: string;
};

function countFrequencies(items: string[][]): [string, number][] {
  const counts = new Map<string, number>();
  for (const list of items) {
    for (const item of list) {
      counts.set(item, (counts.get(item) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function formatFrequencies(items: [string, number][], limit = 5): string {
  return items
    .slice(0, limit)
    .map(([item, count]) => `${item} (${count}×)`)
    .join(", ");
}

export async function buildReport(
  telegramUserId: number,
  days: number,
): Promise<{ analysis: BatchAnalysis; dreamCount: number; stats: string } | null> {
  const dreams = await getDreamsForReport(telegramUserId, days);

  if (dreams.length === 0) return null;

  const themes = countFrequencies(dreams.map((d) => d.themes));
  const emotions = countFrequencies(dreams.map((d) => d.emotions));
  const symbols = countFrequencies(dreams.map((d) => d.symbols));

  const statsLines = [
    `Themes: ${formatFrequencies(themes)}`,
    `Emotions: ${formatFrequencies(emotions)}`,
    `Symbols: ${formatFrequencies(symbols)}`,
  ].join("\n");

  const dreamSummaries = dreams
    .map((d, i) => `Dream ${i + 1}: ${d.dream}`)
    .join("\n\n");

  const prompt = `
The user has recorded ${dreams.length} dreams over the last ${days} days.

Aggregated stats:
${statsLines}

Dream texts:
${dreamSummaries}
  `.trim();

  const raw = await generateBatchAnalysis(prompt);
  const analysis = JSON.parse(raw) as BatchAnalysis;

  return { analysis, dreamCount: dreams.length, stats: statsLines };
}
