import { getDataAttr } from "@olmokit/dom/getDataAttr";
// import Lazy from "../../lazy";
import { loadAllImages } from "../../lazy/manual";

/**
 * LazyLoad custom component
 *
 * Here is all a bit tricky as we need to map the slides taking into account
 * the cloned ones and load them in tandem, both the real and the cloned ones
 * || 1 | 2 | 3 || 4 | 5 | 6 || [7] | 8 | 9 ||
 *
 * @see https://github.com/glidejs/glide/issues/413 Which Event to choose
 * @see https://github.com/glidejs/glide/issues/435 Accessing slide by index
 * using `Components.Html.slides[index]` does not return clones
 *
 * @param {import("../helpers").glideInstance} Glide
 * @param {import("../helpers").glideComponents} Components
 * @param {import("../helpers").glideEvents} Events
 */
export default function LazyLoad(Glide, Components, Events) {
  let mapSlidesByIdx;

  /**
   * Emit when slide lazy content is ready and only if that is still the current
   * active slider
   *
   * @param {number} slideIdx
   */
  function emit(slideIdx) {
    if (slideIdx === Glide.index) {
      // console.log("Glide.LazyLoad:emit->'lazyLoad.after'", slideIdx);
      Events.emit("lazyLoad.after");
    }
  }

  /**
   * Load slide content lazily
   * Use custom lazy images loader as `Lazyload.loadAll` does not always call
   * the completed callback.
   *
   * @param {HTMLElement} container
   * @param {Function} [callback]
   */
  function load(container, callback) {
    if (!container) {
      if (callback) callback();
    }

    loadAllImages(container, callback);
  }

  /**
   * On mount
   *
   * Eagerly load the next (and the previous too if in `loop` mode)
   */
  function onMount() {
    const visibleIdxs = getVisibleIndexes(
      Glide.index,
      false,
      Glide.settings.loop,
      true,
    );
    loadSlides(visibleIdxs);
  }

  /**
   * On run
   *
   * Handler executed on run, here it is a bit different we probably need to
   * load less slides than on mounted because it is often the case that the
   * slider shows more slides `perView` but moves just by one `perMove`
   */
  function onRun() {
    const visibleIdxs = getVisibleIndexes(Glide.index, true);
    loadSlides(visibleIdxs);
  }

  /**
   * Load given slides
   *
   * loop through the idxs to load without re-loaded the ones already did
   *
   * @param {number[]} indexes
   */
  function loadSlides(indexes) {
    for (var i = 0; i < indexes.length; i++) {
      const slideIdx = indexes[i];
      const slideMap = mapSlidesByIdx[slideIdx];
      if (!slideMap) {
        // FIXME: something is wrong here...?
        return;
      }
      const { sl, did } = mapSlidesByIdx[slideIdx];
      // console.log("Glide.LazyLoad:loadSlides", slideIdx, mapSlidesByIdx);
      if (sl) {
        // FIXME: just always fire the emit, because LazyLoad does not trigger
        // the onloaded callback if the image has already loaded before.
        // emit(true, slideIdx);
        if (did) {
          emit(slideIdx);
        } else {
          // emit once when both the clones and the real slides have completed
          let loadedCount = sl.length;
          for (var j = 0; j < sl.length; j++) {
            const $slide = sl[j];
            // console.log("Glide.LazyLoad:loadSlides", $slide);
            load($slide, () => {
              loadedCount--;
              if (!loadedCount) {
                mapSlidesByIdx[slideIdx].did = true;
                emit(slideIdx);
              }
            });
          }
        }
      }
    }
  }

  /**
   * Get visible slides real indexes
   *
   * @param {number} startFrom
   * @param {boolean} isRunning
   * @param {boolean} [eagerPre]
   * @param {boolean} [eagerPost]
   * @returns
   */
  function getVisibleIndexes(startFrom, isRunning, eagerPre, eagerPost) {
    const { perView, perMove, focusAt } = Glide.settings;
    const currentIdx = startFrom;
    const lastIdx = Components.Html.slides.length - 1;
    const visibleIdxs = [];
    // FIXME: Does the focusAt determine the Glide.index?
    let firstVisibleIdx = focusAt > 0 ? currentIdx - focusAt : currentIdx;
    let lastVisibleIdx = currentIdx + (perView - focusAt - 1);
    if (isRunning) {
      firstVisibleIdx = lastVisibleIdx;
      lastVisibleIdx = lastVisibleIdx + perMove;
    }

    // optionally ask for one more slide on one or both sides
    if (eagerPre) firstVisibleIdx--;
    if (eagerPost) lastVisibleIdx++;

    // get the idxs before the boundary
    if (firstVisibleIdx < 0) {
      var offsetedFirstVisibleIdx = lastIdx + (firstVisibleIdx + 1);
      while (offsetedFirstVisibleIdx <= lastIdx) {
        visibleIdxs.push(offsetedFirstVisibleIdx);
        offsetedFirstVisibleIdx++;
      }
    }

    // get the idxs after the boundary
    if (lastVisibleIdx > lastIdx) {
      var offsetedLastVisibleIdx = lastVisibleIdx - lastIdx - 1;
      while (offsetedLastVisibleIdx >= 0) {
        visibleIdxs.push(offsetedLastVisibleIdx);
        offsetedLastVisibleIdx--;
      }
    }

    // now restrain the first and last within the boundaries
    // and get all idxs within the boundaries
    firstVisibleIdx = Math.max(0, firstVisibleIdx);
    lastVisibleIdx = Math.min(lastVisibleIdx, lastIdx);
    while (firstVisibleIdx <= lastVisibleIdx) {
      visibleIdxs.push(firstVisibleIdx);
      firstVisibleIdx++;
    }

    // console.log("Glide.LazyLoad:getVisibleIndexes", visibleIdxs.join(","));
    return visibleIdxs;
  }

  /**
   * Build slides map by idx, for each idx put both the "real" slides and the
   * "cloned" ones. This happens and is needed only in `loop` mode.
   */
  function buildSlidesMap() {
    mapSlidesByIdx = {};

    const slides = Components.Html.slides;
    const clones = Components.Clones.items;

    for (let i = 0; i < slides.length; i++) {
      mapSlidesByIdx[i] = {
        sl: [slides[i]],
      };
    }

    for (let j = 0; j < clones.length; j++) {
      const clone = clones[j];
      const cloneRealIdx = parseInt(getDataAttr(clone, "glide-idx"), 10);
      mapSlidesByIdx[cloneRealIdx].sl.push(clone);
    }
  }

  // "clones.after" hook is triggered also on "update" event
  Events.on("clones.after", buildSlidesMap);

  // when looping we need the new calculated index
  if (Glide.settings.loop) {
    Events.on("run", onRun);
    // otherwise we can use the one before
  } else {
    Events.on("run.before", onRun);
  }
  // TODO: ? Events.on("swipe", ?);

  return {
    mount() {
      // otherwise it is called in the "clones.after" hook
      if (!Glide.settings.loop) {
        buildSlidesMap();
      }
      onMount();
    },
    load,
  };
}
