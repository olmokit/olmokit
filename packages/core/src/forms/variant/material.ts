import { $all } from "@olmokit/dom/$all";
import { forEach } from "@olmokit/dom/forEach";
import { off } from "@olmokit/dom/off";
import { on } from "@olmokit/dom/on";
import { setEmptyStatus } from "../helpers";
import type { AnyFormHTMLElement } from "../types";

export default function FormsVariantMaterial(rootSelector: string) {
  const $controls = $all<AnyFormHTMLElement>(`${rootSelector} .formControl`);

  forEach($controls, ($input) => {
    on($input, "blur", setEmptyStatus);

    // on load for prefilled values
    // use a timeout for prefilled values in session restored by the browser on
    // page back navigation
    setTimeout(() => setEmptyStatus.call($input), 10);
  });

  return {
    destroy() {
      forEach($controls, ($input) => {
        off($input, "blur", setEmptyStatus);
      });
    },
  };
}
