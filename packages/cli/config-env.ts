import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { configBuild } from "./config-build.js";
import type { Config } from "./types.js";

export type AutomaticEnvVars = ReturnType<typeof getAutomaticEnvVars>;

export type ConfigurableEnvVars = typeof defaultEnvVars;

export type PredefinedEnvVars = AutomaticEnvVars & ConfigurableEnvVars;

export const defaultEnvVars = {
  /**
   * @category App
   * @note This uses the same name as Laravel's env variables
   */
  APP_URL: "",
  /**
   * @category App
   * @note This uses the same name as Laravel's env variables
   */
  APP_DEBUG: false as boolean,
  /**
   * @category App
   * @note This uses the same name as Laravel's env variables
   */
  DEBUGBAR_ENABLED: false as boolean,
  /**
   * @category CMS
   */
  CMS_API_URL: "",
  /**
   * @category CMS
   */
  CMS_API_STORAGE: "",
  /**
   * @category CMS
   */
  CMS_API_CACHE: true as boolean,
  /**
   * @category Auth
   */
  AUTH_API_URL: "",
  /**
   * @category Auth
   */
  AUTH_API_CACHE: true as boolean,
  /**
   * @category Auth
   */
  AUTH_REGISTER_LOGIN: false as boolean,
  /**
   * @category Forms
   */
  OLMOFORMS_TOKEN: "",
  /**
   * @category Hooks
   */
  HOOKS_ALLOWED_IPS: "",
  /**
   * @category Hooks
   */
  HOOKS_ALLOWED_PARAM: "",
  /**
   * @category Images
   */
  IMG_COMPRESSION_QUALITY: 75,
  /**
   * @category Images
   */
  IMG_COMPRESSION_QUALITY_WEBP: 75,
  /**
   * @category Images
   */
  IMG_PRETTY_URLS: false as boolean,
  /**
   * @category CI
   */
  CI_VISIT_MODE: undefined as undefined | false | "php" | "node",
  /**
   * @category CI
   */
  CI_CLEAR_CACHE: false as boolean,
  /**
   * Select the CDN to use for frontend static assets (only `s3` for now)
   * @feature CDN
   * @category CDN
   */
  CDN: undefined as undefined | false | "s3",
  /**
   * The URL of the publicly accessible `S3` bucket
   * NB: do not add `/public` at the end
   *
   * @example "https://storage.mycompany.com"
   * @category CDN/S3
   * @note This uses the same name as Laravel's env variables
   */
  AWS_URL: false as string | false,
  /**
   * @example "XXXXXXXXXXXXXXXXXXXX"
   * @category CDN/S3
   * @note This uses the same name as Laravel's env variables
   */
  AWS_ACCESS_KEY_ID: "",
  /**
   * @example "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   * @category CDN/S3
   * @note This uses the same name as Laravel's env variables
   */
  AWS_SECRET_ACCESS_KEY: "",
  /**
   * @example "eu-south-1",
   * @category CDN/S3
   * @note This uses the same name as Laravel's env variables
   */
  AWS_DEFAULT_REGION: "",
  /**
   * @example "project-com-assets",
   * @category CDN/S3
   * @note This uses the same name as Laravel's env variables
   */
  AWS_BUCKET: "",
  /**
   * @default false
   * @category CDN/S3
   * @note This uses the same name as Laravel's env variables
   */
  AWS_USE_PATH_STYLE_ENDPOINT: false as boolean,
  /**
   * Analyses the webpack bundles
   *
   * @category dev
   */
  DEV_ANALYZE: false,
  /**
   * @category dev
   */
  DEV_SKIP_CMS_ROUTES_CHECK: false,
  /**
   * @category dev
   */
  DEV_SOURCEMAPS: false,
  /**
   * @category dev
   */
  DEV_WEBPACK_DEBUG: false,
  /**
   * @category dev
   */
  DEV_WEBPACK_CACHE: false,
};

/**
 * Get automatically determined env variables
 */
function getAutomaticEnvVars(
  custom: Config.CustomMaybeExtended,
  project: Config.Internal["project"],
  configurableVars: ConfigurableEnvVars,
  envName: string
) {
  const build = configBuild({ ...custom, project });

  return {
    /**
     * This is automatically inherited from the project's `package.json#name` property
     *
     * @category Automatic
     */
    APP_NAME: project.slug,
    /**
     * App's key
     *
     * This is dummy and almost stable, we could autogenerate it with
     * `php artisan key` but we don't use databases here.
     *
     * @category Automatic
     */ // prettier-ignore
    APP_KEY: `base64:zz+DQchz4${randomBytes(2).toString("hex")}AmpM4y9Nx+zR4zY2rpMbweU18IxWbw=`, // APP_KEY: `base64:zz+${randomBytes(20).toString("hex")}=`,
    /**
     * The application current environment. This is set dynamically based on the
     * context, the commands, etc.
     * FIXME: not sure this is the right place where to infer the APP_ENV
     *
     * @category Automatic
     */
    APP_ENV: envName,
    /**
     * This is the URL pathname to prepend to all frontend assets, it might be
     * a longer pathname when using a CDN or a simple '/' otherwise or during
     * development
     *
     * It is only updated during `build` and `start|dev` tasks, it needs to persist
     *
     * @category Automatic
     */
    PUBLIC_PATH: build.publicPath,
    /**
     * The public URL, it needs to be absolute only when using a CDN
     *
     * It is only updated during `build` and `start|dev` tasks, it needs to persist
     *
     * @category Automatic
     */
    PUBLIC_URL: build.publicUrl,
  };
}

