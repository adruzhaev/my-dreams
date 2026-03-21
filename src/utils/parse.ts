export type Interpretation = {
  jungian: string;
  freudian: string;
  symbolic: string;
  symbols: string[];
  emotions: string[];
  themes: string[];
};

export function parseInterpretation(raw: string): Interpretation {
  try {
    const parsed = JSON.parse(raw);
    return {
      jungian: parsed.jungian ?? "",
      freudian: parsed.freudian ?? "",
      symbolic: parsed.symbolic ?? "",
      symbols: Array.isArray(parsed.symbols) ? parsed.symbols : [],
      emotions: Array.isArray(parsed.emotions) ? parsed.emotions : [],
      themes: Array.isArray(parsed.themes) ? parsed.themes : [],
    };
  } catch {
    console.error("Failed to parse interpretation. Raw response:", raw);
    throw new Error("Failed to parse dream interpretation response");
  }
}

export function formatInterpretation(i: Interpretation): string {
  let text = `🧠 *Jungian*\n${i.jungian}\n\n💭 *Freudian*\n${i.freudian}\n\n🔮 *Symbolic*\n${i.symbolic}`;

  if (i.symbols.length > 0) text += `\n\n✨ *Symbols:* ${i.symbols.join(", ")}`;
  if (i.emotions.length > 0)
    text += `\n💫 *Emotions:* ${i.emotions.join(", ")}`;
  if (i.themes.length > 0) text += `\n🌀 *Themes:* ${i.themes.join(", ")}`;

  return text;
}
