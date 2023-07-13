import { FormsBase, type FormsBaseOptions } from "../../forms/base";

/**
 * Core: Checkout Form Details
 */
/**
 * This is a change
 */
export default function CheckoutFormPayment(
  $root?: HTMLElement,
  options: FormsBaseOptions = {}
) {
  return FormsBase($root, ".checkoutFormPayment", options);
}
