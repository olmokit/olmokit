import { Emitter } from "@olmokit/utils/Emitter";
import { isUndefined } from "@olmokit/utils/isUndefined";
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
import { isAuthenticated } from "../auth";
import { type Rooter, getScopedRoot } from "../helpers/interface";
import {
  type Item as ItemBase,
  eachItemWithId,
  getItemData,
} from "../helpers/item";

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Wishlist {
  type $endpoints = {
    "/wishlist": {
      GET: {
        response: $response;
      };
      POST: {
        response: $response;
      };
      DELETE: {
        response: $response;
      };
    };
  };

  type $response = $response_item[];

  type $response_item = {
    id: string;
    type: string;
    properties: string[];
    addtocart: boolean;
    status: "available";
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
    "remove:unauth": ArgAction;
    "remove:ok": ArgAction & ArgResponse<$response>;
    "remove:fail": ArgAction & ArgResponse<$response>;
    "add:unauth": ArgAction;
    "add:ok": ArgAction & ArgResponse<$response>;
    "add:fail": ArgAction & ArgResponse<$response>;
  };
}

const NAMESPACE = "wishlist";
const ENDPOINT = `/_/cms/${NAMESPACE}/`; // FIXME: trailing slashes
const ATTR_ITEM = `${NAMESPACE}-item`;
const ATTR_READY = `${NAMESPACE}-ready`;
const ATTR_STATUS = `${NAMESPACE}-status`;
const ATTR_VALUE = `${NAMESPACE}-value`;
const ATTR_BTN = `${NAMESPACE}-btn`;

export const { emit: wishlistEmit, on: wishlistOn } =
  Emitter<Wishlist.Events>(NAMESPACE);

/**
 * It holds a map where the *keys* are the wishlist item ids and the *value( is
 * a boolean that says if it is wished or not
 */
let store: Record<string, boolean> = {};

/**
 * Mark wishlist item DOM element as 'wished'
 */
function markAsWished($el: HTMLElement) {
  removeClass($el, "is-not-wished");
  addClass($el, "is-wished");
  setDataAttr($el, ATTR_VALUE, "true");
}

/**
 * Mark wishlist item DOM element as 'not-wished'
 */
function markAsNotWished($el: HTMLElement) {
  addClass($el, "is-not-wished");
  removeClass($el, "is-wished");
  setDataAttr($el, ATTR_VALUE, "false");
}

/**
 * Set status an all elements on page with the `data-item-id="{{ $id }}"`
 *
 * Here we change the status of all items in the current DOM matching the ID,
 * this might be what we want or not dependning on the type of wishlist we have.
 * There are wishlists implementations that store the wishlist item as a strict
 * combination of item `id` and `poperties` and implementations that solely
 * consider the `id`. Hence, in this latter and most common scenario, when a
 * user _wish_ or _unwish_ an item that is present multiple times in the page
 * with different properties configured, like on a shopping cart page, the action
 * will reflect the updated status on all the items on the page that has the same
 * ID, despite their configured properties.
 */
function setStatus(
  { id }: Pick<Wishlist.Item, "id">,
  status: "loading" | "done",
  wished?: boolean,
) {
  eachItemWithId(id, ($item) => {
    // set loading/done status
    setDataAttr($item, ATTR_STATUS, status);

    eachWishlistBtn($item, ($btn) => {
      $btn.disabled = status === "loading";
    });

    // set wished/not-wished status
    if (!isUndefined(wished)) {
      if (wished) {
        markAsWished($item);
      } else {
        markAsNotWished($item);
      }
    }
  });
}

/**
 * Loop through each WishlistBtn marked with the `data-wishlist-btn` attribute
 * and run the given callback. You can scope the buttons to the given `$item`
 * element, for instance when using it in a products list page.
 */
export function eachWishlistBtn(
  $item: HTMLElement | Document | null,
  callback: ($btn: HTMLButtonElement) => any,
) {
  const $elements = toArray(
    $all(`[data-${ATTR_BTN}]`, $item),
  ) as unknown as HTMLButtonElement[];
  $elements.forEach(callback);
  return $elements;
}

/**
 * Retrieve the current user's wishlist data
 */
export function getWishlist() {
  if (!isAuthenticated()) {
    if (process.env["NODE_ENV"] !== "production") {
      console.warn(
        "[@olmokit/core/wishlist] called 'get' with unauthenticated user",
      );
    }
    return;
  }

  const request =
    laravelGet<Wishlist.$endpoints["/wishlist"]["GET"]["response"]>(ENDPOINT);

  request.then(({ data = [] }) => {
    store = {};
    data.forEach((item) => {
      store[item.id] = true;
    });
    // }).catch(() => {
  });

  return request;
}

