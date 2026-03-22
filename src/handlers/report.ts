import { MyContext } from "../types/context";
import { buildReport } from "../services/analysis";

const DEFAULT_DAYS = 30;

export async function reportHandler(ctx: MyContext) {
  const userId = ctx.from?.id;
  if (!userId) return;

  const rawArg =
    typeof ctx.match === "string" ? ctx.match.trim() : ctx.match?.toString();
  const days = rawArg ? parseInt(rawArg, 10) : DEFAULT_DAYS;

  if (isNaN(days) || days <= 0) {
    await ctx.reply(ctx.t("report-usage"), { parse_mode: "Markdown" });
    return;
  }

  await ctx.reply(ctx.t("report-generating", { days }), {
    parse_mode: "Markdown",
  });

  const result = await buildReport(userId, days);

  if (!result) {
    await ctx.reply(ctx.t("report-no-dreams", { days }), {
      parse_mode: "Markdown",
    });
    return;
  }

  const { analysis, dreamCount, stats } = result;

  const text = [
    ctx.t("report-header", { days, count: dreamCount }),
    "",
    ctx.t("report-stats"),
    stats,
    "",
    `🧠 *Jungian*\n${analysis.jungian}`,
    "",
    `💭 *Freudian*\n${analysis.freudian}`,
    "",
    `🔮 *Symbolic*\n${analysis.symbolic}`,
    "",
    `🌙 *Overall*\n${analysis.overall}`,
  ].join("\n");

  await ctx.reply(text, { parse_mode: "Markdown" });
}
