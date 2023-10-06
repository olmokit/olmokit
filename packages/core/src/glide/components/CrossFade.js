import { addClass } from "@olmokit/dom/addClass";
import { setVendorCSS } from "@olmokit/dom/setVendorCSS";
import "./CrossFade.scss";

/**
 * CrossFade custom component
 *
 * Custom cross fade animation, it parses the `animationDuration` as CSS value
 * in milliseconds and forces `slider` type behaviour, because we don't want
 * slide clones created by the carousel` default type. It also forces
 * `animationDuration` and `rewindDuration` to 0 to remove the sliding behaviour
 *
 * @param {import("../helpers").glideInstance} Glide
 * @param {import("../helpers").glideComponents} Components
 */
export default function CrossFade(Glide, Components) {
  const component = {
    mount() {
      const time = `${Glide.settings.animationDuration}ms`;
      const { slides, root } = Components.Html;

      Glide.update({ cloneRatio: 0, animationDuration: 0, rewindDuration: 0 });

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        setVendorCSS(slide, "transitionDuration", time);
      }

      addClass(root, "glide--crossfade");
    },
  };

  return component;
}
