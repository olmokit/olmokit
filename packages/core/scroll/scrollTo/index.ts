import { isFunction } from "@olmokit/utils/isFunction";
import { isNumber } from "@olmokit/utils/isNumber";
import { getDocumentHeight } from "@olmokit/dom/getDocumentHeight";

/**
 * @borrows [eases-jsnext](https://www.npmjs.com/package/eases-jsnext#usage)
 */
function cubicInOut(t: number) {
  return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
}

// TODO: decide whether to respect the user preference
// const userPrefersReducedMotion =
//   "matchMedia" in window &&
//   window.matchMedia("(prefers-reduced-motion)").matches;

/**
 * Calculate how far to scroll
 *
 * @see https://github.com/cferdinandi/smooth-scroll (credits)
 *
 * @param {HTMLElement | Number} target
 * @param {HTMLElement} [container] If a container is passed it needs to have a *non* `static` CSS `position`
 * @param {Number} offset
 * @returns {Number}
 */
function getEndY(
  target: HTMLElement | number,
  offset: number,
  documentHeight: number,
  container?: HTMLElement
) {
  let location = 0;

  if (isNumber(target)) {
    location = target;
  } else {
    if (container) {
      location = target.offsetTop;
      return location;
    }
    // TODO: reuse "../../dom/getOffsetTop" ?
    else if (target.offsetParent) {
      do {
        // @ts-expect-error FIXME: core types
        location += target.offsetTop;
        // @ts-expect-error FIXME: core types
        target = target.offsetParent;
      } while (target);
    }
  }

  location = Math.max(location - offset, 0);
  // adjust scroll distance to prevent abrupt stops near the bottom of the page
  location = Math.min(location, documentHeight - window.innerHeight);
  return location;
}

/**
 * Bring the anchored element into focus
 *
 * @see https://github.com/cferdinandi/smooth-scroll (credits)
 */
function adjustFocus(target: HTMLElement | number) {
  // Is scrolling to top of page, blur
  if (target === 0) {
    document.body.focus();
  }

  // don't run if scrolling to a number on the page
  if (typeof target === "number") return;

  // Otherwise, bring element into focus
  target.focus();
  if (document.activeElement !== target) {
    target.setAttribute("tabindex", "-1");
    target.focus();
    target.style.outline = "none";
  }
}

type ScrollToOptions = {
  /**
   * The container to scroll, uses `window` by default
   * @deault Window
   */
  container?: HTMLElement;
  onstart?: (pos: number | HTMLElement) => void;
  onstop?: (pos: number | HTMLElement) => void;
  /** @default 0 */
  offset: number | (() => number);
  /** @default true */
  focus: boolean;
  /** @default 500 */
  speed: number;
};

/**
 * Scroll to
 */
export function scrollTo(
  target: number | HTMLElement,
  {
    container,
    onstart,
    onstop,
    offset: offsetOpt = 0,
    focus = true,
    speed: speedOpt = 500,
  }: Partial<ScrollToOptions> = {}
) {
  // if (process.env["NODE_ENV"] !== "production") {
  //   if (typeof target === "undefined") {
  //     console.error(`scrollTo: missing target element`);
  //   }
  // }
  const scroller = container || window;
  const isScrollerAnElement = scroller instanceof HTMLElement;
  const documentHeight = getDocumentHeight();
  const offset = isFunction(offsetOpt) ? offsetOpt() : offsetOpt;
  const fromY = container ? container.scrollTop : window.pageYOffset;
  const toY = getEndY(target, offset, documentHeight, container);
  const distance = toY - fromY;
  const speed = Math.abs((distance / 1000) * speedOpt);
  let timeLapsed = 0;
  let start: null | number;
  let percentage;
  let position;

  // if the user prefers reduced motion, jump to location
  // if (userPrefersReducedMotion) {
  //   if (hasScrollTo) {
  //     scroller.scrollTo(0, Math.floor(toY));
  //   } else {
  //     scroller.scrollTop = Math.floor(toY);
  //   }
  //   if (onstop) onstop(target);
  //   return;
  // }

  // reset position to fix weird iOS bug
  // @see https://github.com/cferdinandi/smooth-scroll/issues/45
  if (fromY === 0) {
    if (!isScrollerAnElement) {
      scroller.scrollTo(0, 0);
    } else {
      scroller.scrollTop = 0;
    }
  }

  function loop(timestamp: number) {
    if (!start) {
      start = timestamp;
    }
    timeLapsed += timestamp - start;
    percentage = speed === 0 ? 0 : timeLapsed / speed;
    percentage = percentage > 1 ? 1 : percentage;
    position = fromY + distance * cubicInOut(percentage);

    if (!isScrollerAnElement) {
      scroller.scrollTo(0, Math.floor(position));
    } else {
      scroller.scrollTop = Math.floor(position);
    }

    if (!stop(position, toY)) {
      requestAnimationFrame(loop);
      start = timestamp;
    }
  }

  function stop(position: number, toY: number) {
    // get the current location
    const nowY = container ? container.scrollTop : window.pageYOffset;

    // check if the target has been reached (or we've hit the end of the document)
    if (
      position === toY ||
      nowY === toY ||
      (!container && fromY < toY && window.innerHeight + nowY >= documentHeight)
    ) {
      // clear the animation timer
      if (onstop) onstop(target);
      // bring the element into focus, it won't do anything if that is a number
      if (focus) adjustFocus(target);
      // reset start
      start = null;

      return true;
    }

    return;
  }

  if (onstart) onstart(target);

  requestAnimationFrame(loop);
}

export default scrollTo;
