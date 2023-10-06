/**
 * A very tolerant form's HTMLElement type
 */
export type AnyFormHTMLElement = (
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
) &
  Partial<Pick<HTMLInputElement, "checked">>;
