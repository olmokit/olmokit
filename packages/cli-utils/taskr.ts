import {
  type Logger,
  createLogger,
} from "@niceties/logger";
import { terminalSupportsUnicode } from "@niceties/logger/format-utils";
import chalk, { type ChalkInstance } from "chalk";
import cliCursor from "cli-cursor";
import type { Command } from "commander";
import baseOra, {
  Options as BaseOraOptions,
  PromiseOptions as BaseOraPromiseOptions,
  type Ora,
  type Color as OraColor, // oraPromise as baseOraPromise,
} from "ora";
import type { LiteralUnion } from "type-fest";
import { capitalize } from "@olmokit/utils/capitalize";
import { createTaskrAppender } from "./taskr-appender.js";

export type TaskrInstance<TCtx = any> = ReturnType<typeof createTaskr<TCtx>>;

type TaskrIcon = "info" | "success" | "warn" | "error";

type TaskrLogFn = (
  message: string,
  suffix?: string,
  prefix?: string,
  ...args: unknown[]
) => void;

export type TaskrLog = TaskrLogFn & {
  chalk: ChalkInstance;
} & Record<TaskrIcon, TaskrLogFn> & {
    branded: TaskrLogFn & Record<TaskrIcon, TaskrLogFn>;
  };

export type TaskrOra = typeof baseOra;

type TaskrOraExtraOptions = {
  colorForce?: TaskrColor;
};

type TaskrOraOptions = BaseOraOptions & TaskrOraExtraOptions;

type TaskrOraPromiseOptions<T> = BaseOraPromiseOptions<T> &
  TaskrOraExtraOptions;

/** Exclude color that do not have a `Bright` variant */
export type TaskrColor = Exclude<OraColor, "gray" | "black">; //

type TaskrSetupOptions<TCtx = {}> = {
  /**
   * A generic context object, usually holding a global configuration
   */
  ctx?: TCtx;
  /**
   * The CLI name
   *
   * @default "CLI"
   */
  name?: string;
  /**
   * Optional CLI suffix (displayed after name), useful for big CLIs to
   * differentiate various ambients/contexts
   *
   * @default ""
   */
  suffix?: string;
  /**
   * The CLI brand color, a limited section/portion of a Chalk color.
   *
   * @default "white"
   */
  color?: TaskrColor;
  /**
   * The CLI default indentation
   *
   * @default 0
   */
  indent?: number;
};

type TaskMeta<TCtx> = {
  meta: {
    /**
     * The task title
     *
     * Either a custom `string` title or:
     * - `:auto` it will use the information we have to log the title, such as
     * the number of children and the timing the task/taskGroup took
     * - `:no` No logging operated here
     */
    title: LiteralUnion<":auto" | ":no", string>;
    /**
     * The task's subject
     */
    subject?: string;
    /**
     * Whether the task log should be still (no spinning -> start/end lifecycle)
     */
    still?: boolean;
    /**
     * Override `color` for a specific task
     */
    color?: TaskrColor;
    /**
     * Allow a task to customise its own logging, either just the start, its end
     * or both
     */
    ownLog?: ("start" | "end")[];
    /**
     * If specified the task only whether this function returns true
     */
    whether?: (arg: TaskArg<TCtx>) => boolean;
  };
};

export type TaskArg<TCtx = any> = {
  ctx: TCtx;
  /**
   * `runTask` from current `taskr` instance, useful to run tasks within a task,
   * for example long running tasks like watchers
   */
  runTask: TaskrInstance<TCtx>["runTask"];
  /**
   * A custom logger that automatically indents correctly when used within
   * tasks execution
   */
  log: TaskrLog;
  logger: Logger;
  spinner: Ora;
  ora: TaskrOra;
  chalk: ChalkInstance;
  cliCursor: typeof cliCursor;
};

/**
 * Add `arg`, the whole argument object, to ease the forwardng of the argument
 * to inner functions of a single task.
 */
export type Task<TCtx> = ((
  arg: TaskArg<TCtx> & { arg: TaskArg<TCtx> }
) => Promise<void>) &
  TaskMeta<TCtx>;

export type TaskGroup<TCtx> = TaskMeta<TCtx> & {
  children?: (Task<TCtx> | TaskGroup<TCtx> | TaskrAction<TCtx>)[];
  parallel?: boolean;
};

export type TaskRunOptions<TCtx = {}> = Omit<
  TaskrOraOptions,
  "color" | "colorForce"
> &
  Partial<TaskMeta<TCtx>["meta"]> & {
    ctx?: TCtx;
    indent?: number;
    logger?: Logger;
  };

/**
 * It supports a task imported dynamically
 *
 * @example
 * ```js
 * () => import("./my-task-default")
 * // or
 *  () => import("./my-task-named").then((mod) => mode.mytask)
 * ```
 */
