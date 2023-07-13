import { $ } from "@olmokit/dom/$";
import { on } from "@olmokit/dom/on";
import { onScroll } from "../scroll/onScroll";
import { scrollTo } from "../scroll/scrollTo";

/**
 * Link to inline video
 *
 * Video link, import video player when it comes into the viewport or when the
 * trigger link is clicked, on this latter event wait for scroll end and then
 * play the video.
 */
export default function linkToInlineVideo(
  triggerSelector: string,
  targetSelector: string
) {
  const $trigger = $(triggerSelector);
  if (!$trigger) return;

  const $target = $(targetSelector);
  const getPlayer = () => import("../player");
  const handleVideoReached = () => {
    getPlayer().then(({ Player }) => {
      Player($(".video-js", $target) as HTMLElement).play();
    });
  };

  on($trigger, "click", (event) => {
    event.preventDefault();

    scrollTo($target, {
      onstop: handleVideoReached,
    });
  });

  onScroll($target, {
    onin: getPlayer,
  });
}
