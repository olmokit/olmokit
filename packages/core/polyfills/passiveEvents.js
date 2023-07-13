import { on } from "@olmokit/dom/on";

let supportsPassive = false;

try {
  const opts = Object.defineProperty({}, "passive", {
    // eslint-disable-next-line getter-return
    get: function () {
      supportsPassive = true;
    },
  });
  on("testPE", null, opts);
  // eslint-disable-next-line no-empty
} catch (e) {}

/**
 * Get passive event listener option
 *
 * @see https://www.afasterweb.com/2017/08/23/passive-event-listeners-scroll-performance/
 * @param {boolean} [fallback]
 * @returns {Object | boolean}
 */
export default function getPassiveEventOpt(fallback) {
  return supportsPassive ? { passive: true } : fallback;
}
