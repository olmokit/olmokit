import { Emitter } from "@olmokit/utils/Emitter";
import { isNumber } from "@olmokit/utils/isNumber";
import { isUndefined } from "@olmokit/utils/isUndefined";
import { objectOmit } from "@olmokit/utils/objectOmit";
import { $all } from "@olmokit/dom/$all";
import { addClass } from "@olmokit/dom/addClass";
import { forEach } from "@olmokit/dom/forEach";
import { listen } from "@olmokit/dom/listen";
import { removeClass } from "@olmokit/dom/removeClass";
import { setDataAttr } from "@olmokit/dom/setDataAttr";
import { toArray } from "@olmokit/dom/toArray";
import type { AjaxResponse } from "../ajax";
import {
  del as laravelDel,
  get as laravelGet,
  post as laravelPost,
} from "../ajax/laravel";
import { isUserOrGuest } from "../auth";
import { type Rooter, getScopedRoot } from "../helpers/interface";
import {
  type Item as ItemBase,
  eachItemWithId,
  getItemData,
} from "../helpers/item";

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Cart {
  type $endpoints = {
    "/cart": {
      GET: {
        response: $response;
      };
    };
    "/cart?complete=true": {
      GET: {
        response: $response_complete;
      };
    };
    "/{locale}/cart": {
      POST: {
        response: $response_complete;
      };
      DELETE: {
        response: $response_complete;
      };
    };
    "/{locale}/cart/quantity": {
      POST: {
        response: $response_complete;
      };
    };
    "/{locale}/cart/discount": {
      POST: {
        response: $response_complete;
      };
      DELETE: {
        response: $response_complete;
      };
    };
  };

  type $response = {
    items: $response_item[];
    items_quantity: number;
  };

  type $response_complete = {
    items: $response_item[];
    items_quantity: number;
    addresses: {
      billing: null | string | number;
      shipping: null | string | number;
    };
    currency: $response_currency;
    currencies: $response_currency[];
    shippingmethods: $response_shippingmethod[];
    paymentmethods: $response_paymentmethod[];
    selectedshippingmethod: null | $response_shippingmethod;
    selectedpaymentmethod: null | $response_paymentmethod;
    /** e.g. `"350.00"` */
    subtotal: string;
    /** e.g. `"350.00"` */
    total: string;
    /** e.g. `"427.00"` */
    total_vat: string;
    discount: null | $response_discount;
  };

  type $response_currency = {
    /** e.g. `"EUR"` */
    code: string;
    /** e.g. `"€"` */
    symbol: string;
  };

  type $response_shippingmethod = {
    code: string;
    name: string;
    description: string;
    requiredShippingAddress: boolean;
    requiredBillingAddress: boolean;
  };

  type $response_paymentmethod = {
    code: string;
    name: string;
    description: string;
  };

  type $response_discount = {
    code: string;
    value: string;
    description: string;
    percentage: null | number;
  };

  type $response_item = {
    id: string | number;
    cartitemid: string | number;
    type: string;
    properties: string[];
    version: string;
    quantity: number;
  };

  type $response_item_complete = {
    id: string | number;
    cartitemid: string | number;
    type: string;
    properties: $response_item_complete_property[];
    version: string;
    quantity: number;
    num_versions: number;
    addtocart: boolean;
    available: boolean;
    // optional and project dependant properties
    price?: string;
    fullprice?: string;
    title?: string;
    brand?: string;
    thumbnail?: {
      image: string;
      imagealt?: string | null;
    };
    slug?: string;
    category?: string;
    subcategory?: string;
  };

  type $response_item_complete_property = {
    id: string | number;
    name: string;
    required: boolean;
    items: $response_item_complete_property_item[];
  };

  type $response_item_complete_property_item = {
    id: string | number;
    code: string;
    name: string;
  };

  type Item = ItemBase.Model & {};

  type ArgAction = {
    data: Item;
    $item: HTMLElement;
    $btn: HTMLButtonElement;
  };

  type ArgResponse<T> = {
    response: AjaxResponse<T>;
  };

  type Events = {
    updated: Pick<ArgAction, "data">;
    updating: Pick<ArgAction, "data">;
    "get:fail": ArgResponse<$response>;
    "get:ok": ArgResponse<$response>;
    "remove:fail": ArgAction & ArgResponse<$response_complete>;
    "remove:ok": ArgAction & ArgResponse<$response_complete>;
    "add:valid": ArgAction;
    "add:invalid": ArgAction;
    "add:ok": ArgAction & ArgResponse<$response_complete>;
    "add:fail": ArgAction & ArgResponse<$response_complete>;
  };
}

const NAMESPACE = "cart";
const ENDPOINT = `/_/cms/${NAMESPACE}/`; // FIXME: trailing slashes
const ENDPOINT_QUANTITY = `${ENDPOINT}quantity/`; // FIXME: trailing slashes
const ENDPOINT_DISCOUNT = `${ENDPOINT}discount/`; // FIXME: trailing slashes
const ATTR_ITEM = `${NAMESPACE}-item`;
const ATTR_READY = `${NAMESPACE}-ready`;
const ATTR_STATUS = `${NAMESPACE}-status`;
const ATTR_VALUE = `${NAMESPACE}-value`;
const ATTR_BTN = `${NAMESPACE}-btn`;
const ATTR_BTN_ADD = `${ATTR_BTN}="add"`;
const ATTR_BTN_REMOVE = `${ATTR_BTN}="remove"`;
const ATTR_ITEMS_QUANTITY = `${NAMESPACE}-items-quantity`;

