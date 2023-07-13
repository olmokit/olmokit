import getUrlHashParams from "@olmokit/utils/getUrlHashParams";
import type { AnyQueryParams } from "@olmokit/utils/location";
import mergeUrlQueryParams from "@olmokit/utils/mergeUrlQueryParams";
import { navigateToHashParams } from "./navigateToHashParams";

/**
 * It updates the "query params" within the `location.hash`, it uses `location`
 *
 * @category location
 */
export function navigateToMergedHashParams(
  params: NonNullable<AnyQueryParams> = {},
  hash = ""
) {
  return navigateToHashParams(
    mergeUrlQueryParams(getUrlHashParams(hash), params),
    hash
  );
}

export default navigateToMergedHashParams;
