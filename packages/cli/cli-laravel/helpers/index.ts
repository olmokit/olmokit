import { isHttps, normaliseUrl } from "../../helpers-getters.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";
import { getServerHost, getServerPort } from "../webpack/helpers.js";

/**
 * Get internal IPS, used for hooks default allowed IPS
 */
export function getInternalIps() {
  return Array.from(global.__IPS.all)
    .map((ip) => (ip ? ip.trim() : null))
    .filter((ip) => !!ip) as string[];
}

/**
 * Returns the project's base URL (environment sensible)
 */
export function getBaseUrl(bypassWds?: boolean) {
  if (bypassWds || process.env.NODE_ENV === "production") {
    return normaliseUrl(`${process.env.PUBLIC_URL}/`);
  }

  const protocol = isHttps() ? "https://" : "http://";
  return normaliseUrl(`${protocol}${getServerHost()}:${getServerPort()}/`);
}

/**
 * Get public URLs, env dependent and ensure initial/ending slashes
 */
export function getPublicUrls() {
  const relativeUrls = paths.frontend.dest.relativeUrls;
  const baseUrl = getBaseUrl();

  return {
    base: normaliseUrl(`${baseUrl}/`),
    assets: normaliseUrl(`${baseUrl}${relativeUrls.assets}/`),
    entries: normaliseUrl(`${baseUrl}${relativeUrls.entries}/`),
    images: normaliseUrl(`${baseUrl}${relativeUrls.images}/`),
    fonts: normaliseUrl(`${baseUrl}${relativeUrls.fonts}/`),
    // FIXME: verify this wds bypass, if we need it, and also add a dummy favicon
    // template during development
    favicons: normaliseUrl(`${getBaseUrl(true)}${relativeUrls.favicons}/`),
    serviceWorker: normaliseUrl(`${baseUrl}/${relativeUrls.serviceWorker}`),
  };
}

/**
 * Get JS globally avialable variables
 *
 */
export function getProjectJsGlobals(config: Pick<CliLaravel.Config, "env">) {
  const publicUrls = getPublicUrls();

  return [
    {
      name: "__DEV__",
      desc: "Flag for development environment. Code put inside a condition based on this variable will be stripped out on production.",
      type: "boolean",
      value: process.env.NODE_ENV !== "production",
    },
    {
      name: "__ENV__",
      desc: "Current environment",
      // dynamically creates a tuple like "'development' | 'production'"
      type: config.env.names.map((name) => `'${name}`).join(" | "),
      value: `"${process.env.APP_ENV}"`,
    },
    {
      name: "__URL__",
      desc: "The website base URL, in other words its domain (environment sensible).",
      type: "string",
      value: `"${process.env.APP_URL}"`,
    },
    {
      name: "__API__",
      desc: "The website api URL (environment sensible).",
      type: "string",
      value: `"${process.env.CMS_API_URL}"`,
    },
    {
      name: "__ASSETS__",
      desc: "The website static assets URL (environment sensible).",
      type: "string",
      value: `"${publicUrls.assets}"`,
    },
    {
      name: "__IMAGES__",
      desc: "The website static images URL (environment sensible).",
      type: "string",
      value: `"${publicUrls.images}"`,
    },
    {
      name: "__FONTS__",
      desc: "The website static fonts URL (environment sensible).",
      type: "string",
      value: `"${publicUrls.fonts}"`,
    },
  ];
}
