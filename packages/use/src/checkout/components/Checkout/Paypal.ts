// import { $ } from "@olmokit/dom";
import {
  CheckoutPaymentMethod,
  type CheckoutPaymentMethodArgs,
} from "./PaymentMethod";
import "./Paypal.scss";

/**
 * CheckoutPaypal
 */
export class CheckoutPaypal extends CheckoutPaymentMethod {
  constructor($root: HTMLDivElement, args: CheckoutPaymentMethodArgs) {
    super($root, args);

    // custom stuff?
  }
}
