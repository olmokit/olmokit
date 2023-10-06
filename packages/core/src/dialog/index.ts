import type { ConditionalPick } from "@olmokit/utils";
import { Defer } from "@olmokit/utils/Defer";
import { Emitter } from "@olmokit/utils/Emitter";
import { getUrlQueryParams } from "@olmokit/utils/getUrlQueryParams";
import { isFunction } from "@olmokit/utils/isFunction";
import { isString } from "@olmokit/utils/isString";
import { $ } from "@olmokit/dom/$";
import { addClass } from "@olmokit/dom/addClass";
import { listen } from "@olmokit/dom/listen";
import { off } from "@olmokit/dom/off";
import { on } from "@olmokit/dom/on";
import { removeClass } from "@olmokit/dom/removeClass";
import { setVendorCSS } from "@olmokit/dom/setVendorCSS";
import { navigateToMergedParams } from "@olmokit/browser/navigateToMergedParams";
import { navigateWithoutUrlParam } from "@olmokit/browser/navigateWithoutUrlParam";
import scrollLock, { fillGapsOf } from "../scroll/lock";
import { DIALOG_ATTR_CLOSE } from "./helpers";
import "./index.scss";
import type {
  DialogCreator,
  DialogEvents,
  DialogEventsData,
  DialogHooks, // DialogSkeleton,
  DialogInstance,
  DialogOptions,
} from "./types";

export type {
  DialogOptions,
  DialogInstance,
  DialogCreator,
  DialogEvents,
  DialogEventsData,
  DialogHooks,
  DialogSkeleton,
} from "./types";

/**
 * Dialog instances in memory
 *
 * @internal
 */
const instances: Record<NonNullable<DialogOptions["id"]>, DialogInstance> = {};

/**
 * Dialog, a simple, reusable and extendable dialog function. It only manages
 * standard dialog beahaviour and accesibility.
 *
 * for inspiration @see https://github.com/ghosh/Micromodal
 * TODO: trap focus perhaps with @see https://www.npmjs.com/package/tabbable
 *
 * @param rooter The DOM selector to run the dialog upon, defaults to `".dialog"`
 */
