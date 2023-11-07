import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { $ } from "execa";
import fsExtra from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const create = () =>
  new Command("create")
    .description("Test create-app local version")
    .action(async () => {
      const rootPath = join(process.cwd(), "../.olmokit-test-create");
      if (existsSync(rootPath)) {
        await rm(rootPath, { force: true, recursive: true });
      }

      await fsExtra.ensureDir(rootPath);

      const packagePath = join(
        __dirname,
        "../dist/packages/create-app/index.js",
      );

      if (existsSync(packagePath)) {
        await fsExtra.copy(packagePath, join(rootPath, "index.js"));

        await fsExtra.writeJSON(join(rootPath, "package.json"), {
          type: "module",
          scripts: {
            test: "./index.js test-app",
          },
        });

        const { exitCode } = await $({
          reject: false,
          cwd: rootPath,
          stdio: "inherit",
        })`pnpm ${["test"]}`;

        if (exitCode === 0) {
          console.error(
            "Run 'create-app', a folder '.olmokit-test-create' in the parent path has been created",
          );
        }
      } else {
        console.error("There is no local built version of 'create-app'");
      }
    });
