// FIXME: somehow the $$ deeper import does not work
import { $$ } from "@olmokit/dom";
import { $ } from "@olmokit/dom/$";
import { forEach } from "@olmokit/dom/forEach";
import { Dropdown } from "@olmokit/core/dropdown";
import "./index.scss";

/**
 * Component: Header subnav
 */
export function HeaderSubnav(headerSelector = ".Header:") {
  const $header = $(headerSelector);

  forEach($$(".dropdown", $header), ($dropdown) => {
    Dropdown($dropdown, {
      namespace: "HS",
      fillGaps: [$header],
      hoverable: true,
    });
  });
}

export default HeaderSubnav;