/**
 * Get a single env var value, both as `flat` (a primitve for the current env),
 * and as `map` (one primitve value for each env)
 */
function getEnvVarValue<
  TValue extends Config.EnvVarValueFlatOrByEnvName<TEnvsMap, any>,
  TEnvsMap extends Config.EnvsMap
>(value: TValue, envsMap: TEnvsMap, envName: keyof TEnvsMap) {
  // either we have a map where we can look for a value specific to the env name
  if (typeof value === "object" && value !== null) {
    return {
      // @ts-expect-error FIXME: type
      flat: value[envName],
      map: value,
    };
  }
  // or we have a primitive value that is meant to be shared among all envs
  return {
    flat: value,
    map: Object.keys(envsMap).reduce((mapByEnvName, envName) => {
      mapByEnvName[envName] = value;
      return mapByEnvName;
    }, {} as Config.EnvVarByEnvName<Config.EnvsMap, any>),
  };
}

type ProcessedEnvVars<
  TEnvsMap extends Config.EnvsMap,
  TVars extends Config.EnvVars
> = {
  current: TVars;
  byVarNameMap: Config.EnvVarsByVarName<TEnvsMap, TVars>;
};

/**
 * Logic that merges the env variables overridden in the hidden `.olmo.ts` file
 */
function processConfigEnvVars<
  TVars extends Config.EnvVars,
  TEnvsMap extends Config.EnvsMap = Config.EnvsMap
>(
  currentEnvName: string,
  envsMap: TEnvsMap,
  vars: Config.EnvVarsFlatOrByEnvName<TEnvsMap, TVars>,
  varsOverride: Partial<TVars> = {}
) {
  const allKeys = [
    ...Object.keys(vars),
    ...Object.keys(varsOverride),
  ] as (keyof TVars)[];
  return allKeys.reduce(
    (map, varName) => {
      const rawValue = varsOverride?.[varName] ?? vars[varName];

      if (typeof rawValue !== "undefined") {
        const value = getEnvVarValue(rawValue, envsMap, currentEnvName);

        if (typeof value.flat !== "undefined") {
          map.current[varName] = value.flat;
        }
        if (typeof value.map !== "undefined") {
          map.byVarNameMap[varName] = value.map;
        }
      }

      return map;
    },
    {
      current: {},
      byVarNameMap: {},
    } as ProcessedEnvVars<TEnvsMap, TVars>
  );
}

/**
 * TODO: Here we could check if we are on CI, look at the current branch, read
 * a global CLI command option, etc... decide the priority of this
 * By default we assume we are developing on the local envronment.
 */
function determineCurrentEnv() {
  return "local";
}

/**
 * Process the `env` portion of the internal config object
 */
export function getConfigEnv(
  custom: Config.CustomMaybeExtended,
  project: Config.Internal["project"]
): Config.Internal["env"] {
  const envsMap = custom.env.branches || {
    dev: "dev",
    staging: "staging",
    production: "production",
  };
  const currentEnvName = custom.envNameToInheritFrom || determineCurrentEnv();

  const configurableVars = processConfigEnvVars<ConfigurableEnvVars>(
    currentEnvName,
    envsMap,
    {
      ...defaultEnvVars,
      ...custom.env.vars,
    },
    custom.overrides?.env?.vars
  );
  const extraVars = processConfigEnvVars<Config.EnvVars>(
    currentEnvName,
    envsMap,
    custom.env.extraVars || {},
    custom.overrides?.env?.extraVars
  );
  const automaticEnvVars = processConfigEnvVars<AutomaticEnvVars>(
    currentEnvName,
    envsMap,
    getAutomaticEnvVars(
      custom,
      project,
      configurableVars.current,
      currentEnvName
    )
  );

  // merge all env vars maps by name
  const varsByVarNameMap = {
    ...configurableVars.byVarNameMap,
    ...extraVars.byVarNameMap,
    ...automaticEnvVars.byVarNameMap,
  };
  // merge all env vars flat map of current env
  const vars = {
    ...configurableVars.current,
    ...extraVars.current,
    ...automaticEnvVars.current,
  };

  return {
    nameToBranchMap: envsMap,
    names: Object.keys(envsMap),
    varsByVarNameMap,
    vars,
  };
  // return buildConfigEnv(envsMap, configurableVars, extraVars, automaticEnvVars);
}

