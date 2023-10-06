/**
 * @file With `config` we mean the `CLI` configuration set by the current `project`
 */
import type { Config } from "./types";

/**
 * Create Olmo project configuration in `olmo.ts` file.
 *
 * You can extend it in the hidden `.olmo.ts` file to customize your
 * _**local** environment_.
 *
 * @example
 *
 * in public `olmo.ts`:
 * ```js
 * import { createConfig } from "@olmokit/cli";
 *
 * export default createConfig({
 *   type: "laravel",
 *   env: {
 *     branches: {
 *       dev: "dev",
 *       production: "production",
 *     },
 *     vars: {
 *       APP_URL: "https://mywebsite.com"
 *     }
 *   }
 * });
 * ```
 * in hidden `.olmo.ts`:
 * ```js
 * import olmo from "./olmo";
 *
 * export default olmo.extend("dev", {
 *   env: {
 *     vars: {
 *       APP_URL: "http://mywebsite.test"
 *     }
 *   }
 * };
 * ```
 *
 * TODO: support async signature
 */
export function createConfig<TEnvsMap extends Config.EnvsMap>(
  custom: Config.Custom<TEnvsMap>,
) {
  return {
    ...custom,
    extend: <TEnvName extends keyof TEnvsMap>(
      envNameToInheritFrom: TEnvName,
      overrides?: Config.CustomOverrides,
    ): Config.CustomMaybeExtended<TEnvsMap, TEnvName> => {
      return {
        ...custom,
        hasHiddenConfig: true,
        envNameToInheritFrom,
        overrides,
      };
    },
  };
}

// function mergeLocalConfig<
//   TEnvsMap extends Config.EnvsMap,
//   TEnvName extends keyof TEnvsMap
// >(
//   custom: Config.Custom<TEnvsMap>,
//   envNameToInheritFrom: TEnvName,
//   overrides?: Config.CustomOverrides
// ): Config.Custom<TEnvsMap> {
//   if (overrides?.env) {
//     return {
//       ...custom,
//       env: {
//         branches: custom.env.branches,
//         vars: {},
//         extraVars: {},
//       },
//     };
//   }
//   return custom;
// }
