import { type WatchOptions, watch as chokidarWatch } from "chokidar";

/**
 * Creates a watcher instance (with `chokidar`)
 *
 * TODO: maybe we can try `parcel-watcher` *
 * @see https://github.com/paulmillr/chokidar#path-filtering
 */
export function createWatcher(
  globPath: string,
  dotfiles = false,
  options: WatchOptions = {}
) {
  const defaults: WatchOptions = {
    ignoreInitial: true,
  };
  if (!dotfiles) {
    defaults.ignored = /(^|[/\\])\../;
  }

  return chokidarWatch(getWatchPath(globPath), { ...defaults, ...options });
}

/**
 * Get watch path safe for Windows OS
 *
 * @see https://github.com/paulmillr/chokidar/issues/777
 * @see https://github.com/paulmillr/chokidar/commit/8ca15efdc9b22cb2fb30af2e8d24a3b07d7ad380
 */
function getWatchPath(fullPath: string) {
  return fullPath.replace(/\\/g, "/");
}
