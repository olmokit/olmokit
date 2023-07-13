import yargs from "yargs-parser";

/**
 * Allow to pass a single argument without double dash and use its name
 * to compose a normal cli option syntax. Basically it allows to run
 * `npx mybin task --option myoption`
 * simply with:
 * `npx mybin task myoption`
 */
export function parseCliOptions() {
  const args = process.argv.slice(3);
  if (args[0] && args[0].indexOf("--") !== 0) {
    args.splice(0, 0, "--option");
  }

  return args;
}

/**
 * Get cli option by name, it defaults to the standard single option that can
 * be used without the two dashes, thanks to the function here above)
 */
export function getCliOption(optionName = "option") {
  let output = "";
  process.argv.forEach((name, idx) => {
    if (name === `--${optionName}`) {
      output = process.argv[idx + 1];
    }
  });
  return output;
}

/**
 * Get cli options map, filter out the defualt node args needed to run gulp
 * tasks
 */
export function getCliOptionsMap() {
  const optionsArgs = parseCliOptions();
  const argv = yargs(optionsArgs);
  // @ts-expect-error FIXME: cli types
  delete argv["_"];
  return argv;
}
