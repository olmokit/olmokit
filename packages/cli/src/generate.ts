import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { basename, join } from "node:path";
import template from "lodash.template";

type GenerateOptions = {
  name: string;
  data: object;
  srcFolder?: string;
  srcFilename?: string;
  destFolder: string;
  destFilename?: string;
};

/**
 * Generate folder/files from template/s
 */
export function generate({
  name,
  data,
  srcFolder,
  srcFilename,
  destFolder,
  destFilename,
}: GenerateOptions) {
  if (!existsSync(destFolder)) {
    mkdirSync(destFolder);
  }

  const generatedFolder = join(destFolder, name);

  if (!existsSync(generatedFolder)) {
    mkdirSync(generatedFolder);
  }
  // start from a single template file
  if (srcFilename) {
    generateFromTpl(srcFilename, {
      data,
      generatedFolder,
      destFilename,
    });
    // or use all template files in the given folder
  } else if (srcFolder) {
    readdirSync(srcFolder).forEach((tplPath) => {
      generateFromTpl(join(srcFolder, tplPath), {
        data,
        generatedFolder,
        destFilename,
      });
    });
  }
}

type GenerateFromTplOptions = {
  data: object;
  generatedFolder: string;
  destFilename?: string;
};

/**
 * Generate from single template file
 */
function generateFromTpl(
  tplFullpath: string,
  { data, generatedFolder, destFilename }: GenerateFromTplOptions,
) {
  const tplFilename = basename(tplFullpath);
  const tplContent = readFileSync(tplFullpath, "utf-8");
  const tplCompiled = template(tplContent);
  const generatedContent = tplCompiled(data);
  const filename = (destFilename || tplFilename).replace("__tpl__", "");
  const generatedPath = join(generatedFolder, filename);

  writeFileSync(generatedPath, generatedContent);
}