export const { emit: cartEmit, on: cartOn } = Emitter<Cart.Events>(NAMESPACE);

/**
 * It holds a map where the *keys* are the cart item ids and the *value( is
 * a boolean that says if it is in cart or not
 */
let store: Record<string, boolean> = {};

/**
 * Mark cart item DOM element as 'in-cart'
 */
function markAsInCart($el: HTMLElement) {
  removeClass($el, "is-not-in-cart");
  addClass($el, "is-in-cart");
  setDataAttr($el, ATTR_VALUE, "true");
}

/**
 * Mark cart item DOM element as 'not-in-cart'
 */
function markAsNotInCart($el: HTMLElement) {
  addClass($el, "is-not-in-cart");
  removeClass($el, "is-in-cart");
  setDataAttr($el, ATTR_VALUE, "false");
}

/**
 * Set status an all elements on page with the `data-item-id="{{ $id }}"`
 */
function setStatus(
  { id }: Pick<Cart.Item, "id">,
  status: "loading" | "done",
  inCart?: boolean
) {
  eachItemWithId(id, ($item) => {
    setDataAttr($item, ATTR_STATUS, status);

    if (!isUndefined(inCart)) {
      if (inCart) {
        markAsInCart($item);
      } else {
        markAsNotInCart($item);
      }
    }

    eachCartAddBtn($item, ($btn) => {
      $btn.disabled = status === "loading";
    });
  });
}

/**
 * Filter item data specific to some cart async POST interactions
 */
export function cleanCartItemRequestBody(data: Cart.Item) {
  return objectOmit(data, ["readonlyProperties", "params"]);
}

/**
 * Loop through each CartAddBtn marked with the `data-cart-btn="add"` attribute
 * and run the given callback. You can scope the buttons to the given `$item`
 * element, for instance when using it in a products list page.
 */
export function eachCartAddBtn(
  $item: HTMLElement | Document | null,
  callback: ($btn: HTMLButtonElement) => any
) {
  const $elements = toArray(
    $all(`[data-${ATTR_BTN_ADD}]`, $item)
  ) as unknown as HTMLButtonElement[];
  $elements.forEach(callback);
  return $elements;
}

/**
 * Loop through each DOM element marked with the `data-cart-items-quantity`
 * attribute and run the given callback.
 * These DOM elements should just contain the number of the cart items, so in
 * a complex markup you need to wrap only the number within such element
 * as its `textContect` will be replaced.
 * @example
 *
 * ```html
 * <div class="MyCartBadge:">
 *  You have <span data-cart-items-quantity>{{ $cart['items_quantity'] }}</span>
 * </div>
 * ```
 */
export function eachCartItemsQuantity(callback: ($btn: HTMLElement) => any) {
  const $elements = toArray(
    $all(`[data-${ATTR_ITEMS_QUANTITY}]`)
  ) as unknown as HTMLElement[];
  $elements.forEach(callback);
  return $elements;
}

/**
 * Update cart items quantity on all matching DOM elements
 */
export function updateCartItemsQuantity(howMany: number) {
  if (isNumber(howMany)) {
    eachCartItemsQuantity(($el) => {
      $el.innerText = howMany ? howMany + "" : "";
    });
  }
}

/**
 * Just reduce duplication
 */
function asyncRequest<
  Successful extends Pick<Cart.$response, "items_quantity">,
>(fn: typeof laravelPost, endpoint: string, data?: any) {
  cartEmit("updating", { data });
  const request = fn<Successful>(endpoint, { data });

  request.then((response) => {
    updateCartItemsQuantity(response.data.items_quantity);
    cartEmit("updated", { data });
  });

  return request;
}

/**
 * Retrieve the current user's cart data ("lean" version)
 */
export function getCart() {
  const request = asyncRequest<Cart.$endpoints["/cart"]["GET"]["response"]>(
    laravelGet,
    ENDPOINT
  );

  request
    .then((response) => {
      cartEmit("get:ok", { response });
      store = {};

      const { items } = response.data;

      if (items) {
        items.forEach((item) => {
          store[item.id] = true;
        });
      }
    })
    .catch((response) => {
      cartEmit("get:fail", { response });
    });

  return request;
}

/**
 * Retrieve the current user's cart data ("complete" version)
 */
export function getCartComplete() {
  const request = asyncRequest<
    Cart.$endpoints["/cart?complete=true"]["GET"]["response"]
  >(laravelGet, ENDPOINT + "?complete=true");

  request
    .then((response) => {
      cartEmit("get:ok", { response });
    })
    .catch((response) => {
      cartEmit("get:fail", { response });
    });

  return request;
}

/**
 * Add an item from the user's cart asynchronously
 */