type TaskrAction<TCtx> =
  | Task<TCtx>
  | TaskGroup<TCtx>
  | (() => Promise<
      | Task<TCtx>
      | TaskGroup<TCtx>
      | (() => Promise<Task<TCtx> | TaskGroup<TCtx>>)
    >);

function isActionATaskOrTaskGroup<TCtx>(
  action: any /* TaskrAction */
): action is Task<TCtx> | TaskGroup<TCtx> {
  return !!action.meta;
}

function isTaskGroup<TCtx>(
  taskOrTaskGroup: any
): taskOrTaskGroup is TaskGroup<TCtx> {
  return !!taskOrTaskGroup.children;
}

/**
 * Format task's timing
 */
function formatTaskTime(ms: number) {
  const msRounded = Math.round(ms);

  if (ms > 1000 * 60) {
    const minutes = Math.floor(ms / 60000);
    const seconds = parseInt(((ms % 60000) / 1000).toFixed(0), 10);
    return `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}`;
  }
  if (ms > 1000) return `${(msRounded / 1000).toFixed(0)}s`;
  if (ms > 100) return `${(msRounded / 1000).toFixed(1).replace(".0", "")}s`;
  return `${msRounded}ms`;
}

const emptyLine = () => console.log();

export const createTaskr = <TCtx>(custom: TaskrSetupOptions<TCtx>) => {
  // Taskr options, we **must** define all default values
  const ctx = custom.ctx || ({} as TCtx);
  const optName = custom.name || "CLI";
  const optSuffix = custom.suffix || "";
  const optColor = custom.color || "white";
  const optIndent = custom.indent || 0;
  const supportsUnicode = terminalSupportsUnicode();
  const symbolInfo = supportsUnicode ? "•" : "-";
  const symbolSuccess = supportsUnicode ? "✔" : "+";
  const symbolWarn = supportsUnicode ? "⚠" : "!";
  const symbolError = supportsUnicode ? "✕" : "x";

  /**
   * Useful for overall program execution's time debugging/logging
   */
  const setupAt = performance.now();

  /**
   * Color choosen in the setup
   */
  const color = optColor;

  /**
   * Color (bright variant) choosen in the setup
   */
  const colorBright = `${optColor}Bright` as const;

  /**
   * Text colorise with the color choosen in the setup
   */
  // const text = (str: string) => chalk[color](str);

  /**
   * Text colorise with bright color variant of the color choosen in the setup
   */
  const textBright = (str: string) => chalk[colorBright](str);

  /**
   * Predefined icons with the color choosen in the setup
   */
  const icon: Record<TaskrIcon, string> = {
    /**
     * Info icon
     */
    info: textBright(symbolInfo),
    /**
     * Success icon
     */
    success: textBright(symbolSuccess),
    /**
     * Warning icon
     */
    warn: textBright(symbolWarn),
    /**
     * Error icon
     */
    error: chalk.redBright(symbolError),
  };

  /**
   * Log creator function
   */
  const createLog = ({ indent }: { indent: number } = { indent: 0 }) => {
    const logConsole = (
      branded?: boolean,
      action?: "" | keyof typeof icon,
      message?: string,
      suffix?: string,
      prefix?: string,
      ...args: unknown[]
    ) => {
      const output = [];
      if (branded) output.push("\n" + getCliBrand() + "\n\n");
      if (prefix) output.push(chalk.dim(prefix));
      if (action) output.push(icon[action]);
      output.push(message);
      if (suffix) output.push(chalk.dim(suffix));
      if (branded) output.push("\n");

      console.log(" ".repeat(indent) + output.join(" "), ...args);
    };

    const logBase: TaskrLogFn & { branded: TaskrLogFn } = (...args) =>
      logConsole(false, "", ...args);
    logBase.branded = (...args) => logConsole(true, "", ...args);

    const log = (["info", "success", "warn", "error"] as const).reduce(
      (log, symbol) => {
        if (symbol) {
          log[symbol] = (...args) => logConsole(false, symbol, ...args);
          log.branded[symbol] = (...args) => logConsole(true, symbol, ...args);
        }
        return log;
      },
      logBase as TaskrLog
    );

    log.chalk = chalk;

    return log;
  };

  /**
   * Default logger
   */
  const log = createLog();

  /**
   * Reset the instance and return it, useful to simply update options, merging
   * the previously applied to the new ones
   */
  const reset = <TNewCtx extends TCtx = TCtx>(
    newOptions: TaskrSetupOptions<TNewCtx>
  ) => {
    return createTaskr({ ...custom, ...newOptions });
  };

  /**
   * Custom log appender
   * @see https://github.com/kshutkin/niceties/blob/main/logger/src/index.ts#L12-L37
   */
  createTaskrAppender(color, [icon.info, icon.success, icon.warn, icon.error]);

  /**
   * Tweaked `ora` options according to the Taskr setup configuration
   */
  const oraGetTweakedOptions = <T>(
    options?: string | TaskrOraOptions | TaskrOraPromiseOptions<T> | undefined
  ) => {
    if (typeof options === "string") {
      return { text: options, color: optColor };
    } else if (options) {
      return { ...options, color: options.colorForce || optColor };
    }
    return { color: optColor };
  };

  const oraWrapMethods = (base: Ora) => {
    base.warn = (text?: string) =>
      base.stopAndPersist({ text, symbol: icon.warn });
    base.info = (text?: string) =>
      base.stopAndPersist({ text, symbol: icon.info });
    base.succeed = (text?: string) =>
      base.stopAndPersist({ text, symbol: icon.success });
    base.fail = (text?: string) =>
      base.stopAndPersist({ text, symbol: icon.error });
    return base;
  };

  /**
   * Same as `ora` with default branded color
   */
  const ora = (options?: string | TaskrOraOptions | undefined) =>
    oraWrapMethods(baseOra(oraGetTweakedOptions(options)));

  /**
   * Same as `oraPromise` with default branded color
   *
   * @see https://github.com/sindresorhus/ora/blob/main/index.js#L380
   */
  ora.promise = async <T>(
    action: PromiseLike<T> | ((spinner: Ora) => PromiseLike<T>),
    options?: string | TaskrOraPromiseOptions<T>
  ) => {
    const actionIsFunction = typeof action === "function";
    // @ts-expect-error nevermind
    const actionIsPromise = typeof action.then === "function";

    if (!actionIsFunction && !actionIsPromise) {
      throw new TypeError("Parameter `action` must be a Function or a Promise");
    }

    const { successText, failText } =
      typeof options === "object"
        ? options
        : { successText: undefined, failText: undefined };

    const spinner = oraWrapMethods(
      baseOra(oraGetTweakedOptions(options))
    ).start();

    try {
      const promise = actionIsFunction ? action(spinner) : action;
      const result = await promise;

      spinner.succeed(
        successText === undefined
          ? undefined
          : typeof successText === "string"
          ? successText
          : successText(result)
      );

      return result;
    } catch (error) {
      spinner.fail(
        failText === undefined
          ? undefined
          : typeof failText === "string"
          ? failText
          : failText(error as Error)
      );

      throw error;
    }
  };

  /**
   * Get CLI brand "logo-like" (a là `Nx`)
   */
  const getCliBrand = (
    arg: {
      name?: string;
      suffix?: string;
      color?: TaskrColor;
    } = {}
  ) => {
    const name = arg.name || optName;
    const suffix = arg.suffix || optSuffix;
    const color = arg.color || optColor;
    const bgColor = `bg${capitalize(color)}` as const;
    return chalk.bold(
      `${chalk[color](">")} ${chalk[bgColor](` ${name} `)}${
        suffix ? ` ${chalk[color](suffix)}` : ""
      }`
    );
  };

  /**
   * Helper to enhance a `commander` **program** with some nice logging
   * (a là `Nx`)
   */
  const pm = (program: Command) => {
    program.addHelpText("beforeAll", "\n" + getCliBrand() + "\n");
    program.addHelpText("afterAll", "\n");

    program.hook("preSubcommand", (thisCommand, subCommand) => {
      emptyLine();

      log(
        getCliBrand() +
          ` Started ${chalk.bold(subCommand.name())} in ${formatTaskTime(
            performance.now() - setupAt
          )}`
      );

      emptyLine();
    });
    return program;
  };

  /**
   * Helper to enhance a `commander` **command** with some nice logging
   * (a là `Nx`)
   */
  const cmd = (program: Command) => {
    const t0 = performance.now();

    // NOTE: commander does not support attaching multiple hooks of the same
    // kind to the same command, so we remove this hook and move it to the
    // overall program's hook above. In this way we can use this useful hook
    // in our subcommands, often useful to set some environment variables that
    // should affect the whole command execution
    // program.hook("preAction", (thisCommand, actionCommand) => {
    //   emptyLine();
    //   spinner.text = `Started ${chalk.bold(actionCommand.name())}`;
    //   spinner.suffixText = chalk.dim(
    //     `in ${formatTaskTime(performance.now() - setupAt)} ...`
    //   );
    //   spinner.stopAndPersist();
    //   emptyLine();
    // });

    program.hook("postAction", (thisCommand, actionCommand) => {
      emptyLine();

      log(
        getCliBrand() +
          ` End ${chalk.bold(actionCommand.name())} after ${formatTaskTime(
            performance.now() - t0
          )}`
      );

      emptyLine();
    });

    return program;
  };

  /**
   * Run task
   */
  const runTask = async (
    task: Task<TCtx> | TaskGroup<TCtx>,
    options?: TaskRunOptions<TCtx>
  ) => {
    const startedAt = performance.now();
    const { subject, ownLog, whether } = task.meta;
    let { title, still } = task.meta;
    let indent = optIndent;
    let color = `${optColor}` as const;
    let oldLogger: undefined | Logger;

    if (options) {
      const {
        title: titleOpt,
        still: stillOpt,
        indent: indentOpt,
        color: colorOpt,
        logger: loggerOpt,
      } = options;
      title = titleOpt ?? title;
      still = stillOpt ?? still;
      indent = indentOpt ?? indent;
      color = colorOpt ?? color;
      oldLogger = loggerOpt ?? undefined;
    }

    // create a spinner instance with correct indentation to forward to the task
    const spinner = ora({
      text: title,
      indent,
      color,
    });
    // create a log instance with correct indentation to forward to the task
    const log = createLog({ indent });

    const logger = createLogger(oldLogger);

    const arg = {
      ctx: options?.ctx || ctx,
      log,
      logger,
      spinner,
      ora: ora,
      chalk,
      cliCursor,
      runTask,
    };

    // bail immediately if the task is conditional and condition is not met
    if (whether && !whether(arg)) {
      return;
    }

    cliCursor.hide();

    if (isTaskGroup<TCtx>(task)) {
      const { parallel, children } = task;

      if (children?.length) {
        let message = "";

        message =
          title === ":auto"
            ? chalk.dim(
                still
                  ? `Run ${children.length} tasks in ${
                      parallel ? "parallel" : "series"
                    }`
                  : `Running ${children.length} tasks in ${
                      parallel ? "parallel" : "series"
                    }...`
              )
            : title;

        if (title !== ":auto" && title !== ":no") {
          message = chalk[color](message);
          if (indent < 6) {
            message = chalk.bold(message);
          }

          if (subject) {
            message =
              chalk.white[`bg${capitalize(color)}`](` ${subject} `) +
              " " +
              message;
          }
        }

        if (title !== ":no") {
          logger[still ? "finish" : "start"](message);
        }

        const newOptions = {
          ...options,
          logger: logger,
          indent: title === ":no" ? indent : indent + 2,
        };

        if (parallel) {
          await Promise.all(
            children.map((child) => runAction(child, newOptions))
          );
        } else {
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            await runAction(child, newOptions);
          }
        }

        if (title === ":auto") {
          message = chalk.dim(
            `Run ${children.length} tasks in ${
              parallel ? "parallel" : "series"
            }`
          );
        }

        if (title !== ":no" && !still) {
          logger.finish(
            message +
              chalk.dim(` (${formatTaskTime(performance.now() - startedAt)})`)
          );
        }
      }
    } else {
      if (!ownLog?.includes("start") && title && title !== ":no") {
        if (indent > 6) title = chalk.italic(title);
        if (still) {
          logger.finish(title);
        } else {
          logger.update(title);
        }
      }

      await task({ ...arg, arg });

      if (!ownLog?.includes("end") && !still && title && title !== ":no") {
        if (indent > 6) title = chalk.italic(title);
        logger.finish(
          title +
            chalk.dim(` (${formatTaskTime(performance.now() - startedAt)})`)
        );
      }
    }

    // cliCursor.show();
  };

  /**
   * Run an action, a flexible async runner
   *
   * @example
   *
   * ```js
   * tasks().series(
   *   () => import("./my-task-default"),
   *   () => import("./my-task-named").then((mod) => mode.mytask)
   * );
   * ```
   */
  // FIXME: type any
  const runAction = async (
    action: TaskrAction<any>,
    options?: TaskRunOptions<any>
  ) => {
    if (isActionATaskOrTaskGroup(action)) {
      await runTask(action, options);
    } else if (typeof action === "function") {
      const maybeAmoduleImport = await action();

      if (maybeAmoduleImport) {
        await runAction(maybeAmoduleImport, options);
      }
    }
  };

  return {
    ctx,
    reset,
    runTask,
    runAction,
    /**
     * A simple `console.log`ger with coherent styles
     */
    log,
    /**
     * Commander's `program` wrapper
     */
    pm,
    /**
     * Commander's `command` wrapper
     */
    cmd,
    /**
     * Re-exports tweaked `ora` version (and its `oraPromise` as `ora.promise`)
     */
    ora,
    /**
     * Re-exports `chalk` to ease usage, avoiding an import
     */
    chalk,
  };
};
