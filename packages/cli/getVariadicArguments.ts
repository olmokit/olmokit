/**
 * Allows to define variadic arguments boths as `arg1 arg2 arg3` and as
 * `arg1,arg2 arg3` and return an array of arguments without duplicates.
 */
export function getVariadicArguments(args: string[]) {
  const allArgs = args.reduce((all, arg) => {
    const subArgs = arg.split(",");

    if (subArgs.length > 1) {
      all = all.concat(subArgs.map((subArg) => subArg.trim()));
    } else {
      all.push(arg);
    }
    return all;
  }, [] as string[]);

  return Array.from(new Set(allArgs));
}
