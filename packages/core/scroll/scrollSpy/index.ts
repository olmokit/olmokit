import { isFunction } from "@olmokit/utils/isFunction";
import { isString } from "@olmokit/utils/isString";
import { $ } from "@olmokit/dom/$";
import { $all } from "@olmokit/dom/$all";
import { addClass } from "@olmokit/dom/addClass";
import { emitEvent } from "@olmokit/dom/emitEvent";
import { forEach } from "@olmokit/dom/forEach";
import { getDocumentHeight } from "@olmokit/dom/getDocumentHeight";
import { getHeight } from "@olmokit/dom/getHeight";
import { getOffsetTop } from "@olmokit/dom/getOffsetTop";
import { listenResize } from "@olmokit/dom/listenResize";
import { listenScroll } from "@olmokit/dom/listenScroll";
import { removeClass } from "@olmokit/dom/removeClass";
import "../../../polyfills/closest";

export type ScrollSpyOptions = {
  /**
   * Selector for a fixed/absolute header that adds to the offset
   */
  header: string;
  /**
   * @default "is-active"
   */
  navClass: string;
  /**
   * @default "is-active"
   */
  contentClass: string;
  offset: number | (() => number | string);
  reflow: boolean;
  events: boolean;
  onSetup?: null | ((areas: ScrollSpyArea[]) => void);
};

type ScrollSpyArea = {
  idx: number;
  nav: HTMLElement;
  content: HTMLElement;
};

const defaults: ScrollSpyOptions = {
  header: "",
  navClass: "is-active",
  contentClass: "is-active",
  offset: 0,
  reflow: false,
  events: true,
  onSetup: null,
};

/**
 * Sort content from first to last in the DOM
 * @param data The content areas
 */
function sortContents(data: ScrollSpyArea[]) {
  if (data) {
    data
      .sort((item1, item2) => {
        if (getOffsetTop(item1.content) < getOffsetTop(item2.content)) {
          return -1;
        }
        return 1;
      })
      .map((item, idx) => {
        item.idx = idx;
        return item;
      });
  }
}

/**
 * Get the offset to use for calculating position
 * @param settings The settings for this instantiation
 * @return The number of pixels to offset the calculations
 */
let headerEl: HTMLElement | undefined;

function getOffset(settings: ScrollSpyOptions) {
  const { header, offset } = settings;
  let headerOffset = 0;

  if (header) {
    headerEl = headerEl || $<HTMLElement>(header);
    headerOffset = headerEl ? getHeight(headerEl) : 0;
  }

  let offsetSafe = isFunction(offset) ? offset() : offset;
  offsetSafe = isString(offsetSafe) ? parseFloat(offsetSafe) : offsetSafe;

  return offsetSafe + headerOffset;
}

/**
 * Determine if an element is in view
 * @param elem The element
 * @param settings The settings for this instantiation
 * @param [bottom] If `true`, check if element is above bottom of viewport instead
 * @return Returns `true` if element is in the viewport
 */
function isInView(elem: Element, settings: ScrollSpyOptions, bottom?: boolean) {
  const bounds = elem.getBoundingClientRect();
  const offset = getOffset(settings);
  if (bottom) {
    return (
      bounds.bottom <
      (window.innerHeight || document.documentElement.clientHeight)
    );
  }
  return bounds.top <= offset;
}

/**
 * Check if at the bottom of the viewport
 * @return If `true`, page is at the bottom of the viewport
 */
function isAtBottom() {
  if (window.innerHeight + window.pageYOffset >= getDocumentHeight())
    return true;
  return false;
}

/**
 * Check if the last item should be used (even if not at the top of the page)
 * @param item The last item
 * @param settings The settings for this instantiation
 * @return If `true`, use the last item
 */
function useLastItem(area: ScrollSpyArea, settings: ScrollSpyOptions) {
  if (isAtBottom() && isInView(area.content, settings, true)) return true;
  return false;
}

/**
 * Get the active content
 * @return The content area and matching navigation link
 */
function getActive(areas: ScrollSpyArea[], settings: ScrollSpyOptions) {
  const last = areas[areas.length - 1];
  if (useLastItem(last, settings)) {
    return last;
  }

  for (let i = areas.length - 1; i >= 0; i--) {
    if (isInView(areas[i].content, settings)) {
      return areas[i];
    }
  }
  return;
}

/**
 * Deactivate a nav and content area
 */
