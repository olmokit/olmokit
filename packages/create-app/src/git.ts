import { type ExecSyncOptions, execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";

function isInGitRepository() {
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

function isInMercurialRepository() {
  try {
    execSync("hg --cwd . root", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

export function inGitRepo() {
  return isInGitRepository() || isInMercurialRepository();
}

export function tryGitInit(cwd?: string) {
  const options: ExecSyncOptions = { stdio: "ignore" };
  if (cwd) options.cwd = cwd;

  try {
    execSync("git --version", options);
    if (inGitRepo()) {
      return false;
    }

    execSync("git init", options);
    return true;
  } catch (e) {
    console.warn("Git repo not initialized", e);
    return false;
  }
}

export function tryGitCommit(appPath: string, msg: string) {
  try {
    execSync("git add -A", { stdio: "ignore" });
    execSync(`git commit -m "${msg}"`, {
      stdio: "ignore",
    });
    return true;
  } catch (e) {
    // We couldn't commit in already initialized git repo,
    // maybe the commit author config is not set.
    // In the future, we might supply our own committer
    // like Ember CLI does, but for now, let's just
    // remove the Git files to avoid a half-done state.
    console.warn("Git commit not created", e);
    console.warn("Removing .git directory...");
    try {
      // unlinkSync() doesn't work on directories.
      rmSync(join(appPath, ".git"));
    } catch (removeErr) {
      // Ignore.
    }
    return false;
  }
}
