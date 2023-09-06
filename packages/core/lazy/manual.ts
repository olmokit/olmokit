import { isString } from "@olmokit/utils/isString";
import { $ } from "@olmokit/dom/$";
import { $all } from "@olmokit/dom/$all";
import { addClass } from "@olmokit/dom/addClass";
import { forEach } from "@olmokit/dom/forEach";
import { getDataAttr } from "@olmokit/dom/getDataAttr";
import {
  getWasProcessedData,
  lazyClass,
  lazyClassSuccess,
  setSourcesImg, // lazyClassLoading,
  setWasProcessedData,
} from "./index";

type LazyPreloadImagesMap = Record<
  string,
  {
    el: HTMLImageElement;
    src: string;
    width?: number;
    height?: number;
  }
>;

type LazyManualOptions = {
  /** Image selector, defaults to `lazyClass` */
  sel?: string;
  /** Image src data attribute name, defaults to `src` (in the html `data-src="..."`) */
  attr?: string;
};

/**
 * Preload images from the given rooter
 *
 * @param rooter Either a selector or a DOM element
 * @param done Callback to execute once all images are loaded
 */
export function preloadImages(
  rooter: string | HTMLElement,
  done: (imagesMap: LazyPreloadImagesMap) => void,
  { sel, attr = "src" }: LazyManualOptions = {}
) {
  const map: LazyPreloadImagesMap = {};
  const $images = $all(
    sel || `.${lazyClass}`,
    isString(rooter) ? $<HTMLElement>(rooter) : rooter
  );
  const howMany = $images.length;
  let asyncLoadedCount = 0;
  let toLoad = howMany;

  forEach($images, (el) => {
    if (el instanceof HTMLImageElement) {
      el.className += ` ${lazyClass}`;

      if (getWasProcessedData(el)) {
        const { src, width, height } = el as HTMLImageElement;
        map[src] = { el, src, width, height };
        toLoad--;
      } else {
        asyncLoadedCount++;
        const dummy = new Image();
        const src = getDataAttr(el, attr) || "";
        dummy.src = src;

        map[src] = { el, src };

        // @ts-expect-error FIXME: core types
        dummy.onload = function (this: HTMLImageElement) {
          map[src].width = this.width;
          map[src].height = this.height;
          toLoad--;
          if (toLoad === 0) {
            if (done) done(map);
          }
        };
      }
    }
  });

  if (asyncLoadedCount === 0 && !toLoad) {
    if (done) done(map);
  }
}

/**
 * Load all images
 */
export function loadAllImages(
  rooter: string | HTMLElement,
  done: () => void,
  options?: LazyManualOptions
) {
  preloadImages(
    rooter,
    (map) => {
      for (const src in map) {
        const { el } = map[src];
        // setDataAttr(el, "src", src);
        setSourcesImg(el);
        setWasProcessedData(el);

        // removeClass(el, lazyClassLoading);
        addClass(el, lazyClassSuccess);
      }
      if (done) done();
    },
    options
  );
}
