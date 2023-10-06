import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import ci from "ci-info";
import { filer } from "@olmokit/cli-utils";
// filer
import { runIfDevAndMissingFile } from "../../helpers-getters.js";
import { getInternalIps } from "../helpers/index.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

/**
 * Create htaccess file if not existing on user's machine
 */
async function maybeCreateFile(name: string) {
  const filename = name ? `.htaccess.${name}` : ".htaccess";
  await runIfDevAndMissingFile(join(paths.frontend.dest.public, filename), () =>
    filer(filename, {
      base: paths.self.templates,
      dest: paths.frontend.dest.public,
    }),
  );
}

// const htaccessCurrent: CliLaravel.Task = () => maybeCreateFile("");
// htaccessCurrent.meta = { title: ".htaccess for current env" };

// const htaccessDev: CliLaravel.Task = () => maybeCreateFile("dev");
// htaccessDev.meta = { title: ".htaccess for 'dev' env" };

// const htaccessStaging: CliLaravel.Task = () => maybeCreateFile("staging");
// htaccessStaging.meta = { title: ".htaccess for 'staging' env" };

// const htaccessProduction: CliLaravel.Task = () => maybeCreateFile("production");
// htaccessProduction.meta = { title: ".htaccess for 'production' env" };

/**
 * Htaccess reusable function for hashed assets
 */
async function htaccessHashed(
  dest: string,
  extensions: string[],
  hours: number,
) {
  await filer("htaccess-assets-hashed", {
    base: paths.self.templates,
    data: {
      extensions: extensions.join("|"),
      days: hours * 60 * 60,
    },
    rename: ".htaccess",
    dest,
  });
}

