import { createDialogTpl } from "../helpers";
import { Dialog } from "../index";
import type { DialogHooks, DialogOptions } from "../types";
import "./index.scss";

/**
 * Async Dialog
 *
 * A dialog that does not require any existing markup as it creates on the fly.
 * It accepts the same `options` and `hooks` as the base `Dialog`.
 */
export function DialogAsync(options: DialogOptions, hooks: DialogHooks) {
  return Dialog(createDialogTpl, options, hooks);
}