export function Dialog(
  rooter: string | HTMLElement | DialogCreator,
  options: DialogOptions = {},
  hooks: DialogHooks = {},
) {
  const { id } = options;

  if (id && instances[id]) {
    return instances[id];
  }

  const CLASS_LOADING = "is-loading";
  // const EVENT_NAMESPACE = "dialog.";
  const { tpl, rootClass, transition = 300, gaps } = options;
  const { mounted, rendered, opening, opened, closing, closed } = hooks;
  const { emit, on: onEvent } = Emitter<DialogEvents>("dialog");
  let lastActiveElement: Element | null;
  let $root: DialogInstance["$root"];
  let $wrap: DialogInstance["$wrap"];
  let $content: DialogInstance["$content"];
  let $backdrop: HTMLElement;
  let $cage: HTMLElement;
  let willOpen = Defer<boolean>();

  if (isFunction(rooter)) {
    const skeleton = rooter();
    $root = skeleton.$root;
    $backdrop = skeleton.$backdrop;
    $cage = skeleton.$cage;
    $wrap = skeleton.$wrap;
    $content = skeleton.$content;
  } else {
    $root = isString(rooter) ? $(rooter) : rooter;
    if (!$root) {
      return;
    }
    $backdrop = $(".dialogBackdrop", $root);
    $cage = $(".dialogCage", $root);
    $wrap = $(".dialogWrap", $root);
    $content = $(".dialogContent", $root);
  }

  const instance: DialogInstance = {
    id,
    $root,
    $cage,
    $wrap,
    $content,
    willOpen,
    opened: false,
    render,
    open,
    close,
    destroy,
    load,
    loaded,
    on: onEvent,
  };

  if (tpl) {
    render(tpl);
  }
  mountAndBind();

  // maybe save Dialog instance
  if (id) {
    instances[id] = instance;
  }

  /**
   * Mounted, bind event listeners
   */
  function mountAndBind() {
    if (rootClass) {
      $root.className += " " + rootClass;
    }

    on($root, "touchstart", handleClick);
    on($root, "click", handleClick);
    on(document, "keydown", handleKeydown);

    setVendorCSS($backdrop, "transitionDuration", `${transition}ms`);
    setVendorCSS($wrap, "transitionDuration", `${transition}ms`);

    addClass($root, "has-init");

    if (mounted) mounted(instance);
  }

  /**
   * Populate dialog content with HTML, it calls the `rendered` hook
   *
   * @param silent Useful when emptying the dialog content and don't want the `rendered` callback to be called
   */
  function render(content: string, silent?: boolean) {
    $content.innerHTML = content;

    if (rendered && !silent) rendered(instance);
  }

  /**
   * Handle click
   *
   * @private
   */
  function handleClick(event: MouseEvent | TouchEvent) {
    const el = event.target as HTMLElement;
    if (el.hasAttribute(`data-${DIALOG_ATTR_CLOSE}`)) {
      close(event);
      event.preventDefault();
    }
  }

  /**
   * Handle keydown
   *
   * @private
   */
  function handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === 27) close(event);
    // if (event.keyCode === 9) maintainFocus(event)
  }

  /**
   * Destroy
   *
   * @public
   */
  function destroy() {
    off($root, "touchstart", handleClick);
    off($root, "click", handleClick);
    off(document, "keydown", handleKeydown);
    $root.parentNode?.removeChild($root);
  }

  /**
   * Close
   *
   * @public
   */
  function close<TData extends DialogEventsData>(
    _event?: Event,
    customData?: TData,
  ) {
    if (closing) closing(instance, customData);

    emit("closing", customData);

    udpdateDeeplink(instance.id, false);

    if (lastActiveElement) {
      // @ts-expect-error FIXME: core types dialog
      lastActiveElement?.focus();
    }
    removeClass($root, "is-in");

    instance.opened = false;

    setTimeout(() => {
      $root.style.display = "none";

      willOpen = Defer();
      instance.willOpen = willOpen;

      // destroy only if an id has not been set on instantiation, otherwise we
      // will keep the dialog and maybe reuse it the next time
      if (id && !instances[id]) {
        destroy();
      }

      scrollLock.enable($cage);

      if (closed) closed(instance, customData);
      emit("closed", customData);
    }, transition);

    return instance;
  }

  /**
   * Open
   *
   * @public
   */
  function open<TData extends DialogEventsData>(customData?: TData) {
    lastActiveElement = document.activeElement;

    $root.style.display = "block";

    setTimeout(() => {
      addClass($root, "is-in");
    }, 3);

    if (opening) opening(instance, customData);

    emit("opening", customData);

    udpdateDeeplink(instance.id, true);

    if (gaps) fillGapsOf(gaps);
    scrollLock.disable($cage);

    setTimeout(() => {
      if (opened) opened(instance, customData);
      instance.opened = true;
      emit("opened", customData);

      willOpen.resolve();
    }, transition + 3);

    return instance;
  }

  // /**
  //  * Event emitter function
  //  *
  //  * @param {string} name
  //  * @param {any} [data]
  //  */
  // function emit(name, data) {
  //   emitEvent(`${EVENT_NAMESPACE}${name}`, {
  //     instance,
  //     data,
  //   });
  // }

  /**
   * Start loading async content
   *
   * @public
   */
  function load() {
    addClass($root, CLASS_LOADING);
  }

  /**
   * End loading async content
   *
   * @public
   */
  function loaded() {
    removeClass($root, CLASS_LOADING);
  }

  return instance;
}

/**
 * Update url parameter for deeplinking
 */
export function udpdateDeeplink(queryParam?: string, opened?: boolean) {
  if (queryParam) {
    if (opened) {
      navigateToMergedParams({ [queryParam]: true }, true);
    } else {
      navigateWithoutUrlParam(queryParam, true);
    }
  }
}

/**
 * Basic auto intialisation of dialogs, it cactch links with the right data
 * attribute and prompt the dialog, same on load based on current query params
 *
 * @param method The instance method name to use to open the the dialog, this allows implementers to easily override the open behaviour
 */
export function dialogInit<TCustom>(
  instance: DialogInstance<TCustom>,
  method: ConditionalPick<DialogInstance<TCustom>, (a?: any) => any>,
) {
  method = method || "open";
  const queryParams = getUrlQueryParams();

  if (instance.id) {
    listen("click", `[data-${instance.id}]`, handleClick);

    // open immediately if deeplinked
    if (queryParams[instance.id]) {
      // @ts-expect-error FIXME: dialog types
      instance[method]();
    }
  }

  /**
   * Handle click, hijack auth links to auth dialog
   */
  function handleClick(event: MouseEvent) {
    event.preventDefault();
    // @ts-expect-error FIXME: dialog types
    instance[method](event.target);
  }
}

export default Dialog;
