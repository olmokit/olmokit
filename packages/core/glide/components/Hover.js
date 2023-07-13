import { off } from "@olmokit/dom/off";
import { on } from "@olmokit/dom/on";

/**
 * Hover custom glide component
 *
 * @param {import("../helpers").glideInstance} Glide
 * @param {import("../helpers").glideComponents} Components
 * @param {import("../helpers").glideEvents} Events
 *
 * @deprecated ?
 */
export default function Hover(Glide, Components, Events) {
  /**
   * @this {HTMLElement}
   */
  function onEnter(slide) {
    Events.emit("hover.enter", { slide: this, idx: Glide.index });
  }

  /**
   * @this {HTMLElement}
   */
  function onLeave(slide) {
    Events.emit("hover.leave", { slide: this, idx: Glide.index });
  }

  const component = {
    /**
     * Initializes autoplaying and events.
     *
     * @return {Void}
     */
    mount() {
      this.bind();
    },

    /**
     * Stops autoplaying while mouse is over glide's area.
     *
     * @return {Void}
     */
    bind() {
      const { slides } = Components.Html;
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        on(slide, "mouseenter", onEnter.bind(slide));
        on(slide, "mouseleave", onLeave.bind(slide));
      }
    },

    /**
     * Unbind mouseover events.
     *
     * @returns {Void}
     */
    unbind() {
      const { slides } = Components.Html;
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        off(slide, "mouseenter", onEnter);
        off(slide, "mouseleave", onLeave);
      }
    },
  };

  Events.on(["destroy", "update"], () => {
    component.unbind();
  });

  return component;
}
