import { existsSync, readFileSync } from "fs";

export function readJsonFile<T extends object>(
  jsonPath: string,
  debug?: boolean
) {
  try {
    if (existsSync(jsonPath)) {
      const content = readFileSync(jsonPath, { encoding: "utf-8" });
      return JSON.parse(content) as T;
    }
    if (debug) {
      console.log(`readJsonFile: '${jsonPath}' path not found`);
    }
    return;
  } catch (e) {
    if (debug) {
      console.log(`readJsonFile: '${jsonPath}' catched error`, e);
    }
    return;
  }
}
