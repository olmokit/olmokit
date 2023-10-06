import { FormsBase, type FormsBaseOptions } from "../../forms/base";
import "./index.scss";

/**
 * Core: AddressForm
 */
export function AddressForm(
  $root?: HTMLElement,
  options: FormsBaseOptions = {},
) {
  return FormsBase($root, ".addressForm", options);
}

/**
 * Core: AddressFormShipping
 */
export function AddressFormShipping(
  $root?: HTMLElement,
  options: FormsBaseOptions = {},
) {
  return FormsBase($root, ".addressFormShipping", options);
}

/**
 * Core: AddressFormBilling
 */
export function AddressFormBilling(
  $root?: HTMLElement,
  options: FormsBaseOptions = {},
) {
  return FormsBase($root, ".addressFormBilling", options);
}