export function addToCart(data: Cart.Item) {
  return asyncRequest<Cart.$endpoints["/{locale}/cart"]["POST"]["response"]>(
    laravelPost,
    ENDPOINT,
    cleanCartItemRequestBody(data)
  );
}

/**
 * Remove an item from the user's cart asynchronously
 */
export function removeFromCart(data: Cart.Item) {
  return asyncRequest<Cart.$endpoints["/{locale}/cart"]["DELETE"]["response"]>(
    laravelDel,
    ENDPOINT,
    cleanCartItemRequestBody(data)
  );
}

/**
 * Set a cart's item quantity asynchronously
 */
export function setCartQuantity(data: Cart.Item) {
  return asyncRequest<
    Cart.$endpoints["/{locale}/cart/quantity"]["POST"]["response"]
  >(laravelPost, ENDPOINT_QUANTITY, cleanCartItemRequestBody(data));
}

/**
 * Apply discount code to cart
 */
export function applyCartDiscount(code: string) {
  return asyncRequest<
    Cart.$endpoints["/{locale}/cart/discount"]["POST"]["response"]
  >(laravelPost, ENDPOINT_DISCOUNT, { code });
}

/**
 * Remove discount code from cart
 */
export function removeCartDiscount() {
  return asyncRequest<
    Cart.$endpoints["/{locale}/cart/discount"]["DELETE"]["response"]
  >(laravelDel, ENDPOINT_DISCOUNT);
}

/**
 * Hydrate the DOM marking as in-cart/not-in-cart all the DOM elements
 * that have a `data-...-item="{{ $id }}". Once it is done it marks each
 * element with a `data-...-ready` attribute.
 */
export function hydrateCart(rooter?: Rooter) {
  forEach($all(`[data-${ATTR_ITEM}]`, getScopedRoot(rooter)), ($item) => {
    const { id } = getItemData($item);
    if (store[id]) {
      markAsInCart($item);
    } else {
      markAsNotInCart($item);
    }

    setDataAttr($item, ATTR_READY, "true");
  });
}

/**
 * Bind add to cart buttons
 *
 * It uses event delegation so that later added DOM elements don't need to be
 * re-binded. You can jst call this once in your js entrypoint.
 */
export function bindCartBtnAdd() {
  listen(
    "click",
    `[data-${ATTR_BTN_ADD}]`,
    (event, $btn: HTMLButtonElement) => {
      const $item = $btn.closest(`[data-${ATTR_ITEM}]`) as HTMLElement;

      if ($item) {
        const data = getItemData($item);
        const args = { $item, $btn, data };

        if ($btn.disabled) {
          cartEmit("add:invalid", args);
          return;
        } else {
          cartEmit("add:valid", args);
        }

        setStatus(data, "loading");

        const request = addToCart(data);

        request
          .then((response) => {
            const expandedArgs = { ...args, response };
            setStatus(data, "done", true);
            cartEmit("add:ok", expandedArgs);
          })
          .catch((response) => {
            const expandedArgs = { ...args, response };
            setStatus(data, "done");
            cartEmit("add:fail", expandedArgs);
          });

        // now refetch
        // get();
        return;
      }

      if (process.env["NODE_ENV"] !== "production") {
        console.error(
          `The clicked cart btn is not inside an element with 'data-${ATTR_ITEM}'.`
        );
      }
    }
  );
}

/**
 * Bind remove from cart buttons
 *
 * It uses event delegation so that later added DOM elements don't need to be
 * re-binded. You can jst call this once in your js entrypoint.
 */
export function bindCartBtnRemove(/* hooks?: Cart.Hooks */) {
  listen("click", `[data-${ATTR_BTN_REMOVE}]`, (event) => {
    const $btn = event.target as HTMLButtonElement;
    const $item = $btn.closest(`[data-${ATTR_ITEM}]`) as HTMLElement;

    if ($item) {
      const data = getItemData($item);
      const args = { $item, $btn, data };

      setStatus(data, "loading");

      const request = removeFromCart(data);

      request
        .then((response) => {
          const expandedArgs = { ...args, response };
          setStatus(data, "done", false);
          cartEmit("remove:ok", expandedArgs);
        })
        .catch((response) => {
          const expandedArgs = { ...args, response };
          setStatus(data, "done");
          cartEmit("remove:fail", expandedArgs);
        });

      // now refetch
      // get();
      return;
    }

    if (process.env["NODE_ENV"] !== "production") {
      console.error(
        `The clicked cart btn remove is not inside an element with 'data-${ATTR_ITEM}'.`
      );
    }
  });
}

/**
 * Init the cart on the given container, it will use the whole document
 * if no `$root` argument is provided
 */
export function initCart(rooter?: Rooter) {
  if (isUserOrGuest()) {
    const request = getCart();

    request.finally(() => {
      hydrateCart(rooter);
    });

    return request;
  }

  return;
  // the above is not really needed, we might have the `isUserOrGuest` condition
  // returning false if a user is logged out and has not yet added an item to
  // the cart
  // forEach($all(`[data-${ATTR_ITEM}]`, getScopedRoot(rooter)), ($item) => {
  //   setDataAttr($item, ATTR_READY, "true");
  // });
}
