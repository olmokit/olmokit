import { normaliseUrlPathname } from "@olmokit/utils/normaliseUrlPathname";
import { globalConf, globalData } from "../data";
import { Ajax, type AjaxConfig } from "./index";

const { cmsApiUrl, locale } = globalConf;

/**
 * CMS ajax wrapper, it can automatically adds the user token in the headers
 * and prepend the locale to the given endpoint
 *
 * @param {string} endpoint The endpoint relative path, you can use `{locale}` in your path, it will be automatically replaced with the current locale. Slashes will be normalised.
 */
export function send<T>(endpoint = "", options: AjaxConfig = {}) {
  const headers = options.headers || {};

  if (globalData?.["user"]?.token) {
    headers["X-Token"] = globalData["user"].token;
  }

  options.headers = headers;

  return Ajax<T>(
    cmsApiUrl +
      normaliseUrlPathname(`/${endpoint.replace("{locale}", locale)}`),
    options
  );
}

/**
 * CMS ajax `GET` request shortcut
 *
 * @param {string} endpoint The endpoint relative path, you can use `{locale}` in your path, it will be automatically replaced with the current locale. Slashes will be normalised.
 */
export function get<T>(endpoint: string, options: AjaxConfig = {}) {
  options.method = "GET";
  return send<T>(endpoint, options);
}

/**
 * CMS ajax `POST` request shortcut
 *
 * @param {string} endpoint The endpoint relative path, you can use `{locale}` in your path, it will be automatically replaced with the current locale. Slashes will be normalised.
 */
export function post<T>(endpoint: string, options: AjaxConfig = {}) {
  options.method = "POST";
  return send<T>(endpoint, options);
}

/**
 * CMS ajax `DELETE` request shortcut
 *
 * @param {string} endpoint The endpoint relative path, you can use `{locale}` in your path, it will be automatically replaced with the current locale. Slashes will be normalised.
 */
export function del<T>(endpoint: string, options: AjaxConfig = {}) {
  options.method = "DELETE";
  return send<T>(endpoint, options);
}

export default {
  send,
  get,
  post,
  del,
};
