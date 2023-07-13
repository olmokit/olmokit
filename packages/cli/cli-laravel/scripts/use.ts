import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { basename, join } from "node:path";
import chalk from "chalk";
import { sentenceCase } from "change-case";
import { copy } from "fs-extra";
import { globSync } from "glob";
import prompts from "prompts";
import { meta } from "../../meta.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

type FeatureMetadata = {
  /** The path to the node_module for this feature */
  path: string;
  /** Grabbed and cleaned from the package.name */
  name: string;
  /** Grabbed from the package.version */
  version: string;
  /** Whether we are using a symlinked version of the package */
  local: boolean;
  /** */
  title: string;
  /** */
  description: string;
  /** */
  fullName: string;
  /** Path to the index.js to require, this file will exports as default with the FeatureClass to initialise */
  initialiser: string;
};

type FeatureComponent = {
  /** The component name */
  name: string;
};

type FeatureRoute = {
  /** The route name/id */
  name: string;
  /** Alternative route names to check for existence if the default one is missing */
  alternativeNames?: string[];
};

type FeatureMiddleware = {
  /** The middleware filename */
  name: string;
};

/**
 * Feature base class that `use-` packages must extend
 */
export abstract class Feature {
  info: FeatureMetadata;
  static description: string;

  constructor(info: FeatureMetadata) {
    this.info = info;
    const { title, version } = info;

    console.log(
      `Using ${chalk.bold(chalk.cyanBright(title))} v${chalk.bold(version)}...`
    );

    this.run();

    // console.groupEnd();
  }

  async run() {
    const components = this.components();
    const routes = this.routes();
    const middlewares = this.middlewares();

    await this._manageComponents(components);
    await this._manageRoutes(routes);
    await this._manageMiddlewares(middlewares);

    console.log(`${chalk.bold(chalk.cyanBright(this.info.title))} is set up.`);
  }

  /**
   * To override in subclasses
   */
  abstract components(): FeatureComponent[];

  /**
   * To override in subclasses
   */
  abstract routes(): FeatureRoute[];

  /**
   * To override in subclasses
   */
  abstract middlewares(): FeatureRoute[];

