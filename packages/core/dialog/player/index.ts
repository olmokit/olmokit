// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { $ } from "@olmokit/dom/$";
import { DialogAsync } from "../async";
import "./index.scss";

export type DialogPlayerOptions = {
  /**
   * Video's `src` HTML attribute
   */
  src: string;
  /**
   * Video's poster image `src`, it sets the `poster` HTML attribute
   */
  poster?: string;
  /**
   * Video width
   */
  w?: number;
  /**
   * Video height
   */
  h?: number;
  /**
   * Custom class to add to the root of the Dialog alongside `dialogPlayer`
   */
  rootClass?: string;
  /**
   * Template
   *
   * A template string to render your player within the Dialog
   */
  tpl?: string;
  /**
   * Makes the video downloadable
   *
   * @default false
   */
  downloadable?: boolean;
  /**
   * Shows the video controls with the HTML attribute `controls`
   *
   * @default true
   */
  controls?: boolean;
  /**
   * Set the HTML attribute `autoplay`
   *
   * @default true
   */
  autoplay?: boolean;
};

/**
 * Open player dialog
 *
 * It loads the Player from `"core-player"` with an async import and autoplay the
 * video by default.
 */
export function openDialogPlayer({
  src,
  poster,
  w,
  h,
  rootClass = "",
  tpl,
  downloadable,
  controls = true,
  autoplay = true,
}: DialogPlayerOptions) {
  let attrs = ` class="player video-js vjs-16-9"`;
  if (poster) attrs += ` poster="${poster}"`;
  if (controls) attrs += " controls";
  if (autoplay) attrs += " autoplay";
  if (w) attrs += ` width="${w}"`;
  if (h) attrs += ` height="${h}"`;
  if (!downloadable)
    attrs += ' oncontextmenu="return false;" controlsList="nodownload"';

  tpl =
    tpl ||
    `<video${attrs} playsinline><source src="${src}" type="video/mp4"></video>`;

  let hasPaused = false;

  import("../player").then(({ Player }) => {
    let playerInstance;

    DialogAsync(
      {
        id: src,
        tpl,
        rootClass: "dialogPlayer " + rootClass,
      },
      {
        rendered: (dialog) => {
          dialog.load();
          playerInstance = Player($<HTMLElement>(".player", dialog.$root));
          playerInstance.on("loadeddata", dialog.loaded);
        },
        opened: () => {
          if (hasPaused || autoplay) playerInstance.play();
        },
        closing: () => {
          playerInstance.pause();
          hasPaused = true;
        },
      }
    ).open();
  });
}
