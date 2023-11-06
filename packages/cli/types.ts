/* eslint-disable @typescript-eslint/no-namespace */
import type { Command } from "commander";
import type { FaviconOptions } from "favicons";
import type { TaskrInstance } from "@olmokit/cli-utils/taskr";
import type { ConfigurableEnvVars, PredefinedEnvVars } from "./config-env";

export namespace Cli {
  export type Creator<TConfig extends Config.Internal> = (options: {
    program: Command;
    taskr: TaskrInstance<TConfig>;
  }) => {
    commands: Command[];
  };
}

export namespace Config {
  /**
   * The configuration object defined by the current `project`
   */
  export interface Custom<TEnvsMap extends EnvsMap = EnvsMap> {
    /**
     * The project type
     *
     * @default "laravel"
     */
    type: "laravel"; // | "nextjs";
    /**
     * Favicons autogeneration settings
     */
    favicons?: FaviconOptions;
    /**
     * HTTP Authentication settings (used to protect the `staging` environment)
     */
    httpAuth?: {
      authUserFile?: string;
      matchUrlPart?: string;
      username?: string;
      password?: string;
    };
    /**
     * When `true` the `route` generator commands will use templates adapted
     * for barba.js
     */
    useBarba?: boolean;
    /**
     * Environment configuration
     */
    env: {
      /**
       * Define how the `env`ironments map to `git branch`es
       *
       * @default { dev: "dev", staging: "staging", production: "production" }
       */
      branches: TEnvsMap;
      /**
       * Standardised environment variables, configured by **enviroment** `name`
       * as defined in the `env.branches` map
       */
      vars: EnvVarsFlatOrByEnvName<TEnvsMap, ConfigurableEnvVars>;
      /**
       * Extra environment variables
       */
      extraVars?: EnvVarsFlatOrByEnvName<TEnvsMap, EnvVars>;
    };
    /**
     * Manage configurations relative to the bundled/output deploy-ready output
     */
    output?: {
      /**
       * Set it to `true` to include the `/src` static files (no php)
       *
       * @default false
       */
      src?: boolean;
    };
  }

  /**
   * This is what the project's can override in the hidden configuration file
   */
  export type CustomOverrides = {
    env?: {
      /**
       * The environment variables to override locally
       *
       * NB: This is a flat key/value object
       */
      vars?: Partial<ConfigurableEnvVars>;
      extraVars?: Partial<EnvVars>;
    };
  };

  /**
   * The current `project` probably extends the configuration through a hidden
   * file that _extends_ the main public configuration.
   */
  export type CustomMaybeExtended<
    TEnvsMap extends EnvsMap = EnvsMap,
    TEnvName extends keyof TEnvsMap = keyof TEnvsMap,
  > = Custom<TEnvsMap> & {
    hasHiddenConfig?: boolean;
    envNameToInheritFrom?: TEnvName;
    overrides?: CustomOverrides;
  };

  /**
   * The internal processed/normalised version of the CLI configuration
   *
   * I prefer to cherry pick from the {@link Custom} type rather than extending
   * a shared one, as the two configs are quite different and have different
   * purposes
   */
  export type Internal = Pick<
    Custom,
    "type" | "favicons" | "httpAuth" | "output"
  > &
    Pick<Required<Custom>, "useBarba"> & {
      /**
       * Environment information
       */
      env: {
        /**
         * @inheritdoc {@link Custom}
         */
        nameToBranchMap: Custom<EnvsMap>["env"]["branches"];
        /**
         * @inheritdoc {@link Custom}
         */
        names: (keyof Custom<EnvsMap>["env"]["branches"])[];
        /**
         * All env variables values by env name grouped by var name
         *
         * @example
         * {
         *   MYVAR: {
         *     dev: "a",
         *     prod: "b"
         *   },
         *   MYVAR2: {
         *     dev: "1",
         *     prod: "2"
         *   }
         * }
         */
        varsByVarNameMap: EnvVarsByVarName<
          EnvsMap,
          PredefinedEnvVars & EnvVars
        >;
        /**
         * All current env variables flattened
         */
        vars: PredefinedEnvVars & EnvVars;
      };
    };

  /**
   * Basic unspecified envs map
   */
  export type EnvsMap = Record<string, string>;

  /**
   * Values that an env variable can define
   */
  export type EnvVarValue = string | number | boolean | undefined;

  /**
   * The most basic shape of the env variables definition, used for `extraVars`
   * and as a base type
   *
   * @example
   *
   * {
   *   MYVAR: "a-value",
   * }
   */
  export type EnvVars = Record<string, EnvVarValue>;
  // {
  //   [varName: string]: EnvVarValue;
  // };

  /**
   * @example
   *
   * {
   *   MYVAR: "shared",
   *   MYVAR2: {
   *     dev: "speficic-to-dev",
   *     prod: "speficic-to-prod"
   *   }
   * }
   */
  export type EnvVarsFlatOrByEnvName<
    TEnvsMap extends EnvsMap,
    TVars extends EnvVars,
  > = {
    [VarName in keyof TVars]?: EnvVarValueFlatOrByEnvName<
      TEnvsMap,
      TVars[VarName]
    >;
  };

  /**
   * @example
   *
   * "shared" | {
   *   dev: "speficic-to-dev",
   *   prod: "speficic-to-prod"
   * }
   */
  export type EnvVarValueFlatOrByEnvName<
    TEnvsMap extends EnvsMap,
    TVarValue extends EnvVarValue,
  > = TVarValue | EnvVarValueByEnvName<TEnvsMap, TVarValue>;

  /**
   * @example
   * {
   *   dev: "speficic-to-dev",
   *   prod: "speficic-to-prod"
   * }
   */
  export type EnvVarValueByEnvName<
    TEnvsMap extends EnvsMap,
    TVarValue extends EnvVarValue,
  > = { [EnvName in keyof TEnvsMap]: TVarValue };

  /**
   * @example
   *
   * {
   *   MYVAR: {
   *     dev: "a",
   *     prod: "b"
   *   },
   *   MYVAR2: {
   *     dev: "1",
   *     prod: "2"
   *   }
   * }
   */
  export type EnvVarsByVarName<
    TEnvsMap extends EnvsMap,
    TVars extends EnvVars,
  > = {
    [VarName in keyof TVars]: {
      [EnvName in keyof TEnvsMap]?: TVars[VarName];
    };
  };

  /**
   * @example
   *
   * {
   *   dev: "a",
   *   prod: "b"
   * }
   */
  export type EnvVarByEnvName<
    TEnvsMap extends EnvsMap,
    TVarValue extends EnvVarValue,
  > = {
    [EnvName in keyof TEnvsMap]?: TVarValue;
  };

  /**
   * @example
   *
   * {
   *   dev: {
   *   MYVAR: "shared",
   *   MYVAR2: "speficic-to-dev"EnvVarValueByEnvName
   *   },
   *   prod: {
   *     MYVAR: "shared",
   *     MYVAR2: "speficic-to-prod"
   *   }
   * }
   */
  export type EnvVarsByEnvName<
    TEnvsMap extends EnvsMap,
    TVars extends EnvVars,
  > = {
    [EnvName in keyof TEnvsMap]: {
      [VarName in keyof TVars]: TVars[VarName];
    };
  };
}
