/**
 * @file
 *
 * @borrows [@niceties/draftlog-appender](https://github.com/kshutkin/niceties/tree/main/draftlog-appender)
 *
 * Differences:
 * - add the color support and symbols customization options we use in taskr.
 * - add color to spinner
 * - use `chalk` instead of `kleur`
 * - hide cursor with `cli-cursor` a là `log-update`/`ora`
 */
import {
  ColorFormatters, // Action,
  Formatter,
  type LogLevel,
  LogMessage,
  Prefixes as Symbols,
} from "@niceties/logger";
import { filterMessages } from "@niceties/logger/appender-utils";
// import {
//   asciiPrefixes,
//   colors,
//   tagFactory,
//   unicodePrefixes,
// } from "@niceties/logger/default-formatting";
// alternatively to the below import the module used by `ora`:
// import isUnicodeSupported from 'is-unicode-supported';
import { terminalSupportsUnicode } from "@niceties/logger/format-utils";
import { appender } from "@niceties/logger/global-appender";
import {
  List,
  ListNode,
  append,
  appendRange,
  prepend,
  remove,
  removeRange,
} from "@slimlib/list";
import chalk from "chalk";
import { isCI } from "ci-info";
import draftlog from "draftlog";
import { TaskrColor } from "./taskr";

const enum ItemStatus {
  finished,
  inprogress,
}
interface ModelItem extends Partial<ListNode> {
  inputId?: number;
  message: string;
  status?: ItemStatus; // undefined means static
  loglevel: LogLevel;
  ref?: WeakRef<never>;
  parentId?: number;
  dirty?: boolean;
  lastLeaf?: ModelItem;
  tag?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any;
}

type Model = List<ModelItem> & {
  skipLines: number;
  tick: number;
  spinning: number;
};

const allColumnsListeners = new Set<WeakRef<() => void>>();

function subscribeToTerminalResize(listener: () => void) {
  allColumnsListeners.add(new WeakRef(listener));
}

process.stdout.on("resize", () => {
  for (const listener of allColumnsListeners) {
    const realListener = listener.deref();
    if (realListener) {
      realListener();
    } else {
      allColumnsListeners.delete(listener);
    }
  }
});

function createModel(
  logAboveSpinners: boolean
): [(logMessage: LogMessage) => Model, () => Model] {
  const model: Model = new List<ModelItem>() as Model;
  const itemById: { [key: number]: ModelItem } = Object.create(null);

  model.tick = model.skipLines = model.spinning = 0;

  return [
    ({ action, ...item }: LogMessage & ModelItem) => {
      // item has status undefined, so it is static by default
      item.dirty = true;
      const { inputId } = item;
      if (action === 0) {
        // Action.start) {
        item.status = ItemStatus.inprogress;
      }
      if (action === 2) {
        // Action.finish) {
        item.status = ItemStatus.finished;
      }
      if (action !== 3) {
        // Action.log) {
        // if status still empty in the original item or item does not exists it will remain empty and static
        updateModel(inputId as number, item);
      }
      cleanupModel();
      if (action === 3) {
        // Action.log) {
        appendToModel(item, logAboveSpinners);
      }
      return model;
    },
    () => {
      cleanupModel();
      return model;
    },
  ];

  function appendToModel(item: ModelItem, head: boolean) {
    if (head) {
      prepend(model, item);
    } else {
      append(model, item);
    }
    model.spinning += item.status || 0;
  }

  function updateModel(inputId: number, options: ModelItem): void {
    const modelItem = itemById[inputId];
    if (!modelItem) {
      const item: ModelItem = { inputId: inputId, ...options };
      itemById[inputId] = item;
      const itemParentId = item.parentId;
      if (itemParentId != null) {
        putIntoChildren(itemParentId, item, item);
      } else {
        appendToModel(item, false);
      }
    } else {
      const statusDiff = (options.status || 0) - (modelItem.status || 0);
      const moveIntoParent =
        options.parentId != null && modelItem.parentId == null;
      Object.assign(modelItem, options);
      model.spinning += statusDiff;
      if (moveIntoParent) {
        const lastLeaf = getLastLeaf(modelItem);
        model.spinning -= modelItem.status || 0;
        modelItem.dirty = true;
        removeRange(modelItem as ListNode, lastLeaf as ListNode);
        putIntoChildren(modelItem.parentId as number, modelItem, lastLeaf);
      }
    }
  }

  function putIntoChildren(
    itemParentId: number,
    begin: ModelItem,
    end: ModelItem
  ) {
    let parent = itemById[itemParentId];
    if (!parent) {
      parent = {
        inputId: itemParentId,
        message: "",
        loglevel: 0,
        ref: new WeakRef(model) as WeakRef<never>,
      } as ModelItem;
      appendToModel(parent, false);
      itemById[itemParentId] = parent;
    }
    appendRange(
      getLastLeaf(parent) as ListNode,
      begin as ListNode,
      end as ListNode
    );
    parent.lastLeaf = begin;
    model.spinning += begin.status || 0;
  }

  function cleanupModel() {
    for (const item of model) {
      if (!item.ref?.deref()) {
        model.skipLines += 1;
        item.inputId != null && delete itemById[item.inputId];
        remove(item);
      } else {
        break;
      }
    }
  }
}

function getLastLeaf(modelItem: ModelItem) {
  let lastLeaf = modelItem;
  while (lastLeaf.lastLeaf) {
    lastLeaf = lastLeaf.lastLeaf;
  }
  return lastLeaf;
}

function splitByLines(message: string): string[] {
  return message.match(getSubstringsRegex()) ?? [];
}

let substringsRegex: RegExp, substringsColumns: number;

