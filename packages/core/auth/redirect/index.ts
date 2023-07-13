import { getUrlQueryParams } from "@olmokit/utils/getUrlQueryParams";
import { $each } from "@olmokit/dom/$each";
import { navigateToMergedParams } from "@olmokit/browser/navigateToMergedParams";
import { navigateWithoutUrlParam } from "@olmokit/browser/navigateWithoutUrlParam";

/**
 * The standard redirect input field name, it must match the php server code
 */
export const REDIRECT_PARAM = "redirect";

/**
 * The standard redirect query parameter, it must match the php server code
 */
export const REDIRECT_NAME = "_redirect";

/**
 * Add standard auth `_redirect` URL inside the `<x-auth-redirect>` hidden
 * input element, we use a class selector so that it is a quick operation. The
 * input hidden value it is used server side to redirect the request on success.
 */
export function addFormsRedirect(url: string) {
  if (url) {
    $each(".authRedirect", ($input: HTMLInputElement) => {
      $input.value = url;
    });
  }
}

/**
 * Remove standard auth `_redirect` URL from the `<x-auth-redirect>` hidden
 * input element, we use a class selector so that it is a quick operation.
 */
export function removeFormsRedirect(url: string) {
  if (url) {
    $each(".authRedirect", ($input: HTMLInputElement) => {
      $input.value = url;
    });
  }
}

/**
 * Update forms input field with redirect from query param
 */
export function updateFormsRedirectFromUrl() {
  const url = getRedirectParam();
  if (url) {
    addFormsRedirect(url);
    navigateWithoutUrlParam(REDIRECT_PARAM);
  }
}

/**
 * Retrieve the redirect query param from the URL
 */
export function getRedirectParam(): string {
  return getUrlQueryParams<Record<string, string>>()[REDIRECT_PARAM] || "";
}

/**
 * Add standard auth `redirect` query parameter to URL, without pushing a new
 * state
 */
export function addRedirectParam(url: string) {
  if (url) {
    navigateToMergedParams(
      {
        [REDIRECT_PARAM]: url,
      },
      true
    );
  }
}

/**
 * Remove standard auth `redirect` query parameter to URL, without pushing a new
 * state
 */
export function removeRedirectParam() {
  navigateWithoutUrlParam(REDIRECT_PARAM, true);
}
