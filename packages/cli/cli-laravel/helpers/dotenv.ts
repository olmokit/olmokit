import type { PredefinedEnvVars } from "../../config-env";

/**
 * This resembles Laravel's global `config('env.MY_VAR')` helper using the same
 * function signature and (similar) return value. This is meant to be used in
 * node enviroment to help preventing bugs where the same env variable is treated
 * differently among php and js and also to ease the check on boolean
 * environment variables which are not natively supported by `dotenv` package.
 * See in this regard [this issue](https://github.com/motdotla/dotenv/issues/51)
 * and [this package](https://github.com/ladjs/dotenv-parse-variables).
 *
 * Despite what I see in this [laravel source code](https://github.com/laravel/framework/blob/master/src/Illuminate/Support/Env.php#L93-L124)
 * the env variables returned by the `config('env.XYZ')` global php function
 * are always string except for `false` values becoming `null` and `true` values
 * coerced to actual `bool` `true`. See this [related issue](https://github.com/vlucas/phpdotenv/issues/104).
 * In node we return `false` instead of `null`, it will behave the same.
 */
export function laravelConfig<T extends keyof PredefinedEnvVars>(
  key: `env.${T}`,
): PredefinedEnvVars[T] {
  const raw = process.env[key.replace("env.", "") as T];

  if (typeof raw !== "undefined") {
    if (
      raw.toString().toLowerCase() === "true" ||
      raw.toString().toLowerCase() === "false"
    ) {
      // @ts-expect-error nevermind
      return raw.toString().toLowerCase() === "true";
      // NOTE: laravel seems to return `null` instead of `false`
      // return raw.toString().toLowerCase() === 'true' || null;
    }

    // we could easily parse numbers as number with:
    // if (raw !== "" && !Number.isNaN(Number(raw))) {
    //   // @ts-expect-error nevermind
    //   return Number(raw);
    // }
  }

  return raw;
}
