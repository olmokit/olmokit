import { filer } from "@olmokit/cli-utils/filer";
import { getHeaderAutogeneration, isHttps } from "../../helpers-getters.js";
import { getPublicUrls } from "../helpers/index.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";
import { cleanAssets } from "./clean.js";

function getAssetPartialData() {
  const publicUrls = getPublicUrls();
  return {
    isProduction: process.env["NODE_ENV"] === "production",
    useCDN: !!process.env.CDN,
    assetsPath: paths.frontend.dest.relativeUrls.assets,
    manifestPath: paths.frontend.dest.relativeUrls.manifest,
    entriesFolder: paths.frontend.dest.folders.entries,
    assetsUrl: publicUrls.assets,
    // NOTE: service worker does not work with cross origin URLs
    hasServiceWorker: isHttps() && !process.env.CDN,
    serviceWorkerUrl: publicUrls.serviceWorker,
  };
}

const assetsPartialsHead: CliLaravel.Task = async () => {
  await filer(paths.frontend.filenames.assetsHeadPartial, {
    base: paths.self.templates,
    data: getAssetPartialData(),
    prepend: `{{-- ${getHeaderAutogeneration()} --}}\n\n`,
    dest: paths.frontend.dest.automated,
  });
};
assetsPartialsHead.meta = { title: "Create <assets-head>" };

const assetsPartialsBody: CliLaravel.Task = async () => {
  await filer(paths.frontend.filenames.assetsBodyPartial, {
    base: paths.self.templates,
    data: getAssetPartialData(),
    prepend: `{{-- ${getHeaderAutogeneration()} --}}\n\n`,
    dest: paths.frontend.dest.automated,
  });
};
assetsPartialsBody.meta = { title: "Create <assets-body>" };

export const assets: CliLaravel.TaskGroup = {
  meta: { title: "Manage assets partials" },
  children: [cleanAssets, assetsPartialsHead, assetsPartialsBody],
};
