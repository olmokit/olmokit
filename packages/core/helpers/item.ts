// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/**
 * @file
 *
 * Item entity abstract helper.
 *
 * This relates both to the `cart` and the `wishlist` features as they both
 * interacts with abstract collection items, most of the time of type "product"
 * but not necessarily.
 */
import { Emitter } from "@olmokit/utils/Emitter";
import { getUrlQueryParams } from "@olmokit/utils/getUrlQueryParams";
import { isUndefined } from "@olmokit/utils/isUndefined";
import { updateLinkParams } from "@olmokit/utils/updateLinkParams";
// FIXME: somehow the $$ deeper import does not work
import { $$ } from "@olmokit/dom";
import { $each } from "@olmokit/dom/$each";
import { forEach } from "@olmokit/dom/forEach";
import { getDataAttr } from "@olmokit/dom/getDataAttr";
import { on as domOn } from "@olmokit/dom/on";
import { setDataAttr } from "@olmokit/dom/setDataAttr";
import { toArray } from "@olmokit/dom/toArray";
import { navigateToMergedParams } from "@olmokit/browser/navigateToMergedParams";
import { navigateWithoutUrlParam } from "@olmokit/browser/navigateWithoutUrlParam";
import {
  getFormElementType,
  getFormElementValue,
  setFormElementValue,
} from "../forms/helpers";
import type { AnyFormHTMLElement } from "../forms/types";
import { Rooter, getJSONdataAttr, getScopedRoot } from "./interface";
import { availableItem } from "./itemversion";

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Item {
  type Model = {
    id: string;
    /**
     * The default value is actually set server side
     * @default 'product'
     */
    type?: string;
    /**
     * A quantity of this item to put in the cart or other usages
     */
    quantity?: number;
    /**
     * An array of property IDs
     */
    properties?: string[];
    /**
     * A dictionary where `key` ise the `property['name']` and `value` is the
     * selected `property['item']['value']`
     */
    params?: Record<string, string>;
    /**
     * Whether the properties should not be editable
     */
    readonlyProperties?: boolean;
    /**
     * The `id` of the item when it is **in the cart**, not the same as the item's `id`...
     */
    cartitemid?: string;
  };

  type Property = {
    $input: AnyFormHTMLElement;
    type: ReturnType<typeof getFormElementType>;
    required: boolean;
  };

  type Instance = {
    $quantity: Partial<Property>;
    $properties: Record<string, Property>;
    data: Item.Model;
  };

  type Args = Instance;

  type Events = {
    change: Args;
    valid: Args;
    invalid: Args;
  };

  type Options = {
    syncUrl?: boolean;
    syncUrlClear?: string;
  };

  type Length = number;

  type Index = number;

  type Product = string | null;

  type Typepage = string | null;
}

const ATTR_ITEM_DATA = "item";
const ATTR_ITEM_ID = "item-id";
const ATTR_ITEM_PROPERTY = "item-property";
const ATTR_ITEM_QUANTITY = "item-quantity";
const ATTR_ITEM_LINK = "item-link";

/**
 * Loop through each Item marked with the `data-item-id=""` attribute and run the
 * given callback.
 */
export function eachItem(callback: ($item: HTMLElement) => any) {
  const $elements = toArray(
    $$(`[data-${ATTR_ITEM_ID}]`)
  ) as unknown as HTMLElement[];
  $elements.forEach(callback);
  return $elements;
}

/**
 * Loop through each Item with the given id, marked with the `data-item-id=""`
 * attribute and run the given callback.
 */
export function eachItemWithId(
  id: string,
  callback: ($item: HTMLElement) => any
) {
  const $elements = toArray(
    $$(`[data-${ATTR_ITEM_ID}="${id}"]`)
  ) as unknown as HTMLElement[];
  $elements.forEach(callback);
  return $elements;
}

/**
 * Get item data as object
 *
 * @param {T} [additionalData={}] Custom additional data to append
 */
export const getItemData = <T extends {}>(
  $item: HTMLElement,
  additionalData: T = {} as T
): Item.Model & T => {
  return {
    ...getJSONdataAttr<Item.Model>($item, ATTR_ITEM_DATA),
    ...additionalData,
  };
};

export const { emit: itemEmit, on: itemOn } = Emitter<Item.Events>("item");

/**
 * Item abstraction
 */
