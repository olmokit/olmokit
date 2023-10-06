import { $ } from "@olmokit/dom/$";
import { DialogAsync } from "../async";
import "./index.scss";

type DialogVideoOptions = {
  src: string;
  poster?: string;
  w?: number;
  h?: number;
  rootClass?: string;
  tpl?: string;
  downloadable?: boolean;
  /** @default true */
  controls?: boolean;
  /** @default true */
  autoplay?: boolean;
};

/**
 * Open video dialog (standard HTML5 video player)
 */
export function openDialogVideo({
  src,
  poster,
  w,
  h,
  rootClass = "",
  tpl,
  downloadable,
  controls = true,
  autoplay = true,
}: DialogVideoOptions) {
  let attrs = ` class="video"`;
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

  let video: HTMLVideoElement;

  DialogAsync(
    {
      id: src,
      tpl,
      rootClass: "dialogVideo " + rootClass,
    },
    {
      rendered: (instance) => {
        instance.load();
        video = $(".video", instance.$root);
      },
      opened: () => {
        if (hasPaused && autoplay) video.play();
      },
      closing: () => {
        video.pause();
        hasPaused = true;
      },
    },
  )?.open();
}

export default openDialogVideo;
