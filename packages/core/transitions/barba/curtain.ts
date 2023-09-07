import { type ITransitionData } from "@barba/core";
import { gsap } from "gsap";
import { $ } from "@olmokit/dom/$";

/**
 * Transition curtain effect for barba.js containers
 */
export function transitionsBarbaCurtain(selector = ".transition") {
  const $element = $(selector);

  return {
    leave(data: ITransitionData) {
      // const bg = getComputedStyle(document.body, null).getPropertyValue("background-color");
      return gsap
        .timeline()
        .set($element, {
          display: "block",
          xPercent: -100,
          yPercent: 0,
          // background: bg
        })
        .to($element, {
          xPercent: 100,
          duration: 0.6,
        })
        .to(
          data.current.container,
          {
            opacity: 0,
            duration: 0.6,
          },
          "<"
        );
    },
    after(data: ITransitionData) {
      return gsap
        .timeline()
        .to($element, {
          xPercent: 200,
          duration: 0.6,
        })
        .to(
          data.next.container,
          {
            opacity: 1,
            duration: 0.6,
          },
          "<"
        )
        .set($element, {
          display: "none",
        });
    },
  };
}
