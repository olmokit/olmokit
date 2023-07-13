import { TaskrInstance } from "@olmokit/cli-utils/taskr.js";
import { getVariadicArguments } from "../../getVariadicArguments.js";
import {
  checkRoutesConsistency,
  generateRouteSource,
} from "../helpers/route.js";

/**
 * Generate route
 */
export async function generateRoute(args: string[], taskr: TaskrInstance) {
  const names = getVariadicArguments(args);

  taskr.log.success(
    names.length > 1
      ? `The following routes have been generated:`
      : `The following route has been generated:`
  );

  for (let i = 0; i < names.length; i++) {
    taskr.log.info(names[i], "", "  ");
    generateRouteSource(names[i]);
  }

  await checkRoutesConsistency(taskr.log);
}
