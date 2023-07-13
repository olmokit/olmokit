import { existsSync } from "node:fs";
import { utimes } from "node:fs/promises";

export async function touchFiles(filepaths: string[]) {
  return await Promise.all(
    filepaths.map(async (filepath) => {
      if (existsSync(filepath)) {
        await utimes(filepath, new Date(), new Date());
      }
    })
  );
}
