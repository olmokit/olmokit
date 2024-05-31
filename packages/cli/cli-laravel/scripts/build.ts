import { existsSync } from "fs";
import { copyFile } from "fs/promises";
import { join } from "path";
import { configBuild } from "../../config-build.js";
import { normaliseUrl } from "../../helpers-getters.js";
import { laravelConfig } from "../helpers/dotenv.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";
import { project } from "../../project.js";

/**
 * Get "kind-of-versioned" public path for CDN deployments
 */
function getCdnReadyPublicPath(envName: string) {
  const pad = (n: number) => (n < 10 ? "0" + n : n);
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const yyyymmdd = `${year}${pad(month + 1)}${pad(day)}`;
  const hhmmss = `${pad(hour)}${pad(minutes)}${pad(seconds)}`;

  return `/public/frontend/${yyyymmdd}_${hhmmss}_${envName}`;
}

const buildPre: CliLaravel.Task = async ({ ctx }) => {
  const publicPath = laravelConfig("env.CDN")
    ? getCdnReadyPublicPath(process.env.APP_ENV)
    : "/";
  const publicUrl =
    laravelConfig("env.CDN") === "s3"
      ? normaliseUrl(`${process.env.AWS_URL}/${publicPath}/`)
      : "/";

  configBuild(ctx, { publicPath, publicUrl });
};
buildPre.meta = { title: "Store new build information" };

const buildHtaccess: CliLaravel.Task = async () => {
  const hostingType = process.env.HOSTING_TYPE == "shared" ? ".shared" : "";
  const htaccessType = process.env.APP_ENV+hostingType;
  const destFolder = process.env.HOSTING_TYPE == "shared" ? project.root : paths.frontend.dest.public;
  const pathHtaccess = join(
    destFolder,
    `.htaccess.${htaccessType}`
  );
  const pathTo = process.env.HOSTING_TYPE == "shared" ? project.root : paths.frontend.dest.public;
  console.log('setup htaccess hostingType:', hostingType);
  console.log('setup htaccess htaccessType:', htaccessType);
  console.log('setup htaccess destFolder:', destFolder);
  console.log('setup htaccess pathHtaccess:', pathHtaccess);
  console.log('setup htaccess pathTo:', pathTo);

  // use the right .htaccess.{env} file and copy it as .htaccess
  if (existsSync(pathHtaccess)) {
    await copyFile(pathHtaccess, join(pathTo, ".htaccess"));
  }

  // reload current env to be sure...
  // configDotenv({ override: true });
};
buildHtaccess.meta = { title: "Use the correct .htaccess file" };

export const build: CliLaravel.TaskGroup = {
  meta: { title: "Build the application for production", still: true },
  children: [
    {
      meta: { title: ":auto" },
      children: [
        buildPre,
        () => import("./clean.js").then((m) => m.clean),
        () => import("./setup.js").then((m) => m.setup),
        () => import("./check.js").then((m) => m.check),
        () => import("./env.js").then((m) => m.env),
        buildHtaccess,
        {
          meta: { title: ":auto" },
          children: [
            () => import("./pkg.js").then((m) => m.pkg),
            () => import("./gitignore.js").then((m) => m.gitignore),
            () => import("./htaccess.js").then((m) => m.htaccess),
            () => import("./tplBuild.js").then((m) => m.tplBuild),
            () => import("./i18n.js").then((m) => m.i18nTranslations),
            () => import("./svgicons.js").then((m) => m.svgicons),
            () => import("./favicons.js").then((m) => m.favicons),
            () => import("./assets.js").then((m) => m.assets),
          ],
          parallel: true,
        },
        () => import("./assetsCompile.js").then((m) => m.assetsCompile),
        () => import("./assetsS3.js").then((m) => m.assetsS3),
      ],
    },
  ],
};
