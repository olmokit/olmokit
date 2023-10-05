"use strict";

import { execSync } from "node:child_process";
import {
  appendFileSync,
  existsSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { EOL } from "node:os";
import { dirname, join } from "node:path";
import chalk from "chalk";
import spawn from "cross-spawn";
import fsExtra from "fs-extra";
import { inGitRepo, tryGitCommit, tryGitInit } from "@olmokit/cli-utils/git";
import { paths } from "./paths/index.js";

const require = createRequire(import.meta.url);

// from `create-react-app`:
// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/scripts/init.js

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

type TemplateJson = {
  package?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
};

export default function bootstrap(
  appPath: string,
  appName: string,
  verbose: boolean,
  originalDirectory?: string,
  templateName?: string,
) {
  const appPackage = require(join(appPath, "package.json"));
  const packageManager = existsSync(join(appPath, "pnpm-lock.yaml"))
    ? "pnpm"
    : existsSync(join(appPath, "yarn.lock"))
    ? "yarn"
    : "npm";

  if (!templateName) {
    console.log("");
    console.error(
      `A template was not provided. This is likely because you're using an outdated version of ${chalk.cyan(
        "@olmokit/create-app",
      )}.`,
    );
    console.error(
      `Please note that global installs of ${chalk.cyan(
        "@olmokit/create-app",
      )} are no longer supported.`,
    );
    console.error(
      `You can fix this by running ${chalk.cyan(
        "npm uninstall -g @olmokit/create-app",
      )} or ${chalk.cyan(
        "yarn global remove @olmokit/create-app",
      )} before using ${chalk.cyan("@olmokit/create-app")} again.`,
    );
    return;
  }

  const templatePath = dirname(
    require.resolve(`${templateName}/package.json`, { paths: [appPath] }),
  );

  const templateJsonPath = join(templatePath, "template.json");

  let templateJson: TemplateJson = {};
  if (existsSync(templateJsonPath)) {
    templateJson = require(templateJsonPath);
  }

  const templatePackage: TemplateJson = templateJson.package || {};

  if (templateJson.dependencies) {
    templatePackage.dependencies = templateJson.dependencies;
  }
  if (templateJson.scripts) {
    templatePackage.scripts = templateJson.scripts;
  }

  // Keys to ignore in templatePackage
  const templatePackageBlacklist = [
    "name",
    "version",
    "description",
    "keywords",
    "bugs",
    // "license",
    // "author",
    "contributors",
    "files",
    "browser",
    "bin",
    "man",
    "directories",
    "repository",
    "peerDependencies",
    "bundledDependencies",
    "optionalDependencies",
    "engineStrict",
    "os",
    "cpu",
    "preferGlobal",
    "private",
    "publishConfig",
  ];

  // Keys from templatePackage that will be merged with appPackage
  const templatePackageToMerge = ["dependencies", "scripts"];

  // Keys from templatePackage that will be added to appPackage,
  // replacing any existing entries.
  const templatePackageToReplace = Object.keys(templatePackage).filter(
    (key) => {
      return (
        !templatePackageBlacklist.includes(key) &&
        !templatePackageToMerge.includes(key)
      );
    },
  );

  // Copy over some of the devDependencies
  appPackage.dependencies = appPackage.dependencies || {};

  // Add templatePackage keys/values to appPackage, replacing existing entries
  templatePackageToReplace.forEach((key) => {
    appPackage[key] = templatePackage[key as keyof typeof templatePackage];
  });

  writeFileSync(
    join(appPath, "package.json"),
    JSON.stringify(appPackage, null, 2) + EOL,
  );

  const readmeExists = existsSync(join(appPath, "README.md"));
  if (readmeExists) {
    renameSync(join(appPath, "README.md"), join(appPath, "README.old.md"));
  }

  // Copy the files for the user
  const templateDir = join(templatePath, "template");
  if (existsSync(templateDir)) {
    fsExtra.copySync(templateDir, appPath);
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templateDir)}`,
    );
    return;
  }

  // modifies README.md commands based on user used package manager.
  try {
    const readme = readFileSync(join(appPath, "README.md"), "utf8");
    writeFileSync(
      join(appPath, "README.md"),
      readme.replace(/(npm run |npm )/g, `${packageManager} "`),
      "utf8",
    );
  } catch (err) {
    // Silencing the error. As it fall backs to using default npm commands.
  }

  // Initialize git repo
  let initializedGit = false;

  if (tryGitInit()) {
    initializedGit = true;
    console.log();
    console.log("Initialized a git repository.");
  }

  let command;
  let remove;
  let args;

  if (packageManager === "pnpm") {
    command = "pnpm";
    remove = "uninstall";
    args = ["install"];
  } else if (packageManager === "yarn") {
    command = "yarnpkg";
    remove = "remove";
    args = ["add"];
  } else {
    command = "npm";
    remove = "uninstall";
    args = ["install", "--save", verbose ? "--verbose" : "--silent"].filter(
      (e) => e,
    );
  }

  // Install additional template dependencies, if present.
  const dependenciesToInstall = Object.entries({
    ...templatePackage.dependencies,
    ...templatePackage.devDependencies,
  });
  if (dependenciesToInstall.length) {
    args = args.concat(
      dependenciesToInstall.map(([dependency, version]) => {
        return `${dependency}@${version}`;
      }),
    );
  }

  // Install template dependencies
  if (templateName && args.length > 1) {
    console.log();
    console.log(`Installing template dependencies using ${command}...`);

    const proc = spawn.sync(command, args, { stdio: "inherit" });
    if (proc.status !== 0) {
      console.error(`\`${command} ${args.join(" ")}\` failed`);
      return;
    }
  }

  // Remove template
  console.log(`Removing template package using ${command}...`);
  console.log();

  const proc = spawn.sync(command, [remove, templateName], {
    stdio: "inherit",
  });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(" ")}\` failed`);
    return;
  }

  const gitignoreBase = readFileSync(join(paths.self.templates, "gitignore"));
  const gitignoreExists = existsSync(join(appPath, ".gitignore"));
  if (gitignoreExists) {
    // Append if there's already a `.gitignore` file there
    const data = readFileSync(join(appPath, "gitignore"));
    appendFileSync(join(appPath, ".gitignore"), data);
    appendFileSync(join(appPath, ".gitignore"), gitignoreBase);
    unlinkSync(join(appPath, "gitignore"));
  } else {
    // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
    // See: https://github.com/npm/npm/issues/1862
    fsExtra.moveSync(join(appPath, "gitignore"), join(appPath, ".gitignore"));
    appendFileSync(join(appPath, ".gitignore"), gitignoreBase);
  }

  // Create git commit if git repo was initialized
  if (
    (inGitRepo() || initializedGit) &&
    tryGitCommit(
      appPath,
      `Initialize project using template '${templateName}' for @olmokit/create-app`,
    )
  ) {
    console.log();
    console.log("Created git commit.");
  }

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath;
  if (originalDirectory && join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  // run proper init task automatically
  execSync("npx olmo init");

  // run composer
  try {
    execSync(`composer install --no-interaction --no-progress`);
  } catch (e) {
    // doesnt' matter
  }

  // run valet
  // let valetLinked = false;
  // if (commandExistsSync("valet")) {
  //   execSync(`valet link`);
  //   valetLinked = true;
  // }

  console.log();
  console.log(
    `Success! Created ${appName} at ${appPath}, now enter that folder with`,
  );
  console.log(chalk.cyan("  cd"), cdpath);
  console.log(
    `You should now open the ${chalk.cyan(
      ".env",
    )} file to ensure everything is set up properly.`,
  );
  console.log();
  console.log("Inside this new directory you can run several commands:");
  console.log(
    chalk.cyan(
      `  ${packageManager === "npm" ? "npx" : packageManager} olmo help`,
    ),
  );
  console.log("    Show all available commands.");
  console.log();
  // if (valetLinked) {
  console.log();
  console.log(
    chalk.green(
      `If you have valet your app should be available at http://${appName}.test`,
    ),
  );
  // }
  if (readmeExists) {
    console.log();
    console.log(
      chalk.yellow(
        "PS: You had a `README.md` file, we renamed it to `README.old.md`",
      ),
    );
  }
  console.log();
  console.log("Happy hacking!");
}
