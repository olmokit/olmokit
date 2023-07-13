import { $, on } from "@olmokit/dom";
import { applyCartDiscount, removeCartDiscount } from "@olmokit/core/cart";
import "./Discount.scss";

const ATTR_DISCOUNT = "cart-discount";
const ATTR_DISCOUNT_INPUT = `${ATTR_DISCOUNT}-input`;
const ATTR_DISCOUNT_ADD = `${ATTR_DISCOUNT}-add`;
const ATTR_DISCOUNT_REMOVE = `${ATTR_DISCOUNT}-remove`;
const ATTR_DISCOUNT_FEEDBACK = `${ATTR_DISCOUNT}-feedback`;

/**
 * Component: CartDiscount
 *
 * The component will be initialised simply by calling the function
 * `CartDiscount();` when you need.
 */
export function CartDiscount() {
  const $root = $(".CartDiscount:") as HTMLDivElement;
  const $input = $(`[data-${ATTR_DISCOUNT_INPUT}]`, $root) as HTMLInputElement;
  const $add = $(`[data-${ATTR_DISCOUNT_ADD}]`, $root) as HTMLButtonElement;
  const $remove = $(`[data-${ATTR_DISCOUNT_REMOVE}]`, $root) as HTMLElement;
  const $feedback = $(`[data-${ATTR_DISCOUNT_FEEDBACK}]`, $root) as HTMLElement;

  on($input, "change", handleChange);
  on($input, "keyup", handleChange);
  on($add, "click", handleAdd);
  on($remove, "click", handleRemove);

  /**
   * Handle change
   */
  function handleChange() {
    $feedback.innerHTML = "";
  }

  /**
   * Handle add
   */
  function handleAdd() {
    const { value } = $input;

    if (value) {
      loading();

      applyCartDiscount(value)
        .then(() => {
          location.reload();
        })
        .catch(() => {
          $feedback.innerHTML = "Codice invalido";
        })
        .finally(() => {
          done();
        });
    }
  }

  /**
   * Handle remove
   */
  function handleRemove() {
    loading();

    removeCartDiscount().finally(() => {
      location.reload();
    });
  }

  /**
   * On async loading
   */
  function loading() {
    $add.disabled = true;
  }

  /**
   * On async done
   */
  function done() {
    $add.disabled = false;
  }
}