// function buildConfigEnv<TEnvsMap extends Config.EnvsMap, TVars extends Config.EnvVars>(envsMap: TEnvsMap, ...processed: ProcessedEnvVars<TEnvsMap, TVars>[]) {
//   const varsByVarNameMap = processed.reduce((map, single) => ({
//       ...map,
//       ...single.byVarNameMap
//   }), {} as Config.EnvVarsByVarName<TEnvsMap, TVars>)
//   const vars = processed.reduce((map, single) => ({
//       ...map,
//       ...single.current
//   }), {} as TVars)
//   return {
//     nameToBranchMap: envsMap,
//     names: Object.keys(envsMap),
//     varsByVarNameMap,
//     vars,
//   };
// }

/**
 * Return all env variables values by var name grouped by env name
 */
export function getEnvVarsByEnvName(config: Pick<Config.Internal, "env">) {
  const { varsByVarNameMap } = config.env;
  return Object.keys(varsByVarNameMap).reduce((map, varName) => {
    const varValuesByEnvName = varsByVarNameMap[varName];
    Object.keys(varValuesByEnvName).forEach((envName) => {
      map[envName] = map[envName] || {};
      map[envName][varName] =
        map[envName][varName] || varValuesByEnvName[envName];
    });
    return map;
  }, {} as Config.EnvVarsByEnvName<Config.EnvsMap, Config.Internal["env"]["vars"]>);
}

/**
 * Return list of all env names each with their all env variables
 */
export function getEnvVarsByEnvNameList(config: Pick<Config.Internal, "env">) {
  const varsByEnvNameMap = getEnvVarsByEnvName(config);
  return Object.keys(config.env.nameToBranchMap).map((envName) => ({
    name: envName,
    vars: varsByEnvNameMap[envName],
  })) as {
    name: keyof Config.EnvsMap;
    vars: PredefinedEnvVars & Config.EnvVars;
  }[];
}

/**
 * Update env variables
 */
export function updateEnvVars(
  config: Pick<Config.Internal, "project"> & {
    env: Pick<Config.Internal["env"], "vars">;
  },
  newVars: Partial<Config.Internal["env"]["vars"]>
) {
  config.env.vars = {
    ...config.env.vars,
    ...newVars,
  };

  applyEnvVars(config);
}

/**
 * Update APP_ENV
 */
export function updateAppEnv(config: Config.Internal, envName: string) {
  const varsByEnvNameMap = getEnvVarsByEnvName(config);

  updateEnvVars(config, {
    ...varsByEnvNameMap[envName],
    APP_ENV: envName,
  });
}

/**
 * Set `process.env` primitive JavaScript value
 */
function applyProcessEnvPrimitive(
  dotEnvFileLines: string[],
  name: string,
  value?: string | number | boolean
) {
  if (typeof value === "undefined") {
    delete process.env[name];
  } else if (typeof value === "boolean") {
    if (value) {
      process.env[name] = "true";
      dotEnvFileLines.push(`${name}=true`);
    } else {
      delete process.env[name];
    }
  } else if (typeof value === "string") {
    if (value) {
      process.env[name] = value;
      dotEnvFileLines.push(`${name}=${value}`);
    } else {
      delete process.env[name];
    }
  } else if (typeof value === "number") {
    process.env[name] = value.toString();
    dotEnvFileLines.push(`${name}=${value.toString()}`);
  }
}

/**
 * Apply env variables
 */
export function applyEnvVars(
  config: Pick<Config.Internal, "project"> & {
    env: Pick<Config.Internal["env"], "vars">;
  }
) {
  const vars = config.env.vars;
  const dotEnvFileLines: string[] = [];

  for (const name in vars) {
    const value = vars[name as keyof typeof vars];
    // or be shared/equal among all environments
    applyProcessEnvPrimitive(dotEnvFileLines, name, value);
  }

  writeFileSync(
    config.project.envPath,
    [
      "# This file is autogenerated and .gitignored, do not edit it",
      ...dotEnvFileLines,
    ].join("\n")
  );
}

// type FlatteEnvVarValue<
//   A extends Config.EnvsMap,
//   T
// > = T extends Config.EnvVarsByVarName<A, infer U>
//   ? U
//   : T extends Config.EnvVarValueByEnvName<A, infer U>
//   ? U
//   : T;

// const a/* : Config.EnvVarValueFlatOrByEnvName<Config.EnvsMap, string> */ = { d: "d", p: "p"};
// const b/* : Config.EnvVarsByVarName<Config.EnvsMap, { A: string }> */ = { A: a };
// const c = b["x" as keyof (typeof b)];
// type aFlat = FlatteEnvVarValue<Config.EnvsMap, typeof a>;
// type bFlat = FlatteEnvVarValue<Config.EnvsMap, typeof b>;
// type cFlat = FlatteEnvVarValue<Config.EnvsMap, typeof c>;
