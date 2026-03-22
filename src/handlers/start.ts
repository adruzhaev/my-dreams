import { MyContext } from "../types/context";

export async function startHandler(ctx: MyContext) {
  console.log("ctx.from.language_code: ", ctx?.from?.language_code);
  await ctx.reply(ctx.t("welcome"), { parse_mode: "Markdown" });
}
