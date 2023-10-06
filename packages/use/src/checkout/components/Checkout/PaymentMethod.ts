import { $, getDataAttr, on } from "@olmokit/dom";
import "./PaymentMethod.scss";
import { ATTR_METHOD_CODE, ATTR_METHOD_INPUT, Checkout } from "./index";

export type CheckoutPaymentMethodArgs = {
  $form: HTMLFormElement;
  onChange: (paymentMethod: CheckoutPaymentMethod) => any;
};

/**
 * PaymentMethod base class to extends with the various method specific needs
 * and implementations (e.g. Paypal, Stripe, etc.)
 */
export class CheckoutPaymentMethod {
  $root: HTMLDivElement;
  $form: HTMLFormElement;
  $input: HTMLInputElement;
  type: Checkout.Payment.MethodType;

  constructor(
    $root: HTMLDivElement,
    { $form, onChange }: CheckoutPaymentMethodArgs,
  ) {
    this.$root = $root;
    this.$form = $form;
    this.$input = $(`[data-${ATTR_METHOD_INPUT}]`, $root);
    this.type = getDataAttr(
      $root,
      ATTR_METHOD_CODE,
    ) as Checkout.Payment.MethodType;

    on(this.$input, "change", () => {
      if (onChange) {
        onChange(this);
      }
    });
  }

  /**
   * Is selected
   */
  isSelected() {
    return this.$input.checked;
  }

  /**
   * Select
   */
  select() {}

  /**
   * Deselect
   */
  deselect() {}

  /**
   * Is valid
   */
  isValid() {
    return true;
  }
}
