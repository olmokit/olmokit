/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

import { execSync, spawnSync } from "node:child_process";
import { lookup } from "node:dns";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { get } from "node:https";
import { EOL } from "node:os";
import { basename, join, resolve } from "node:path";
import { parse as urlParse } from "node:url";
import chalk from "chalk";
import { Command } from "commander";
import { spawn } from "cross-spawn";
import { run as envinfoRun } from "envinfo";
import { $ } from "execa";
// import hyperquest from "hyperquest";s
// import { temporaryDirectory} from 'tempy';
// import tar from "tar";
import { ensureDirSync } from "fs-extra";
// import validateProjectName from "validate-npm-package-name";
// shared with cli
// import packageJson from "../package.json";
import { tryGitInit } from "./git.js";

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

const packageJson = {
  name: "@olmokit/create-laravel-app",
  version: "0.0.3",
};

// shared with cli

let projectName: string;

type CommandOptions = {
  verbose: boolean;
  info?: boolean;
  scriptsVersion: string;
  template: string;
  useNpm?: boolean;
  usePnp?: boolean;
};

const semverLt = require("semver/functions/lt");
const semverSatisfies = require("semver/functions/satisfies");
const semverValid = require("semver/functions/valid");
const semverGte = require("semver/functions/gte");

export function init() {
  const program = new Command(packageJson.name)
    .version(packageJson.version)
    .arguments("<project-directory>")
    .usage(`${chalk.green("<project-directory>")} [options]`)
    .action((name) => {
      projectName = name;
    })
    .option("--verbose", "print additional logs")
    .option("--info", "print environment debug info")
    .option(
      "--scripts-version <alternative-package>",
      "use a non-standard version of cli"
    )
    .option(
      "--template <path-to-template>",
      "specify a template for the created project"
    )
    .option("--use-npm")
    .option("--use-pnp")
    .allowUnknownOption()
    .on("--help", () => {
      console.log(
        `    Only ${chalk.green("<project-directory>")} is required.`
      );
      console.log();
      console.log(
        `    A custom ${chalk.cyan("--scripts-version")} can be one of:`
      );
      console.log(`      - a specific npm version: ${chalk.green("0.8.2")}`);
      console.log(`      - a specific npm tag: ${chalk.green("@next")}`);
      console.log(
        `      - a custom fork published on npm: ${chalk.green("my-cli")}`
      );
      console.log(
        `      - a local path relative to the current working directory: ${chalk.green(
          "file:../my-cli"
        )}`
      );
      console.log(
        `      - a .tgz archive: ${chalk.green(
          "https://mysite.com/my-cli-0.8.2.tgz"
        )}`
      );
      console.log(
        `      - a .tar.gz archive: ${chalk.green(
          "https://mysite.com/my-cli-0.8.2.tar.gz"
        )}`
      );
      console.log(
        `    It is not needed unless you specifically want to use a fork.`
      );
      console.log();
      console.log(`    A custom ${chalk.cyan("--template")} can be one of:`);
      console.log(
        `      - a custom template published on npm: ${chalk.green(
          "@olmokit/template-laravel-typescript"
        )}`
      );
      console.log(
        `      - a local path relative to the current working directory: ${chalk.green(
          "file:../my-custom-template"
        )}`
      );
      console.log(
        `      - a .tgz archive: ${chalk.green(
          "https://mysite.com/my-custom-template-0.8.2.tgz"
        )}`
      );
      console.log(
        `      - a .tar.gz archive: ${chalk.green(
          "https://mysite.com/my-custom-template-0.8.2.tar.gz"
        )}`
      );
      console.log();
      console.log(
        `    If you have any problems, do not hesitate to file an issue:`
      );
      console.log(
        `      ${chalk.cyan("https://github.com/olmokit/olmokit/issues/new")}`
      );
      console.log();
    })
    .parse(process.argv);

  const programOptions = program.options as unknown as CommandOptions;

  if (programOptions.info) {
    console.log(chalk.bold("\nEnvironment Info:"));
    console.log(
      `\n  current version of ${packageJson.name}: ${packageJson.version}`
    );
    console.log(`  running from ${__dirname}`);
    return envinfoRun(
      {
        System: ["OS", "CPU"],
        Binaries: ["Node", "npm", "Yarn"],
        Browsers: ["Chrome", "Edge", "Internet Explorer", "Firefox", "Safari"],
        npmPackages: ["@olmokit/cli"],
        npmGlobalPackages: ["@olmokit/create-laravel-app"],
      },
      {
        duplicates: true,
        showNotFound: true,
      }
    ).then(console.log);
  }

  if (typeof projectName === "undefined") {
    console.error("Please specify the project directory:");
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green("<project-directory>")}`
    );
    console.log();
    console.log("For example:");
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green("myapp")}`);
    console.log();
    console.log(
      `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
  }

  // We first check the registry directly via the API, and if that fails, we try
  // the slower `npm view [package] version` command.
  //
  // This is important for users in environments where direct access to npm is
  // blocked by a firewall, and packages are provided exclusively via a private
  // registry.
  (checkForLatestVersion() as Promise<string | undefined>)
    .catch(() => {
      try {
        return execSync("npm view @olmokit/create-laravel-app version")
          .toString()
          .trim();
      } catch (e) {
        return "0.0.1";
      }
    })
    .then((latest?: string) => {
      if (latest && semverLt(packageJson.version, latest)) {
        console.log();
        console.error(
          chalk.yellow(
            `You are running \`@olmokit/create-laravel-app\` ${packageJson.version}, which is behind the latest release (${latest}).\n\n` +
              "We no longer support global installation of Create Laravel App."
          )
        );
        console.log();
        console.log(
          "Please remove any global installs with one of the following commands:\n" +
            "- npm uninstall -g @olmokit/create-laravel-app\n" +
            "- yarn global remove @olmokit/create-laravel-app"
        );
        console.log();
        // console.log(
        //   'The latest instructions for creating a new app can be found here:\n' +
        //     'https://create-react-app.dev/docs/getting-started/'
        // );
        console.log();
        process.exit(1);
      } else {
        createApp(
          projectName,
          programOptions.verbose,
          programOptions.scriptsVersion,
          programOptions.template,
          programOptions.useNpm,
          programOptions.usePnp
        );
      }
    });

  return;
}

