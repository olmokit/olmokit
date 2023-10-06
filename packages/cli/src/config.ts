import type { CliBootArg } from "./cli.js";
import { getConfigEnv } from "./config-env.js";
import type { Config } from "./types";

/**
 * Process the project's custom config and the project's meta information to
 * get the final {@link Config} object
 */
export async function getConfig(
  custom: Config.CustomMaybeExtended = {
    type: "laravel",
    env: {
      branches: {
        dev: "dev",
        staging: "staging",
        production: "production",
      },
      vars: {},
    },
  },
  { spinner }: CliBootArg,
): Promise<Config.Internal> {
  const { type = "laravel", favicons, httpAuth } = custom;
  const env = getConfigEnv(custom);

  const internal: Config.Internal = {
    type,
    favicons,
    httpAuth,
    env,
    useBarba: !!custom.useBarba,
  };

  spinner.text = "Validate configuration";

  const errors = validateConfig(custom, internal);

  if (errors.length) {
    for (let i = 0; i < errors.length; i++) {
      const error = errors[i];
      spinner.fail(error.msg);
    }

    process.exit(1);
  } else {
    spinner.text = "Valid configuration";
  }

  return internal;
}

type ConfigError = {
  msg: string;
};

/**
 * TODO: Here we could validate all AWS related variables and log mis-configurations
 */
function validateConfig(
  _custom: Config.CustomMaybeExtended,
  internal: Config.Internal,
  /* , cliBootArg: CliBootArg */
) {
  const errors: ConfigError[] = [];
  const { CDN, AWS_URL } = internal.env.vars;

  if (CDN === "s3" && !AWS_URL) {
    errors.push({
      msg: `Missing "AWS_URL" value`,
    });
  }

  return errors;
}
