import { readFile, writeFile } from "node:fs/promises";
import ci from "ci-info";
import { configDotenv } from "dotenv";
import { filer } from "@olmokit/cli-utils/filer";
import { project } from "../../project.js";
import { getBaseUrl, getInternalIps } from "../helpers/index.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

const envGenerateLaravel: CliLaravel.Task = async ({ ctx }) => {
  filer("env.php", {
    base: paths.laravel.tpl.config,
    data: {
      vars: ctx.env.vars,
    },
    dest: paths.laravel.app.config,
  });
};
envGenerateLaravel.meta = { title: "Autogenerate Laravel's config/env.php" };

/**
 * Add IPS allowed by default to .env hooks allowed ips variable
 */
function addIpsToHooks(allowedIps: string[], currentValue = "") {
  if (allowedIps.length) {
    const parts = currentValue.split("=");

    if (parts[1]) {
      const ips = new Set(
        parts[1]
          .split(",")
          .map((val) => val.trim())
          .filter((val) => !!val)
      );

      allowedIps.forEach((ip) => ips.add(ip));

      currentValue = `HOOKS_ALLOWED_IPS=${Array.from(ips).join(",")}\n`;

      return currentValue;
    }
  }

  return currentValue;
}

/**
 * Dynamically add the webpack-dev-server url. It needs to be done this way
 * because we first need some environment variables, then we need to determine
 * a free port to use, after that we can set the DEV_WDS_URL in the env file
 * so that it can be used server side too during development to load static
 * resources from webpack-dev-server memory. Then we need to reload the env
 * by recalling the task `envLoad`.
 *
 * On production just strips the DEV_WDS_URL, which should not be there in
 * general, especially in the CI, but it is probably there when building the
 * website locally.
 */
const envSetupModify: CliLaravel.Task = async () => {
  let content = await readFile(project.envPath, { encoding: "utf-8" });

  // add hooks allowed ips only during ci deployment
  if (ci.isCI) {
    const allowedIps = getInternalIps();

    // if the variable is defined in the .env file tweak it
    if (/HOOKS_ALLOWED_IPS/.test(content)) {
      content = content.replace(
        /HOOKS_ALLOWED_IPS.+$[.|\s|\n|\r]*(?=\S)/gm,
        (match) => {
          const newValue = addIpsToHooks(allowedIps, match);
          // console.log("HOOKS_ALLOWED_IPS", newValue);
          return newValue;
        }
      );
      // otherwise add it
    } else {
      content += `\nHOOKS_ALLOWED_IPS=${allowedIps.join(",")}\n`;
    }
  }

  // remove existing webpack-dev-server url
  content = content.replace(
    /[\n|\r]*DEV_WDS_URL.+$[.|\s|\n|\r]*(?=\S)*/gm,
    "\n"
  );
  // and add it during development
  if (process.env["NODE_ENV"] === "development") {
    content += `\nDEV_WDS_URL=${getBaseUrl()}\n`;
  }

  await writeFile(project.envPath, content);
};
envSetupModify.meta = { title: "tweak .env file" };

const envSetupLoad: CliLaravel.Task = async () => {
  configDotenv({
    override: true,
  });
  return;
};
envSetupLoad.meta = { title: "reload .env" };

/**
 * Rerun dotenv programmatically, so that we can load it after the file has
 * been generated in case it was missing and after the `envSetupModify` dynamic
 * configuration
 *
 * TODO: check whether we need to refine this task group
 */
export const env: CliLaravel.TaskGroup = {
  meta: { title: "Manage .env file" },
  children: [envGenerateLaravel, envSetupModify, envSetupLoad],
};
