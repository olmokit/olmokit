// TODO: use ScrollTrigger?
import { addClass } from "@olmokit/dom/addClass";
import { getHeight } from "@olmokit/dom/getHeight";
import { getOffsetTop } from "@olmokit/dom/getOffsetTop";
import { listenResize } from "@olmokit/dom/listenResize";
import { listenScroll } from "@olmokit/dom/listenScroll";
import { removeClass } from "@olmokit/dom/removeClass";

export type ScrollBetweenOptions = {
  /**
   * DOM element to give classes to
   * @default document.body
   */
  target: HTMLElement;
  /**
   * The className to add to the given element
   * @default "between"
   */
  className: string;
  /**
   * The className suffix when the el is in between
   * @default "--in"
   */
  suffixIn: string;
  /**
   * The className suffix when the el is not between
   * @default "--out"
   */
  suffixOut: string;
  /**
   * On change callback
   */
  onchange?: (isBetween: boolean) => void;
};

/**
 * Detect if the scroll position is within the given bounds, either numbers or
 * DOM elements
 */
export function scrollBetween(
  start: number | HTMLElement | (() => number),
  end: number | HTMLElement | (() => number),
  options?: Partial<ScrollBetweenOptions>,
) {
  const {
    target = document.body,
    className = "between",
    suffixIn = "--in",
    suffixOut = "--out",
    onchange,
  } = options || {};
  let isBetween = false;
  let winHeight: number;
  let edgeStart: number;
  let edgeEnd: number;

  function check() {
    if (
      !isBetween &&
      window.pageYOffset + winHeight > edgeStart &&
      window.pageYOffset + winHeight < edgeEnd
    ) {
      removeClass(target, className + suffixOut);
      addClass(target, className + suffixIn);
      isBetween = true;
      if (onchange) onchange(isBetween);
    } else if (
      isBetween &&
      (window.pageYOffset + winHeight < edgeStart ||
        window.pageYOffset + winHeight > edgeEnd)
    ) {
      addClass(target, className + suffixOut);
      removeClass(target, className + suffixIn);
      isBetween = false;
      if (onchange) onchange(isBetween);
    }
  }

  function calculate() {
    if (typeof start === "number") {
      edgeStart = start;
    } else if (typeof start === "function") {
      edgeStart = start();
    }
    // or it is a Node
    else {
      edgeStart = getOffsetTop(start);
    }

    if (typeof end === "number") {
      edgeEnd = end;
    } else if (typeof end === "function") {
      edgeEnd = end();
    }
    // or it is a Node
    else {
      edgeEnd = getOffsetTop(end) + getHeight(end);
    }

    winHeight = window.innerHeight;
  }

  // efficiently update sizes on resize
  const listenerResize = listenResize(calculate);

  // bind debounced on scroll
  const listenerScroll = listenScroll(check);

  // and do it immediately
  calculate();
  check();

  return {
    destroy() {
      if (listenerResize) listenerResize();
      if (listenerScroll) listenerScroll();
      if (target) {
        removeClass(target, className + suffixOut);
        removeClass(target, className + suffixIn);
      }
    },
  };
}

export default scrollBetween;
