import { filer } from "@olmokit/cli-utils/filer.js";
import { execArtisan } from "../helpers/execArtisan.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

// TODO: convert here in JSON? so that php would not need to parse the csv
export const i18nTranslations: CliLaravel.Task = async () => {
  await filer(paths.frontend.filenames.translations, {
    base: paths.frontend.src.translations,
    dest: paths.frontend.dest.translations,
  });
};
i18nTranslations.meta = { title: "Copy the translations source file" };

const i18nClear: CliLaravel.Task = async ({ ora }) => {
  await execArtisan(["view:clear"], ora);
};
i18nClear.meta = { title: "Clear view cache to revive the translations file" };

export const i18n: CliLaravel.TaskGroup = {
  meta: { title: "Manage i18n" },
  children:
    process.env["NODE_ENV"] === "production"
      ? [i18nTranslations]
      : [i18nTranslations, i18nClear],
};
