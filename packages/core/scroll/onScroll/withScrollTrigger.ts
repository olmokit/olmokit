import ScrollTrigger from "@terwanerik/scrolltrigger";
import { isFunction } from "@olmokit/utils/isFunction";
import type { OnScroll } from "./types";

/**
 * Singleton ScrollTrigger instance
 */
let trigger: OnScroll.Trigger;

/**
 * Normalise options (custom ones merged with ScrollTrigger ones)
 */
export function normaliseInitialiserOptions(
  custom: OnScroll.InitaliserOptions
): OnScroll.Options {
  let options;

  // if given a function as second parameter shortcut to onin callback, and
  // leave defaults settings for the rest
  if (isFunction(custom)) {
    options = { onin: custom };
  } else {
    options = custom || {};
  }

  // with defaults
  let { onin, onout } = options;
  const { onchange, once = true, offset = {}, toggle = {} } = options;

  // onchange will fire both at in and out callbacks
  if (onchange) {
    onin = onchange;
    onout = onchange;
  }

  if (!toggle.callback) toggle.callback = {};

  // @ts-expect-error FIXME: core scroll types
  return { onin, onout, onchange, once, offset, toggle };
}

/**
 * Init an onScroll action/trigger reusing the same listener singleton
 *
 * It can be called with options as second argument or with a function to
 * defaults to `in` callback behaviour
 *
 * @see https://github.com/terwanerik/ScrollTrigger
 *
 * @type {OnScroll.initaliser}
 */
export const onScroll: OnScroll.Initaliser = (target, custom) => {
  if (!trigger) {
    trigger = new ScrollTrigger();
  }

  // @ts-expect-error FIXME: core scroll types
  const { once, offset, toggle, onin, onout } =
    normaliseInitialiserOptions(custom);

  /**
   * Callback called on `in` (just pass the element as argument as the trigger
   * instance is not very much used in real word scenarios)
   */
  function callbackIn(trigger: OnScroll.Trigger) {
    onin?.(trigger.element);
  }

  /**
   * Callback called on `out` (just pass the element as argument as the trigger
   * instance is not very much used in real word scenarios)
   */
  function callbackOut(trigger: OnScroll.Trigger) {
    onout?.(trigger.element);
  }

  // final ScrollTrigger options to treat based on given options
  const opts = {
    once,
    offset,
    toggle,
  };

  if (onin) {
    opts.toggle.callback.in = callbackIn;
  }
  if (onout) {
    opts.toggle.callback.out = callbackOut;
  }

  trigger.add(target, opts);

  return {
    trigger,
    target,
  };
};
