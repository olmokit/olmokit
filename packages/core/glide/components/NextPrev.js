import { addClass } from "@olmokit/dom/addClass";
import { siblings } from "@olmokit/dom/siblings";

/**
 * Custom active classes, it adds a `is-prev` and `is-next` classes to the
 * siblings of the currently active slide
 *
 * @see https://github.com/glidejs/glide/issues/401#issuecomment-527567816
 *
 * @param {import("../helpers").glideInstance} Glide
 * @param {import("../helpers").glideComponents} Components
 * @param {import("../helpers").glideEvents} Events
 */
export default function NextPrev(Glide, Components, Events) {
  const component = {
    mount() {
      this.set();
    },

    set() {
      const $slide = Components.Html.slides[Glide.index];
      $slide.classList.remove("is-next", "is-prev");

      siblings($slide).forEach((sibling) => {
        sibling.classList.remove("is-next", "is-prev");
      });

      if ($slide.nextElementSibling) {
        addClass($slide.nextElementSibling, "is-next");
      }

      if ($slide.previousElementSibling) {
        addClass($slide.previousElementSibling, "is-prev");
      }
    },
  };

  Events.on("run", () => {
    component.set();
  });

  return component;
}
