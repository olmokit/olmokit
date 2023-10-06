import type { StatsOptions } from "webpack";
import type { CliLaravel } from "../pm.js";

export const assetsCompile: CliLaravel.Task = async ({ ctx, log, spinner }) => {
  spinner.start("Compiling assets");

  const [webpack, webpackConfig] = await Promise.all([
    import("webpack").then((mod) => mod.default),
    import("../webpack/config.js").then((mod) => mod.default),
  ]);

  return new Promise<void>((resolve, reject) => {
    const configuration = webpackConfig(ctx);
    const compiler = webpack(configuration);
    const handleClose = (closeErr?: Error | null, errored?: boolean) => {
      if (errored) {
        reject();
        process.exit(1);
      } else if (closeErr) {
        log.error(closeErr.message);
        process.exit(1);
        // NOTE: on close error we used to resolve anyway, not sure that is good
        // resolve();
      } else {
        log.success("Webpack exited successfully");
        resolve();
      }
    };

    compiler.run((err, stats) => {
      const errored = !!err ?? stats?.hasErrors();

      if (errored) {
        const msg =
          stats?.toString() ||
          (err ? `${err.name}: ${err.message}` : "Unknown Webpack error");

        spinner.fail(msg);

        compiler.close((closeErr) => handleClose(closeErr, true));
      } else {
        spinner.succeed(
          stats?.toString({
            ...(configuration.stats as StatsOptions),
            colors: true,
          }),
        );
        compiler.close((closeErr) => handleClose(closeErr));
      }
    });
  });
};
assetsCompile.meta = {
  title: "Compile assets bundles (with webpack)",
  ownLog: ["start", "end"],
  still: true,
};