  _startLog(subject: string) {
    console.log(`
Manage ${chalk.cyanBright(this.info.title)}'s ${chalk.bold(
      chalk.blue(subject)
    )}...`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _endLog(subject?: string) {
    // console.groupEnd();
  }

  /**
   * Manage routes
   */
  async _manageRoutes(routes: FeatureRoute[]) {
    if (!routes.length) {
      return;
    }

    this._startLog("routes");

    const map: { existing: string[]; missing: string[] } = {
      existing: [],
      missing: [],
    };

    // check the feature routes and divide them by those existing in the project
    // and those who do not exist
    routes.forEach(({ name, alternativeNames = [] }) => {
      let exists = false;
      const to = join(paths.frontend.src.routes, name);

      if (existsSync(to)) {
        exists = true;
      } else {
        alternativeNames.forEach((alternativeName) => {
          const to = join(paths.frontend.src.routes, alternativeName);
          if (existsSync(to)) {
            exists = true;
          }
        });
      }

      if (exists) {
        map.existing.push(name);
      } else {
        map.missing.push(name);
      }
    });

    // report the routes that exist already
    if (map.existing.length) {
      console.log(
        chalk.white(`
Routes ${chalk.bold(map.existing.join(", "))} already exist in your project.`)
      );
    }

    // manage the creation of the missing routes
    if (map.missing.length) {
      const response = await prompts({
        type: "multiselect",
        name: "toCreate",
        instructions: false,
        min: 0,
        hint: "Select/deselect pressing the space bar",
        message: "The following routes are missing, select those to create",
        choices: map.missing.map((name) => ({
          title: name,
          value: name,
          selected: true,
        })),
      });

      // automatically create the selected missing routes
      if (response.toCreate.length) {
        // the use feature can have some routes default scaffolding in its
        // `/routes` subfolder...
        const withScaffolding = globSync("*", {
          cwd: join(this.info.path, "routes"),
        }).filter((name) => response.toCreate.includes(name));

        // ... or it cannot have it, in that case we just use `olmo route`
        // to automatically create them
        const withoutScaffolding = response.toCreate.filter(
          (name: string) => !withScaffolding.includes(name)
        );

        withScaffolding.forEach((name) => {
          const from = join(this.info.path, "routes", name);
          const to = join(paths.frontend.src.routes, name);

          copy(from, to);
        });

        if (withoutScaffolding.length) {
          execSync(`olmo route ${withoutScaffolding.join(",")}`);
        }

        console.log(
          chalk.white(`
Created missing routes ${chalk.bold(response.toCreate.join(", "))}
`)
        );
      }

      // warn if some mandatory routes are still missing as the user has not
      // selected them via the prompts CLI interface
      if (response.toCreate.length < map.missing.length) {
        const stillMissing = map.missing.filter(
          (name) => !response.toCreate.includes(name)
        );

        console.log(
          chalk.redBright(`
The following routes are still missing: ${chalk.bold(stillMissing.join(", "))}
`)
        );
      }
    }

    this._endLog();
  }

  /**
   * Manage components
   */
  async _manageComponents(components: FeatureComponent[]) {
    if (!components.length) {
      return;
    }

    this._startLog("components");

    const map: { existing: string[]; missing: string[] } = {
      existing: [],
      missing: [],
    };

    // check the feature components and divide them by those existing in the project
    // and those who do not exist
    components.forEach(({ name }) => {
      const to = join(paths.frontend.src.components, name);

      if (existsSync(to)) {
        map.existing.push(name);
      } else {
        map.missing.push(name);
      }
    });

    // report that some components already exist and won't be copied
    if (map.existing.length) {
      console.log(`
${chalk.white(
  `Components ${chalk.bold(
    map.existing.join(", ")
  )} already exist in your project.`
)}
${chalk.dim(`The homonym ${chalk.bold(
  this.info.name
)}'s feature components will not be copied over now.
If you like you might rename these components in your project and re-run ${chalk.bold(
  "olmo use"
)}`)}`);
    }

    // create instead the other components
    if (map.missing.length) {
      const response = await prompts({
        type: "multiselect",
        name: "toCreate",
        instructions: false,
        min: 0,
        hint: "Select/deselect pressing the space bar",
        message: "Select the components to bootstrap in your project",
        choices: map.missing.map((name) => ({
          title: name,
          value: name,
          selected: true,
        })),
      });

      // automatically create the selected missing components
      if (response.toCreate.length) {
        map.missing.forEach((name) => {
          const from = join(this.info.path, "components", name);
          const to = join(paths.frontend.src.components, name);

          // TODO: here we could treat the files, e.g.
          // - [x] remove `/* eslint-disable @typescript-eslint/no-unused-vars */`
          // at first line (variables are written to ease the usage and
          // comprehension of the copied scaffolding component). This done by
          // tweaking the ESlint option from the eslint.json file instead of
          // inlining it in the file template

          copy(from, to);
        });

        console.log(
          chalk.white(
            `Created components ${chalk.bold(response.toCreate.join(", "))}`
          )
        );
      }
    }

    this._endLog();
  }

  /**
   * Manage middlewares
   */
  async _manageMiddlewares(middlewares: FeatureMiddleware[]) {
    if (!middlewares.length) {
      return;
    }

    this._startLog("middlewares");

    const map: { existing: string[]; missing: string[] } = {
      existing: [],
      missing: [],
    };

    // check the feature middlewares and divide them by those existing in the project
    // and those who do not exist
    middlewares.forEach(({ name }) => {
      const to = join(paths.frontend.src.middlewares, `${name}.php`);

      if (existsSync(to)) {
        map.existing.push(name);
      } else {
        map.missing.push(name);
      }
    });

    // report that some middlewares already exist and won't be copied
    if (map.existing.length) {
      console.log(`
${chalk.white(
  `Middlewares ${chalk.bold(
    map.existing.join(", ")
  )} already exist in your project.`
)}
${chalk.dim(`The homonym ${chalk.bold(
  this.info.name
)}'s feature middleware will not be copied over now.
If you like you might rename these middlewares in your project and re-run ${chalk.bold(
  "olmo use"
)}`)}`);
    }

    // create instead the other components
    if (map.missing.length) {
      const response = await prompts({
        type: "multiselect",
        name: "toCreate",
        instructions: false,
        min: 0,
        hint: "Select/deselect pressing the space bar",
        message: "Select the middlewares to copy in your project",
        choices: map.missing.map((name) => ({
          title: name,
          value: name,
          selected: true,
        })),
      });

      // automatically create the selected missing middlewares
      if (response.toCreate.length) {
        map.missing.forEach((name) => {
          const from = join(this.info.path, "middlewares", `${name}.php`);
          const to = join(paths.frontend.src.middlewares, `${name}.php`);

          copy(from, to);
        });

        console.log(
          chalk.white(
            `Created middlewares ${chalk.bold(response.toCreate.join(", "))}`
          )
        );
      }
    }

    this._endLog();
  }
}

/**
 * Get available features by globbing the node_modules that match the `use-`
 * naming convention
 */
function getAvailableFeatures({ ctx }: CliLaravel.TaskArg): FeatureMetadata[] {
  const globPath = `${meta.orgScope}/use/*`;

  return globSync(globPath, {
    cwd: ctx.project.nodeModules,
    withFileTypes: true,
    ignore: join(ctx.project.nodeModules, "/**/node_modules"),
  })
    .filter((globPath) => globPath.isDirectory())
    .map((globPath) => {
      const path = globPath.fullpath();
      const folderName = basename(path);
      // const { version, description } = require(join(path, "/package.json"));
      const version = ""; // TODO: @/use
      const description = ""; // TODO: @/use
      const local = globPath.isSymbolicLink();
      const name = folderName.replace(meta.orgScope, "").replace("/use-", "");
      const title = sentenceCase(name);
      const fullName = `${chalk.bold(title)}${version ? ` v${version} ` : ""}${
        !local ? chalk.dim(`(local)`) : ""
      }${chalk.dim(description ? `: ${description}` : "")}`;
      const initialiser = join(path, "/index.js");

      const metadata: FeatureMetadata = {
        path,
        name,
        version,
        local,
        title,
        description,
        fullName,
        initialiser,
      };

      return metadata;
    });
}

/**
 * Run the `use` command
 */
export const use: CliLaravel.Task = async ({ cliCursor, arg }) => {
  const features = getAvailableFeatures(arg);

  cliCursor.show();

  const response = await prompts({
    type: "multiselect",
    name: "useFeatures",
    instructions: false,
    min: 1,
    hint: "Select one or many pressing the space bar",
    message: "Select which features you want to bootstrap",
    choices: features.map((feature) => ({
      title: feature.fullName,
      value: feature.initialiser,
    })),
  });

  if (response.useFeatures) {
    response.useFeatures.forEach((initialiser: string) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Feature = require(initialiser);
      new Feature(
        features.filter((meta) => meta.initialiser === initialiser)[0]
      );
    });
  }
};
use.meta = { title: ":no" };
