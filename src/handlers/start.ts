import { MyContext } from "../types/context";

export async function startHandler(ctx: MyContext) {
  await ctx.reply(ctx.t("welcome"), { parse_mode: "Markdown" });
}
