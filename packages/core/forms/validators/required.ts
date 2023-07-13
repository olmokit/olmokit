/**
 * Validator: is required check
 */
export default function isRequired(
  element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
) {
  // use the native API if available
  if (element.validity) {
    return !element.validity.valueMissing;
  }

  // TODO: custom stuff for checkboxes, radios, and selects
  return element.value && element.value !== "";
}
