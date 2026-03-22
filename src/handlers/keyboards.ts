import { InlineKeyboard } from "grammy";
import { MyContext } from "../types/context";

export function newDreamKeyboard(ctx: MyContext): InlineKeyboard {
  return new InlineKeyboard().text(ctx.t("new-dream-button"), "new_dream");
}
