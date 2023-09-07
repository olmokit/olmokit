// FIXME: core types for videojs
// import videojs from "video.js/dist/alt/video.core.novtt";
// import { VideoJsPlayerOptions, VideoJsPlayer } from "video.js/dist/types/player";
import videojs from "video.js";
import { isString } from "@olmokit/utils/isString";
import { $ } from "@olmokit/dom/$";
import { $each } from "@olmokit/dom/$each";
// import { $all } from "@olmokit/dom/$all";
import "../media";
import "./index.scss";

// import { VideoJsPlayerOptions, VideoJsPlayer } from "video.js";
// export * from "video.js";

/**
 * `controls` and `preload` options are read from the attribute on the DOM
 * element managed by the blade component
 *
 * @default {
 *   liveui: false;
 * }
 */
// type PlayerOptions = VideoJsPlayerOptions & {};
type PlayerOptions = object;

const defaultOptions = {
  liveui: false,
};

type PlayerInstance = {
  $el: Element;
  video: ReturnType<typeof videojs>;
};

/**
 * Player, just a wrapper around `videojs`
 *
 * It is always better to import this module with async imports as such:
 *
 * @usage
 *
 * ```js
 * let playerInstance;
 * import("@olmokit/core/player").then(({ Player }) => {
 *   const player = Player();
 * });
 * ```
 * or with async/await:
 *
 * ```js
 * const { Player } = await import("@olmokit/core/player");
 * const player = Player();
 * ```
 *
 * @resources
 * - [videojs API](https://docs.videojs.com/)
 * - [bundle size](https://github.com/videojs/video.js/issues/6166)
 *
 * @param rooter Default `undefined`, in this mode `videojs` is run automatically
 * on all HTMLElements with `".video-js"` class, which simply target all the
 * related `<x-player>` blade component's HTMLElements. In this mode an array
 * of instances including each respective root element is returned, otherwise
 * we return just one videojs instance.
 */
export function Player(
  rooter: string | Element | HTMLElement,
  options?: PlayerOptions,
  ready?: () => any
): PlayerInstance["video"];
export function Player(
  rooter?: undefined,
  options?: PlayerOptions,
  ready?: () => any
): PlayerInstance[];
export function Player(
  rooter?: string | Element | HTMLElement,
  options?: PlayerOptions,
  ready?: () => any
) {
  if (typeof rooter === "undefined") {
    const instances: PlayerInstance[] = [];

    $each(".video-js", ($el) => {
      instances.push({
        $el,
        video: videojs($el, { ...defaultOptions, ...(options || {}) }, ready),
      });
    });

    return instances;
  }

  const $el = isString(rooter) ? $(rooter) : rooter;

  return videojs($el, { ...defaultOptions, ...(options || {}) }, ready);
}

export default Player;
