import { copyFile, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { Command } from "commander";
import { ensureDir } from "fs-extra";
import { type GlobOptionsWithFileTypesUnset, glob } from "glob";
import { oraPromise } from "ora";
import { oraOpts } from "./dev.js";
import { self } from "./helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const koine = () =>
  new Command("koine")
    .description("Sync packages from @koine's repos")
    .action(async () => {
      await Promise.all(
        localSyncs.map(async (localSync) => {
          await oraPromise(sync(localSync), {
            suffixText: chalk.dim(localSync.name),
            text: `Sync packages from`,
            ...oraOpts,
          });
          // console.log(`Sync ${name} packages done.`);
        }),
      );
    });

type LocalSyncDef = {
  from: string;
  to: string;
  pattern?: string;
  globOptions?: GlobOptionsWithFileTypesUnset;
};

type LocalSync = {
  name: string;
  defs: LocalSyncDef[];
  replacer?: LocalSyncReplacer;
};

type LocalSyncReplacer = (fileContent: string) => string;

const localSyncs: LocalSync[] = [
  {
    name: "@koine",
    defs: [
      {
        from: "../../../KnitKode/koine/packages/dom",
        to: "../packages/dom/src",
        pattern: "/**/*.ts",
      },
      {
        from: "../../../KnitKode/koine/packages/browser",
        to: "../packages/browser/src",
        pattern: "/**/*.ts",
      },
      {
        from: "../../../KnitKode/koine/packages/utils",
        to: "../packages/utils/src",
        pattern: "/**/*.ts",
      },
    ],
    replacer: (content) => {
      return content.replace(/@koine/gm, self().scope);
    },
  },
];

async function sync(sync: LocalSync) {
  const { defs, replacer } = sync;

  await Promise.all(
    defs.map((def) =>
      oraPromise(syncDef(def, replacer), {
        suffixText: `to ${chalk.dim(def.to)}`,
        text: `Sync ${chalk.dim(def.from)}`,
        ...oraOpts,
      }),
    ),
  );
}

async function syncDef(def: LocalSyncDef, replacer?: LocalSyncReplacer) {
  const { from, to, pattern, globOptions } = def;

  if (pattern) {
    const pathsToCopy = await glob(from + pattern, {
      cwd: __dirname,
      ...(globOptions || {}),
    });

    await ensureDir(resolve(__dirname, to));

    await Promise.all(
      pathsToCopy.map(async (src) => {
        const relativePath = relative(from, src);
        const dest = resolve(__dirname, to, relativePath);
        await syncFile(resolve(__dirname, src), dest, replacer);
      }),
    );
  } else {
    const src = resolve(__dirname, from);
    const dest = resolve(__dirname, to);
    await syncFile(src, dest, replacer);
  }
}

async function syncFile(
  src: string,
  dest: string,
  replacer?: LocalSyncReplacer,
) {
  if (!replacer) {
    await copyFile(src, dest);
  } else {
    const content = await readFile(src, { encoding: "utf-8" });
    await writeFile(dest, replacer(content));
  }
}
