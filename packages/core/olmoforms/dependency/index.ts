// FIXME: somehow the $$ deeper import does not work
import { $$ } from "@olmokit/dom";
import { $ } from "@olmokit/dom/$";
import { forEach } from "@olmokit/dom/forEach";
import { getDataAttr } from "@olmokit/dom/getDataAttr";
import { on } from "@olmokit/dom/on";

function setElement(el: HTMLElement, dep: HTMLInputElement) {
  el.style.display = "block";
  dep.setAttribute("required", "required");
  // dep.value = "";
}

function disableElement(el: HTMLElement, dep: HTMLInputElement) {
  el.style.display = "none";
  dep.removeAttribute("required");
  dep.value = "";
}

/**
 * Olmoforms Dependency
 */
export default function Dependency(rootSelector = ".ofForm:") {
  const $root = $(rootSelector);
  const $form = $<HTMLFormElement>(".of:", $root);
  const $els = $$<HTMLFormElement>(".of:el", $form);
  const $formid = getDataAttr($form, "id");

  forEach($els, (el) => {
    if (el.hasAttribute("data-value")) {
      const value = el.getAttribute("data-value");
      const $dep = $<HTMLInputElement>("#of-" + $formid + "-" + value);

      const name = el.getAttribute("data-name");
      const $source = $<HTMLInputElement>("#of-" + $formid + "-" + name);

      on($dep, "keyup", (e) => {
        const $input = e.target as HTMLInputElement;
        const $trigger = el.getAttribute("data-trigger");
        if ($input?.value == $trigger) {
          setElement(el, $source);
        } else {
          disableElement(el, $source);
        }
      });

      on($dep, "change", (e) => {
        const $input = e.target as HTMLInputElement;
        const $trigger = el.getAttribute("data-trigger");
        if ($input?.value == $trigger) {
          setElement(el, $source);
        } else {
          disableElement(el, $source);
        }
      });

      /** Loading page */
      const $trigger = el.getAttribute("data-trigger");
      if ($dep.value == $trigger) {
        setElement(el, $source);
      } else {
        disableElement(el, $source);
      }
    }
  });
}
