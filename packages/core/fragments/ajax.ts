import { normaliseUrlPathname } from "@olmokit/utils/normaliseUrlPathname";
import type { AjaxConfig } from "../ajax";
import ajaxLaravel from "../ajax/laravel";

/**
 * Fragment ajax request
 *
 * Wraps the `ajaxLaravel` submit prefixing the given endpoint with the standard
 * prefix used by `src/fragments/routes.php`, that is `/_/fragments/`
 *
 * TODO: config(env.URL_TRAILING_SLASH)
 */
export default function ajax<T>(endpoint: string, options?: AjaxConfig) {
  const parts = endpoint.split("?");
  let url = "/_/fragments/" + parts[0];

  // add trailing slash
  url += parts[1] ? `/?${parts[1]}` : "/";

  // remove subsequent slashes
  url = normaliseUrlPathname(url);

  return ajaxLaravel<T>(url, options);
}

/**
 * Fragment ajax GET alias
 *
 * @lends {ajax}
 */
export const get = <T extends string>(endpoint: string, options?: AjaxConfig) =>
  ajax<T>(endpoint, { ...options, method: "POST" });

/**
 * Fragment ajax POST shortcut
 */
export const post = <T>(endpoint: string, options?: AjaxConfig) =>
  ajax<T>(endpoint, { ...options, method: "POST" });
