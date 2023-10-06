import { isFunction } from "@olmokit/utils/isFunction";
import { isString } from "@olmokit/utils/isString";
import { $ } from "@olmokit/dom/$";
import { getDataAttr } from "@olmokit/dom/getDataAttr";

/**
 * The DOM element to use as the root container, usually the "starting point" of
 * a component
 */
export type Rooter<T = HTMLElement> = string | (() => T) | T;

/**
 * Call hook safely (if defined)
 */
export function callHookSafely(
  hooks: Record<string, Function> = {},
  hookName: keyof typeof hooks,
  ...args: any
) {
  if (hooks[hookName]) hooks[hookName](...args);
}

/**
 * Abstraction get a scoped root element
 */
export function getScopedRoot<T extends HTMLElement>(
  rooter?: Rooter<T>,
  root?: string,
): T | null {
  if (isString(rooter)) {
    return root ? $<T>(`${rooter} ${root}`) : $<T>(rooter);
  } else if (isFunction(rooter)) {
    return rooter();
  } else if (rooter) {
    return root ? $<T>(root, rooter) : rooter;
  } else {
    return root ? $<T>(root) : null;
  }
}

/**
 * Get data JSON encoded data attribute on given HTML element
 */
export function getJSONdataAttr<T extends {}>(
  $element: HTMLElement,
  attr: string,
) {
  const attrValue = getDataAttr($element, attr);
  let data = {};

  if (attrValue) {
    try {
      data = JSON.parse(attrValue);
    } catch (e) {
      if (process.env["NODE_ENV"] !== "production") {
        console.warn(
          `[@olmokit/core/helpers/interface] Malformed 'data-${attr}' attribute on DOM element`,
          $element,
        );
      }
    }
  }

  return data as T;
}

/**
 * Run the given callback on each targeted element
 */
//  function eachTarget(
//   target: string | HTMLElement | NodeList;,
//   callback: ($el: HTMLElement) => any
// ) {
//   if (isString(target)) {
//     $each(target, callback);
//   } else if (isNodeList(target)) {
//     forEach(target, callback);
//   } else if (target) {
//     callback(target);
//   }
// }
