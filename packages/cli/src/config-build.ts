import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  // AutomaticEnvVars,
  updateEnvVars,
} from "./config-env.js";
import { project } from "./project.js";
import type { Config } from "./types.js";

type BuildData = {
  publicPath: string; // AutomaticEnvVars["PUBLIC_PATH"];
  publicUrl: string; // AutomaticEnvVars["PUBLIC_URL"];
};

export function configBuild(config: Pick<Config.Internal, "type">): BuildData;
export function configBuild(
  config: Config.Internal,
  data: BuildData,
): BuildData;
export function configBuild(
  config: Pick<Config.Internal, "type"> | Config.Internal,
  data?: BuildData,
) {
  // TODO: this path is maybe too specific to laravel, we might make this
  // contextual to the CLI type or part of an extension mechanism
  const filepath = join(project.root, "public/.build");

  if (data) {
    // write
    try {
      writeFileSync(filepath, JSON.stringify(data));

      // FIXME: fix the overloading to avoid casting
      updateEnvVars(config as Config.Internal, {
        PUBLIC_PATH: data.publicPath,
        PUBLIC_URL: data.publicUrl,
      });
    } catch (e) {
      // log error?
    }
    return data;
  } else {
    // read
    try {
      return JSON.parse(readFileSync(filepath, "utf-8")) as BuildData;
    } catch (e) {
      return {
        publicPath: "",
        publicUrl: "",
      };
    }
  }
}
