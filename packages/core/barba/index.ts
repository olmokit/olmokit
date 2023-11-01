import _barba, { type ITransitionData, type IViewData } from "@barba/core";
import { $ } from "@olmokit/dom/$";
import { setDataAttr } from "@olmokit/dom/setDataAttr";

// import barbaRouter from "@barba/router";
export { barbaRoute } from "./route";

const barbaOlmo = {
  /**
   * Assign a data attribute with the next route namespace on the `<html>` element
   */
  setNamespace: (data?: ITransitionData | IViewData) => {
    if (data?.next) setDataAttr($("html"), "route", data.next.namespace);
  },
};

/**
 * @example Auto smooth scroll on `beforeEnter`
```js
import { scrollTo } from "@olmokit/core/scroll/scrollTo";

barba.hooks.beforeEnter((data) => {
  // `data.trigger` is one of HTMLElment | "barba" | "back" | "forward",
  // scroll only to top when transitioning to a new route by actually clicking
  // a link, otherwise just keep the scroll position
  if (typeof data?.trigger !== "string") {
    scrollTo(0);
  }

  barba.olmo.setNamespace(data);
});
```
 */
export const barba = _barba as typeof _barba & {
  olmo: typeof barbaOlmo;
};

/**
 * Object collecting `olmo` specific `barba` extensions
 */
barba.olmo = barbaOlmo;

/**
 * Barba before enter global hook
 *
 * Run at each state change, always re-initialise the lazy loading and update
 * the header state (which is outside of the `barba-container`)
 *
 * About scrolling and navigation:
 * @see https://github.com/barbajs/barba/issues/159
 */
barba.hooks.beforeEnter((data) => {
  barbaOlmo.setNamespace(data);
});
