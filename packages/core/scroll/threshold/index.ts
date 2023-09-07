// TODO: use ScrollTrigger?
import { addClass } from "@olmokit/dom/addClass";
import { getOffsetTop } from "@olmokit/dom/getOffsetTop";
import { listenScroll } from "@olmokit/dom/listenScroll";
import { removeClass } from "@olmokit/dom/removeClass";

export type ScrollThresholdOptions = {
  /**
   * The element to apply classes
   *
   * @default document.body
   */
  target?: HTMLElement;
  /**
   * The `className` to add to the given element
   */
  className?: "threshold";
  /**
   * The `className` suffix when the element is above
   * @default "--above"
   */
  suffixAbove?: string;
  /**
   * The `className` suffix when the element is below
   * @default "--below"
   */
  suffixBelow?: string;
  /**
   * On change callback
   */
  onchange?: (isBelow: boolean) => void;
};

/**
 * Below threshold scroll utility
 *
 * Detects the current scroll position and apply the above/below classes to the
 * given target element according to the given threshold (either a number or a
 * DOM element)
 *
 * @param threshold Can be a number or a DOM element
 * @param options
 */
export function scrollThreshold(
  threshold: number | HTMLElement = 300,
  {
    target = document.body,
    className = "threshold",
    suffixAbove = "--above",
    suffixBelow = "--below",
    onchange,
  }: ScrollThresholdOptions
) {
  const thresholdNr =
    typeof threshold === "number" ? threshold : getOffsetTop(threshold);
  let isBelow = false;

  function check() {
    if (!isBelow && window.pageYOffset > thresholdNr) {
      removeClass(target, className + suffixAbove);
      addClass(target, className + suffixBelow);
      isBelow = true;
      if (onchange) onchange(isBelow);
    } else if (isBelow && window.pageYOffset <= thresholdNr) {
      addClass(target, className + suffixAbove);
      removeClass(target, className + suffixBelow);
      isBelow = false;
      if (onchange) onchange(isBelow);
    }
  }

  // bind on scroll
  const scrollHandler = listenScroll(check);

  // and check immediately
  check();

  function destroy() {
    scrollHandler();
  }

  return {
    destroy,
  };
}

export default scrollThreshold;