/**
 * Add an item from the user's wishlist asynchronously
 */
export function addToWishlist(data: Wishlist.Item) {
  if (!isAuthenticated()) {
    if (process.env["NODE_ENV"] !== "production") {
      console.warn(
        "[@olmokit/core/wishlist] called 'add' with unauthenticated user",
      );
    }
    return;
  }

  wishlistEmit("updating", { data });

  const request = laravelPost<
    Wishlist.$endpoints["/wishlist"]["POST"]["response"]
  >(ENDPOINT, { data });

  request.then(() => {
    wishlistEmit("updated", { data });
  });

  return request;
}

/**
 * Remove an item from the user's wishlist asynchronously
 */
export function removeFromWishlist(data: Pick<Wishlist.Item, "id">) {
  if (!isAuthenticated()) {
    if (process.env["NODE_ENV"] !== "production") {
      console.warn(
        "[@olmokit/core/wishlist] called 'remove' with unauthenticated user",
      );
    }
    return;
  }

  wishlistEmit("updating", { data });

  const request = laravelDel<
    Wishlist.$endpoints["/wishlist"]["DELETE"]["response"]
  >(ENDPOINT, { data });

  request.then(() => {
    wishlistEmit("updated", { data });
  });

  return request;
}

/**
 * Hydrate the DOM marking as wished/not-wished all the DOM elements
 * that have a `data-...-item="{{ $id }}". Once it is done it marks each
 * element with a `data-...-ready` attribute.
 */
export function hydrateWishlist(rooter?: Rooter) {
  forEach($all(`[data-${ATTR_ITEM}]`, getScopedRoot(rooter)), ($item) => {
    const { id } = getItemData($item);
    if (store[id]) {
      markAsWished($item);
    } else {
      markAsNotWished($item);
    }

    setDataAttr($item, ATTR_READY, "true");
  });
}

/**
 * Bind wishlist buttons.
 *
 * It uses event delegation so that later added DOM elements don't need to be
 * re-binded. You can jst call this once in your js entrypoint.
 */
export function bindWishlistBtn() {
  listen("click", `[data-${ATTR_BTN}]`, (event, $btn) => {
    if ($btn instanceof HTMLButtonElement) {
      const $item = $btn.closest(`[data-${ATTR_ITEM}]`) as HTMLElement;

      if ($item) {
        const data = getItemData($item);
        const args = { $item, $btn, data };

        if (store[data.id]) {
          setStatus(data, "loading");

          if (!isAuthenticated()) {
            wishlistEmit("remove:unauth", args);
            return;
          }

          removeFromWishlist(data)
            ?.then((response) => {
              const expandedArgs = { ...args, response };
              setStatus(data, "done", false);
              wishlistEmit("remove:ok", expandedArgs);

              // now refetch
              getWishlist();
            })
            .catch((response) => {
              const expandedArgs = { ...args, response };
              setStatus(data, "done");
              wishlistEmit("remove:fail", expandedArgs);
            });
        } else {
          setStatus(data, "loading");

          if (!isAuthenticated()) {
            wishlistEmit("add:unauth", args);
            return;
          }

          addToWishlist(data)
            ?.then((response) => {
              const expandedArgs = { ...args, response };
              setStatus(data, "done", true);
              wishlistEmit("add:ok", expandedArgs);

              // now refetch
              getWishlist();
            })
            .catch((response) => {
              const expandedArgs = { ...args, response };
              setStatus(data, "done");
              wishlistEmit("add:fail", expandedArgs);
            });
        }
        return;
      }
      if (process.env["NODE_ENV"] !== "production") {
        console.error(
          `The clicked wishlist btn is not inside an element with 'data-${ATTR_ITEM}'.`,
        );
      }
    }
  });
}

/**
 * Init the wishlist on the given container, it will use the whole document
 * if no `$root` argument is provided
 */
export function initWishlist(rooter?: Rooter) {
  if (!isAuthenticated()) {
    // if (process.env["NODE_ENV"] !== "production") {
    //   console.info(
    //     "[@olmokit/core/wishlist] called 'init' with unauthenticated user"
    //   );
    // }
    return;
  }

  const request = getWishlist();

  request?.finally(() => {
    hydrateWishlist(rooter);
  });

  return request;
}
