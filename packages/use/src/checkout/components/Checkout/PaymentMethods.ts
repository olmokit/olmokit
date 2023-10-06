import { $, $all, forEach, getDataAttr } from "@olmokit/dom";
import { Collapsable } from "@olmokit/core/collapsable";
import "@olmokit/core/forms/radio";
import { CheckoutPaymentMethod } from "./PaymentMethod";
import "./PaymentMethods.scss";
import { CheckoutPaypal } from "./Paypal";
import { ATTR_METHOD_BODY, ATTR_METHOD_CODE, Checkout } from "./index";

type ValueOf<T> = T[keyof T];

/**
 * Component: CheckoutPaymentMethods
 */
export function CheckoutPaymentMethods($form: HTMLFormElement) {
  const $root = $(".CheckoutPaymentMethods:", $form);
  const $methods = $all<HTMLDivElement>(".CheckoutPaymentMethod:", $root);
  const map: Partial<Checkout.Payment.MethodsMap> = {};

  forEach($methods, initPaymentMethod);

  setInitialAccordionState();

  /**
   * Init each payment option
   *
   * It reads the data attribute on the DOM root element
   * to determine which payment controller class to instantiate
   */
  function initPaymentMethod($el: HTMLDivElement) {
    const code = getDataAttr(
      $el,
      ATTR_METHOD_CODE,
    ) as Checkout.Payment.MethodType;
    const $body = $(`[data-${ATTR_METHOD_BODY}]`, $el);
    let Controller = CheckoutPaymentMethod;

    switch (code) {
      case "banktransfer":
        // Controller = BankTransfer;
        break;
      case "cashondelivery":
        // Controller = CashOnDelivery;
        break;
      // @ts-expect-error FIXME: use types
      case "paypal":
        Controller = CheckoutPaypal;
        break;
      // @ts-expect-error FIXME: use types
      case "creditcard":
        // Controller = CheckoutPaypal;
        break;
      // @ts-expect-error FIXME: use types
      case "email":
        // Controller = CheckoutPaypal;
        break;
      default:
        if (process.env["NODE_ENV"] !== "production") {
          console.error(`Unsupported payment code: ${code}`, $el);
        }
        break;
    }

    map[code] = {
      c: new Controller($el, { $form, onChange: updateAccordion }),
      a: Collapsable($body),
    } as ValueOf<Checkout.Payment.MethodsMap>;
  }

  /**
   * Set initial accordion state
   */
  function setInitialAccordionState() {
    const payment = getCurrent();

    updateAccordion(payment, true);
  }

  /**
   * Get currently selected payment
   */
  function getCurrent() {
    for (const _key in map) {
      const key = _key as Checkout.Payment.MethodType;
      const item = map[key];

      if (item?.c.isSelected()) {
        return item.c;
      }
    }
    return null;
  }

  /**
   * Toggle payments in an accordion like behaviour
   */
  function updateAccordion(
    instance?: Checkout.Payment.Controller | null,
    immediate?: boolean,
  ) {
    for (const _key in map) {
      const key = _key as Checkout.Payment.MethodType;
      const item = map[key];

      if (instance && key === instance.type && instance.isSelected()) {
        if (item?.a) item.a.expand(immediate);
        instance.select();
      } else {
        if (item?.a) item.a.collapse(immediate);
        if (item?.c) item.c.deselect();
      }
    }
  }
}
