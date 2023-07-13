import { getMetaCsrfToken } from "../helpers";
import { Ajax, type AjaxConfig, type AjaxResponse } from "./index";

export type AjaxLaravelResponseError = AjaxResponse<{
  msg: string;
}>;

/**
 * Internal laravel ajax wrapper, it just adds the csrf token automatically to the
 * headers fo the request
 *
 * @param {string} endpoint The endpoint relative path, slashes will be normalised.
 */
export function AjaxLaravel<T>(endpoint: string, options: AjaxConfig = {}) {
  const headers = options.headers || {};
  const crsfToken = getMetaCsrfToken();

  if (crsfToken) headers["X-CSRF-TOKEN"] = crsfToken;

  options.headers = headers;

  return Ajax<T>(endpoint, options);
}

/**
 * Internal laravel ajax `GET` request shortcut
 *
 * @param endpoint The endpoint relative path, slashes will be normalised.
 */
export function get<T>(endpoint: string, options: AjaxConfig = {}) {
  options.method = "GET";
  return AjaxLaravel<T>(endpoint, options);
}

/**
 * Internal laravel ajax `POST` request shortcut
 *
 * @param endpoint The endpoint relative path, slashes will be normalised.
 */
export function post<T>(endpoint: string, options: AjaxConfig = {}) {
  options.method = "POST";
  return AjaxLaravel<T>(endpoint, options);
}

/**
 * Internal laravel ajax `DELETE` request shortcut
 *
 * @param endpoint The endpoint relative path, slashes will be normalised.
 */
export function del<T>(endpoint: string, options: AjaxConfig = {}) {
  options.method = "DELETE";
  return AjaxLaravel<T>(endpoint, options);
}

export default AjaxLaravel;