export function Item(
  $root: HTMLElement,
  options: Item.Options,
  product: Item.Product,
  length: Item.Length,
  index: Item.Index,
  typepage: Item.Typepage
) {
  if (!$root) {
    if (process.env["NODE_ENV"] !== "production") {
      console.warn(
        `[@olmokit/core/helpers/item] Initialised Item on unexisting DOM element`,
        $root
      );
    }
    return;
  }
  if (!getDataAttr($root, ATTR_ITEM_DATA)) {
    if (process.env["NODE_ENV"] !== "production") {
      console.warn(
        `[@olmokit/core/helpers/item] Initialised Item on DOM element without 'data-${ATTR_ITEM_DATA}'`,
        $root
      );
    }
    return;
  }

  const { syncUrl, syncUrlClear } = options || {};
  const { readonlyProperties } = getItemData($root);
  const $properties: Record<string, Item.Property> = {};
  let $quantity: Partial<Item.Property> = {};

  // Inital instance state
  const instance = {
    $properties,
    $quantity,
    data: {} as Item.Model,
  };

  // before intialising the properties and quantity hydrate the input values
  if (syncUrl) {
    hydrateValuesFromUrl();
  }

  // build maps and watch interactive item data
  if (!readonlyProperties) {
    initProperties();
  }
  initQuantity();

  // the instance is immediately updated here
  update(null, false, length, index);

  /**
   * Iterate over all elements controlling an item's property
   */
  function eachPropertyElement(callback: ($el: AnyFormHTMLElement) => void) {
    const $elements = toArray(
      $$(`[data-${ATTR_ITEM_PROPERTY}]`, $root)
    ) as unknown as AnyFormHTMLElement[];
    $elements.forEach(callback);
  }

  /**
   * Iterate over all elements controlling item's quantity
   */
  function eachQuantityElement(callback: ($el: AnyFormHTMLElement) => void) {
    const $elements = toArray(
      $$(`[data-${ATTR_ITEM_QUANTITY}]`, $root)
    ) as unknown as AnyFormHTMLElement[];
    $elements.forEach(callback);
  }

  /**
   * Iterate over all item's links
   */
  function eachLinkElement(callback: ($el: HTMLAnchorElement) => void) {
    const $elements = toArray(
      $$(`[data-${ATTR_ITEM_LINK}]`, $root)
    ) as unknown as HTMLAnchorElement[];
    $elements.forEach(callback);
  }

  /**
   * Watch item properties
   */
  function initProperties() {
    eachPropertyElement(($input) => {
      const propertyId = getDataAttr($input, ATTR_ITEM_PROPERTY);

      $properties[propertyId] = {
        $input,
        type: getFormElementType($input),
        required: $input.hasAttribute("required"),
      };

      domOn($input, "change", (event) => {
        handleChange(event as InputEvent);
      });
    });

    instance.$properties = $properties;
  }

  /**
   * Watch item quantity
   */
  function initQuantity() {
    eachQuantityElement(($input) => {
      $quantity = {
        $input,
        type: getFormElementType($input),
        required: $input.hasAttribute("required"),
      };
      domOn($input, "change", handleChange);
    });

    instance.$quantity = $quantity;
  }

  /**
   * Handle item live changes
   */
  function handleChange(event: InputEvent) {
    const element = event.target;
    update(element, true);
    itemEmit("change", instance);
  }

  /**
   * Get item properties map
   *
   * From this we can derive the `Item.Model["params"]` too.
   */
  function getPropertiesMap() {
    const propertiesMap: Record<string, string> = {};

    eachPropertyElement(($input) => {
      const value = getFormElementValue($input);
      if (value) {
        propertiesMap[$input.name] = value;
      }
    });

    return propertiesMap;
  }

  /**
   * Get item quantity value
   */
  function getQuantityValue() {
    if ($quantity.$input && $quantity.$input.value) {
      return parseInt($quantity.$input.value, 10);
    }
    return;
  }

  /**
   * Set item data value on DOM appropriate data attribute by reading each
   * property element and its value and merging with existing data.
   *
   * Quantity is optional, hence we do not assume here a default value,
   * we manage that in the PHP endpoint
   */
  function setDataOnElement(element?: HTMLElement | null, interact = false) {
    const current = getItemData($root);
    const quantity = getQuantityValue();
    const data = { ...current };

    if (!readonlyProperties) {
      resetPropertyExceptPivot(element, interact);
      const propertiesMap = getPropertiesMap();

      data.properties = Object.keys(propertiesMap).map((k) => propertiesMap[k]);
      data.params = propertiesMap;
    }

    if (!isUndefined(quantity)) {
      data.quantity = quantity;
      data.params.quantity = quantity + "";
    }

    instance.data = data;

    setDataAttr($root, ATTR_ITEM_DATA, JSON.stringify(data));

    return data;
  }

  /**
   * Validate all properties and quantity
   */
  function validate(): Item.Property[] {
    const errors = [];

    // check required properties
    for (const propertyId in $properties) {
      const $property = $properties[propertyId];
      const value = getFormElementValue($property.$input);
      if ($property.required && !value) {
        errors.push($property);
      }
    }

    // check required quantity
    if ($quantity.required && !parseInt($quantity.$input.value, 10)) {
      errors.push($quantity);
    }

    return errors;
  }

  /**
   * Make the button add to cart available
   */
  function validateAddtoCart(lenght: number, index: number, interact: boolean) {
    const errors = validate();

    // check quantity in the store if there is no error in attribute setup
    if (!errors.length) {
      // const data = setDataOnElement();
      const data = getItemData($root);
      return availableItem(product, data, lenght, index, interact, typepage);
    }

    return null;
  }

  /**
   * Reset every property except the pivot one
   */
  function resetPropertyExceptPivot(current, interact) {
    if (interact) {
      const allProperties = $$(`[data-${ATTR_ITEM_PROPERTY}]`, $root);
      forEach(allProperties, (element) => {
        if (element.name != syncUrlClear && current.name == syncUrlClear) {
          element.value = "";
        }
      });
    }
  }

  function resetUrlParams(syncUrlClear) {
    const allparams = getUrlQueryParams();
    for (const [key] of Object.entries(allparams)) {
      if (key != syncUrlClear) {
        navigateWithoutUrlParam(key);
      }
    }
  }

  /**
   * Update
   *
   * It reads the state from the DOM and update the data attribute on the `$root`
   * Item element. It checks the validity of the current configuration and emits
   * the approriate events. It also updates the URL, the item links for
   * deeplinking and it disables the CartAdd btn if the validation fails.
   */
  function update(
    element?: HTMLElement | null,
    interact = false,
    length = 0,
    index = 0
  ) {
    const errors = validate();
    const isValid = !errors.length;
    const data = setDataOnElement(element, interact);
    const addToCart = validateAddtoCart(length, index, interact);

    if (interact && syncUrlClear) {
      if (syncUrlClear != element?.name) {
        updateUrl(data.params, element);
      } else {
        resetUrlParams(syncUrlClear);
        updateUrl(data.params);
      }
    }

    if (!interact && syncUrl) {
      updateUrl(data.params);
    }

    eachLinkElement(($link) => {
      updateLinkParams($link, data.params);
    });

    /**
     * *** fabs made a change ***
     * I changed this condition to the one below cause I added this one validateAddtoCart()
     * which wait the result if validate() and makes a control to the available key (store quantity)
     * and make the addToCart button active
     */

    // if (isValid) {
    //   itemEmit("valid", instance);

    //   $each(
    //     `[data-cart-btn="add"]`,
    //     ($btn: HTMLButtonElement) => {
    //       $btn.disabled = false;
    //     },
    //     $root
    //   );

    // } else {
    //   itemEmit("invalid", instance);

    //   $each(
    //     `[data-cart-btn="add"]`,
    //     ($btn: HTMLButtonElement) => {
    //       $btn.disabled = true;
    //     },
    //     $root
    //   );
    // }

    /**
     * Check if all attributes are set and display the label and the addtocart
     * watch out, the label is not desplayed at first, like the addtocart btn is disabled
     * so just if the condition is false them become active
     *
     * If the attributes are not set correctly the label does not appera
     */
    if (!isValid) {
      $each(
        `[data-available-label]`,
        ($label: HTMLLabelElement) => {
          $label.style.display = "none";
        },
        $root
      );
    }
    if (addToCart === false) {
      itemEmit("valid", instance);

      $each(
        `[data-cart-btn="add"]`,
        ($btn: HTMLButtonElement) => {
          $btn.disabled = false;
        },
        $root
      );
      /**
       * if exist make the label Available disapprear
       */
      $each(
        `[data-available-label]`,
        ($label: HTMLLabelElement) => {
          $label.style.display = "none";
        },
        $root
      );
    } else if (addToCart === true || addToCart === null) {
      itemEmit("invalid", instance);

      $each(
        `[data-cart-btn="add"]`,
        ($btn: HTMLButtonElement) => {
          $btn.disabled = true;
        },
        $root
      );
      /**
       * if exist make the label Available apprear
       */
      if (isValid) {
        $each(
          `[data-available-label]`,
          ($label: HTMLLabelElement) => {
            $label.style.display = "block";
          },
          $root
        );
      }
    }

    return data;
  }

  /**
   * Hydrate values from URL
   *
   * It reads the current query parameters and set the input values whose name
   * matches the query param keys/value pairs
   *
   */
  function hydrateValuesFromUrl() {
    const params = getUrlQueryParams();

    if (!readonlyProperties) {
      eachPropertyElement(($input) => {
        const correspondingParam = params[$input.name];
        if (!isUndefined(correspondingParam)) {
          setFormElementValue($input, correspondingParam);
        }
      });
    }

    eachQuantityElement(($input) => {
      const correspondingParam = params[$input.name];
      if (!isUndefined(correspondingParam)) {
        setFormElementValue($input, correspondingParam);
      }
    });
  }

  /**
   * Update the URL with the current item state
   *
   * It merges exsiting query params with the new one to prevent loosing special
   * and foreign query params like analytics campaign's ones and alike.
   * It uses history `replace`, not adding records to the history stack.
   */
  function updateUrl(
    params: Record<string, string>,
    element?: HTMLInputElement
  ) {
    const value = element ? element.value : null;
    if (value == "") {
      navigateWithoutUrlParam(element?.name);
    } else {
      navigateToMergedParams(params, true);
    }
  }

  return {
    validate,
    ...instance,
  };
}

/**
 * Init Item on all elements with `data-item-id=""`
 */
export function initItems<TRoot extends HTMLElement = HTMLElement>(
  typepage?: Item.Typepage,
  rooter?: Rooter<TRoot>,
  options?: Item.Options,
  product?: Item.Product
) {
  const $items = $$(`[data-${ATTR_ITEM_ID}]`, getScopedRoot<TRoot>(rooter));
  forEach($items, ($item, index) => {
    Item($item, options, product, $items.length, index, typepage);
  });
}
