import { existsSync, lstatSync } from "node:fs";
import type { Config } from "./types.js";

/**
 * Get now time information text
 */
function getNow() {
  const pad = (n: number) => (n < 10 ? "0" + n : n);
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ddmmyyyy = pad(day) + "/" + pad(month + 1) + "/" + year;
  const hhmmss = pad(hour) + ":" + pad(minutes) + ":" + pad(seconds);

  return ddmmyyyy + " " + hhmmss;
}

export const getBanner = (config: Config.Internal) => {
  const pkg = config.project.packageJson;
  const thisYear = new Date().getFullYear();
  const startYear = pkg.config?.startYear ?? thisYear;
  const endYear = thisYear > startYear ? "-" + thisYear : "";

  return (
    `` +
    `/*! ` +
    `Copyright (c) ${startYear}${endYear} ${pkg.author} | ` +
    `${config.project.title} v${pkg.version} (${
      process.env.APP_URL
    }, last change on: ${getNow()}) ` +
    `*/`
  );
};

/**
 * Get header autogeneration banner
 */
export function getHeaderAutogeneration() {
  return `DO NOT EDIT, THIS FILE IS AUTO-GENERATED. LAST UPDATE ${getNow()}`;
}

/**
 * Is https app url?
 */
export function isHttps() {
  return /^https:\/\//.test(process.env.APP_URL);
}

/**
 * Normalize URL
 *
 * Removes double slashes but not after protocol, e.g. keep `http://`
 */
export function normaliseUrl(url: string) {
  return url.replace(/(?<!:)\/{2,}/g, "/");
}

/**
 * Remove trailing slashes
 */
export function removeTrailingSlashes(url: string) {
  return url.replace(/\/+$/g, "");
}

/**
 * Run target if env is development and if the given file does not already exists
 */
export async function runIfDevAndMissingFile(
  filePath: string,
  target: () => Promise<void>
) {
  if (process.env["NODE_ENV"] === "development") {
    let alreadyExists = false;

    try {
      if (existsSync(filePath)) {
        alreadyExists = true;
      }
      // eslint-disable-next-line no-empty
    } catch (err) {}

    if (!alreadyExists) {
      return await target();
    }
  }
  return;
}

/**
 * Is using a locally linked npm module
 *
 * When developing node_modules is useful to have this information, whether
 * you are using the version from the npm registry or from your local machine
 * linked with `npm link`
 *
 * @param path The npm module to check
 */
export function isUsingLocalLinkedNodeModule(path: string) {
  const stat = lstatSync(path);
  // const dir = readdirSync(path, { withFileTypes: true })[0];
  // TODO: pnpm always use symlinks so  when that is used we need to read
  // the link target with `fs.readlink(fullPath)` and check whether that
  // target is a relative path, if so we are using a locally linked node module
  return stat.isSymbolicLink();
}
