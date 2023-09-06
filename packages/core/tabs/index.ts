import { getUrlQueryParams } from "@olmokit/utils/getUrlQueryParams";
import $all from "@olmokit/dom/$all";
import { addClass } from "@olmokit/dom/addClass";
import { forEach } from "@olmokit/dom/forEach";
import { getDataAttr } from "@olmokit/dom/getDataAttr";
import { off } from "@olmokit/dom/off";
import { on } from "@olmokit/dom/on";
import { removeClass } from "@olmokit/dom/removeClass";
import { navigateToMergedParams } from "@olmokit/browser/navigateToMergedParams";
import type { TabsCallbackArg, TabsMap } from "./types";

const ATTR_TABS = "tabs";
const ATTR_TAB = "tabs-tab";
const ATTR_PANELS = "tabs-panels";
const ATTR_PANEL = "tabs-panel";
const CLASS_ACTIVE = "is-active";

type TabsProps = {
  /** You can optionally force the tabs to initialise with a specific active tab */
  initialTabId?: string;
  /** Hook into here to make custom animations on tab change */
  onChange: (arg: TabsCallbackArg) => any;
};

export function Tabs(param: string, { initialTabId, onChange }: TabsProps) {
  let map: TabsMap;

  readDataFromDOM();
  initialDeeplink();
  bindListeners();

  /**
   * Deeplink on load based on URL hash
   */
  function initialDeeplink() {
    let tabId = initialTabId || getTabIdFromUrl();

    if (!tabId) {
      tabId = Object.keys(map)[0];

      // deeplink programatically if there is no query param in the URL
      if (tabId) {
        navigateToMergedParams({ [param]: tabId }, true);
      }
    }
    if (tabId) {
      setActive(tabId);
    }
  }

  /**
   * Build tabs map from DOM elements
   */
  function readDataFromDOM() {
    map = {};
    const rootTabs = `[data-${ATTR_TABS}="${param}"]`;
    const rootPanels = `[data-${ATTR_PANELS}="${param}"]`;

    forEach($all(`${rootTabs} [data-${ATTR_TAB}]`), ($tab) => {
      const id = getDataAttr($tab, ATTR_TAB);
      if (id) map[id] = { $tab };
    });

    forEach($all(`${rootPanels} [data-${ATTR_PANEL}]`), ($panel) => {
      const id = getDataAttr($panel, ATTR_PANEL);
      if (id) {
        map[id] = map[id] || {};
        map[id].$panel = $panel;
      }
    });
  }

  /**
   * Bind listeners
   *
   * We do not use `location.hash = "..."` as that always make the browser
   * jump to the target element, @see https://lea.verou.me/2011/05/change-url-hash-without-page-jump/
   */
  function bindListeners() {
    for (const key in map) {
      const { $tab } = map[key];
      if ($tab) on($tab, "click", handleClickTab);
    }
    on(window, "popstate", handlePopState);
  }

  /**
   * Destroy listeners
   */
  function destroyListeners() {
    for (const key in map) {
      const { $tab } = map[key];
      if ($tab) off($tab, "click", handleClickTab);
    }
  }

  /**
   * Handle tab click
   */
  function handleClickTab(event: Event) {
    event.preventDefault();
    const $tab = event.target as HTMLElement;
    const tabId = getDataAttr($tab, ATTR_TAB);
    if (tabId) {
      setActive(tabId);
      navigateToMergedParams({ [param]: tabId });
    }
  }

  /**
   * Handle pop state
   */
  function handlePopState() {
    const tabId = getTabIdFromUrl();
    setActive(tabId);
  }

  /**
   * Set active tab
   */
  function setActive(newId: string) {
    // check that the tab exists
    if (!map[newId]) {
      return;
    }
    let $activeTab;
    let $activePanel;
    const $inactiveTabs = [];
    const $inactivePanels = [];

    for (const tabId in map) {
      const mapItem = map[tabId];
      const { $tab, $panel } = mapItem;
      if (tabId === newId) {
        if ($tab) {
          $activeTab = $tab;
          addClass($tab, CLASS_ACTIVE);
        }
        if ($panel) {
          $activePanel = $panel;
          addClass($panel, CLASS_ACTIVE);
        }
      } else {
        if ($tab) {
          removeClass($tab, CLASS_ACTIVE);
          $inactiveTabs.push($tab);
        }
        if ($panel) {
          removeClass($panel, CLASS_ACTIVE);
          $inactivePanels.push($panel);
        }
      }
    }

    onChange({
      tabId: newId,
      $activeTab,
      $activePanel,
      $inactiveTabs,
      $inactivePanels,
    });
  }

  /**
   * Get tab id reading the current location hash
   */
  function getTabIdFromUrl() {
    const params = getUrlQueryParams();
    return params[param] as string;
  }

  return {
    refresh() {
      destroyListeners();
      readDataFromDOM();
      bindListeners();
    },
  };
}

export default Tabs;
