/**
 * Lazy loading
 *
 * @file
 *
 * - @see https://github.com/verlok/lazyload Options documentation
 * - Consider also using @see https://github.com/aFarkas/lazysizes
 *
 * Polyfill of intersection observer?
 * @see https://github.com/verlok/lazyload#to-polyfill-or-not-to-polyfill-intersectionobserver
 */
// import LazyLoad from "vanilla-lazyload";
import { $all } from "@olmokit/dom/$all";
import { addClass } from "@olmokit/dom/addClass";
import { forEach } from "@olmokit/dom/forEach";
import { getDataAttr } from "@olmokit/dom/getDataAttr";
import { off } from "@olmokit/dom/off";
import { on } from "@olmokit/dom/on";
import { removeClass } from "@olmokit/dom/removeClass";
import { setDataAttr } from "@olmokit/dom/setDataAttr";
import { toArray } from "@olmokit/dom/toArray";
import "./index.scss";

export const lazyClass = "lazy";

export const lazyClassSuccess = "lazy-success";

export const lazyClassError = "lazy-error";

export const lazyClassLoading = "is-loading";

const runningOnBrowser = typeof window !== "undefined";

const isBot =
  (runningOnBrowser && !("onscroll" in window)) ||
  (typeof navigator !== "undefined" &&
    /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent));

const supportsIntersectionObserver =
  runningOnBrowser && "IntersectionObserver" in window;

const defaultSettings: LazyLoadOptions = {
  selector: "." + lazyClass,
  container: isBot || runningOnBrowser ? document : null,
  threshold: 300,
  thresholds: null,
  classLoading: lazyClassLoading,
  classLoaded: lazyClassSuccess,
  classError: lazyClassError,
  loadDelay: 0,
  autoUnobserve: true,
  onenter: null,
  onexit: null,
  onreveal: null,
  onloaded: null,
  onerror: null,
  onfinish: null,
  useNative: false,
};

const processedDataName = "was-processed";
const timeoutDataName = "ll-timeout";
const trueString = "true";

const resetWasProcessedData = (element: HTMLElement) =>
  setDataAttr(element, processedDataName, null);

export const setWasProcessedData = (element: HTMLElement) =>
  setDataAttr(element, processedDataName, trueString);

export const getWasProcessedData = (element: HTMLElement) =>
  getDataAttr(element, processedDataName) === trueString;

const setTimeoutData = (element: HTMLElement, value: null | string) =>
  setDataAttr(element, timeoutDataName, value);

const getTimeoutData = (element: HTMLElement) =>
  getDataAttr(element, timeoutDataName);

const purgeProcessedElements = (elements: HTMLElement[]) => {
  return elements.filter((element) => !getWasProcessedData(element));
};

const purgeOneElement = (
  elements: HTMLElement[],
  elementToPurge: HTMLElement,
) => {
  return elements.filter((element: HTMLElement) => element !== elementToPurge);
};

const safeCallback = <TScope, TCallback extends (...args: any) => any>(
  callback?: null | TCallback,
  scope?: TScope,
  ...args: Parameters<TCallback>
) => {
  if (!callback) {
    return;
  }

  callback.call(scope, args);
};

const updateLoadingCount = (instance: LazyLoadInstance, plusMinus: number) => {
  instance._l += plusMinus;
  if (instance._e.length === 0 && instance._l === 0) {
    safeCallback(instance._s.onfinish, instance, instance);
  }
};

const getSourceTags = (parentTag: HTMLElement) => {
  const sourceTags: HTMLElement[] = [];
  for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
    if (childTag.tagName === "SOURCE") {
      sourceTags.push(childTag as HTMLElement);
    }
  }
  return sourceTags;
};

const setAttributeIfValue = (
  element: HTMLElement,
  attrName: string,
  value?: null | string,
) => {
  if (!value) {
    return;
  }
  element.setAttribute(attrName, value);
  return true;
};

