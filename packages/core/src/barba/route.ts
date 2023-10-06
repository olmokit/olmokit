// import { type ITransitionData } from "@barba/core";

/**
 * Barba route HOC
 */
export function barbaRoute(mounted: () => any, destroyed: () => any) {
  /**
   * Creates an instance of barbaRoute
   *
   * @param config.id Route name
   */
  return function (config: { id: string }) {
    if (process.env["NODE_ENV"] !== "production") {
      console.info(`barbaRoute ${config.id} created`);
    }

    // if (created) created();

    /**
     * Mount (private behaviour)
     */
    function __m(/* _data: ITransitionData */) {
      if (process.env["NODE_ENV"] !== "production") {
        console.info(`barbaRoute ${config.id} mounted`);
      }

      if (mounted) mounted();
    }

    /**
     * Destroy (private behaviour)
     */
    function __d(/* _data: ITransitionData */) {
      console.info(`barbaRoute ${config.id} destroyed`);

      if (destroyed) destroyed();
    }

    return {
      __m,
      __d,
    };
  };
}

// const STYLE_REGEX = /<style\ id="__route-style-.+">([.|\s|\S]*)<\/style>/gm;
// const $head = document.head;

// /**
//  * Create next route style
//  */
// function createNextRouteStyle(data: ITransitionData) {
//   // extract next route style from barba response
//   const matches = STYLE_REGEX.exec(data.next.html);
//   const styleCss = matches && matches[1] ? matches[1] : "no_css";

//   // create new style tag
//   const style = document.createElement("style");
//   style.id = `__route-style-${data.next.namespace}`;
//   style.textContent = styleCss;
//   style.type = "text";
//   $head.appendChild(style);

//   return style;
// }
