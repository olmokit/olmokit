import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import type { TaskrLog } from "@olmokit/cli-utils/taskr";
import { generate } from "../../generate.js";
import { getNameVariants } from "../../getNameVariants.js";
import { paths } from "../paths/index.js";
import { type CmsResponseDataStructure, cmsGetStructure } from "./cms.js";
import { laravelConfig } from "./dotenv.js";

/**
 * Should check routes
 */
export function shouldCheckRoutes() {
  if (
    !laravelConfig("env.CMS_API_URL") ||
    laravelConfig("env.DEV_SKIP_CMS_ROUTES_CHECK")
  ) {
    return false;
  }

  return true;
}

/**
 * Get remote route names as a flat array of strings, route IDs correspond to
 * names.
 */
function getRoutesNamesFromRemote(routes: CmsResponseDataStructure["routes"]) {
  const output: string[] = [];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    output.push(route.id);
  }

  return output;
}

/**
 * Get locally defined routes IDs based on the source code folder structure,
 * each route name corresponds to its folder name
 */
async function getRoutesNamesFromSource() {
  const routesSrc = paths.frontend.src.routes;

  // at the very begininng routes folder might not even be there
  if (!existsSync(routesSrc)) {
    return [];
  }

  const routesDirents = await readdir(routesSrc, { withFileTypes: true });

  return routesDirents
    .filter((folder) => folder.isDirectory())
    .map((folder) => folder.name);
}

/**
 * Check routes consistency and reports a summary in the terminal. The check is
 * performed among two levels:
 *
 * 1) routes determined by the source code folder structure
 * 2) routes defined in the CMS
 */
export async function checkRoutesConsistency(log: TaskrLog, useBarba: boolean) {
  if (!shouldCheckRoutes()) {
    return;
  }
  log.info("Check that CMS pages are in sync");

  try {
    const asyncData = await getRoutes(log);
    const source = await getRoutesNamesFromSource();
    const remote = getRoutesNamesFromRemote(asyncData.routes);
    const missingRemotes = source.filter(
      (route) => remote.indexOf(route) === -1,
    );
    const missingSources = remote.filter(
      (route) => source.indexOf(route) === -1,
    );

    if (missingRemotes.length) {
      log.warn(
        log.chalk.ansi256(220)(
          `The following routes are defined locally but ${log.chalk.bold(
            "missing in the CMS",
          )}:`,
        ),
      );

      for (let i = 0; i < missingRemotes.length; i++) {
        log(missingRemotes[i], "", `  ${i + 1}. `);
      }

      log.warn(
        log.chalk.ansi256(220)(
          "You might want to add them through the CMS pages.",
        ),
      );
    }

    if (missingSources.length) {
      log.warn(
        log.chalk.yellowBright(
          `The following routes defined in the CMS were ${log.chalk.bold(
            "missing locally",
          )}:`,
        ),
      );

      for (let i = 0; i < missingSources.length; i++) {
        log(missingSources[i], "", `  ${i + 1}. `);
        generateRouteSource(missingSources[i], useBarba);
      }

      log.warn(
        log.chalk.yellowBright(
          "Now they have been autogenerated. It is better to immediately add and push them on Git.",
        ),
      );
    }

    if (!missingRemotes.length && !missingSources.length) {
      log.success(
        log.chalk.bold("Routes are consistent") +
          " between the CMS and the local repository folder structure.",
      );
    }
  } catch (e) {
    log.error("Failed checking routes consistency");
  }
}

/**
 * Is the given route an exception route?
 */
function isExceptionRoute(routeName: string) {
  return ["400", "404", "419", "500", "503"].includes(routeName);
}

/**
 * Generate route source files and folder
 */
export function generateRouteSource(name: string, useBarba: boolean) {
  const data = {
    route: getNameVariants(name),
    isExceptionRoute: isExceptionRoute(name),
  };

  generate({
    name,
    data,
    srcFolder: join(paths.self.templates, "route" + (useBarba ? "-barba" : "")),
    destFolder: paths.frontend.src.routes,
  });
}

/**
 * Merge routes coming from the CMS with system routes, like 404 and 500 error
 * pages
 */
function mergeWithSystemRoutes(
  response: CmsResponseDataStructure = {
    routes: [],
    i18n: {
      default_locale: "en",
      locales: ["en"],
    },
  },
) {
  const { routes, ...data } = response;
  const systemRoutes: Record<
    string,
    CmsResponseDataStructure["routes"][number]
  > = {
    404: {
      id: "404",
      slug: {},
    },
    500: {
      id: "500",
      slug: {},
    },
    503: {
      id: "503",
      slug: {},
    },
  };

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    if (systemRoutes[route.id]) {
      delete systemRoutes[route.id];
    }
  }

  for (const key in systemRoutes) {
    const route = systemRoutes[key];
    for (let k = 0; k < data.i18n.locales.length; k++) {
      const locale = data.i18n.locales[k];
      route.slug[locale] = `/${locale}/${route.id}`;
    }
    routes.unshift(route);
  }

  return {
    ...data,
    routes,
  };
}

/**
 * Get routes merging those defined from the CMS and the system default routes
 */
async function getRoutes(log: TaskrLog) {
  try {
    const res = await cmsGetStructure(log);

    return mergeWithSystemRoutes(res);
  } catch (e) {
    return mergeWithSystemRoutes();
  }
}

/**
 * Check whether a route is using `barba`
 *
 * It searches for a `$useBarba` property on the route's controller php class.
 * We simply do a regex, we might be more sophisticated and parse the actual
 * php code but it does not seem to be needed.
 */
async function isRouteUsingBarba(routeName: string) {
  const routeController = join(
    paths.frontend.src.routes,
    routeName,
    "index.php",
  );
  const regex = /\$useBarba.*=.*true/gm;

  if (existsSync(routeController)) {
    const cnt = await readFile(routeController, "utf-8");

    return regex.test(cnt);
  }
  return false;
}

/**
 * Get all routes names/ids that use barba
 */
export async function getBarbaRoutes() {
  const allRoutes = await getRoutesNamesFromSource();
  const routesChecked = await Promise.all(
    allRoutes.map(async (routeName) => {
      return (await isRouteUsingBarba(routeName)) ? routeName : false;
    }),
  );

  return routesChecked.filter((routeName) => routeName !== false);
}
