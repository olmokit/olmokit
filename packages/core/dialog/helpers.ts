import { createElement } from "@olmokit/dom/createElement";
import { setDataAttr } from "@olmokit/dom/setDataAttr";
import { iconTpl } from "../icon";
import type { DialogSkeleton } from "./types";

/**
 * HTML attribute for elements that will close the dialog on click
 */
export const DIALOG_ATTR_CLOSE = "dialog-close";

function createDialogElement(name: string) {
  return createElement("div", `dialog${name}`);
}

/**
 * Create default dialog template dynamically and append it to the body
 *
 * @param closeIconGlyph Close icon name (uses svgicon inlined system)
 */
export function createDialogTpl(closeIconGlyph?: string): DialogSkeleton {
  // const fragment = document.createDocumentFragment();
  const $root = createDialogElement("");
  const $backdrop = createDialogElement("Backdrop");
  const $cage = createDialogElement("Cage");
  const $centerer = createDialogElement("Centerer");
  const $wrap = createDialogElement("Wrap");
  const $content = createDialogElement("Content");
  const $loader = createDialogElement("Loader");
  const $close = createDialogElement("Close");
  $close.innerHTML = iconTpl(closeIconGlyph || "close", "js-noclick");

  setDataAttr($close, DIALOG_ATTR_CLOSE, "");
  setDataAttr($cage, DIALOG_ATTR_CLOSE, "");
  setDataAttr($centerer, DIALOG_ATTR_CLOSE, "");

  $wrap.appendChild($content);
  $wrap.appendChild($loader);
  $wrap.appendChild($close);
  $centerer.appendChild($wrap);
  $cage.appendChild($centerer);
  $root.appendChild($backdrop);
  $root.appendChild($cage);

  document.body.appendChild($root);

  return { $root, $backdrop, $cage, $wrap, $content };
}