function getSubstringsRegex() {
  const newColumns = process.stdout.columns || 80;
  if (substringsColumns !== newColumns) {
    substringsRegex = new RegExp(`.{1,${newColumns}}`, "g");
    substringsColumns = newColumns;
  }
  return substringsRegex;
}

interface DraftlogConfig {
  defaults: {
    canReWrite: boolean;
    maximumLinesUp: number;
  };
}

function createCanvas(
  spinner: Spinner,
  color: TaskrColor,
  formatter: Formatter,
  ident: number
) {
  draftlog(console);
  (draftlog as never as DraftlogConfig).defaults.canReWrite = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updaters: Array<(message?: any, ...optionalParams: any[]) => void> = [];

  let lastModel: Model | undefined;

  subscribeToTerminalResize(() => {
    if (lastModel) {
      modelFn(lastModel, true);
    }
  });

  return modelFn;

  function modelFn(model: Model, dirty = false) {
    lastModel = model;
    if (model.skipLines) {
      updaters.splice(0, model.skipLines);
      model.skipLines = 0;
    }
    let key = 0;
    const stack: (ModelItem | null)[] = [];
    for (const item of model) {
      if (dirty || item.dirty || item.status) {
        let prefix = getPrefix(item.status as ItemStatus, model.tick),
          prefixUpdated = false;
        const subitems = splitByLines(item.message);
        for (const message of subitems) {
          let updater = updaters[key++];
          if (!updater) {
            updater = console.draft(" ");
            // updater = createLogUpdate(process.stderr);
            updaters.push(updater);
          }
          updater(
            formatter(
              {
                loglevel: item.loglevel,
                message,
                context: item.context,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                action: (item.status === undefined
                  ? 3 // Action.log
                  : undefined) as unknown as any,
                tag: item.tag,
              },
              prefix,
              ident * stack.length
            )
          );
          if (
            subitems.length > 1 &&
            typeof prefix === "string" &&
            !prefixUpdated
          ) {
            prefix = prefix.replaceAll(/./g, " ");
            prefixUpdated = true;
          }
        }
        if (item.dirty) {
          item.dirty = false;
          dirty = true;
        }
      } else {
        // iterate
        key += splitByLines(item.message).length;
      }
      if (stack[stack.length - 1] === item) {
        stack[stack.length - 1] = null;
      }
      if (item.lastLeaf) {
        stack.push(item.lastLeaf);
      }
      while (stack.length && stack[stack.length - 1] == null) {
        stack.pop();
      }
    }

    while (key < updaters.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updaters[key++] as (message?: any, ...optionalParams: any[]) => void)(
        ""
      );
    }
  }

  function getPrefix(status: ItemStatus, tick: number): string | boolean {
    // status is truthy when it is inprogress
    return status
      ? (chalk[color](spinner.frames[tick]) as string | boolean)
      : // status not null when it is finished
        status != null;
  }
}

function createAppender(
  spinner: Spinner,
  color: TaskrColor,
  formatter: Formatter,
  logAboveSpinners: boolean,
  ident: number
) {
  let interval: NodeJS.Timeout | undefined;

  const [updateModel, getModel] = createModel(logAboveSpinners);
  const renderModel = createCanvas(spinner, color, formatter, ident);

  return (message: LogMessage) => {
    renderModel(updateModel(message));
    checkTimeout();
  };

  function checkTimeout() {
    const spinning = getModel().spinning;
    if (spinning && !interval) {
      interval = setInterval(
        updateSpinners,
        spinner.interval
      ) as unknown as NodeJS.Timeout;
      interval.unref(); // unref immidiately just in case
    } else if (!spinning && interval) {
      clearInterval(interval);
      interval = undefined;
    }
  }

  function updateSpinners() {
    const model = getModel();
    model.tick++;
    model.tick %= spinner.frames.length;
    renderModel(model);
  }
}

interface Spinner {
  interval: number;
  frames: string[];
}

const dots = {
  interval: 50,
  frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
};

const line = {
  interval: 130,
  frames: ["-", "\\", "|", "/"],
};

const createFormatter = (
  colors: ColorFormatters,
  symbols: Symbols,
  tagFactory: (tag: string) => string
) => {
  return (
    { loglevel, message, context, action, tag }: LogMessage,
    usePrefix?: string | boolean,
    identation = 0
  ): string => {
    const prefix =
      usePrefix === true
        ? `${symbols[loglevel]} `
        : typeof usePrefix === "string"
        ? `${usePrefix} `
        : "";
    const color = colors[loglevel];
    const text = `${prefix}${
      // loglevel === LogLevel.verbose &&
      loglevel === 0 &&
      // action === Action.log &&
      action === 3 &&
      tag !== undefined
        ? tagFactory(tag) + " "
        : ""
    }${message}${context != null ? " " + context : ""}`;
    return `${" ".repeat(identation)}${color ? color(text) : text}`;
  };
};

export function createTaskrAppender(color: TaskrColor, symbols: Symbols) {
  if (!isCI) {
    const colorise = chalk[color];
    const supportsUnicode = terminalSupportsUnicode();
    const spinner = supportsUnicode ? dots : line;
    // eslint-disable-next-line no-sparse-arrays
    const colors: ColorFormatters = [, , chalk.yellow, chalk.red];
    const tagFactory = (tag: string) => {
      return "[" + colorise(tag) + "]";
    };
    const formatter = createFormatter(colors, symbols, tagFactory);

    let minLogLevel = 1; // LogLevel.info;
    appender(
      filterMessages<Error, { setMinLevel(logLevel: LogLevel): void }>(
        (message: LogMessage) => message.loglevel >= minLogLevel,
        createAppender(spinner, color, formatter, true, 2), // eslint-disable-line indent
        {
          setMinLevel(logLevel: LogLevel) {
            minLogLevel = logLevel;
          },
        } // eslint-disable-line indent
      )
    );
  }
}