function createApp(
  name: string,
  verbose: boolean,
  version: string,
  template: string,
  useNpm?: boolean,
  usePnp?: boolean
) {
  const unsupportedNodeVersion = !semverSatisfies(process.version, ">=18");
  if (unsupportedNodeVersion) {
    console.log(
      chalk.yellow(
        `You are using Node ${process.version} so the project will be bootstrapped with an old unsupported version of tools.\n\n` +
          `Please update to Node 18 or higher for a better, fully supported experience.\n`
      )
    );
    // Fall back to latest supported cli on Node 4
    // version = 'cli@0.9.x';
    process.exit(1);
  }

  const root = resolve(name);
  const appName = basename(root);

  checkAppName(appName);
  ensureDirSync(name);
  if (!isSafeToCreateProjectIn(root, name)) {
    process.exit(1);
  }
  console.log();

  console.log(`Creating a new Laravel app in ${chalk.green(root)}.`);
  console.log();

  const packageJson = {
    private: true,
    name: `@olmokit/${appName}`,
    version: "0.0.1",
  };
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify(packageJson, null, 2) + EOL
  );

  // init git here, so husky install does not break
  if (tryGitInit(root)) {
    console.log();
    console.log("Initialized a git repository.");
  }

  const useYarn = useNpm ? false : shouldUseYarn();
  const originalDirectory = process.cwd();
  process.chdir(root);

  if (!useYarn) {
    const npmInfo = checkNpmVersion();
    if (!npmInfo.hasMinNpm) {
      if (npmInfo.npmVersion) {
        console.log(
          chalk.yellow(
            `You are using npm ${npmInfo.npmVersion} so the project will be bootstrapped with an old unsupported version of tools.\n\n` +
              `Please update to npm 6 or higher for a better, fully supported experience.\n`
          )
        );
      }
      // Fall back to latest supported cli for npm 3
      version = "cli@0.9.x";
    }
  } else if (usePnp) {
    const yarnInfo = checkYarnVersion();
    if (yarnInfo.yarnVersion) {
      if (!yarnInfo.hasMinYarnPnp) {
        console.log(
          chalk.yellow(
            `You are using Yarn ${yarnInfo.yarnVersion} together with the --use-pnp flag, but Plug'n'Play is only supported starting from the 1.12 release.\n\n` +
              `Please update to Yarn 1.12 or higher for a better, fully supported experience.\n`
          )
        );
        // 1.11 had an issue with webpack-dev-middleware, so better not use PnP with it (never reached stable, but still)
        usePnp = false;
      }
      if (!yarnInfo.hasMaxYarnPnp) {
        console.log(
          chalk.yellow(
            "The --use-pnp flag is no longer necessary with yarn 2 and will be deprecated and removed in a future release.\n"
          )
        );
        // 2 supports PnP by default and breaks when trying to use the flag
        usePnp = false;
      }
    }
  }

  if (useYarn) {
    let yarnUsesDefaultRegistry = true;
    try {
      yarnUsesDefaultRegistry =
        execSync("yarnpkg config get registry").toString().trim() ===
        "https://registry.yarnpkg.com";
    } catch (e) {
      // ignore
    }
    if (yarnUsesDefaultRegistry) {
      copyFileSync(
        require.resolve("./yarn.lock.cached"),
        join(root, "yarn.lock")
      );
    }
  }

  run(
    root,
    appName,
    version,
    verbose,
    originalDirectory,
    template,
    useYarn,
    usePnp
  );
}

