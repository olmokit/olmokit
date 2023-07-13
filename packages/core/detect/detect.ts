import { $ } from "@olmokit/dom/$";
import { addClass } from "@olmokit/dom/addClass";

/**
 * A function returning an array of two values, the first is the detection name
 * and the latter is the detection result
 */
export type Detection = () => (string | boolean)[];

let html: HTMLHtmlElement;

/**
 * Detect a feature, a device or anything along these lines
 *
 * @param {Detection} detection
 * @param {string} [positiveClassPrefix="has"] The prefix of the class added to the `<html>` element when the detection has positive result
 * @param {string} [negativeClassPrefix="no"] The prefix of the class added to the `<html>` element when the detection has negative result
 */
export function detect(
  detection: Detection,
  positiveClassPrefix = "has",
  negativeClassPrefix = "no"
) {
  const result = detection();

  if (!html) {
    html = $("html");
  }

  // use function custom property
  addClass(
    html,
    `${result[1] ? `${positiveClassPrefix}-` : `${negativeClassPrefix}-`}${
      result[0]
    }`
  );

  return result[1];
}
