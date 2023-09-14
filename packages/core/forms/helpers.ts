import { $ } from "@olmokit/dom/$";
import { $each } from "@olmokit/dom/$each";
import { addClass } from "@olmokit/dom/addClass";
import { getDataAttr } from "@olmokit/dom/getDataAttr";
import { removeClass } from "@olmokit/dom/removeClass";
import "../polyfills/closest";
import type { AnyFormHTMLElement } from "./types";

type FormsElementType =
  | "input"
  | "select"
  | "textarea"
  | "checkbox"
  | "radio"
  | "file";

/**
 * Get form element type in a coherent way
 */
export function getFormElementType(
  element: AnyFormHTMLElement
): FormsElementType {
  const { tagName, type } = element;

  let output: FormsElementType = "input";

  if (tagName == "SELECT") output = "select";
  else if (tagName == "TEXTAREA") output = "textarea";
  else if (type == "checkbox") output = "checkbox";
  else if (type == "radio") output = "radio";
  else if (type == "file") output = "file";

  return output;
}

/**
 * Get form/any-input element valye in a consistent way
 *
 * The only special value retrieval is for `radio` inputs, @see https://stackoverflow.com/q/9618504/1938970
 */
export function getFormElementValue(element: AnyFormHTMLElement): string {
  const type = getFormElementType(element);
  if (type === "radio") {
    const $input = $(
      `input[name="${element.name}"]:checked`,
      undefined,
      true
    ) as HTMLInputElement;
    return $input ? $input.value : "";
  }
  return element.value;
}

/**
 * Get form/any-input element valye in a consistent way
 *
 * The only special value set is for `radio` inputs, @see https://stackoverflow.com/q/9618504/1938970
 */
export function setFormElementValue(
  element: AnyFormHTMLElement,
  value: string
) {
  const type = getFormElementType(element);
  if (type === "radio" || type === "checkbox") {
    $each<HTMLInputElement>(`input[name="${element.name}"]`, ($input) => {
      $input.checked = $input.value === value;
    });
  } else {
    element.value = value;
  }
}

/**
 * Get form element wrapper
 *
 * The element type matches the class name of the form element wrapper, so
 * checkboxes are wrapped in a `.checkbox` class, inputs in `.input`, textareas
 * in `.textarea`, etc.
 */
export function getElementWrapper(element: AnyFormHTMLElement) {
  const rootClass = getFormElementType(element);
  return element.closest(`.${rootClass}`) as HTMLDivElement;
}

/**
 * Get rules names for the given form element based on its DOM attributes
 */
export function getElementRules(element: AnyFormHTMLElement) {
  const attrValidation = getDataAttr(element, "validation");
  const custom = attrValidation ? attrValidation.split(" ") : [];
  const standard = [] as string[];

  if (element.hasAttribute("required")) standard.push("required");
  if (element.getAttribute("type") === "email") standard.push("email");
  if (element.getAttribute("type") === "file") standard.push("file");

  return standard.concat(custom);
}

/**
 * Get form label input
 */
export function getLabelInput(element: HTMLLabelElement) {
  // @ts-expect-error FIXME: core types forms
  // TODO: outlined file style needs the following instead
  // return $(".formControl", element.closest(".formRoot"));
  return element.previousElementSibling
    .previousElementSibling as AnyFormHTMLElement;
}

/**
 * Set empty status on input, in replacement for the missin `:empty` CSS selector
 */
export function setEmptyStatus(this: AnyFormHTMLElement) {
  if (this.value) {
    addClass(this, "notempty");
  } else {
    removeClass(this, "notempty");
  }
}

/**
 * Get radio input checked element
 */
export function getRadioChecked(inputs: HTMLInputElement[]) {
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      return inputs[i];
    }
  }
  return null;
}

/**
 * Get radio input checked value
 */
export function getRadioValue(inputs: HTMLInputElement[]) {
  const checkedOne = getRadioChecked(inputs);
  return checkedOne ? checkedOne.value : "";
}

/**
 * Get form data as query params
 */
export function getPostData<T extends { [key: string]: string }>(data: T) {
  const params = [];

  for (const name in data) {
    const value = data[name];

    if (value) {
      params.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
    }
  }

  return params.join("&");
}

/**
 * Get form data as object
 *
 * @see https://stackoverflow.com/q/11661187
 * @see https://vanillajstoolkit.com/helpers/serializearray/
 */
export function getFormData(form: HTMLFormElement) {
  // Setup our serialized data
  const output = {} as Record<string, string>;

  // Loop through each field in the form
  for (let i = 0; i < form.elements.length; i++) {
    const element = form.elements[i] as AnyFormHTMLElement;
    const { name, value, type, checked /* disabled, */ } = element;

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
 * Trigger `change` event (and therefore fire its `onchange` listeners) on an
 * input element whose value was changed programmatically, e.g. the `spinner` or
 * the `range` form controls.
 */
export function triggerEvent($input: HTMLInputElement, eventName = "change") {
  $input.dispatchEvent(new Event(eventName));
}
