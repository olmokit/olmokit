import { SplitText } from "gsap/all";
// FIXME: somehow the $$ deeper import does not work
import { $$ } from "@olmokit/dom";

/**
 * Split RTE block of text wit inner HTML
 */
export function splitRichText(selector: string | HTMLElement) {
  const element = typeof selector === "string" ? $$(selector) : selector;

  if (element instanceof NodeList) {
    for (let i = 0, l = element.length; i < l; i++) {
      splitRichText(element[i]);
    }
  } else {
    const brLines = element.innerHTML ? element.innerHTML.split("<br>") : [];
    if (brLines.length > 1) {
      // wrap text divided by <br> in <div>...</div>
      let brLinesAsDiv = "";
      for (let i = 0, l = brLines.length; i < l; i++) {
        brLinesAsDiv += "<div>" + brLines[i] + "</div>";
      }
      element.innerHTML = brLinesAsDiv;

      splitRichText(element);
    } else if (element.children && element.children.length) {
      for (let i = 0, l = element.children.length; i < l; i++) {
        splitRichText(element.children[i] as HTMLElement);
      }
    } else {
      new SplitText(element, { type: "lines" });
    }
  }
}
