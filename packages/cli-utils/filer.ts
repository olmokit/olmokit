import { readFile, writeFile } from "node:fs/promises";
import path, { type PlatformPath } from "node:path";
import { ensureDir } from "fs-extra";
import { type GlobOptionsWithFileTypesUnset, glob } from "glob";
import template from "lodash.template";

/**
 * Rename a file
 *
 * Either:
 * 1) a string containing the filename **with** the extension (if needed) as
 * nothing will be added implicitly.
 * 2) a function returning either `void` or an object with a custom `dir` and/or
 * a custom `name` for the file, both are optional (returning an empty string
 * is supported as a way to delete the values from the output renamed filepath)
 */
export type FilerRename =
  | string
  | ((arg: FilerTranformerArg) => void | {
      dir?: string;
      name?: string;
    });

export type FilerTranformerArg = {
  /** The result of `path.basename(originalPath)` */
  basename: string;
  /** The result of `path.dirname(originalPath)` relative to the {@link FilerOptions["base"]} option */
  dir: string;
  /**
   * Forward the `node:path` api to avoid importing it each time
   */
  path: PlatformPath;
};

/**
 * Prepend string to a file contents
 */
type FilerPrepend = string | ((arg: FilerTranformerArg) => string | undefined);

/**
 * Append string to a file contents
 */
type FilerAppend = string | ((arg: FilerTranformerArg) => string | undefined);

/**
 * Data to populate a file template
 */
type FilerData = object | ((arg: FilerTranformerArg) => object);

export type FilerOptions = {
  /**
   * The base directory path from where on files keep their relative parent
   * folder structure
   */
  base?: string;
  /**
   * {@link GlobOptionsWithFileTypesUnset} options
   */
  glob?: GlobOptionsWithFileTypesUnset;
  /** {@link FilerRename} */
  rename?: FilerRename;
  /** {@link FilerPrepend} */
  prepend?: FilerPrepend;
  /** {@link FilerAppend} */
  append?: FilerAppend;
  /** {@link FilerData} */
  data?: FilerData;
  /**
   * The destination folder of the file(s). Multiple destinations are supported
   * when passing an array of paths.
   */
  dest: string | string[];
};

/**
 *
 * @returns The new paths of the matched files
 */
export async function filer(
  pathGlob: string,
  options: FilerOptions = {
    dest: "",
  }
) {
  const {
    base = "",
    glob: globOpt,
    append: appendOpt = "",
    prepend: prependOpt = "",
    rename,
    data,
    dest,
  } = options;

  const globFullpath = path.join(base, pathGlob);
  const filepaths = await glob(globFullpath, globOpt);

  /* const newPaths =  */ await Promise.all(
    filepaths.map(async (filepath) => {
      let outDir = path.dirname(filepath);
      let outName = path.basename(filepath);
      let outContent = "";

      if (base) {
        outDir = path.relative(base, outDir);
      }

      const arg = {
        basename: outName,
        dir: outDir,
        path,
      };
      const prepend =
        typeof prependOpt === "string" ? prependOpt : prependOpt(arg);
      const append = typeof appendOpt === "string" ? appendOpt : appendOpt(arg);
      // const mustReadFileContent = data || append || prepend;

      // if (mustReadFileContent) {
      outContent = await readFile(filepath, { encoding: "utf-8" });
      // }

      // x): process file as templates with data
      if (data) {
        const templateData = typeof data === "function" ? data(arg) : data;
        const templateCompiled = template(outContent);
        outContent = templateCompiled(templateData);
      }

      // x): add prepend to file content
      if (prepend) outContent = prepend + outContent;

      // x): add append to file content
      if (append) outContent = outContent + append;

      // x): rename file
      if (rename) {
        if (typeof rename === "function") {
          const custom = rename(arg);
          if (typeof custom?.dir === "string") outDir = custom.dir;
          if (typeof custom?.name === "string") outName = custom.name;
        } else if (typeof rename === "string") {
          outName = rename;
        }
      }

      // support multiple dest paths
      if (Array.isArray(dest)) {
        return await Promise.all(
          dest.map((destPath) =>
            filerWrite(path.join(destPath, outDir), outName, outContent)
          )
        );
      }

      return await filerWrite(path.join(dest, outDir), outName, outContent);
    })
  );

  // console.log("filer", newPaths);
}

async function filerWrite(dir: string, name: string, content: string) {
  const outPath = path.join(dir, name);

  await ensureDir(dir);
  await writeFile(outPath, content);

  return outPath;
}
