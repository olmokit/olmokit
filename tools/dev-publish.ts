/**
 * @file
 *
 * After this you should go to the project you want to to test these local
 * libs and run `pnpm link --global {packageName}
 */
import chalk from "chalk";
import { Command } from "commander";
import { $ } from "execa";
import { publish as ghpagesPublish } from "gh-pages";
import inquirer from "inquirer";
import ora, { oraPromise } from "ora";
import { exit } from "process";
import semver from "semver";
import { type Options, oraOpts } from "./dev.js";
import { type Lib, editJSONfile, self } from "./helpers.js";

export const publish = () =>
  new Command("publish")
    .description("Publish packages")
    .action(async (opts: Options) => {
      if (iGitDirty()) {
        ora().fail("You have uncommited work. Cannot proceed.");
        exit(1);
      }

      ora().info(
        `${chalk.italic("Single version policy")} ${chalk.dim(
          "all packages will be published with the same version"
        )}`
      );

      // ask for release
      const { release } = await promptRelease(
        "Olmo packages",
        self().packageJson.version
      );

      // bump libs src
      await Promise.all(
        self().libs.map(async (lib) =>
          oraPromise(bumbLib(lib, release), {
            ...oraOpts,
            text: "Bump package version",
            suffixText: chalk.dim(`${lib.name}`),
          })
        )
      );

      // build libs
      await oraPromise(
        $({ stdio: "inherit" })`nx run-many --all --targets=build`,
        {
          text: `Build all libs with updated version`,
        }
      );

      // prepublish libs
      await Promise.all(
        self().libs.map(async (lib) =>
          oraPromise(prepublishLib(lib, release), {
            ...oraOpts,
            text: `Pre-publish ${chalk.bold(lib.packager)} package`,
            suffixText: chalk.dim(`${lib.name}`),
          })
        )
      );

      // commit files
      await oraPromise(
        $({ stdio: "inherit" })`git commit -am ${`chore(release): v${release.version}`}`,
        {
          text: `Commit files edited during release`,
        }
      );

      // publish libs
      await Promise.all(
        self().libs.map(async (lib) =>
          oraPromise(publishLib(lib, release), {
            ...oraOpts,
            text: `Publish ${chalk.bold(lib.packager)} package`,
            suffixText: chalk.dim(`${lib.name}`),
          })
        )
      );

      // postpublish (at the level of this repo (not each libs))
      await oraPromise(postpublish(release), {
        text: `Create and push release tag to this repo`,
      });
    });

type Release = {
  type: semver.ReleaseType | "asIs";
  version: string;
};

/**
 * @resources
 * - [node-is-git-dirty](https://github.com/JPeer264/node-is-git-dirty)
 * - [SO thread](https://stackoverflow.com/q/3878624/1938970)
 */
function iGitDirty() {
  try {
    const { stdout } = $.sync`git status --short`;

    return stdout.length;
  } catch (e) {
    return false;
  }
}

/**
 * We bump the version only in **src** relying on a subsequent `nx build` to
 * retain the correct version in the generated **dist**. Following
 * a single version policy this does not seem necessary but actually `nx` gives
 * problems recognizing the internal dependency graph if a package does not
 * specify its version in its package.json and it also does not produce the right
 * `dependencies` versions in the built `package.json`. Furthermore this approach
 * gives us the flexibility to more easily move away from the single version
 * policy toward an "independent" policy if needed.
 */
async function bumbLib(lib: Lib, release: Release) {
  await editJSONfile(self().root, "package.json", (data) => {
    data.version = release.version;
  });
  if (lib.packager === "npm") {
    await editJSONfile(lib.src, "package.json", (data) => {
      data.version = release.version;
    });
  } else if (lib.packager === "composer") {
    await editJSONfile(lib.src, "composer.json", (data) => {
      data.version = release.version;
    });
  }
}

/**
 * We specify the version in the `composer.json` in the **src** of the package
 * but we remove it from the **dist** file following what is suggested in the
 * [composer docs](https://getcomposer.org/doc/04-schema.md#version).
 */
async function prepublishLib(lib: Lib, release: Release) {
  if (lib.packager === "composer") {
    await editJSONfile([lib.src, lib.dist], "composer.json", (data) => {
      delete data.version;
    });
  }
}

async function publishLib(lib: Lib, release: Release) {
  if (lib.packager === "npm") {
    await $({ cwd: lib.dist })`npm publish --access public`;
  } else if (lib.packager === "composer") {
    return new Promise<void>((resolve, reject) => {
      ghpagesPublish(
        lib.dist,
        {
          branch: "main",
          dotfiles: true,
          repo: lib.composerJson.support.source,
          tag: lib.version,
          push: true,
          message: `chore(release): v${release.version}`,
        },
        (err) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        }
      );
    });
  }
}

/**
 * @see https://git-scm.com/book/en/v2/Git-Basics-Tagging
 */
async function postpublish(release: Release) {
  const tagName = `v${release.version}`;
  await $`git tag -a ${tagName} -m ${"Release " + release.version}"`;
  await $`git push origin ${tagName}`;
}

async function promptRelease(subject, currentVersion: string) {
  return await inquirer.prompt<{
    release: Release;
  }>([
    {
      name: "release",
      message: "Choose new version",
      suffix: ` ${chalk.dim(subject)}`,
      choices: createReleaseTypeChoices(currentVersion),
      type: "list",
      validate: (options) => {
        if (!options.length) {
          return "Choose one of the above, use space to choose the option";
        }

        return true;
      },
    },
  ]);
}

function createReleaseTypeChoice(
  releaseType: semver.ReleaseType,
  currentVersion: string
) {
  const newVersion = semver.inc(currentVersion, releaseType, "alpha", "1");

  return {
    name: `${releaseType} ${chalk.dim(
      chalk.bold(currentVersion) + " -> " + chalk.bold(newVersion)
    )}`,
    value: { type: releaseType, version: newVersion },
  };
}

function createReleaseTypeChoices(currentVersion: string) {
  return [
    createReleaseTypeChoice("patch", currentVersion),
    createReleaseTypeChoice("minor", currentVersion),
    createReleaseTypeChoice("major", currentVersion),
    createReleaseTypeChoice("prepatch", currentVersion),
    createReleaseTypeChoice("preminor", currentVersion),
    createReleaseTypeChoice("premajor", currentVersion),
    {
      name: `as is ${chalk.bold(currentVersion)}`,
      value: { type: "asIs", version: currentVersion },
    },
  ];
}
