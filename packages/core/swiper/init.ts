// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Swiper } from "swiper";
import { A11y, Lazy } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";
import { $ } from "@olmokit/dom/$";
import { listenResize } from "@olmokit/dom/listenResize";
import { lazyClass, lazyClassSuccess } from "../lazy";
import "./index.scss";

type SwiperOptionsExtended = SwiperOptions & {
  killWhen?: {
    above?: number;
    below?: number;
    cleanStyles?: boolean;
  };
};

export function swiperInit(
  selector: string,
  options: SwiperOptionsExtended = {},
  customComponents = [],
) {
  const defaultOptions = {
    lazy: {
      loadOnTransitionStart: true,
      elementClass: lazyClass,
      loadedClass: lazyClassSuccess,
      // loadingClass:
      // preloaderClass:
    },
  };
  const element = typeof selector === "string" ? $(selector) : selector;
  let instance: Swiper;

  Swiper.use([A11y, Lazy, ...customComponents]);

  const createInstance = () => {
    return new Swiper(element, {
      ...defaultOptions,
      ...options,
    });
  };

  if (options.killWhen) {
    const { above, below, cleanStyles = false } = options.killWhen;
    let hasInit = false;

    const liveOrDie = () => {
      if (
        (above && window.innerWidth >= above) ||
        (below && window.innerWidth < below)
      ) {
        if (instance) {
          hasInit = false;
          instance.destroy(true, cleanStyles);
        }
      } else {
        if (!hasInit) {
          instance = createInstance();
          hasInit = true;
        }
      }
    };

    liveOrDie();

    listenResize(liveOrDie);
  } else {
    instance = createInstance();
  }

  return instance;
}

export default swiperInit;
