import { globalConf } from "../data";

/**
 * Get website base url
 */
export function getBaseUrl(trailingSlash = true) {
  let url = globalConf.baseUrl || "";
  if (!url) {
    if (process.env["NODE_ENV"] !== "production") {
      console.warn("Failed to retrieve baseUrl from `globalConf`");
    }
    return "";
  }

  // ensure trailing slash
  if (trailingSlash) {
    url = url + "/";
  }

  // replace too many end slashes
  return url.replace(/\/+$/, "/");
}

/**
 * Normalise URL path, it replaces consecutive slashes
 */
export function normaliseUrlPath(path: string) {
  return path.replace(/\/+/g, "/");
}

/**
 * Get endpoint
 */
export function getEndpoint(path = "", trailingSlash = true) {
  let url = getBaseUrl() + "/" + path;

  // ensure trailing slash
  if (trailingSlash) {
    url = url + "/";
  }

  // replace too many consecutive slashes (except `http{s}://`)
  return url.replace(/([^:]\/)\/+/g, "$1");
}
