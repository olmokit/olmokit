// import _isEmail from "validator/lib/isEmail";
import { $ } from "@olmokit/dom/$";

/**
 * Validator: is email check
 */
export default function isFilesize(element: HTMLInputElement) {
  const file = element.files?.[0];
  if (!file) {
    return true;
  }

  const size = file.size;
  const $file = $(".file");
  const sizeLimit = $<HTMLInputElement>(".fileSize", $file).value;
  if (size > parseInt(sizeLimit)) {
    return false;
  }

  return true;
}
