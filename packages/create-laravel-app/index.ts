#!/usr/bin/env node
"use strict";

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split(".");
const major = parseInt(semver[0], 10);

if (major < 18) {
  console.error(
    "You are running Node " +
      currentNodeVersion +
      ".\n" +
      "Create Laravel App requires Node 18 or higher. \n" +
      "Please update your version of Node."
  );
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { init } = require("./createLaravelApp");

init();
