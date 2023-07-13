// import webpack from "webpack";
// import webpackDevServer from "webpack-dev-server";
import { Defer } from "@olmokit/utils/Defer";
import type { CliLaravel } from "../pm.js";

// import { webpackConfig } from "../webpack/config.js";
// import { webpackConfigDevServer } from "../webpack/devServer.js";

export const assetsWatch: CliLaravel.Task = async ({
  ctx,
  log,
  chalk,
  ora,
}) => {
  log.info(`Starting ${chalk.bold("webpack-dev-server")}`);

  const [webpack, webpackDevServer, webpackConfig, webpackConfigDevServer] =
    await Promise.all([
      import("webpack").then((mod) => mod.default),
      import("webpack-dev-server").then((mod) => mod.default),
      import("../webpack/config.js").then((mod) => mod.default),
      import("../webpack/devServer.js").then((mod) => mod.default),
    ]);

  return new Promise<void>((resolve, reject) => {
    const compiler = webpack(webpackConfig(ctx));
    const server = new webpackDevServer(webpackConfigDevServer(ctx), compiler);
    const firstCompilationPromise = Defer();
    let hasFinishedFirstCompilation = false;
    let spinnerCompile: ReturnType<typeof ora>;

    compiler.hooks.beforeCompile.tap("cli", () => {
      if (hasFinishedFirstCompilation) {
        spinnerCompile = ora("Compiling assets...");
        spinnerCompile.start();
      }
    });

    compiler.hooks.afterCompile.tap("cli", (compilation) => {
      const stats = compilation.getStats();

      if (hasFinishedFirstCompilation && spinnerCompile) {
        spinnerCompile.stop();
      }

      if (!hasFinishedFirstCompilation) {
        firstCompilationPromise.resolve();
      }

      if (!stats.hasWarnings() && !stats.hasErrors()) {
        const statsStr = stats.toString({
          assets: false,
          runtime: false,
          // modules: true,
          cachedModules: false,
          runtimeModules: false,
          orphanModules: false,
          builtAt: true,
          version: false,
        });
        console.log();
        console.log(chalk.dim(statsStr));
        console.log();
      }
    });

    server.stopCallback = () => {
      log.info(`Stopped ${chalk.bold("webpack-dev-server")}`);
      resolve();
    };

    // FIXME: shall we use await here or ok like this?
    // await server.start();
    server
      .start()
      .then(() => {
        log.success(`Started ${chalk.bold("webpack-dev-server")}`);

        const spinnerFirst = ora({
          text: "Running first assets compilation, be patient",
          suffixText: chalk.dim("..."),
          indent: 4,
        }).start();

        firstCompilationPromise.then(() => {
          hasFinishedFirstCompilation = true;
          spinnerFirst.stop();
        });
      })
      .catch(() => {
        log.error(`Failed ${chalk.bold("webpack-dev-server")}`);
        reject();
        process.exit(1);
      });
  });
};
assetsWatch.meta = {
  // subject: "watch",
  title: "Watch assets (with webpack)",
  still: true,
};