function shouldUseYarn() {
  return false; // disable yarn for now...
  try {
    execSync("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

async function install(
  root: string,
  useYarn?: boolean,
  usePnp?: boolean,
  dependencies: string[] = [],
  verbose?: boolean,
  isOnline?: boolean
) {
  let command: string;
  let args: string[];
  if (useYarn) {
    command = "yarnpkg";
    args = ["add", "--exact"];
    if (!isOnline) {
      args.push("--offline");
    }
    if (usePnp) {
      args.push("--enable-pnp");
    }
    [].push.apply(args, dependencies as never[]);

    // Explicitly set cwd() to work around issues like
    // https://github.com/facebook/create-react-app/issues/3326.
    // Unfortunately we can only do this for Yarn because npm support for
    // equivalent --prefix flag doesn't help with this issue.
    // This is why for npm, we run checkThatNpmCanReadCwd() early instead.
    args.push("--cwd");
    args.push(root);

    if (!isOnline) {
      console.log(chalk.yellow("You appear to be offline."));
      console.log(chalk.yellow("Falling back to the local Yarn cache."));
      console.log();
    }
  } else {
    command = "npm";
    args = ["install", "--save", "--save-exact", "--loglevel", "error"].concat(
      dependencies
    );

    if (usePnp) {
      console.log(chalk.yellow("NPM doesn't support PnP."));
      console.log(chalk.yellow("Falling back to the regular installs."));
      console.log();
    }
  }

  if (verbose) {
    args.push("--verbose");
  }

  const { exitCode } = $({ stdio: "inherit" })`${command} ${args}`;
  if (exitCode === 1) {
    return { command: `${command} ${args.join(" ")}` };
  }

  return;
}

function run(
  root: string,
  appName: string,
  version: string,
  verbose: boolean,
  originalDirectory: string,
  template: string,
  useYarn?: boolean,
  usePnp?: boolean
) {
  Promise.all([
    getInstallPackage(version, originalDirectory),
    getTemplateInstallPackage(template, originalDirectory),
  ]).then(([packageToInstall, templateToInstall]) => {
    const allDependencies = [
      // TODO: make this list autogenerated?
      // FIXME: this list should depend on the CLI context...once we implement
      // different ones, then we will also prompt the user to select a CLI
      // context here earlier
      "@olmokit/browser",
      "@olmokit/cli",
      "@olmokit/components",
      "@olmokit/core",
      "@olmokit/dom",
      "@olmokit/use",
      "@olmokit/utils",
      packageToInstall,
    ];

    console.log("Installing packages. This might take a couple of minutes.");

    Promise.all([
      getPackageInfo(packageToInstall),
      getPackageInfo(templateToInstall),
    ])
      .then(([packageInfo, templateInfo]) =>
        checkIfOnline(useYarn).then((isOnline) => ({
          isOnline,
          packageInfo,
          templateInfo,
        }))
      )
      .then(({ isOnline, packageInfo, templateInfo }) => {
        allDependencies.push(templateToInstall);

        console.log(
          `Installing ${chalk.cyan(packageInfo.name)} with ${chalk.cyan(
            templateInfo.name
          )}...`
        );
        console.log();

        return install(
          root,
          useYarn,
          usePnp,
          allDependencies,
          verbose,
          isOnline
        ).then(() => ({
          packageInfo,
          templateInfo,
        }));
      })
      .then(async ({ packageInfo, templateInfo }) => {
        const packageName = packageInfo.name;
        const templateName = templateInfo.name;
        checkNodeVersion(packageName);
        setCaretRangeForRuntimeDeps(packageName);

        const pnpPath = resolve(process.cwd(), ".pnp.js");

        const nodeArgs = existsSync(pnpPath) ? ["--require", pnpPath] : [];

        await executeNodeScript(
          {
            cwd: process.cwd(),
            args: nodeArgs,
          },
          [root, appName, verbose, originalDirectory, templateName],
          `
        var init = require('${packageName}/scripts/bootstrap.js');
        init.apply(null, JSON.parse(process.argv[1]));
      `
        );

        // if (version === 'cli@0.9.x') {
        //   console.log(
        //     chalk.yellow(
        //       `\nNote: the project was bootstrapped with an old unsupported version of tools.\n` +
        //         `Please update to Node >=18 and npm >=6 to get supported tools in new projects.\n`
        //     )
        //   );
        // }
      })
      .catch((reason) => {
        console.log();
        console.log("Aborting installation.");
        if (reason.command) {
          console.log(`  ${chalk.cyan(reason.command)} has failed.`);
        } else {
          console.log(
            chalk.red("Unexpected error. Please report it as a bug:")
          );
          console.log(reason);
        }
        console.log();

        // On 'exit' we will delete these files from target directory.
        const knownGeneratedFiles = [
          // "package.json",
          "yarn.lock",
          // "node_modules",
        ];
        const currentFiles = readdirSync(join(root));
        currentFiles.forEach((file) => {
          knownGeneratedFiles.forEach((fileToMatch) => {
            // This removes all knownGeneratedFiles.
            if (file === fileToMatch) {
              console.log(`Deleting generated file... ${chalk.cyan(file)}`);
              rmSync(join(root, file));
            }
          });
        });
        const remainingFiles = readdirSync(join(root));
        if (!remainingFiles.length) {
          // Delete target folder if empty
          console.log(
            `Deleting ${chalk.cyan(`${appName}/`)} from ${chalk.cyan(
              resolve(root, "..")
            )}`
          );
          process.chdir(resolve(root, ".."));
          rmSync(join(root));
        }
        console.log("Done.");
        process.exit(1);
      });
  });
}

function getInstallPackage(version: string, originalDirectory: string) {
  let packageToInstall = "@olmokit/cli";
  const validSemver = semverValid(version);
  if (validSemver) {
    packageToInstall += `@${validSemver}`;
  } else if (version) {
    if (version[0] === "@" && !version.includes("/")) {
      packageToInstall += version;
    } else if (version.match(/^file:/)) {
      packageToInstall = `file:${resolve(
        originalDirectory,
        version.match(/^file:(.*)?$/)![1]
      )}`;
    } else {
      // for tar.gz or alternative paths
      packageToInstall = version;
    }
  }

  return Promise.resolve(packageToInstall);
}

export function getTemplateInstallPackage(
  template: string,
  originalDirectory: string
) {
  let templateToInstall = "@olmokit/template-laravel";
  if (template) {
    if (template.match(/^file:/)) {
      templateToInstall = `file:${resolve(
        originalDirectory,
        template.match(/^file:(.*)?$/)?.[1] || ""
      )}`;
    } else if (
      template.includes("://") ||
      template.match(/^.+\.(tgz|tar\.gz)$/)
    ) {
      // for tar.gz or alternative paths
      templateToInstall = template;
    } else {
      // Add prefix '@olmokit/template-' to non-prefixed templates, leaving any
      // @scope/ and @version intact.
      const packageMatch = template.match(/^(@[^/]+\/)?([^@]+)?(@.+)?$/);
      const scope = packageMatch?.[1] || "";
      const templateName = packageMatch?.[2] || "";
      const version = packageMatch?.[3] || "";

      if (
        templateName === templateToInstall ||
        templateName.startsWith(`${templateToInstall}-`)
      ) {
        // Covers:
        // - @olmokit/template
        // - @SCOPE/@olmokit/template
        // - @olmokit/template-NAME
        // - @SCOPE/@olmokit/template-NAME
        templateToInstall = `${scope}${templateName}${version}`;
      } else if (version && !scope && !templateName) {
        // Covers using @SCOPE only
        templateToInstall = `${version}/${templateToInstall}`;
      } else {
        // Covers templates without the `@olmokit/template` prefix:
        // - NAME
        // - @SCOPE/NAME
        templateToInstall = `${scope}${templateToInstall}-${templateName}${version}`;
      }
    }
  }

  return Promise.resolve(templateToInstall);
}

// Extract package name from tarball url or path.
async function getPackageInfo(installPackage: string) {
  if (installPackage.match(/^.+\.(tgz|tar\.gz)$/)) {
    // FIXME: we should support defining packages as tarball
    // const tempDir = temporaryDirectory();
    // let stream;
    // if (/^http/.test(installPackage)) {
    //   stream = hyperquest(installPackage);
    // } else {
    //   stream = createReadStream(installPackage);
    // }
    // // return extractStream(stream, obj.tmpdir).then(() => obj);
    // const extracted = await tar.x({
    //   file: installPackage,
    //   path: tempDir,
    // }, [
    //   "package.json"
    // ]);
    //   .then((obj) => {
    //     const { name, version } = require(join(
    //       obj.tmpdir,
    //       "package.json"
    //     ));
    //     obj.cleanup();
    //     return { name, version };
    //   })
    //   .catch((err) => {
    //     // The package name could be with or without semver version, e.g. cli-0.2.0-alpha.1.tgz
    //     // However, this function returns package name only without semver version.
    //     console.log(
    //       `Could not extract the package name from the archive: ${err.message}`
    //     );
    //     const assumedProjectName = installPackage.match(
    //       /^.+\/(.+?)(?:-\d+.+)?\.(tgz|tar\.gz)$/
    //     )?.[1];
    //     console.log(
    //       `Based on the filename, assuming it is "${chalk.cyan(
    //         assumedProjectName
    //       )}"`
    //     );
    //     return { name: assumedProjectName };
    //   });
  } else if (installPackage.startsWith("git+")) {
    // Pull package name out of git urls e.g:
    // git+https://github.com/mycompany/cli.git
    // git+ssh://github.com/mycompany/cli.git#v1.2.3
    return {
      name: installPackage.match(/([^/]+)\.git(#.*)?$/)?.[1],
    };
  } else if (installPackage.match(/.+@/)) {
    // Do not match @scope/ when stripping off @version or @tag
    return {
      name: installPackage.charAt(0) + installPackage.substr(1).split("@")[0],
      version: installPackage.split("@")[1],
    };
  } else if (installPackage.match(/^file:/)) {
    const installPackagePath = installPackage.match(/^file:(.*)?$/)?.[1];
    if (!installPackagePath) {
      throw `Invalid installPackagePath`;
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { name, version } = require(join(installPackagePath, "package.json"));
    return { name, version };
  }
  return { name: installPackage };
}

function checkNpmVersion() {
  let hasMinNpm = false;
  let npmVersion = null;
  try {
    npmVersion = execSync("npm --version").toString().trim();
    hasMinNpm = semverGte(npmVersion, "6.0.0");
  } catch (err) {
    // ignore
  }
  return {
    hasMinNpm: hasMinNpm,
    npmVersion: npmVersion,
  };
}

function checkYarnVersion() {
  const minYarnPnp = "1.12.0";
  const maxYarnPnp = "2.0.0";
  let hasMinYarnPnp = false;
  let hasMaxYarnPnp = false;
  let yarnVersion = null;
  try {
    yarnVersion = execSync("yarnpkg --version").toString().trim();
    if (semverValid(yarnVersion)) {
      hasMinYarnPnp = semverGte(yarnVersion, minYarnPnp);
      hasMaxYarnPnp = semverLt(yarnVersion, maxYarnPnp);
    } else {
      // Handle non-semver compliant yarn version strings, which yarn currently
      // uses for nightly builds. The regex truncates anything after the first
      // dash. See #5362.
      const trimmedYarnVersionMatch = /^(.+?)[-+].+$/.exec(yarnVersion);
      if (trimmedYarnVersionMatch) {
        const trimmedYarnVersion = trimmedYarnVersionMatch.pop();
        if (trimmedYarnVersion) {
          hasMinYarnPnp = semverGte(trimmedYarnVersion, minYarnPnp);
          hasMaxYarnPnp = semverLt(trimmedYarnVersion, maxYarnPnp);
        }
      }
    }
  } catch (err) {
    // ignore
  }
  return {
    hasMinYarnPnp: hasMinYarnPnp,
    hasMaxYarnPnp: hasMaxYarnPnp,
    yarnVersion: yarnVersion,
  };
}

function checkNodeVersion(packageName: string) {
  const packageJsonPath = resolve(
    process.cwd(),
    "node_modules",
    packageName,
    "package.json"
  );

  if (!existsSync(packageJsonPath)) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require(packageJsonPath);
  if (!packageJson.engines || !packageJson.engines.node) {
    return;
  }

  if (!semverSatisfies(process.version, packageJson.engines.node)) {
    console.error(
      chalk.red(
        "You are running Node %s.\n" +
          "Create Laravel App requires Node %s or higher. \n" +
          "Please update your version of Node."
      ),
      process.version,
      packageJson.engines.node
    );
    process.exit(1);
  }
}

// FIXME: still use dependency `validate-npm-package-name`?
const validateProjectName = (_appName: string) => ({
  validForNewPackages: true,
  // errors: [],
  errors: undefined,
  warnings: undefined,
});

function checkAppName(appName: string) {
  const validationResult = validateProjectName(appName);
  if (!validationResult.validForNewPackages) {
    console.error(
      chalk.red(
        `Cannot create a project named ${chalk.green(
          `"${appName}"`
        )} because of npm naming restrictions:\n`
      )
    );
    [
      ...(validationResult.errors || []),
      ...(validationResult.warnings || []),
    ].forEach((error) => {
      console.error(chalk.red(`  * ${error}`));
    });
    console.error(chalk.red("\nPlease choose a different project name."));
    process.exit(1);
  }

  // TODO: there should be a single place that holds the dependencies
  const dependencies = [/* '@olmokit/frontend', */ "@olmokit/cli"].sort();
  if (dependencies.includes(appName)) {
    console.error(
      chalk.red(
        `Cannot create a project named ${chalk.green(
          `"${appName}"`
        )} because a dependency with the same name exists.\n` +
          `Due to the way npm works, the following names are not allowed:\n\n`
      ) +
        chalk.cyan(dependencies.map((depName) => `  ${depName}`).join("\n")) +
        chalk.red("\n\nPlease choose a different project name.")
    );
    process.exit(1);
  }
}

// function makeCaretRange(dependencies: Record<string, string>, name: string) {
//   const version = dependencies[name];

//   if (typeof version === "undefined") {
//     console.error(chalk.red(`Missing ${name} dependency in package.json`));
//     process.exit(1);
//   }

//   let patchedVersion = `^${version}`;

//   if (!semverValidRange(patchedVersion)) {
//     console.error(
//       `Unable to patch ${name} dependency version because version ${chalk.red(
//         version
//       )} will become invalid ${chalk.red(patchedVersion)}`
//     );
//     patchedVersion = version;
//   }

//   dependencies[name] = patchedVersion;
// }

function setCaretRangeForRuntimeDeps(packageName: string) {
  const packagePath = join(process.cwd(), "package.json");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require(packagePath);

  if (typeof packageJson.dependencies === "undefined") {
    console.error(chalk.red("Missing dependencies in package.json"));
    process.exit(1);
  }

  const packageVersion = packageJson.dependencies[packageName];
  if (typeof packageVersion === "undefined") {
    console.error(chalk.red(`Unable to find ${packageName} in package.json`));
    process.exit(1);
  }

  // makeCaretRange(packageJson.dependencies, '@olmokit/frontend');

  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + EOL);
}

// If project only contains files generated by GH, it’s safe.
// Also, if project contains remnant error logs from a previous
// installation, lets remove them now.
// We also special case IJ-based products .idea because it integrates with CRA:
// https://github.com/facebook/create-react-app/pull/368#issuecomment-243446094
function isSafeToCreateProjectIn(root: string, name: string) {
  const validFiles = [
    ".DS_Store",
    ".git",
    ".gitattributes",
    ".gitignore",
    ".gitlab-ci.yml",
    ".hg",
    ".hgcheck",
    ".hgignore",
    ".idea",
    ".npmignore",
    ".travis.yml",
    "docs",
    "LICENSE",
    "README.md",
    "mkdocs.yml",
    "Thumbs.db",
  ];
  // These files should be allowed to remain on a failed install, but then
  // silently removed during the next create.
  const errorLogFilePatterns = [
    "npm-debug.log",
    "yarn-error.log",
    "yarn-debug.log",
  ];
  const isErrorLog = (file: string) => {
    return errorLogFilePatterns.some((pattern) => file.startsWith(pattern));
  };

  const conflicts = readdirSync(root)
    .filter((file) => !validFiles.includes(file))
    // IntelliJ IDEA creates module files before CRA is launched
    .filter((file) => !/\.iml$/.test(file))
    // Don't treat log files from previous installation as conflicts
    .filter((file) => !isErrorLog(file));

  if (conflicts.length > 0) {
    console.log(
      `The directory ${chalk.green(name)} contains files that could conflict:`
    );
    console.log();
    for (const file of conflicts) {
      try {
        const stats = lstatSync(join(root, file));
        if (stats.isDirectory()) {
          console.log(`  ${chalk.blue(`${file}/`)}`);
        } else {
          console.log(`  ${file}`);
        }
      } catch (e) {
        console.log(`  ${file}`);
      }
    }
    console.log();
    console.log(
      "Either try using a new directory name, or remove the files listed above."
    );

    return false;
  }

  // Remove any log files from a previous installation.
  readdirSync(root).forEach((file) => {
    if (isErrorLog(file)) {
      rmSync(join(root, file));
    }
  });
  return true;
}

function getProxy() {
  if (process.env["https_proxy"]) {
    return process.env["https_proxy"];
  } else {
    try {
      // Trying to read https-proxy from .npmrc
      const httpsProxy = execSync("npm config get https-proxy")
        .toString()
        .trim();
      return httpsProxy !== "null" ? httpsProxy : undefined;
    } catch (e) {
      return;
    }
  }
}

function checkIfOnline(useYarn?: boolean): Promise<boolean> {
  if (!useYarn) {
    // Don't ping the Yarn registry.
    // We'll just assume the best case.
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    lookup("registry.yarnpkg.com", (err) => {
      let proxy: string | undefined;
      if (err != null && (proxy = getProxy())) {
        // If a proxy is defined, we likely can't resolve external hostnames.
        // Try to resolve the proxy name as an indication of a connection.
        if (proxy) {
          const urlString = urlParse(proxy, false).hostname;
          if (urlString) {
            lookup(urlString, (proxyErr) => {
              resolve(proxyErr == null);
            });
          }
        }
      } else {
        resolve(err == null);
      }
    });
  });
}

function executeNodeScript(
  {
    cwd,
    args,
  }: {
    cwd: string;
    args: string[];
  },
  data: object,
  source: string
) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [...args, "-e", source, "--", JSON.stringify(data)],
      { cwd, stdio: "inherit" }
    );

    child.on("close", (code) => {
      if (code !== 0) {
        reject({
          command: `node ${args.join(" ")}`,
        });
        return;
      }
      resolve();
    });
  });
}

function checkForLatestVersion() {
  return new Promise((resolve, reject) => {
    get(
      "https://registry.npmjs.org/-/package/@olmokit/create-laravel-app/dist-tags",
      (res) => {
        if (res.statusCode === 200) {
          let body = "";
          res.on("data", (data) => (body += data));
          res.on("end", () => {
            resolve(JSON.parse(body).latest);
          });
        } else {
          reject();
        }
      }
    ).on("error", () => {
      reject();
    });
  });
}
