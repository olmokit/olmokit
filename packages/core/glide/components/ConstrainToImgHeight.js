import { $ } from "@olmokit/dom/$";
import { getDataAttr } from "@olmokit/dom/getDataAttr";

// import Lazy from "../../lazy";

/**
 * ConstrainToImgHeight custom component
 *
 * TODO: fix it, in some cases it does not seem to calculate the right height,
 * it might has to do with flex containers
 *
 * @see https://github.com/glidejs/glide/issues/236#issuecomment-400971569
 *
 * @param {import("../helpers").glideInstance} Glide
 * @param {import("../helpers").glideComponents} Components
 * @param {import("../helpers").glideEvents} Events
 */
export default function ConstrainToImgHeight(Glide, Components, Events) {
  /**
   * Calculate height based on slide container width and natural image sizes
   * using this proportion:
   *
   * `slideWidth : img.naturaWidth = x : img.naturalHeight`
   *
   * @param {HTMLElement} slide
   * @param {HTMLImageElement} img
   */
  function calculateHeight(slide, img) {
    const slideWidth = slide.offsetWidth;
    const imgCurrentHeight =
      (slideWidth * img.naturalHeight) / img.naturalWidth;
    const { track, wrapper } = Components.Html;
    track.style.height = `${imgCurrentHeight}px`;
    wrapper.style.height = `${imgCurrentHeight}px`;
  }

  const component = {
    mount() {
      component.set();
    },
    set() {
      const $slide = Components.Html.slides[Glide.index];
      const img = $("img", $slide);
      const lazySrc = getDataAttr(img, "src");

      if (lazySrc) {
        const img = new Image();
        img.src = lazySrc;
        img.onload = () => calculateHeight($slide, img);
      } else {
        calculateHeight($slide, img);
      }
    },
  };

  Events.on("resize", component.set);

  return component;
}
