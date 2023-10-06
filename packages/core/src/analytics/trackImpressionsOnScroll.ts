import { onScroll } from "../scroll/onScroll";
import { getTrackImpressionData, trackImpression } from "./helpers";

/**
 * Track impressions on scroll
 *
 * The array and check of duplicates is to prevent doubled impressions on async
 * rendered content (e.g. in a "results-filtering" scenario)
 */
export function trackImpressionsOnScroll(
  eventName?: string,
  currencyCode?: string,
) {
  const trackedData: Record<string, boolean> = {};

  return onScroll("[data-track-impression]", {
    onin: (element) => {
      const dataString = getTrackImpressionData(element);
      if (dataString && !trackedData[dataString]) {
        trackImpression(dataString, eventName, currencyCode);
        trackedData[dataString] = true;
      }
    },
    // trigger the event only when 90% of the element is visible
    offset: {
      element: {
        y: 0.9,
      },
    },
  });
}
