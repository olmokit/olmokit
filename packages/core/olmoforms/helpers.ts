import { $ } from "@olmokit/dom/$";
import { getDataAttr } from "@olmokit/dom/getDataAttr";
import { setFormElementValue } from "../forms/helpers";
import type { AnyFormHTMLElement } from "../forms/types";

/**
 * Get form data as query params
 */
export function getPostData(data: Record<string, string>): string {
  const params = [];

  for (const name in data) {
    const value = data[name];

    // FIXME: uncomment this check once fillform will be fixed to don't require
    // non required fields
    // if (value) {
    params.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
    // }
  }

  return params.join("&");
}

/**
 * Get form data as object
 *
 * @see https://stackoverflow.com/q/11661187
 * @see https://vanillajstoolkit.com/helpers/serializearray/
 */
export function getFormData(form: HTMLFormElement): object {
  // Setup our serialized data
  const output: Record<string, string> = {};

  // Loop through each field in the form
  for (let i = 0; i < form.elements.length; i++) {
    const element = form.elements[i] as AnyFormHTMLElement;
    const { name, value, type, disabled, checked } = element;

    if (
      !name ||
      // FIXME: (This might be fixed in the API). we pass everything now, even
      // `disabled` fields as the API still requires a value for them. We might
      // need to disable them in JavaScript, for instance when we have dependent
      // fields and when one is hidden should also be disabled to adjust the
      // `tabindex`. So we skip the `disabled` check keeping commented the line:
      // disabled ||
      type === "reset" ||
      type === "submit" ||
      type === "button"
    ) {
      continue;
    }

    // it reads two form data values from the same input, one is the file content
    // encoded as data url, the other is the filename, its key will be the same
    // with a `_name` suffix.
    else if (type === "file") {
      output[name] = getDataAttr(element, "filecontent") || "";
      output[`${name}_name`] = getDataAttr(element, "filename") || "";
    }
    // normalise the checkbox value
    /**
     * This is a change
     */
    else if (type === "checkbox") {
      output[name] = checked ? "true" : "false";
    }
    // type === 'file'
    else if (type !== "radio" || checked) {
      output[name] = value;
    }
  }

  return output;
}

/**
 * Prefill form element data-attribute JSON encoded data
 *
 * @param {HTMLElement} element Clicked HTML element
 * @param {HTMLElement | Document | null} $formRoot Optional wrapper element around form
 */
export function prefillFromElement(
  element: HTMLElement,
  $formRoot: HTMLElement | Document | null
) {
  const raw = getDataAttr(element, "prefill");

  try {
    const data = JSON.parse(raw || "{}");
    for (const name in data) {
      const value = data[name];
      const $input = $<AnyFormHTMLElement>(`[name='${name}']`, $formRoot);
      if ($input) setFormElementValue($input, value);
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

/**
 * Check if in the form there a type=file input and if it is dirty
 */
export function getTypeFile(form: HTMLFormElement): boolean {
  // Loop through each field in the form
  for (let i = 0; i < form.elements.length; i++) {
    const element = form.elements[i] as HTMLFormElement;
    const { type, value } = element;
    if (type === "file" && value !== "") {
      return true;
    }
  }

  return false;
}
