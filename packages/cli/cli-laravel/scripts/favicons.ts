import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import deepmerge from "deepmerge";
import faviconsLib, { type FaviconOptions } from "favicons";
import { getHeaderAutogeneration } from "../../helpers-getters.js";
import { getPublicUrls } from "../helpers/index.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

function getFaviconsOpts(config: CliLaravel.Config): Partial<FaviconOptions> {
  return deepmerge<Partial<FaviconOptions>>(
    {
      appName: config.project.title, // Your application's name. `string`
      appDescription: "", // config.project.packageJson.description, // Your application's description. `string`
      version: config.project.packageJson.version, // Your application's version string. `string`
      // url: process.env.APP_URL,
      // appShortName: null, // Your application's short_name. `string`. Optional. If not set, appName will be used
      // developerName: null, // Your (or your developer's) name. `string`
      // developerURL: null, // Your (or your developer's) URL. `string`
      display: "standalone", // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
      background: "#fff", // Background colour for flattened icons. `string`
      theme_color: "#fff", // Theme color user for example in Android's task switcher. `string`
      // appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
      dir: "auto", // Primary text direction for name, short_name, and description
      lang: "it", // Primary language for name and short_name
      orientation: "any", // Default orientation: "any", "natural", "portrait" or "landscape". `string`
      scope: "/", // set of URLs that the browser considers within your app
      start_url: "/?homescreen=1", // Start URL when launching the application from a device. `string`
      pixel_art: false, // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
      loadManifestWithCredentials:
        process.env.APP_ENV === "dev" || process.env.APP_ENV === "staging"
          ? true
          : false, // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
    },
    config.favicons || {}
  );
}

/**
 * Generate favicons
 */
export const favicons: CliLaravel.Task = async ({ ctx, logger }) => {
  const src = join(paths.frontend.src.favicons, "favicon.png");
  const destFiles = paths.frontend.dest.favicons;
  const destHtml = join(
    paths.frontend.dest.automated,
    paths.frontend.filenames.faviconsPartial
  );
  const header = `{{-- ${getHeaderAutogeneration()} --}}\n\n`;

  // Configuration (see above in the README file).
  const configuration = {
    ...getFaviconsOpts(ctx),
    path: getPublicUrls().favicons,
  };

  const { images, files, html } = await faviconsLib(src, configuration);
  await mkdir(destFiles, { recursive: true });

  // write images
  await Promise.all(
    images.map((image) =>
      writeFile(join(destFiles, image.name), image.contents)
    )
  );

  // write other files
  await Promise.all(
    files.map((file) => writeFile(join(destFiles, file.name), file.contents))
  );

  // write html partial
  await writeFile(destHtml, header + html.join("\n"));

  const filesQuantity = images.length + files.length;

  logger.finish(
    `Generated ${filesQuantity} favicons files referenced in ${paths.frontend.filenames.faviconsPartial}`
  );
};

favicons.meta = { title: "Generate favicons", ownLog: ["end"] };
