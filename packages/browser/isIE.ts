import { isServer } from "@olmokit/utils";

/**
 * @category detect
 * @category is
 * @see https://stackoverflow.com/a/21712356/12285349
 */
export function isIE(ssrValue = true) {
  if (isServer) {
    return ssrValue;
  }
  const ua = window.navigator.userAgent;

  if (ua.indexOf("MSIE ") > 0 || ua.indexOf("Trident/") > 0) {
    return true;
  }
  return false;
}

export default isIE;
