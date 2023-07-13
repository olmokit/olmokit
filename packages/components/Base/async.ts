import listenLoaded from "@olmokit/dom/listenLoaded";
import loadResource from "@olmokit/core/ajax/loadResource";

/**
 * Base async component class to extend, it loads its external dependencies
 * lazyly, for stuff like galleries not needed immediately.
 *
 * It uses `loadResource` tiny and efficient plugin
 * @see https://github.com/filamentgroup/loadCSS
 */
export class BaseComponentAsync {
  dependencies: string[] = [];

  constructor(name: string) {
    name = name || this.constructor.name;

    this.created();

    listenLoaded(() => {
      if (loadResource.isDefined(name)) {
        loadResource.ready(name, this.ready.bind(this));
      } else {
        if (this.shouldLoad()) {
          loadResource(this.dependencies, name, {
            success: this.ready.bind(this),
            error: this.failed.bind(this),
            numRetries: 3,
          });
        } else {
          this.refused();
        }
      }
    });
  }

  /**
   * Should load? Method to override in subclasses
   *
   * Starts the dependencies loading based on the returning value of this
   * method, false by default.
   */
  shouldLoad() {
    return false;
  }

  /**
   * Executed immediately regardless of the dependencies loading
   */
  created() {
    return;
  }

  /**
   * All dependencies have been loaded.
   */
  ready() {
    return;
  }

  /**
   * Dependencies loading has failed.
   */
  failed() {
    return;
  }

  /**
   * Called after `shouldLoad` check, useful to revert stuff done on `created`
   */
  refused() {
    return;
  }
}

export default BaseComponentAsync;