const setImageAttributes = (element: HTMLElement) => {
  setAttributeIfValue(element, "sizes", getDataAttr(element, "sizes"));
  // <source src> with a <picture> parent is invalid and therefore ignored.
  // Please use <source srcset> instead.
  // if (!setAttributeIfValue(element, "srcset", getDataAttr(element, "src"))) {
  //   setAttributeIfValue(element, "src", getDataAttr(element, "src"));
  // }
  setAttributeIfValue(element, "srcset", getDataAttr(element, "srcset"));
  setAttributeIfValue(element, "src", getDataAttr(element, "src"));
};

export const setSourcesImg = (element: HTMLElement) => {
  const parent = element.parentNode as HTMLElement;

  if (parent && parent.tagName === "PICTURE") {
    const sourceTags = getSourceTags(parent);
    sourceTags.forEach((sourceTag) => {
      setImageAttributes(sourceTag);
    });
  }

  setImageAttributes(element);
};

const setSourcesIframe = (element: HTMLIFrameElement) => {
  setAttributeIfValue(element, "src", getDataAttr(element, "src"));
};

const setSourcesVideo = (element: HTMLVideoElement) => {
  const sourceTags = getSourceTags(element);
  sourceTags.forEach((sourceTag) => {
    setAttributeIfValue(sourceTag, "src", getDataAttr(sourceTag, "src"));
  });
  setAttributeIfValue(element, "poster", getDataAttr(element, "poster"));
  setAttributeIfValue(element, "src", getDataAttr(element, "src"));
  element.load();
};

const setSourcesBgImage = (element: HTMLElement) => {
  const srcDataValue = getDataAttr(element, "src");
  const bgDataValue = getDataAttr(element, "bg");

  if (srcDataValue) {
    element.style.backgroundImage = `url("${srcDataValue}")`;
  }

  if (bgDataValue) {
    element.style.backgroundImage = bgDataValue;
  }
};

const setSourcesFunctions = {
  IMG: setSourcesImg,
  IFRAME: setSourcesIframe,
  VIDEO: setSourcesVideo,
} as const;

const setSources = (element: HTMLElement, instance: LazyLoadInstance) => {
  const tagName = element.tagName as keyof typeof setSourcesFunctions;
  const setSourcesFunction = setSourcesFunctions[tagName];
  if (setSourcesFunction) {
    // @ts-expect-error FIXME: core types
    setSourcesFunction(element);
    updateLoadingCount(instance, 1);
    instance._e = purgeOneElement(instance._e, element);
    return;
  }
  setSourcesBgImage(element);
};

const genericLoadEventName = "load";
const mediaLoadEventName = "loadeddata";
const errorEventName = "error";

const addEventListeners = (
  element: HTMLElement,
  loadHandler: (ev: Event) => void,
  errorHandler: (ev: Event) => void,
) => {
  on(element, genericLoadEventName, loadHandler);
  on(element, mediaLoadEventName, loadHandler);
  on(element, errorEventName, errorHandler);
};

const removeEventListeners = (
  element: HTMLElement,
  loadHandler: (ev: Event) => void,
  errorHandler: (ev: Event) => void,
) => {
  off(element, genericLoadEventName, loadHandler);
  off(element, mediaLoadEventName, loadHandler);
  off(element, errorEventName, errorHandler);
};

const eventHandler = function (
  event: Event,
  success: boolean,
  instance: LazyLoadInstance,
) {
  const options = instance._s;
  const className = success ? options.classLoaded : options.classError;
  const callback = success ? options.onloaded : options.onerror;
  const element = event.target as HTMLElement;

  removeClass(element, options.classLoading);
  addClass(element, className);
  if (!success && element instanceof HTMLImageElement) element.alt = "";
  safeCallback(callback, instance, element, instance);

  updateLoadingCount(instance, -1);
};

