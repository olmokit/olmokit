import { isNumber } from "@olmokit/utils/isNumber";

/**
 * AutoHeight custom component
 *
 * NB: When `LazyLoad` component is used AutoHeight must be declared after it
 * as such: `glide.mount({ LazyLoad, AutoHeight })`
 *
 * TODO: we might also need to take into account the LazyLoad auto initialized
 * on page load...
 *
 * @see https://github.com/glidejs/glide/issues/236#issuecomment-400971569
 *
 * @param {import("../helpers").glideInstance} Glide
 * @param {import("../helpers").glideComponents} Components
 * @param {import("../helpers").glideEvents} Events
 */
export default function AutoHeight(Glide, Components, Events) {
  let transitionTime = 200;

  function resetHeight() {
    Components.Html.track.style.height = "auto";
  }

  /**
   * Set height of current slide
   * Actually set/unset height on glide track DOM element and emit event
   */
  function setHeightOfCurrentSlide() {
    if (Glide.settings.autoHeight === false) {
      resetHeight();
    } else {
      const $slide = Components.Html.slides[Glide.index];
      const height = $slide.offsetHeight;

      if (!height) {
        Components.Html.track.style.cssText = "";
      } else {
        Components.Html.track.style.height = `${height}px`;
        setTimeout(() => {
          Events.emit("autoHeight.after");
        }, transitionTime);
      }
      // console.log("Glide.AutoHeight, setting", $slide);
    }
  }

  // console.log("Glide.AutoHeight, LazyLoad is", !!Components.LazyLoad);

  const component = {
    mount() {
      const { Html, LazyLoad } = Components;
      const { animationDuration, autoHeight } = Glide.settings;

      if (autoHeight === false) {
        resetHeight();
      } else {
        transitionTime = isNumber(autoHeight) ? autoHeight : animationDuration;

        Html.track.style.transition = `height ${transitionTime}ms ease-in-out`;

        // if slider has LazyLoad we use its event
        if (!LazyLoad) {
          setHeightOfCurrentSlide();
        }
      }
    },
  };

  Events.on("run", setHeightOfCurrentSlide);
  Events.on("run.after", setHeightOfCurrentSlide);
  Events.on("resize", setHeightOfCurrentSlide);
  Events.on("destroy", () => resetHeight());
  if (Components.LazyLoad) {
    Events.on("lazyLoad.after", setHeightOfCurrentSlide);
  }

  Events.on("update", () => component.mount);

  return component;
}
