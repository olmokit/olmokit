import { uuid } from "@olmokit/utils";
import { $ } from "@olmokit/dom/$";
import { emitEvent } from "@olmokit/dom/emitEvent";
import { getHeight } from "@olmokit/dom/getHeight";
import { off } from "@olmokit/dom/off";
import { on } from "@olmokit/dom/on";
import "../../../polyfills/closest";
import { scrollTo } from "../scrollTo";

export type SmoothScrollOptions = {
  selector: string;
  header: string;
  speed: number;
  offset: number;
  updateURL: boolean;
  popstate: boolean;
  events: boolean;
  focus?: boolean;
};

type SmoothScrollHistoryState = {
  smoothScroll?: string;
  anchor?: HTMLAnchorElement | string | number;
};

const defaults = {
  selector: "[data-smooth]",
  header: "",
  speed: 600,
  offset: 0,
  updateURL: true,
  popstate: true,
  events: false,
};

function setHistory(options: SmoothScrollOptions, instanceId: string) {
  if (!history.replaceState || !options.updateURL || history.state) return;

  const hash = window.location.hash || "";

  // Set a default history
  history.replaceState(
    {
      smoothScroll: instanceId,
      anchor: hash ? hash : window.pageYOffset,
    } satisfies SmoothScrollHistoryState,
    document.title,
    hash ? hash : window.location.href
  );
}

/**
 * Update the URL
 * @param anchor
 * @param options
 */
function updateURL(
  anchor: HTMLElement | number,
  options: SmoothScrollOptions,
  instanceId: string
) {
  if (typeof anchor === "number") return;

  // verify that pushState is supported and the updateURL option is enabled
  if (!history.pushState || !options.updateURL) return;

  // update URL
  history.pushState(
    { smoothScroll: instanceId, anchor: anchor.id },
    document.title,
    anchor === document.documentElement ? "#top" : "#" + anchor.id
  );
}

/**
 * @borrows [cferdinandi/smooth-scroll](https://github.com/cferdinandi/smooth-scroll)
 */
export function smoothScroll(options: Partial<SmoothScrollOptions> = {}) {
  let settings: SmoothScrollOptions;
  let anchor: HTMLElement | number | null;
  let toggle: HTMLAnchorElement | null;
  let headerEl: HTMLElement | null;
  const instanceId = uuid();

  /**
   * Cancel a scroll-in-progress
   */
  function cancel(
    noEvent: boolean,
    anchor: HTMLElement | number | null,
    toggle: HTMLElement | null
  ) {
    if (noEvent) return;
    if (settings.events) emitEvent("scrollCancel", { anchor, toggle });
  }

  /**
   * Start/stop the scrolling animation
   *
   * @param anchor The element or position to scroll to
   * @param toggle The element that toggled the scroll event
   * @param options
   */
  function scroll(
    anchor: HTMLElement | number,
    toggle: HTMLElement | null,
    options = {}
  ) {
    const _settings = { ...settings, ...options };
    const headerOffset = headerEl ? getHeight(headerEl) : 0;

    cancel(false, anchor, toggle);

    updateURL(anchor, _settings, instanceId);

    scrollTo(anchor, {
      offset: _settings.offset + headerOffset,
      focus: _settings.focus,
      speed: _settings.speed,
      onstart: () => {
        if (_settings.events) emitEvent("scrollStart", { anchor, toggle });
      },
      onstop: () => {
        cancel(true, anchor, toggle);
        if (_settings.events) emitEvent("scrollStop", { anchor, toggle });
      },
    });
  }

  /**
   * If smooth scroll element clicked, animate scroll
   */
  function handleClick(event: MouseEvent) {
    // don't run if event was canceled but still bubbled up
    // by @mgreter - https://github.com/cferdinandi/smooth-scroll/pull/462/
    if (event.defaultPrevented) return;

    // don't run if right-click or command/control + click or shift + click
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey)
      return;

    toggle = (event?.target as HTMLElement)?.closest(settings.selector);

    if (!toggle) return;

    // get the anchored element
    let anchor;
    if (toggle.hash === "#") {
      anchor = document.documentElement;
    } else {
      anchor = $(toggle.hash);
    }

    if (!anchor) return;

    event.preventDefault();

    setHistory(settings, instanceId);

    scroll(anchor, toggle);
  }

  /**
   * Animate scroll on popstate events
   */
  function handlePopstate() {
    const state = history.state as SmoothScrollHistoryState;
    // stop if history.state doesn't exist (ex. if clicking on a broken anchor link).
    // fixes `Cannot read property 'smoothScroll' of null` error getting thrown.
    if (!state) return;

    // console.log("state.smoothScroll", state.smoothScroll);

    // only run if state is a popstate record for this instantiation
    if (!state.smoothScroll || state.smoothScroll !== instanceId) {
      return;
    }

    // get the anchor
    const anchor = state.anchor;
    const scrollAnchor =
      anchor && typeof anchor === "string" ? $(anchor) : null;

    if (scrollAnchor) {
      // animate scroll to anchor link
      scroll(scrollAnchor, null, { updateURL: false });
    }
  }

  /**
   * Destroy the current initialization.
   */
  function destroy() {
    // if plugin isn't already initialized, stop
    if (!settings) return;

    // remove event listeners
    off(document, "click", handleClick);
    off(window, "popstate", handlePopstate);

    // cancel any scrolls-in-progress
    cancel(false, anchor, toggle);

    // reset variables
    settings = { ...defaults };
    anchor = null;
    toggle = null;
  }

  /**
   * Initialize Smooth Scroll
   */
  function init() {
    // destroy any existing initializations
    destroy();

    // selectors and variables
    settings = { ...defaults, ...options };

    if (settings.header) {
      headerEl = $<HTMLElement>(settings.header);
    }

    // when a toggle is clicked, run the click handler
    on(document, "click", handleClick, false);

    // if updateURL and popState are enabled, listen for pop events
    if (settings.updateURL && settings.popstate) {
      on(window, "popstate", handlePopstate, false);
    }
  }

  init();

  // public api
  return {
    scroll,
    cancel,
    destroy,
  };
}

export default smoothScroll;
