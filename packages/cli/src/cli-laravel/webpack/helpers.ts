import { paths } from "../paths/index.js";

/**
 * Get server host
 */
export function getServerHost() {
  const host = "localhost"; // "myproject.test";
  return host.replace(/\/+$/g, "");
}

/**
 * Get server port
 */
export function getServerPort() {
  return global.__FREEPORT;
}

/**
 * Get js/css output filename
 */
export function getOutputName(type: "entry" | "chunk", ext: "js" | "css") {
  let finalExt: string = ext;

  if (process.env["NODE_ENV"] === "production") {
    finalExt = `[contenthash].${ext}`;
  }

  // async chunks usually don't have a name, if they do we just use it during dev
  // as it increases bundle size, @see https://bit.ly/3cGkYif
  if (type === "chunk" && process.env["NODE_ENV"] === "production") {
    return `${paths.frontend.dest.folders.chunks}/[id].${finalExt}`;
  }

  return `${paths.frontend.dest.folders.entries}/[name].${finalExt}`;
}

/**
 * Get resource type setting for webpack's CopyPlugin
 *
 * TODO: verify whether we still need this despite we use [asset-modules](https://webpack.js.org/guides/asset-modules/)
 */
export function getCopySetting(
  type: "images" | "fonts" | "media",
  hashable?: boolean,
) {
  const context = paths.frontend.src[type];
  const from = "**/*.*";
  let to;
  if (process.env.NODE_ENV === "production") {
    to = `${paths.frontend.dest.folders[type]}/[path][name]`;
  } else {
    to = `${paths.frontend.dest[type]}/[path][name]`;
  }
  if (hashable && process.env.NODE_ENV === "production") {
    to += ".[contenthash]";
  }
  to += "[ext]";

  return {
    from,
    to,
    context,
    noErrorOnMissing: true,
  };
}
