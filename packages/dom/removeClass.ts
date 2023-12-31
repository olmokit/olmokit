/**
 * Remove class shortcut
 */
export function removeClass<T extends Element = HTMLElement>(
  el?: T,
  className = ""
) {
  if (process.env["NODE_ENV"] !== "production") {
    if (!el) {
      ("[@olmokit/dom:removeClass] unexisting DOM element");
      return;
    }
  }
  if (el) el.classList.remove(className);
}

export default removeClass;