const addOneShotEventListeners = (
  element: HTMLElement,
  instance: LazyLoadInstance,
) => {
  const loadHandler = (event: Event) => {
    eventHandler(event, true, instance);
    removeEventListeners(element, loadHandler, errorHandler);
  };
  const errorHandler = (event: Event) => {
    eventHandler(event, false, instance);
    removeEventListeners(element, loadHandler, errorHandler);
  };
  addEventListeners(element, loadHandler, errorHandler);
};

const managedTags = ["IMG", "IFRAME", "VIDEO"];

const onEnter = (
  element: HTMLElement,
  entry: IntersectionObserverEntry,
  instance: LazyLoadInstance,
) => {
  const options = instance._s;
  safeCallback(options.onenter, instance, element, entry, instance);
  if (!options.loadDelay) {
    revealAndUnobserve(element, instance);
    return;
  }
  delayLoad(element, instance);
};

const revealAndUnobserve = (
  element: HTMLElement,
  instance: LazyLoadInstance,
) => {
  const observer = instance._O;
  revealElement(element, instance);
  if (observer && instance._s.autoUnobserve) {
    observer.unobserve(element);
  }
};

const onExit = (
  element: HTMLElement,
  entry: IntersectionObserverEntry,
  instance: LazyLoadInstance,
) => {
  const options = instance._s;
  safeCallback(options.onexit, instance, element, entry, instance);
  if (!options.loadDelay) {
    return;
  }
  cancelDelayLoad(element);
};

const cancelDelayLoad = (element: HTMLElement) => {
  const timeoutId = getTimeoutData(element);
  if (!timeoutId) {
    return; // do nothing if timeout doesn't exist
  }
  clearTimeout(timeoutId);
  setTimeoutData(element, null);
};

const delayLoad = (element: HTMLElement, instance: LazyLoadInstance) => {
  const loadDelay = instance._s.loadDelay;
  let timeoutId = getTimeoutData(element);
  if (timeoutId) {
    return; // do nothing if timeout already set
  }
  // @ts-expect-error FIXME: core types
  timeoutId = setTimeout(function () {
    revealAndUnobserve(element, instance);
    cancelDelayLoad(element);
  }, loadDelay);
  setTimeoutData(element, timeoutId);
};

const revealElement = (
  element: HTMLElement,
  instance: LazyLoadInstance,
  force?: boolean,
) => {
  const options = instance._s;
  if (!force && getWasProcessedData(element)) {
    return; // element has already been processed and force wasn't true
  }
  if (managedTags.indexOf(element.tagName) > -1) {
    addOneShotEventListeners(element, instance);
    addClass(element, options.classLoading);
  }
  setSources(element, instance);
  setWasProcessedData(element);
  safeCallback(options.onreveal, instance, element, instance);
  // safeCallback(options.callback_set, element, instance);
};

const isIntersecting = (entry: IntersectionObserverEntry) =>
  entry.isIntersecting || entry.intersectionRatio > 0;

const getObserverSettings = (options: LazyLoadOptions) => ({
  root: options.container === document ? null : options.container,
  rootMargin: options.thresholds || options.threshold + "px",
});

const setObserver = (instance: LazyLoadInstance) => {
  if (!supportsIntersectionObserver) {
    return null;
  }
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) =>
      isIntersecting(entry)
        ? onEnter(entry.target as HTMLElement, entry, instance)
        : onExit(entry.target as HTMLElement, entry, instance),
    );
  }, getObserverSettings(instance._s));
};

const nativeLazyTags = ["IMG", "IFRAME"];

const shouldUseNative = (options: LazyLoadOptions) =>
  options.useNative && "loading" in HTMLImageElement.prototype;

const loadAllNative = (instance: LazyLoadInstance) => {
  instance._e.forEach((element: HTMLElement) => {
    if (nativeLazyTags.indexOf(element.tagName) === -1) {
      return;
    }
    element.setAttribute("loading", "lazy");
    revealElement(element, instance);
  });
};

const getElements = (
  options: LazyLoadOptions,
  elements?: NodeListOf<HTMLElement>,
) =>
  purgeProcessedElements(
    toArray(elements || $all(options.selector, options.container)),
  );

