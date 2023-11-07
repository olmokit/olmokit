/**
 * @file
 *
 * `loadConfig` technique is totally borrowed from TailwindCSS. It allows to use
 * a configuration file written in typescript.
 *
 * @borrows [TailwindCSS](https://github.com/tailwindlabs/tailwindcss/blob/mastetr/src/lib/load-config.ts)
 * - [TailwindCSS: ESM and TypeScript support](https://tailwindcss.com/blog/tailwindcss-v3-3#esm-and-type-script-support)
 */
import { fileURLToPath } from "node:url";
import jitiFactory, { type JITI } from "jiti";
import sucrase from "sucrase";
import type { CliBootArg } from "./cli.js";

const __filename = fileURLToPath(import.meta.url);

let jiti: JITI | null = null;

function lazyJiti({ spinner, taskr }: CliBootArg) {
  return (
    jiti ||
    (jiti = jitiFactory(__filename, {
      interopDefault: true,
      // this allows to watch the `olmo.ts` files
      requireCache: false,
      onError: (err) => {
        spinner.stop();
        taskr.log.branded.error("Invalid olmo.ts file", err.message);
        process.exit(1);
      },
      transform: function (opts) {
        try {
          return sucrase.transform(opts.source, {
            transforms: ["typescript", "imports"],
          });
        } catch (err) {
          spinner.stop();
          taskr.log.branded.error(
            "Invalid olmo.ts file",
            err ? err.toString() : "",
          );
          process.exit(1);
        }
      },
    }))
  );
}

export function loadConfig(path: string, cliBootArg: CliBootArg) {
  try {
    const config = (function () {
      try {
        // https://stackoverflow.com/a/16060619/1938970
        if (path) delete require.cache[require.resolve(path)];
        return path ? require(path) : {};
      } catch (e) {
        return lazyJiti(cliBootArg)(path);
      }
    })();

    return config.default || config;
  } catch (e) {
    return;
  }
}
