import type { PackageJson } from "type-fest";

/**
 * Given a parsed `package.json` content it returns the *list* and *map* of all
 * its dependencies, optionally filtered by the given `scope` argument
 *
 * @param scope In the shape of `@${string}`
 */
export function getProjectDependencies(pkg: PackageJson, scope?: `@${string}`) {
  try {
    const {
      dependencies = {},
      devDependencies = {},
      peerDependencies = {},
    } = pkg;
    const all = { ...dependencies, ...devDependencies, ...peerDependencies };
    const names = Object.keys(all);
    const uniqueNames = [...new Set(names)];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    let list = uniqueNames.map((name) => ({ name, version: all[name]! }));
    let map = all as Record<string, string>;

    if (scope) {
      list = list.filter(({ name }) => name.startsWith(scope));
      map = list.reduce((map, dep) => {
        map[dep.name] = dep.version;
        return map;
      }, {} as Record<string, string>);
    }

    return {
      list,
      map,
    };
  } catch (e) {
    console.log(`getProjectDependencies`, e);
  }

  return {
    list: [],
    map: {},
  };
}