function deactivate(settings: ScrollSpyOptions, area?: null | ScrollSpyArea) {
  if (!area) return;

  // Get the parent list item
  const li = area.nav.closest("li");
  if (!li) return;

  // Remove the active class from the nav and content
  removeClass(li, settings.navClass);
  removeClass(area.content, settings.contentClass);

  // Emit a custom event
  emitEvent("scrollspy:deactivate", {
    li,
    link: area.nav,
    content: area.content,
    settings: settings,
  });
}

/**
 * Activate a nav and content area
 */
function activate(settings: ScrollSpyOptions, area?: null | ScrollSpyArea) {
  if (!area) return;

  // Get the parent list item
  const li = area.nav.closest("li");
  if (!li) return;

  // Add the active class to the nav and content
  addClass(li, settings.navClass);
  addClass(area.content, settings.contentClass);

  // Emit a custom event
  emitEvent("scrollspy:active", {
    li,
    link: area.nav,
    content: area.content,
    settings: settings,
  });
}

/**
 * Scrollspy
 *
 * Manages in-page hash based navigation adding 'active' classes on links inside
 * the given navigation element.
 *
 * @param selector The selector to use for navigation items
 * @param options User options and settings
 */
export default function scrollSpy(
  selector: string,
  options: Partial<ScrollSpyOptions> = {}
) {
  let timeout: number | null;
  let settings: ScrollSpyOptions;
  let data: ScrollSpyArea[];
  let current: ScrollSpyArea | null | undefined;
  let continueFrame: boolean | undefined;
  let scrollListener: () => void | undefined;
  let resizeListener: () => void | undefined;

  /**
   * Set variables from DOM elements
   */
  function setup() {
    // Get all nav items
    const navItems = $all<HTMLAnchorElement>(selector);

    // Create data array
    data = [];

    // Loop through each item, get it's matching content, and push to the array
    forEach(navItems, (navItem, idx) => {
      // Get the content for the nav item
      const content = $("#" + decodeURIComponent(navItem.hash.substring(1)));
      if (!content) return;

      // Push to the data array
      data.push({
        idx,
        nav: navItem,
        content: content,
      });
    });

    // Sort data by the order they appear in the DOM
    sortContents(data);

    if (settings.onSetup) {
      settings.onSetup(data);
    }
  }

  /**
   * Detect which content is currently active
   */
  function detect() {
    // Get the active content
    const active = getActive(data, settings);

    // if there's no active content, deactivate and bail
    if (!active) {
      if (current) {
        deactivate(settings, current);
        current = null;
      }
      return;
    }

    // If the active content is the one currently active, do nothing
    if (current && active.content === current.content) return;

    // Deactivate the current content and activate the new content
    deactivate(settings, current);
    activate(settings, active);

    // Update the currently active content
    current = active;
  }

  /**
   * Detect the active content on scroll
   * Debounced for performance
   */
  function scrollHandler() {
    // If there's a timer, cancel it
    if (timeout) {
      cancelAnimationFrame(timeout);
    }

    if (continueFrame) {
      // Setup debounce callback
      timeout = requestAnimationFrame(detect);
    }
  }

  /**
   * Update content sorting on resize
   * Debounced for performance
   */
  function resizeHandler() {
    // If there's a timer, cancel it
    if (timeout) {
      cancelAnimationFrame(timeout);
    }

    if (continueFrame) {
      // Setup debounce callback
      timeout = requestAnimationFrame(function () {
        sortContents(data);
        detect();
      });
    }
  }

  /**
   * Destroy the current instantiation
   */
  function destroy() {
    // Undo DOM changes
    if (current) {
      deactivate(settings, current);
    }

    // Remove event listeners
    if (scrollListener) scrollListener();
    if (resizeListener) resizeListener();
    if (timeout) {
      cancelAnimationFrame(timeout);
    }

    // Reset variables
    data = [];
    current = null;
    timeout = null;
    continueFrame = false;
    settings = { ...defaults };
  }

  /**
   * Initialize the current instantiation
   */
  function init() {
    // Merge user options into defaults
    settings = { ...defaults, ...options };

    continueFrame = true;

    // Setup variables based on the current DOM
    setup();

    // Find the currently active content
    detect();

    // Setup event listeners
    scrollListener = listenScroll(scrollHandler);
    if (settings.reflow) {
      resizeListener = listenResize(resizeHandler);
    }
  }

  // Initialize and return the public APIs
  init();

  return {
    setup,
    detect,
    destroy,
  };
}
