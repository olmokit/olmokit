import { $ } from "@olmokit/dom/$";

export { callHookSafely, getScopedRoot } from "./interface";
export { getBaseUrl, getEndpoint } from "./location";

/**
 * Uuid, tiny custom helper instead of node's uuid/v4
 *
 * @see https://stackoverflow.com/a/2117523/1938970
 * @returns {string}
 */
export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Download file programmatically, it fakes a click action, should only work
 * from same origin domain
 */
export function downloadFile(url: string, name: string) {
  const a = document.createElement("a");
  a.download = name;
  a.href = url;
  a.click();
}

export function getMetaCsrfToken() {
  return $("meta[name='csrf-token']")?.getAttribute("content") || "";
}
