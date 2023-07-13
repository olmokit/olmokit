import { addClass } from "@olmokit/dom/addClass";
import "./Fade.scss";

/**
 * Fade custom component
 *
 * Custom fade animation achieved by adding a custom class on the root element
 * the style is applied by CSS
 */
export default function Fade(Glide, Components) {
  return {
    mount() {
      addClass(Components.Html.root, "glide--fade");
    },
  };
}
