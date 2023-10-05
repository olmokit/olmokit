import { join } from "path";
import type { TaskrInstance } from "@olmokit/cli-utils/taskr";
import { generate } from "../../generate.js";
import { getNameVariants } from "../../getNameVariants.js";
import { getVariadicArguments } from "../../helpers-getters.js";
import { paths } from "../paths/index.js";

/**
 * Generate component
 */
export function generateComponent(args: string[], taskr: TaskrInstance) {
  const names = getVariadicArguments(args);

  taskr.log.success(
    names.length > 1
      ? `The following components have been generated:`
      : `The following component has been generated:`,
  );

  for (let i = 0; i < names.length; i++) {
    const data = { component: getNameVariants(names[i]) };
    taskr.log.info(data.component.className, "", "  ");

    generate({
      name: data.component.className,
      data,
      srcFolder: join(paths.self.templates, "component"),
      destFolder: paths.frontend.src.components,
    });
  }
}