const retryLazyLoad = (instance: LazyLoadInstance) => {
  const options = instance._s;
  const errorElements = $all("." + options.classError, options.container);
  forEach(errorElements, (element: HTMLElement) => {
    removeClass(element, options.classError);
    resetWasProcessedData(element);
  });
  instance.update();
};

const setOnlineCheck = (instance: LazyLoadInstance) => {
  if (!runningOnBrowser) {
    return;
  }

  on(window, "online", () => {
    retryLazyLoad(instance);
  });
};

type LazyLoadInstance = {
  _s: LazyLoadOptions;
  _e: HTMLElement[];
  _l: number;
  _O: IntersectionObserver | null;
  update: (elements?: HTMLElement[]) => void;
};

export type LazyLoadOptions = {
  /** @default ".lazy" */
  selector: string;
  container: null | Document | HTMLElement;
  /** @default 300 */
  threshold: number;
  /** @default null */
  thresholds: any;
  /** @default "is-loading" */
  classLoading: string;
  /** @default "lazy-success" */
  classLoaded: string;
  /** @default "lazy-error" */
  classError: string;
  /** @default 0 */
  loadDelay: number;
  /** @default true */
  autoUnobserve: boolean;
  /** @default null */
  onenter:
    | null
    | ((
        element: HTMLElement,
        entry: IntersectionObserverEntry,
        instance: LazyLoadInstance,
      ) => void);
  /** @default null */
  onexit:
    | null
    | ((
        element: HTMLElement,
        entry: IntersectionObserverEntry,
        instance: LazyLoadInstance,
      ) => void);
  /** @default null */
  onreveal: null | ((element: HTMLElement, instance: LazyLoadInstance) => void);
  /** @default null */
  onloaded: null | ((element: HTMLElement, instance: LazyLoadInstance) => void);
  /** @default null */
  onerror: null | ((element: HTMLElement, instance: LazyLoadInstance) => void);
  /** @default null */
  onfinish: null | ((instance: LazyLoadInstance) => void);
  /** @default false */
  useNative: boolean;
};

/**
 * Lazyload
 *
 * Very similar to https://github.com/verlok/lazyload
 */
export class LazyLoad {
  /**
   * Settings/options
   */
  _s: LazyLoadOptions;
  /**
   * HTML elements to be treeated as lazy
   */
  _e: HTMLElement[];
  /**
   * Loading count
   */
  _l: number;
  /**
   * The `IntersectionObserver` instance
   */
  _O: IntersectionObserver | null;

  constructor(
    custom: Partial<LazyLoadOptions> = {},
    elements?: NodeListOf<HTMLElement>,
  ) {
    this._s = {
      ...defaultSettings,
      ...custom,
    };
    this._e = [];
    this._l = 0;
    this._O = setObserver(this as LazyLoadInstance);
    this.update(elements);
    setOnlineCheck(this as LazyLoadInstance);
  }

  update(elements?: NodeListOf<HTMLElement>) {
    const { _s: options, _O: observer } = this;

    this._e = getElements(options, elements);
    if (isBot || !this._O) {
      this.loadAll();
      return;
    }
    if (shouldUseNative(options)) {
      loadAllNative(this as LazyLoadInstance);
      this._e = getElements(options, elements);
    }

    if (observer) {
      this._e.forEach((element: HTMLElement) => {
        observer.observe(element);
      });
    }
  }

  destroy() {
    const { _O: observer } = this;

    if (observer) {
      this._e.forEach((element: HTMLElement) => {
        observer.unobserve(element);
      });
      this._O = null;
    }
    // this._e = null;
    // this._s = null;
  }

  load(element: HTMLElement, force?: boolean) {
    revealElement(element, this as LazyLoadInstance, force);
  }

  loadAll() {
    this._e.forEach((element: HTMLElement) => {
      revealAndUnobserve(element, this as LazyLoadInstance);
    });
  }
}

// autoinit
// new LazyLoad();

export default LazyLoad;
