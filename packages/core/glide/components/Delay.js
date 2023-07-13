import { addClass } from "@olmokit/dom/addClass";
import { removeClass } from "@olmokit/dom/removeClass";

/**
 * Delay enter/exit custom component
 *
 * calling pause here does not seem to work,
 * @see https://github.com/glidejs/glide/issues/410 Pause ignored after hover
 * So I use glide.disable/enable instead of glide.pause/play,
 * @see https://github.com/glidejs/glide/issues/359#issuecomment-520834864
 */
export default function Delay(Glide, Components, Events) {
  const { enter, exit } = Glide.settings.delay;

  const component = {
    mount() {
      addClass(Components.Html.root, "glide--delay");
    },
  };

  if (exit) {
    Events.on("run.before", () => {
      const slide = Components.Html.slides[Glide.index];
      addClass(slide, "is-exiting");
      // console.log("run.before pause at idx", Glide.index);
      // Components.Transition.disable();
      Glide.disable(); // Glide.pause();
      setTimeout(() => {
        removeClass(slide, "is-exiting");
        // console.log("run.before play from idx", Glide.index);
        // Components.Transition.enable();
        Glide.enable(); // Glide.play();
      }, exit);
    });
  }

  if (enter) {
    Events.on("run.after", () => {
      const slide = Components.Html.slides[Glide.index];
      addClass(slide, "is-entering");
      // console.log("run.after pause at idx", Glide.index);
      Glide.disable(); // Glide.pause();
      setTimeout(() => {
        removeClass(slide, "is-entering");
        // console.log("run.after play from idx", Glide.index);
        Glide.enable(); // Glide.play();
      }, enter);
    });
  }

  return component;
}
