// import _isEmail from "validator/lib/isEmail";
import type { AnyFormHTMLElement } from "../types";

/**
 * Validator: is email check
 */
export default function isEmail(element: AnyFormHTMLElement) {
  // return _isEmail(element.value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(element.value);
  // return element.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}
