import { isString } from "@olmokit/utils/isString";
import { getDataAttr } from "@olmokit/dom/getDataAttr";

/**
 * Get impression track data on the given HTML element, the element must encode
 * the data to send in a `data-impression="{data}"` attribute,
 *
 * You can do it with twig with:
 * ```
 * {% set trackData = { name: 'a name' } %}
 *
 * <div data-impression="{{ trackData | json_encode() }}">
 * ```
 *
 * @returns Either undefined if the element was not there or the impression data parsed from the element
 */
export function getTrackImpressionData(element?: HTMLElement) {
  if (!element) return;
  return getDataAttr(element, "track-impression");
}

/**
 * Track impression on the given HTML element
 *
 * @requires dataLayer
 * @param data Either a JSON stringified data object or a plain javascript Object
 * @param eventName default=`"impressionsEE"`
 * @param currencyCode default=`"EUR"`
 * @returns The impression data parsed from the element
 */
export function trackImpression(
  data: string | object,
  eventName = "impressionsEE",
  currencyCode = "EUR"
) {
  data = isString(data) ? JSON.parse(data) : data;

  window.dataLayer.push({
    event: eventName,
    ecommerce: {
      currencyCode,
      impressions: [data],
    },
  });

  return data;
}
