import { addClass } from "@olmokit/dom/addClass";

/**
 * Slave of custom component
 *
 * Make slider a slave of another slider
 *
 * @param {import("../helpers").glideInstance} Glide
 * @param {import("../helpers").glideComponents} Components
 */
export default function SlaveOf(Glide, Components) {
  const master = Glide.settings.slaveOf;

  const component = {
    mount() {
      const { root, track } = Components.Html;
      addClass(root, "glide--slave");
      track.style.cursor = "inherit";
      if (Components.Swipe) Components.Swipe.disable();
    },
  };

  master.on("run", () => {
    Glide.go(`=${master.index}`);
  });

  master.on("pause", () => Glide.pause());

  return component;
}
