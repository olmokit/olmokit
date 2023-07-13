import styles from "./index.scss";

// FIXME: allow for custom breakpoints, maybe parse `variables.scss`?
export type ScssBreakpoints = {
  xl: number;
  lg: number;
  md: number;
  sm: number;
  xs: number;
  boxed: number;
};

export type ScssContainers = {
  xl: number;
  lg: number;
  md: number;
  sm: number;
  xs: number;
};

let scssGridGutter = 0;
const scssBreakpoints: ScssBreakpoints = {} as ScssBreakpoints;
const scssContainers: ScssContainers = {} as ScssContainers;
const scssVariables: Record<string, number> = {};

for (const fullKey in styles) {
  const splittedBreakpoints = fullKey.split(
    "breakpoint"
  ) as (keyof ScssBreakpoints)[];
  const splittedContainers = fullKey.split(
    "container"
  ) as (keyof ScssContainers)[];

  if (fullKey === "gridGutter") {
    scssGridGutter = parseFloat(styles[fullKey]);
  } else if (splittedBreakpoints.length === 2) {
    scssBreakpoints[splittedBreakpoints[1]] = parseFloat(styles[fullKey]);
  } else if (splittedContainers.length === 2) {
    scssContainers[splittedContainers[1]] = parseFloat(styles[fullKey]);
  } else {
    scssVariables[fullKey] = parseFloat(styles[fullKey]);
  }
}

export const theme = scssVariables;

export const gridGutter = scssGridGutter;

export const breakpoints = scssBreakpoints;

export const containers = scssContainers;
