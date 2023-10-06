import { Collapsable } from "@olmokit/core/collapsable";
import { CheckoutPaymentMethod } from "./PaymentMethod";

const ATTR_METHOD = "checkout-paymentmethod";

export const ATTR_METHOD_CODE = `${ATTR_METHOD}-code`;
export const ATTR_METHOD_BODY = `${ATTR_METHOD}-body`;
export const ATTR_METHOD_INPUT = `${ATTR_METHOD}-input`;

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Checkout {}

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Checkout.Payment {
  type MethodType = "banktransfer" | "cashondelivery";

  export type MethodsMap = Record<
    MethodType,
    {
      /** Payment method Controller class */
      c: Controller;
      /** Collapsable area */
      a: ReturnType<typeof Collapsable>;
    }
  >;

  type Controller = CheckoutPaymentMethod;
}
