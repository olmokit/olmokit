import type { ITransitionData } from "@barba/core";

const STYLE_REGEX = /<style id="__route-style-.+">([.|\s|\S]*)<\/style>/gm;

export class BarbaRoute {
  id: string;

  /**
   * Creates an instance of BarbaRoute
   *
   * @param {object} config
   * @param {string} config.id Route name
   */
  constructor(config: { id: string }) {
    this.id = config.id;

    console.info(`BarbaRoute ${this.id} created`);
    this.created();
  }

  /**
   * Created hook (vue like hook)
   *
   * @abstract
   * @memberof BarbaRoute
   */
  created() {
    return;
  }

  /**
   * Mount (private behaviour)
   */
  __m(data: ITransitionData) {
    console.info(`BarbaRoute ${this.id} mounted`);

    // grab the current route specific style
    const currentStyle = document.getElementById(
      `__route-style-${data.current.namespace}`,
    );
    // try to grab the next route specific style
    const nextStyle = document.getElementById(
      `__route-style-${data.next.namespace}`,
    );

    // enable it if it is already there
    if (nextStyle) {
      nextStyle.removeAttribute("type");
      // otherwise create if from scratch
    } else {
      // extract next route style from barba response
      const matches = STYLE_REGEX.exec(data.next.html);
      const styleCss = matches && matches[1] ? matches[1] : "";

      // create new style tag
      const style = document.createElement("style");
      style.id = `__route-style-${data.next.namespace}`;
      style.textContent = styleCss;
      currentStyle?.insertAdjacentElement("afterend", style);
    }

    this.mounted();
  }

  /**
   * Mounted hook (vue like hook)
   *
   * @abstract
   * @memberof BarbaRoute
   */
  mounted() {
    return;
  }

  /**
   * Destroy (private behaviour)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __d(_data: ITransitionData) {
    console.info(`BarbaRoute ${this.id} destroyed`);

    // grab the current route specific style
    const currentStyle = document.getElementById(`__route-style-${this.id}`);

    // disable it
    if (currentStyle) {
      currentStyle.setAttribute("type", "text");
    }

    this.destroyed();
  }

  /**
   * Destroyed hook (vue like hook)
   *
   * @abstract
   * @memberof BarbaRoute
   */
  destroyed() {
    return;
  }
}