function getHtaccessAllowedIps(filecontent: string) {
  const regex = /Allow from(.+)/gim;
  const ips = [];
  let matches;

  while ((matches = regex.exec(filecontent)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (matches.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    if (matches[1]) {
      ips.push(matches[1]);
    }
  }
  return ips.map((value) => value.trim());
}

// const htaccessEntries: CliLaravel.Task = () =>
//   htaccessHashed(paths.frontend.dest.entries, ["js", "css", "txt"], 24 * 365);
// htaccessEntries.meta = { title: ".htacces for entries" };

// const htaccessChunks: CliLaravel.Task = () =>
//   htaccessHashed(paths.frontend.dest.chunks, ["js", "css", "txt"], 24 * 365);
// htaccessChunks.meta = { title: ".htacces for chunks" };

// const htaccessImages: CliLaravel.Task = () =>
//   htaccessHashed(
//     paths.frontend.dest.images,
//     ["gif", "png", "jpg", "jpeg", "svg", "webp"],
//     24 * 365
//   );
// htaccessImages.meta = { title: ".htacces for images" };

// const htaccessFonts: CliLaravel.Task = () =>
//   htaccessHashed(
//     paths.frontend.dest.fonts,
//     ["woff", "woff2", "ttf", "otf", "eot"],
//     24 * 365
//   );
// htaccessFonts.meta = { title: ".htacces for fonts" };

// const htaccessFavicons: CliLaravel.Task = () =>
//   htaccessHashed(
//     paths.frontend.dest.favicons,
//     ["png", "json", "xml", "webapp", "ico"],
//     4
//   );
// htaccessFavicons.meta = { title: ".htacces for favicons" };

/**
 * Add the current runner IP to the htaccess allow section in dev/staging
 * protected environments
 *
 * Order allow,deny
 * Allow from 185.31.102.112
 * Allow from 83.91.216.141
 */
const htaccessModify: CliLaravel.Task = async () => {
  const allowedIps = getInternalIps();

  if (!ci.isCI || !allowedIps.length) {
    return;
  }

  const src = join(paths.frontend.dest.public, ".htaccess");
  let content = await readFile(src, { encoding: "utf-8" });
  const existingIps = getHtaccessAllowedIps(content);
  const ipsToAdd = existingIps.length
    ? allowedIps.filter((ip) => !existingIps.includes(ip))
    : allowedIps;

  // if we already have all the ips whitelisted do nothing
  if (!ipsToAdd.length) {
    return;
  }

  // if we do not we add the rule
  const toInsert = `Order allow,deny${ipsToAdd
    .map((ip) => `\nAllow from ${ip}`)
    .join("")}\n`;

  // if there is already the rule tweak it
  if (/Order allow,deny/gim.test(content)) {
    content = content.replace(/Order allow,deny[.|\s|\n|\r]/gim, toInsert);
    // otherwise let's be sure there is an Auth basic protection in the htaccess
    // and in case add the lines at the end of the block
  } else if (/^AuthType Basic/gim.test(content)) {
    content = content.replace(
      /(AuthType Basic)((.|\s|\n|\r)*?)(^|[^\n])\n{2}(?!\n)/,
      `$1$2$4\n${toInsert}`,
    );
  } else {
    // otherwise we just add the lines at the begininng of the htaccess file,
    // it is a bit unsafe perhaps... on production we will never have such
    // problem, in theory, htaccess will never block access
    if (process.env.APP_ENV !== "production") {
      const lines = content.split("\n");
      lines.splice(2, 0, toInsert);
      content = lines.join("\n");
    }
  }

  // add satisfy if missing
  if (!/Satisfy any/gim.test(content)) {
    const matches = content.match(/Allow.+$/gm);

    const lastMatch =
      matches && matches.length ? matches[matches.length - 1] : null;
    if (lastMatch) {
      content = content.replace(lastMatch, `${lastMatch}\nSatisfy any\n`);
    }
  }

  await writeFile(src, content);
};
htaccessModify.meta = { title: "Ensure .htaccess security" };

export const htaccess: CliLaravel.Task = async (arg) => {
  const { ctx, spinner } = arg;

  if (process.env["NODE_ENV"] === "production") {
    await Promise.all(
      [
        async () => {
          await htaccessHashed(
            paths.frontend.dest.entries,
            ["js", "css", "txt"],

            24 * 365,
          );
          spinner.suffixText = spinner.suffixText + " / entries";
        },
        async () => {
          await htaccessHashed(
            paths.frontend.dest.chunks,
            ["js", "css", "txt"],
            24 * 365,
          );
          spinner.suffixText = spinner.suffixText + " / chunks";
        },
        async () => {
          await htaccessHashed(
            paths.frontend.dest.images,
            ["gif", "png", "jpg", "jpeg", "svg", "webp"],
            24 * 365,
          );
          spinner.suffixText = spinner.suffixText + " / images ";
        },
        async () => {
          await htaccessHashed(
            paths.frontend.dest.fonts,
            ["woff", "woff2", "ttf", "otf", "eot"],
            24 * 365,
          );
          spinner.suffixText = spinner.suffixText + " / fonts ";
        },
        async () => {
          await htaccessHashed(
            paths.frontend.dest.favicons,
            ["png", "json", "xml", "webapp", "ico"],
            4,
          );
          spinner.suffixText = spinner.suffixText + " / favicons ";
        },
        async () => {
          await htaccessModify(arg);
          // spinner.
        },
      ].map((fn) => fn()),
    );
    return;
    // return await taskr.parallel(
    //   htaccessEntries,
    //   htaccessChunks,
    //   htaccessImages,
    //   htaccessFonts,
    //   htaccessFavicons,
    //   htaccessModify
    // );
  }

  await Promise.all(
    // add current too (no env name)
    ["", ...ctx.env.names].map(async (envName) => {
      await maybeCreateFile(envName);
      spinner.suffixText = spinner.suffixText + ` / ${envName || "current"}`;
    }),
  );
  return;

  // return taskr.parallel(
  //   // htaccessModify, // to debug...
  //   htaccessCurrent,
  //   htaccessDev,
  //   htaccessStaging,
  //   htaccessProduction
  // );
};
htaccess.meta = { title: "Manage .htaccess files" };
