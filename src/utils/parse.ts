export function parseInterpretation(raw: string) {
  const jungian =
    raw.match(/🧠 \*Jungian\*\n([\s\S]*?)(?=💭|\Z)/)?.[1]?.trim() ?? raw;
  const freudian =
    raw.match(/💭 \*Freudian\*\n([\s\S]*?)(?=🔮|\Z)/)?.[1]?.trim() ?? raw;
  const symbolic =
    raw.match(/🔮 \*Symbolic\*\n([\s\S]*?)$/)?.[1]?.trim() ?? raw;

  return { jungian, freudian, symbolic };
}
