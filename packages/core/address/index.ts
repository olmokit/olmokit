import { Emitter } from "@olmokit/utils/Emitter";
import { $all } from "@olmokit/dom/$all";
import { forEach } from "@olmokit/dom/forEach";
import { getDataAttr } from "@olmokit/dom/getDataAttr";
import { listen } from "@olmokit/dom/listen";
import { setDataAttr } from "@olmokit/dom/setDataAttr";
import type { AjaxResponse } from "../ajax";
import { del as laravelDel, post as laravelPost } from "../ajax/laravel";
import { getJSONdataAttr } from "../helpers/interface";

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Address {
  type $endpoints = {};

  type Type = "billing" | "shipping";

  type Model = {
    /** The address `id` from the backend database */
    id: string;
    /** Managed by the PHP Helpers\Address class */
    type: Type;
    /** It can be a comma separated string of different address types, e.g. `"shipping,billing"` */
    _default?: Type | Type[];
  };

  type ArgAction = {
    data: Model;
    $item: HTMLElement;
    $btn: HTMLButtonElement;
  };

  type ArgResponse<T> = {
    response: AjaxResponse<T>;
  };

  type CallbackArgs = {
    data: Model;
    $item: HTMLElement;
    $btn: HTMLButtonElement;
  };

  type CallbackArgsWithResponse<T = {}> = CallbackArgs & {
    response: T;
  };

  type Events = {
    updated: Pick<ArgAction, "data">;
    updating: Pick<ArgAction, "data">;
    "remove:ok": ArgAction & ArgResponse<{}>;
    "remove:fail": ArgAction & ArgResponse<{}>;
    "setdefault:ok": ArgAction & ArgResponse<{}>;
    "setdefault:fail": ArgAction & ArgResponse<{}>;
  };
}

const NAMESPACE = "address";
const ENDPOINT = `/_/cms/${NAMESPACE}`;
/**
 * This is a change, trailing slash
 */
const ENDPOINT_REMOVE = `${ENDPOINT}/remove/`;
const ENDPOINT_SETDEFAULT = `${ENDPOINT}/setdefault/`;
const ATTR_ITEM = `${NAMESPACE}`;
const ATTR_ID = `${NAMESPACE}-id`;
const ATTR_STATUS = `${NAMESPACE}-status`;
const ATTR_BTN_REMOVE = `${NAMESPACE}-remove`;
const ATTR_BTN_SETDEFAULT = `${NAMESPACE}-setdefault`;

export const { emit: addressEmit, on: addressOn } =
  Emitter<Address.Events>(NAMESPACE);

/**
 * Set status an all elements on page with the `data-cart-item="{{ $id }}"`
 */
function setStatus(
  { id }: Pick<Address.Model, "id">,
  status: "loading" | "done",
  btnAttr: string
) {
  forEach($all(`[data-${ATTR_ID}="${id}"]`), ($item) => {
    setDataAttr($item, ATTR_STATUS, status);

    forEach($all(`[data-${btnAttr}]`, $item), ($btn) => {
      if (status === "loading") {
        $btn.setAttribute("disabled", "true");
      } else {
        $btn.removeAttribute("disabled");
      }
    });
  });
}

/**
 * Remove an address asynchronously
 */
export function removeAddress(data: Address.Model) {
  const request = laravelDel<{}>(ENDPOINT_REMOVE, { data });
  return request;
}

/**
 * Set an address as default asynchronously
 */
export function setdefaultAddress(data: Address.Model) {
  const request = laravelPost<{}>(ENDPOINT_SETDEFAULT, { data });
  return request;
}

/**
 * Get address model data from DOM element
 */
function getAddressDataFromElement($element: HTMLElement) {
  return getJSONdataAttr<Address.Model>($element, ATTR_ITEM);
}

/**
 * Bind remove address buttons
 *
 * It uses event delegation so that later added DOM elements don't need to be
 * re-binded. You can jst call this once in your js entrypoint.
 */
export function bindAddressBtnRemove(/* hooks?: Address.Hooks */) {
  listen(
    "click",
    `[data-${ATTR_BTN_REMOVE}]`,
    (event, $btn: HTMLButtonElement) => {
      const $item = $btn.closest(`[data-${ATTR_ITEM}]`) as HTMLElement;

      if ($item) {
        // the button might be within a form, so prevent accidental submission
        event.preventDefault();

        const data = getAddressDataFromElement($item);
        const args = { $item, $btn, data };

        setStatus(data, "loading", ATTR_BTN_REMOVE);

        const request = removeAddress(data);

        request
          .then((response) => {
            const expandedArgs = { ...args, response };
            addressEmit("remove:ok", expandedArgs);
          })
          .catch((response) => {
            const expandedArgs = { ...args, response };
            addressEmit("remove:fail", expandedArgs);
          })
          .finally(() => {
            setStatus(data, "done", ATTR_BTN_REMOVE);
          });
      } else {
        if (process.env["NODE_ENV"] !== "production") {
          console.error(
            `The clicked address btn is not inside an element with 'data-${ATTR_ITEM}'.`
          );
        }
      }
    }
  );
}

/**
 * Bind set default address buttons
 *
 * It uses event delegation so that later added DOM elements don't need to be
 * re-binded. You can jst call this once in your js entrypoint.
 */
export function bindAddressBtnSetDefault(/* hooks?: Address.Hooks */) {
  listen(
    "click",
    `[data-${ATTR_BTN_SETDEFAULT}]`,
    (event, $btn: HTMLButtonElement) => {
      const $item = $btn.closest(`[data-${ATTR_ITEM}]`) as HTMLElement;

      if ($item) {
        // the button might be within a form, so prevent accidental submission
        event.preventDefault();

        const _default = getDataAttr($btn, ATTR_BTN_SETDEFAULT) as Address.Type;
        const data = { ...getAddressDataFromElement($item), _default };
        const args = { $item, $btn, data };

        setStatus(data, "loading", ATTR_BTN_SETDEFAULT);

        const request = setdefaultAddress(data);

        request
          .then((response) => {
            const expandedArgs = { ...args, response };
            addressEmit("setdefault:ok", expandedArgs);
          })
          .catch((response) => {
            const expandedArgs = { ...args, response };
            addressEmit("setdefault:ok", expandedArgs);
          })
          .finally(() => {
            setStatus(data, "done", ATTR_BTN_SETDEFAULT);
          });
      } else {
        if (process.env["NODE_ENV"] !== "production") {
          console.error(
            `The clicked address btn is not inside an element with 'data-${ATTR_ITEM}'.`
          );
        }
      }
    }
  );
}

/**
 * Default Address export to use as an object with methods
 */
export default {
  remove: removeAddress,
  setdefault: setdefaultAddress,
  emit: addressEmit,
  on: addressOn,
  bindBtnRemove: bindAddressBtnRemove,
  bindBtnSetDefault: bindAddressBtnSetDefault,
};
