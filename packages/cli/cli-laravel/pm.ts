import { Command, Option } from "commander";
import type {
  Task as TaskrTask,
  TaskArg as TaskrTaskArg,
  TaskGroup as TaskrTaskGroup,
} from "@olmokit/cli-utils/taskr";
import { updateAppEnv } from "../config-env.js";
import type { Config as BaseConfig, Cli } from "../types.js";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CliLaravel {
  export type Config = BaseConfig.Internal & {};

  export type Task = TaskrTask<Config>;

  export type TaskGroup = TaskrTaskGroup<Config>;

  export type TaskArg = TaskrTaskArg<Config>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CliLaravel.CmdDeploy {
  export type Config = CliLaravel.Config & { options: Options };

  export type Options = {
    /** The environment to deploy (should match the branch associated to the deploy script in the ci.yml file) */
    env: string;
    /** The deploy mode, either via ftp or ssh */
    mode?: "ftp" | "ssh";
    /** The folder on the server where to deploy, starting from root */
    folder: string;
    /** When in `--mode ftp` is the ftp host (as url e.g. `dev.mycompany.net` or IP address). When in `--mode ssh` is the server address (e.g. `ubuntu@myconfig.mycompany.net`) */
    host: string;
    /** Ftp username */
    username: string;
    /** Ftp password or `sshpass -p {password}` */
    password: string;
    /** SSH key variable name, it must be a CI variable name like `MY_CI_VAR` set on git from https://gitlab.com/myproject/-/settings/ci_cd */
    sshkeyvar: string;
    /** Port to connect (used in SSH deploys sometimes) */
    port: string;
    /** This is needed when deploying on an http protected domain from an external runner, e.g. from gitlab.com */
    auth?: "http";
  };

  export type Task = TaskrTask<Config>;

  export type TaskGroup = TaskrTaskGroup<Config>;

  export type TaskArg = TaskrTaskArg<Config>;
}

// by default we assume a development mode, we overwrite when needed in preaction
// commands' hooks
process.env.NODE_ENV = "development";

export const pm: Cli.Creator<CliLaravel.Config> = ({ taskr }) => ({
  commands: [
    new Command("start")
      .description("Start the dev server")
      .aliases(["dev", "s"])
      .action(async () => {
        await taskr.runAction(() =>
          import("./scripts/dev.js").then((mod) => mod.dev)
        );
      }),
    new Command("build")
      .description("Build the production code")
      .hook("preAction", () => {
        process.env.NODE_ENV = "production";
      })
      .action(async () => {
        await taskr.runAction(() =>
          import("./scripts/build.js").then((mod) => mod.build)
        );
      }),
    new Command("component")
      .description("Scaffold a new component (php, blade, scss and js)")
      .aliases(["components", "c"])
      .argument("<name...>")
      .addHelpText(
        "after",
        "Accept multiple components' names separated by space or string. E.g.: header footer card"
      )
      .action(async (names: string[]) => {
        const generateComponent = await import(
          "./scripts/generateComponent.js"
        ).then((mod) => mod.generateComponent);
        generateComponent(names, taskr);
      }),
    new Command("route")
      .description("Scaffold a new route (php, blade, scss and js)")
      .aliases(["routes", "r"])
      .argument("<name...>")
      .addHelpText(
        "after",
        "Accept multiple routes' names separated by space or string. E.g.: home about contact"
      )
      .action(async (names: string[]) => {
        const generateRoute = await import("./scripts/generateRoute.js").then(
          (mod) => mod.generateRoute
        );
        generateRoute(names, taskr);
      }),
    new Command("core")
      .description("Copy core blade templates from @olmokit/core library")
      .action(() =>
        taskr.runAction(() =>
          import("./scripts/core.js").then((mod) => mod.core)
        )
      ),
    new Command("use")
      .description("Bootstraps and scaffold an olmo feature")
      .action(async () => {
        // TODO: use command
        await taskr.runAction(() =>
          import("./scripts/use.js").then((mod) => mod.use)
        );
      }),
    new Command("format")
      .description(
        "Prettify js, scss, md and php files (it is done automatically before every commit)"
      )
      .aliases(["prettier", "f"])
      .option("-d, --dry-run", "When active it will not modify your files.")
      .action(async (options) => {
        // FIXME: finish here the options passing to the prettier task
        // console.log("format command options", options);
        const prettier = (await import("./scripts/prettier.js")).prettier;
        await prettier(taskr);
      }),
    new Command("clean")
      .description("Clean storage and page cache")
      .action(async () => {
        await taskr.runAction(() =>
          import("./scripts/clean.js").then((mod) => mod.clean)
        );
      }),
    new Command("clear")
      .description("Clear Laravel local caches")
      .action(async () => {
        await taskr.runAction(() =>
          import("./scripts/clean.js").then((mod) => mod.clear)
        );
      }),
    new Command("wipe")
      .description(
        "Wipe out everything: Laravel caches, storage and all compiled files"
      )
      .action(() =>
        taskr.runAction(() =>
          import("./scripts/clean.js").then((mod) => mod.wipe)
        )
      ),
    new Command("link")
      .description("Link local packages (for olmo contributors only)")
      .action(async () => {
        await taskr.runAction(() =>
          import("./scripts/link.js").then((mod) => mod.link)
        );
      }),
    new Command("unlink")
      .description("Unlink local packages (for olmo contributors only)")
      .action(async () => {
        await taskr.runAction(() =>
          import("./scripts/unlink.js").then((mod) => mod.unlink)
        );
      }),
    new Command("init")
      .alias("postinstall")
      .description("This is automatically ran on 'postinstall' hook")
      .action(() =>
        taskr.runAction(() =>
          import("./scripts/init.js").then((mod) => mod.init)
        )
      ),
    new Command("visit")
      .description(
        "Visit all website URLs, it uses the current env, or a specific one can be given as argument"
      )
      .action(async () => {
        const visit = (await import("./scripts/visit.js")).visit;

        await visit(taskr.ctx, taskr.log);
      }),
    new Command("svgicons")
      .description("Builds the svg icons")
      .action(() =>
        taskr.runAction(() =>
          import("./scripts/svgicons.js").then((mod) => mod.svgicons)
        )
      ),
    new Command("favicons")
      .description("Builds the favicons")
      .action(() =>
        taskr.runAction(() =>
          import("./scripts/favicons.js").then((mod) => mod.favicons)
        )
      ),
    new Command("deploy")
      .description("This is meant to be used only by the CI")
      .hook("preAction", () => {
        process.env.NODE_ENV = "production";
      })
      .addOption(
        new Option(
          "-e, --env <name>",
          "The environment to deploy (should match the branch associated to the deploy script in the ci.yml file)"
        )
          .default(guessCurrentEnv(taskr.ctx))
          .makeOptionMandatory()
      )
      .addOption(
        new Option("-m, --mode <mode>", "Deploy upload mode")
          .choices(["ftp", "ssh"])
          .default("ftp")
          .makeOptionMandatory()
      )
      .addOption(
        new Option(
          "-f, --folder <folder>",
          "The folder on the server where to deploy, starting from root"
        ).makeOptionMandatory()
      )
      .addOption(
        new Option(
          "-t, --host <host>",
          "When in `--mode ftp` is the ftp host (as url e.g. `dev.mycompany.net` or IP address). When in `--mode ssh` is the server address (e.g. `ubuntu@myconfig.mycompany.net`)"
        ).makeOptionMandatory()
      )
      .addOption(new Option("-u, --username <name>", "Ftp username"))
      .addOption(
        new Option(
          "-p, --password <pwd>",
          "Ftp password or `sshpass -p {password}`"
        ).makeOptionMandatory()
      )
      .addOption(
        new Option(
          "-s, --sshkeyvar <var>",
          "SSH key variable name, it must be a CI variable name like `MY_CI_VAR` set on git from https://gitlab.com/myproject/-/settings/ci_cd"
        )
      )
      .addOption(
        new Option(
          "-po, --port <port>",
          "Port to connect (used in SSH deploys sometimes)"
        ).makeOptionMandatory()
      )
      .addOption(
        new Option(
          "-a, --auth <auth>",
          "This is needed when deploying on an http protected domain from an external runner, e.g. from gitlab.com"
        )
      )
      .action(async (options: CliLaravel.CmdDeploy.Options) => {
        const { isCI, name } = await import("ci-info");
        if (!isCI) {
          taskr.log.error("This script is not running on a CI server. Exit.");
          return;
        }
        updateAppEnv(taskr.ctx, options.env);

        taskr.log.success(`Running on CI server ${taskr.chalk.bold(name)}`);

        const build = (await import("./scripts/build.js")).build;

        await taskr.runTask(build);
        const ci = (await import("./scripts/ci.js")).ci;

        // @ts-expect-error FIXME: workaround this taskr ctx flexibility
        await taskr.runTask(ci, { ctx: { ...taskr.ctx, options } });
        // const deployTaskr = taskr.reset<CliLaravel.CmdDeploy.Config>({
        //   ctx: { ...taskr.ctx, options },
        // });
        // await deployTaskr.runTask(ci, { ctx: { ...taskr.ctx, options } });
      }),
    // new Command("s3")
    //   .description(
    //     "Manage assets with S3. Internal for testing, do not use directly"
    //   )
    //   .action(() =>
    //     taskr.runAction(() =>
    //       import("./scripts/assetsS3.js").then((mod) => mod.assetsS3)
    //     )
    //   ),
  ],
});

/**
 * Guess deploy environment based on standard branching model
 */
function guessCurrentEnv(config: CliLaravel.Config) {
  const last = config.env.names[config.env.names.length - 1];
  const branch = process.env["CI_COMMIT_BRANCH"];
  if (!branch) {
    return last;
  }

  const branchesMap: Record<
    string,
    keyof CliLaravel.Config["env"]["nameToBranchMap"]
  > = {
    main: "dev",
    master: "dev",
    stage: "staging",
    staging: "staging",
    prod: "production",
    production: "production",
    ...config.env.nameToBranchMap,
  };

  return branchesMap[branch] || last;
}

export default pm;
