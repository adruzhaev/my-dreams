import { MyContext } from "../types/context";
import { searchDreams } from "../services/dream";

export async function searchHandler(ctx: MyContext) {
  const query =
    typeof ctx.match === "string" ? ctx.match?.trim() : ctx.match?.toString();
  const userId = ctx.from?.id;

  if (!userId) return;

  if (!query) {
    await ctx.reply(ctx.t("search-usage"), { parse_mode: "Markdown" });
    return;
  }

  await ctx.reply(ctx.t("search-searching"), { parse_mode: "Markdown" });

  const results = await searchDreams(userId, query);

  if (results.length === 0) {
    await ctx.reply(ctx.t("search-no-results"), { parse_mode: "Markdown" });
    return;
  }

  const lines: string[] = [ctx.t("search-results-header")];

  for (const [i, r] of results.entries()) {
    const date = r.createdAt.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const dreamPreview =
      r.dream.length > 120 ? r.dream.slice(0, 120) + "…" : r.dream;

    lines.push(`\n*${i + 1}.* 📅 ${date}\n_${dreamPreview}_\n🧠 ${r.jungian}`);

    if (r.themes.length > 0) {
      lines.push(`🌀 *Themes:* ${r.themes.join(", ")}`);
    }
  }

  await ctx.reply(lines.join("\n"), { parse_mode: "Markdown" });
}
