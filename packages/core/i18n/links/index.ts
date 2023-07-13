// FIXME: somehow the $$ deeper import does not work
import { $$ } from "@olmokit/dom";
import { $ } from "@olmokit/dom/$";
import { addClass } from "@olmokit/dom/addClass";
import { forEach } from "@olmokit/dom/forEach";
import { getDataAttr } from "@olmokit/dom/getDataAttr";
import { listen } from "@olmokit/dom/listen";
import "./index.scss";

/**
 * I18n links
 *
 * Handles switching language through links hijacked by javascript
 */
export function I18nLinks(rootSelector = "") {
  const $root = $(`${rootSelector ? rootSelector + " " : ""}.i18nLinks`);
  const domMap: Record<string, HTMLAnchorElement> = {};

  /**
   * Build a map associating a locale to its link, this will be used to swap
   * the links on route change
   */
  forEach<HTMLAnchorElement>($$("[data-locale]", $root), ($link) => {
    const locale = getDataAttr($link, "locale");
    if (locale) domMap[locale] = $link;
  });

  listen("click", ".i18nLinksItem", (event, $link: HTMLAnchorElement) => {
    event.preventDefault();

    addClass($root, "is-loading");
    addClass($link, "is-loading");

    location.href = $link.href;
  });

  /**
   * On route change update the localised links with the fresh data embedded
   * as json in the HTML response
   */
  function assignLocalisedLinks() {
    const $dataHolder = $("#i18nLinks");

    if ($dataHolder) {
      const langs = JSON.parse(getDataAttr($dataHolder, "langs") || "[]");

      for (let i = 0; i < langs.length; i++) {
        const { locale, switchUrl } = langs[i];
        if (domMap[locale]) domMap[locale].setAttribute("href", switchUrl);
      }
    }
  }

  /**
   * On route change update the localised links with the fresh data embedded
   * as json in the HTML response
   */
  function onRouteChange() {
    assignLocalisedLinks();
  }

  return {
    onRouteChange,
  };
}
