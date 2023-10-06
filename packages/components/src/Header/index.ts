import type { PartialDeep } from "@olmokit/utils";
import { $ } from "@olmokit/dom/$";
import { addClass } from "@olmokit/dom/addClass";
import { off } from "@olmokit/dom/off";
import { on } from "@olmokit/dom/on";
import { removeClass } from "@olmokit/dom/removeClass";
import { setVendorCSS } from "@olmokit/dom/setVendorCSS";
import { parseSize } from "@olmokit/core/helpers/jss";

type HeaderStatus = "collapsed" | "expanding" | "expanded";

type HeaderOptionsWithDefaults = {
  styles: {
    expandTime: number;
  };
};

export type HeaderOptions = PartialDeep<HeaderOptionsWithDefaults>;

export function Header(
  rootSelector = ".Header:",
  customOptions: HeaderOptions = {},
) {
  const $root = $(rootSelector);
  if (!$root) {
    return;
  }

  const { styles: customOptionsStyles, ...restCustomOptions } = customOptions;

  const options: HeaderOptionsWithDefaults = {
    styles: {
      expandTime: 300,
      ...customOptionsStyles,
    },
    ...restCustomOptions,
  };
  const expandTime = parseSize(options.styles.expandTime);
  const $toggle = $(".Header:toggle", $root);
  const $collapsable = $(".Header:collapse", $root);
  const $bg = $(".Header:bgExpanded", $root);

  let status: HeaderStatus = "collapsed";

  // localeSwitch();

  // default status as collapsed
  _setStatus("collapsed");

  // immediately clamp the collpsable header part, it won't never be open
  // at this point.
  if ($collapsable) $collapsable.style.maxHeight = "0";
  if ($bg) $bg.style.bottom = "100%";

  if ($collapsable) {
    setVendorCSS($collapsable, "transitionDuration", expandTime);
  }

  if ($toggle) {
    on($toggle, "click", handleToggle);
    on(document, "click", handleClickOutside);
  }

  /**
   * Handle click outside
   */
  function handleClickOutside(event: MouseEvent) {
    if (status === "expanded") {
      if (event.target instanceof Node && !$root.contains(event.target)) {
        collapse();
      }
    }
  }

  /**
   * Handle toggle
   */
  function handleToggle() {
    if (status !== "expanded") {
      expand();
    } else {
      collapse();
    }
  }

  /**
   * Expand
   *
   */
  function expand() {
    // first expand the background
    $collapsable.style.maxHeight = `${window.innerHeight * 0.9}px`;
    $bg.style.bottom = "0";
    _setStatus("expanding");

    // then slide in the collapsable
    setTimeout(() => {
      addClass($collapsable, "is-in");
      _setStatus("expanded");
    }, expandTime);

    // then we are expanded
    setTimeout(() => {
      _setStatus("expanded");
    }, expandTime * 1.5);

    addClass($toggle, "is-active");
  }

  /**
   * Collapse
   *
   */
  function collapse() {
    // first slide out the collapsable
    removeClass($collapsable, "is-in");
    _setStatus("expanding");

    // then contract the background
    setTimeout(() => {
      $bg.style.bottom = "100%";
    }, expandTime);

    // then we are collapsed
    setTimeout(() => {
      $collapsable.style.maxHeight = "0";
      _setStatus("collapsed");
    }, expandTime * 1.5);

    removeClass($toggle, "is-active");
  }

  /**
   * Set status
   */
  function _setStatus(newValue: HeaderStatus) {
    status = newValue;
    $root.setAttribute("data-status", newValue);
  }

  /**
   * Destroy
   *
   */
  function destroy() {
    off($toggle, "click", handleToggle);
    off(document, "click", handleClickOutside);
  }

  return {
    $root,
    expand,
    collapse,
    destroy,
  };
}

export default Header;
