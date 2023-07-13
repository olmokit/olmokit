import { gsap } from "gsap";
import animOnScroll from "../withGsap";

export default function onScrollInBottom(
  from = {},
  to = {},
  duration = 1.25,
  fromY = -100,
  fromOpacity = 0,
  toY = 0,
  toOpacity = 1
) {
  return animOnScroll("in-top", ($element) => {
    gsap.fromTo(
      $element,
      {
        y: fromY,
        autoAlpha: fromOpacity,
        ...from,
      },
      {
        duration,
        y: toY,
        autoAlpha: toOpacity,
        ...to,
      }
    );
  });
}
