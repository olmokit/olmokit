// FIXME: somehow the $$ deeper import does not work
import { $$ } from "@olmokit/dom";
import forEach from "@olmokit/dom/forEach";
import isNodeList from "@olmokit/dom/isNodeList";

/**
 * Base component class to extend, it makes sure that the root selector
 * is in the page before initializing the component.
 *
 * @class Base
 */
export class BaseComponent {
  /**
   * Default static root selector that determines the root element where the
   * component is mounted
   *K
   */
  rootSelector = "";

  /**
   * Default static options for the component.
   * It always includes a styles object where we can make use of sass variables.
   * Pass them during instantiation like so:
   *
   * ```js
   * import styles from "./index.scss"
   *
   * new MyComponent(".myselector", { styles })
   * ```
   */
  defaults = {
    styles: {},
  };

  options: object;

  /**
   * @type {HTMLElement}
   */
  root: null | HTMLElement;

  /**
   * Base component constructor
   */
  constructor(selectorOrElement: string | HTMLElement, customOptions = {}) {
    this.options = {
      ...this.defaults,
      ...customOptions,
    };
    this.root = null;

    if (!selectorOrElement && !this.rootSelector) {
      return;
    }

    // the order of the following conditions matters because we can both have
    // a string selector that when recursively instantiate calls this class
    // both with the rootSelector and with a HTMLelement/NodeList. We give
    // priority to the latter

    // initialised with HTMLElement
    if (selectorOrElement instanceof HTMLElement) {
      this.root = selectorOrElement;
      if (selectorOrElement) {
        this.created();
        this.mounted();
      }
    }
    // initialised with NodeList
    else if (isNodeList(selectorOrElement)) {
      if (selectorOrElement.length) {
        // @ts-expect-error components types
        forEach<HTMLElement>(selectorOrElement, (element) => {
          new BaseComponent(element);
        });
      }
    }
    // initialised with string selector
    else if (typeof selectorOrElement === "string" || this.rootSelector) {
      const elements = $$(selectorOrElement || this.rootSelector);

      if (isNodeList(elements) && elements.length) {
        forEach(elements, (element) => {
          // @ts-expect-error components types
          new this.constructor(element);
        });
      }
    }
  }

  /**
   * Method to override in subclasses
   * @abstract
   */
  created() {
    return;
  }

  /**
   * Method to override in subclasses
   * @abstract
   */
  mounted() {
    return;
  }

  /**
   * Method to override in subclasses
   * @abstract
   */
  destroyed() {
    return;
  }
}

export default BaseComponent;
