import videojs from "video.js";

// FIXME: core types for videojs
// import type { VideoJsPlayerOptions, VideoJsPlayer } from "video.js";
type VideoJsPlayerOptions = any;
type VideoJsPlayer = any;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Player {
  /** VideoJS options */
  export type VendorOptions = VideoJsPlayerOptions;

  /** There are no custom options for now  */
  export type CustomOptions = {};

  /** Merge of custom and vendor options */
  export type Options = CustomOptions & VendorOptions;

  /** Player initialiser function */
  export type Initialiser = (
    rooter?: string | HTMLElement | VideoJsPlayer,
    options?: Options,
    ready?: () => void
  ) => VideoJsPlayer;

  export type Instance = {
    $el: Element;
    video: ReturnType<typeof videojs>;
  };
}
