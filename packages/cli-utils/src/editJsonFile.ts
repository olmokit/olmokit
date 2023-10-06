import { readFile, writeFile } from "node:fs/promises";
import { EOL } from "node:os";
import { join } from "node:path";
import json from "comment-json";

/**
 * Edit JSON file (mutable)
 *
 * @param root One or multiple root for the json file to edit
 * @param fileName The json file name
 * @param mutator A function that **mutates** the data
 */
export async function editJsonFile<TData = any>(
  root: string | string[],
  fileName: string,
  mutator: (data: TData) => void,
) {
  const roots = Array.isArray(root) ? root : [root];

  await Promise.all(
    roots.map(async (root) => {
      const filePath = join(root, fileName);

      try {
        const fileContent = await readFile(filePath, { encoding: "utf-8" });
        // const fileJSON = JSON.parse(fileContent);
        const jsonContent = json.parse(fileContent) as TData;
        mutator(jsonContent);
        // const fileNewContent = JSON.stringify(jsonContent, null, 2);
        const fileNewContent = json.stringify(jsonContent, null, 2);

        if (fileNewContent) {
          await writeFile(filePath, fileNewContent + EOL);
        }
      } catch (err) {
        console.log("editJsonFile failed for:", filePath);
        // throw e;
        return;
      }
    }),
  );
}
