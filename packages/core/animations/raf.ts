/**
 * Provides requestAnimationFrame in a cross browser way.
 *
 * @author paulirish / http://paulirish.com/
 */
export const raf =
  window.requestAnimationFrame ||
  (function () {
    return (
      // @ts-expect-error FIXME: legacy browsers support, remove it
      window.webkitRequestAnimationFrame ||
      // @ts-expect-error FIXME: legacy browsers support, remove it
      window.mozRequestAnimationFrame ||
      // @ts-expect-error FIXME: legacy browsers support, remove it
      window.oRequestAnimationFrame ||
      // @ts-expect-error FIXME: legacy browsers support, remove it
      window.msRequestAnimationFrame ||
      function (callback: FrameRequestCallback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

export default raf;
