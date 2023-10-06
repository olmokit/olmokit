import { Command } from "commander";
import type {
  Task as TaskrTask,
  TaskArg as TaskrTaskArg,
  TaskGroup as TaskrTaskGroup,
} from "@olmokit/cli-utils";
// taskr
import type { Config as BaseConfig, Cli } from "../types.js";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CliNextjs {
  export type Config = BaseConfig.Internal & {};

  export type Task = TaskrTask<Config>;

  export type TaskGroup = TaskrTaskGroup<Config>;

  export type TaskArg = TaskrTaskArg<Config>;
}

export const pm: Cli.Creator<CliNextjs.Config> = () => ({
  commands: [
    new Command("start")
      .description("Start the dev server")
      .aliases(["dev", "s"])
      .action(async () => {
        console.log("Starting next.js dev server...");
      }),
  ],
});

export default pm;
