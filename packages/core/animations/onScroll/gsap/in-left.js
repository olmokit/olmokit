import { gsap } from "gsap";
import animOnScroll from "../withGsap";

export default function onScrollInLeft(
  from = {},
  to = {},
  duration = 1.25,
  fromX = -100,
  fromOpacity = 0,
  toX = 0,
  toOpacity = 1
) {
  return animOnScroll("in-left", ($element) => {
    gsap.fromTo(
      $element,
      {
        x: fromX,
        autoAlpha: fromOpacity,
        ...from,
      },
      {
        duration,
        x: toX,
        autoAlpha: toOpacity,
        ...to,
      }
    );
  });
}
