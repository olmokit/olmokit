/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/*!
 * Glide.js v3.4.0
 * (c) 2013-2020 Jędrzej Chałubek <jedrzej.chalubek@gmail.com> (http://jedrzejchalubek.com/)
 * Released under the MIT License.
 */

const defaults = {
  /**
   * Start at specific slide number defined with zero-based index.
   *
   * @type {Number}
   */
  startAt: 0,

  /**
   * A number of slides visible on the single viewport.
   *
   * @type {Number}
   */
  perView: 1,

  /**
   * A number of slides visible on the single viewport.
   *
   * @type {Number}
   */
  perMove: 1,

  /**
   * Focus currently active slide at a specified position in the track.
   *
   * Available inputs:
   * `center` - Current slide will be always focused at the center of a track.
   * `0,1,2,3...` - Current slide will be focused on the specified zero-based index.
   *
   * @type {String|Number}
   */
  focusAt: 0,

  /**
   * A size of the gap added between slides.
   *
   * @type {Number}
   */
  gap: 0,

  /**
   * Change slides after a specified interval. Use `false` for turning off autoplay.
   *
   * @type {Number|Boolean}
   */
  autoplay: false,

  /**
   * Stop autoplay on mouseover event.
   *
   * @type {Boolean}
   */
  hoverpause: true,

  /**
   * Allow for changing slides with left and right keyboard arrows.
   *
   * @type {Boolean}
   */
  keyboard: true,

  /**
   * Type of the movement.
   *
   * @type {Boolean}
   */
  loop: true,

  /**
   * Stop running `perView` number of slides from the end. Use this
   * option if you don't want to have an empty space after
   * a slider. Works only when not looping and a
   * non-centered `focusAt` setting.
   *
   * @type {Boolean}
   */
  bound: false,

  /**
   * Slider will rewind to the first/last slide when it's at the start/end. Has an effect only when not looping.
   *
   * @type {Boolean}
   */
  rewind: false,

  /**
   * A number of slides moved on single swipe.
   *
   * Available types:
   * `perView` - Moves slider by one slide per swipe
   * `perMove` - Moves slider between views per swipe (number of slides defined in `perView` options)
   *
   * @type {"perView" | "perMove"}
   */
  perSwipe: "perMove",

  /**
   * Minimal swipe distance needed to change the slide. Use `false` for turning off a swiping.
   *
   * @type {Number|Boolean}
   */
  swipeThreshold: 80,

  /**
   * Minimal mouse drag distance needed to change the slide. Use `false` for turning off a dragging.
   *
   * @type {Number|Boolean}
   */
  dragThreshold: 120,

  /**
   * Angle required to activate slides moving on swiping or dragging.
   *
   * @type {Number}
   */
  touchAngle: 45,

  /**
   * Moving distance ratio of the slides on a swiping and dragging.
   *
   * @type {Number}
   */
  touchRatio: 0.5,

  /**
   * Definest how many clones will be created in looped mode.
   *
   * @type {Number}
   */
  cloneRatio: 1,

  /**
   * Duration of the animation in milliseconds.
   *
   * @type {Number}
   */
  animationDuration: 400,

  /**
   * Easing function for the animation.
   *
   * @type {String}
   */
  animationTimingFunc: "cubic-bezier(.165, .840, .440, 1)",

  /**
   * Throttle costly events at most once per every wait milliseconds.
   *
   * @type {Number}
   */
  throttle: 10,

  /**
   * Moving direction mode.
   *
   * Available inputs:
   * - 'ltr' - left to right movement,
   * - 'rtl' - right to left movement.
   *
   * @type {String}
   */
  direction: "ltr",

  /**
   * The distance value of the next and previous viewports which
   * have to peek in the current view. Accepts number and
   * pixels as a string. Left and right peeking can be
   * set up separately with a directions object.
   *
   * For example:
   * `100` - Peek 100px on the both sides.
   * { before: 100, after: 50 }` - Peek 100px on the left side and 50px on the right side.
   *
   * @type {Number|String|Object}
   */
  peek: 0,

  /**
   * Collection of options applied at specified media breakpoints.
   * For example: display two slides per view under 800px.
   * `{
   *   '800px': {
   *     perView: 2
   *   }
   * }`
   */
  breakpoints: {},

  /**
   * Collection of internally used HTML classes.
   *
   * @type {Object}
   */
  classes: {
    swipeable: "glide--swipeable",
    direction: {
      ltr: "glide--ltr",
      rtl: "glide--rtl",
    },
    dragging: "is-dragging",
    slide: {
      clone: "is-clone",
      active: "is-active",
    },
    arrow: {
      disabled: "is-disabled",
    },
    nav: {
      active: "is-active",
    },
  },
};

/**
 * Outputs warning message to the bowser console.
 *
 * @param  {String} msg
 * @return {Void}
 */
function warn(msg) {
  console.error("[Glide warn]: " + msg);
}

const _typeof =
  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function (obj) {
        return typeof obj;
      }
    : function (obj) {
        return obj &&
          typeof Symbol === "function" &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };

const classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

const createClass = (function () {
  function defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
      const descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

const defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

const _extends =
  Object.assign ||
  function (target) {
    for (let i = 1; i < arguments.length; i++) {
      const source = arguments[i];

      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

const get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  const desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    const parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    const getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

const inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    );
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
};

const possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }

  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
};

/**
 * Converts value entered as number
 * or string to integer value.
 *
 * @param {String} value
 * @returns {Number}
 */
function toInt(value) {
  return parseInt(value);
}

/**
 * Converts value entered as number
 * or string to flat value.
 *
 * @param {String} value
 * @returns {Number}
 */
function toFloat(value) {
  return parseFloat(value);
}

/**
 * Indicates whether the specified value is a string.
 *
 * @param  {*}   value
 * @return {Boolean}
 */
function isString(value) {
  return typeof value === "string";
}

/**
 * Indicates whether the specified value is an object.
 *
 * @param  {*} value
 * @return {Boolean}
 *
 * @see https://github.com/jashkenas/underscore
 */
function isObject(value) {
  const type = typeof value === "undefined" ? "undefined" : _typeof(value);

  return type === "function" || (type === "object" && !!value); // eslint-disable-line no-mixed-operators
}

/**
 * Indicates whether the specified value is a function.
 *
 * @param  {*} value
 * @return {Boolean}
 */
function isFunction(value) {
  return typeof value === "function";
}

/**
 * Indicates whether the specified value is undefined.
 *
 * @param  {*} value
 * @return {Boolean}
 */
function isUndefined(value) {
  return typeof value === "undefined";
}

/**
 * Indicates whether the specified value is an array.
 *
 * @param  {*} value
 * @return {Boolean}
 */
function isArray(value) {
  return value.constructor === Array;
}

/**
 * Creates and initializes specified collection of extensions.
 * Each extension receives access to instance of glide and rest of components.
 *
 * @param {Object} glide
 * @param {Object} extensions
 *
 * @returns {Object}
 */
function mount(glide, extensions, events) {
  const components = {};

  for (const name in extensions) {
    if (isFunction(extensions[name])) {
      components[name] = extensions[name](glide, components, events);
    } else {
      warn("Extension must be a function");
    }
  }

  for (const _name in components) {
    if (isFunction(components[_name].mount)) {
      components[_name].mount();
    }
  }

  return components;
}

/**
 * Defines getter and setter property on the specified object.
 *
 * @param  {Object} obj         Object where property has to be defined.
 * @param  {String} prop        Name of the defined property.
 * @param  {Object} definition  Get and set definitions for the property.
 * @return {Void}
 */
function define(obj, prop, definition) {
  Object.defineProperty(obj, prop, definition);
}

/**
 * Sorts aphabetically object keys.
 *
 * @param  {Object} obj
 * @return {Object}
 */
function sortKeys(obj) {
  return Object.keys(obj)
    .sort()
    .reduce(function (r, k) {
      r[k] = obj[k];

      return r[k], r;
    }, {});
}

/**
 * Merges passed settings object with default options.
 *
 * @param  {Object} target
 * @param  {Object} source
 * @return {Object}
 */
function mergeDeep(target, source) {
  const output = _extends({}, target);

  if (isObject(source)) {
    if (!isObject(target)) {
      target = {};
    }
    Object.keys(source).forEach(function (key) {
      if (isObject(source[key])) {
        if (!(key in target))
          _extends(output, defineProperty({}, key, source[key]));
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        _extends(output, defineProperty({}, key, source[key]));
      }
    });
  }

  return output;
}

const EventsBus = (function () {
  /**
   * Construct a EventBus instance.
   *
   * @param {Object} events
   */
  function EventsBus() {
    const events =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, EventsBus);

    this.events = events;
    this.hop = events.hasOwnProperty;
  }

  /**
   * Adds listener to the specifed event.
   *
   * @param {String|Array} event
   * @param {Function} handler
   */

  createClass(EventsBus, [
    {
      key: "on",
      value: function on(event, handler) {
        if (isArray(event)) {
          for (let i = 0; i < event.length; i++) {
            this.on(event[i], handler);
          }

          return;
        }

        // Create the event's object if not yet created
        if (!this.hop.call(this.events, event)) {
          this.events[event] = [];
        }

        // Add the handler to queue
        const index = this.events[event].push(handler) - 1;

        // Provide handle back for removal of event
        return {
          remove: function remove() {
            delete this.events[event][index];
          },
        };
      },

      /**
       * Runs registered handlers for specified event.
       *
       * @param {String|Array} event
       * @param {Object=} context
       */
    },
    {
      key: "emit",
      value: function emit(event, context) {
        if (isArray(event)) {
          for (let i = 0; i < event.length; i++) {
            this.emit(event[i], context);
          }

          return;
        }

        // If the event doesn't exist, or there's no handlers in queue, just leave
        if (!this.hop.call(this.events, event)) {
          return;
        }

        // Cycle through events queue, fire!
        this.events[event].forEach(function (item) {
          item(context || {});
        });
      },
    },
  ]);
  return EventsBus;
})();

const Glide = (function () {
  /**
   * Construct glide.
   *
   * @param  {String} selector
   * @param  {Object} options
   */
  function Glide(selector) {
    const options =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Glide);

    this._c = {};
    this._t = [];
    this._e = new EventsBus();

    this.disabled = false;
    this.selector = selector;
    this.settings = mergeDeep(defaults, options);
    this.index = this.settings.startAt;
  }

  /**
   * Initializes glide.
   *
   * @param {Object} extensions Collection of extensions to initialize.
   * @return {Glide}
   */

  createClass(Glide, [
    {
      key: "mount",
      value: function mount$$1() {
        const extensions =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : {};

        this._e.emit("mount.before");

        if (isObject(extensions)) {
          this._c = mount(this, extensions, this._e);
        } else {
          warn("You need to provide a object on `mount()`");
        }

        this._e.emit("mount.after");

        return this;
      },

      /**
       * Collects an instance `translate` transformers.
       *
       * @param  {Array} transformers Collection of transformers.
       * @return {Void}
       */
    },
    {
      key: "mutate",
      value: function mutate() {
        const transformers =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : [];

        if (isArray(transformers)) {
          this._t = transformers;
        } else {
          warn("You need to provide a array on `mutate()`");
        }

        return this;
      },

      /**
       * Updates glide with specified settings.
       *
       * @param {Object} settings
       * @return {Glide}
       */
    },
    {
      key: "update",
      value: function update() {
        const settings =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : {};

        this.settings = mergeDeep(this.settings, settings);

        if (settings.hasOwnProperty("startAt")) {
          this.index = settings.startAt;
        }

        this._e.emit("update");

        return this;
      },

      /**
       * Change slide with specified pattern. A pattern must be in the special format:
       * `>` - Move one forward
       * `<` - Move one backward
       * `={i}` - Go to {i} zero-based slide (eq. '=1', will go to second slide)
       * `>>` - Rewinds to end (last slide)
       * `<<` - Rewinds to start (first slide)
       *
       * @param {String} pattern
       * @return {Glide}
       */
    },
    {
      key: "go",
      value: function go(pattern) {
        this._c.Run.make(pattern);

        return this;
      },

      /**
       * Move track by specified distance.
       *
       * @param {String} distance
       * @return {Glide}
       */
    },
    {
      key: "move",
      value: function move(distance) {
        this._c.Transition.disable();
        this._c.Move.make(distance);

        return this;
      },

      /**
       * Destroy instance and revert all changes done by this._c.
       *
       * @return {Glide}
       */
    },
    {
      key: "destroy",
      value: function destroy() {
        this._e.emit("destroy");

        return this;
      },

      /**
       * Start instance autoplaying.
       *
       * @param {Boolean|Number} interval Run autoplaying with passed interval regardless of `autoplay` settings
       * @return {Glide}
       */
    },
    {
      key: "play",
      value: function play() {
        const interval =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : false;

        if (interval) {
          this.settings.autoplay = interval;
        }

        this._e.emit("play");

        return this;
      },

      /**
       * Stop instance autoplaying.
       *
       * @return {Glide}
       */
    },
    {
      key: "pause",
      value: function pause() {
        this._e.emit("pause");

        return this;
      },

      /**
       * Sets glide into a idle status.
       *
       * @return {Glide}
       */
    },
    {
      key: "disable",
      value: function disable() {
        this.disabled = true;

        return this;
      },

      /**
       * Sets glide into a active status.
       *
       * @return {Glide}
       */
    },
    {
      key: "enable",
      value: function enable() {
        this.disabled = false;

        return this;
      },

      /**
       * Adds cuutom event listener with handler.
       *
       * @param  {String|Array} event
       * @param  {Function} handler
       * @return {Glide}
       */
    },
    {
      key: "on",
      value: function on(event, handler) {
        this._e.on(event, handler);

        return this;
      },

      /**
       * Gets value of the core options.
       *
       * @return {Object}
       */
    },
    {
      key: "settings",
      get: function get$$1() {
        return this._o;
      },

      /**
       * Sets value of the core options.
       *
       * @param  {Object} o
       * @return {Void}
       */
      set: function set$$1(o) {
        if (isObject(o)) {
          this._o = o;
        } else {
          warn("Options must be an `object` instance.");
        }
      },

      /**
       * Gets current index of the slider.
       *
       * @return {Object}
       */
    },
    {
      key: "index",
      get: function get$$1() {
        return this._i;
      },

      /**
       * Sets current index a slider.
       *
       * @return {Object}
       */
      set: function set$$1(i) {
        this._i = toInt(i);
      },

      /**
       * Gets value of the idle status.
       *
       * @return {Boolean}
       */
    },
    {
      key: "disabled",
      get: function get$$1() {
        return this._d;
      },

      /**
       * Sets value of the idle status.
       *
       * @return {Boolean}
       */
      set: function set$$1(status) {
        this._d = !!status;
      },
    },
  ]);
  return Glide;
})();

function Run(Glide, Components, Events) {
  const Run = {
    /**
     * Initializes autorunning of the glide.
     *
     * @return {Void}
     */
    mount: function mount() {
      this._o = false;
    },

    /**
     * Makes glides running based on the passed moving schema.
     *
     * @param {String} move
     */
    make: function make(move) {
      const _this = this;

      if (!Glide.disabled) {
        Glide.disable();

        this.move = move;

        Events.emit("run.before", this.move);

        this.calculate();

        Events.emit("run", this.move);

        Components.Transition.after(function () {
          if (_this.isStart()) {
            Events.emit("run.start", _this.move);
          }

          if (_this.isEnd()) {
            Events.emit("run.end", _this.move);
          }

          if (_this.isOffset("<") || _this.isOffset(">")) {
            _this._o = false;

            Events.emit("run.offset", _this.move);
          }

          Events.emit("run.after", _this.move);

          Glide.enable();
        });
      }
    },

    /**
     * Calculates current index based on defined move.
     *
     * @return {Number|Undefined}
     */
    calculate: function calculate() {
      const move = this.move,
        length = this.length;
      const steps = move.steps,
        direction = move.direction;
      const _Glide$settings = Glide.settings,
        loop = _Glide$settings.loop,
        perMove = _Glide$settings.perMove;

      const distance = steps === "|" ? perMove : steps || 1;

      // While direction is `=` we want jump to
      // a specified index described in steps.
      if (direction === "=") {
        // Check if bound is true, as we want to avoid whitespaces
        if (Glide.settings.bound && steps > length) {
          Glide.index = length;
        } else {
          Glide.index = steps;
        }

        return;
      }

      // When pattern is equal to `>>` we want
      // fast forward to the last slide.
      if (direction === ">" && steps === ">") {
        Glide.index = length;

        return;
      }

      // When pattern is equal to `<<` we want
      // fast forward to the first slide.
      if (direction === "<" && steps === "<") {
        Glide.index = 0;

        return;
      }

      if (direction === ">") {
        const index = calculateForwardIndex(distance);

        if (index > length && loop) {
          this._o = true;
        }

        Glide.index = normalizeForwardIndex(index, distance);

        return;
      }

      if (direction === "<") {
        const _index = calculateBackwardIndex(distance);

        if (_index < 0 && loop) {
          this._o = true;
        }

        Glide.index = normalizeBackwardIndex(_index, distance);

        return;
      }

      warn(
        "Invalid direction pattern [" + direction + steps + "] has been used"
      );
    },

    /**
     * Checks if we are on the first slide.
     *
     * @return {Boolean}
     */
    isStart: function isStart() {
      return Glide.index <= 0;
    },

    /**
     * Checks if we are on the last slide.
     *
     * @return {Boolean}
     */
    isEnd: function isEnd() {
      return Glide.index >= this.length;
    },

    /**
     * Checks if we are making a offset run.
     *
     * @param {String} direction
     * @return {Boolean}
     */
    isOffset: function isOffset(direction) {
      return this._o && this.move.direction === direction;
    },

    /**
     * Checks if bound mode is active
     *
     * @return {Boolean}
     */
    isBound: function isBound() {
      return (
        !Glide.settings.loop &&
        Glide.settings.focusAt !== "center" &&
        Glide.settings.bound
      );
    },
  };

  /**
   * Returns index value to move forward/to the right
   *
   * @param distance
   * @returns {Number}
   */
  function calculateForwardIndex(distance) {
    const index = Glide.index;

    if (Glide.settings.loop) {
      return index + distance;
    }

    return index + (distance - (index % distance));
  }

  /**
   * Calculates index value to move backward/to the left
   *
   * @param distance
   * @returns {Number}
   */
  function calculateBackwardIndex(distance) {
    const index = Glide.index;

    if (Glide.settings.loop) {
      return index - distance;
    }

    return (Math.ceil(index / distance) - 1) * distance;
  }

  /**
   * Normalizes the given forward index based on glide settings, preventing it to exceed certain boundaries
   *
   * @param index
   * @param length
   * @param distance
   * @returns {Number}
   */
  function normalizeForwardIndex(index, distance) {
    const length = Run.length;

    if (index <= length) {
      return index;
    }

    if (Glide.settings.loop) {
      return index - (length + 1);
    }

    if (Glide.settings.rewind) {
      // bound does funny things with the length, therefor we have to be certain
      // that we are on the last possible index value given by bound
      if (Run.isBound() && !Run.isEnd()) {
        return length;
      }

      return 0;
    }

    if (Run.isBound()) {
      return length;
    }

    return Math.floor(length / distance) * distance;
  }

  /**
   * Normalizes the given backward index based on glide settings, preventing it to exceed certain boundaries
   *
   * @param index
   * @param length
   * @param distance
   * @returns {*}
   */
  function normalizeBackwardIndex(index, distance) {
    const length = Run.length;

    if (index >= 0) {
      return index;
    }

    if (Glide.settings.loop) {
      return index + (length + 1);
    }

    if (Glide.settings.rewind) {
      // bound does funny things with the length, therefor we have to be certain
      // that we are on first possible index value before we to rewind to the length given by bound
      if (Run.isBound() && Run.isStart()) {
        return length;
      }

      return Math.floor(length / distance) * distance;
    }

    return 0;
  }

  define(Run, "move", {
    /**
     * Gets value of the move schema.
     *
     * @returns {Object}
     */
    get: function get() {
      return this._m;
    },

    /**
     * Sets value of the move schema.
     *
     * @returns {Object}
     */
    set: function set(value) {
      const step = value.substr(1);

      this._m = {
        direction: value.substr(0, 1),
        steps: step ? (toInt(step) ? toInt(step) : step) : 0,
      };
    },
  });

  define(Run, "length", {
    /**
     * Gets value of the running distance based
     * on zero-indexing number of slides.
     *
     * @return {Number}
     */
    get: function get() {
      const settings = Glide.settings;
      const length = Components.Html.slides.length;

      // If the `bound` option is active, a maximum running distance should be
      // reduced by `perView` and `focusAt` settings. Running distance
      // should end before creating an empty space after instance.

      if (this.isBound()) {
        return (
          length - 1 - (toInt(settings.perView) - 1) + toInt(settings.focusAt)
        );
      }

      return length - 1;
    },
  });

  define(Run, "offset", {
    /**
     * Gets status of the offsetting flag.
     *
     * @return {Boolean}
     */
    get: function get() {
      return this._o;
    },
  });

  return Run;
}

/**
 * Returns a current time.
 *
 * @return {Number}
 */
function now() {
  return new Date().getTime();
}

/**
 * Returns a function, that, when invoked, will only be triggered
 * at most once during a given window of time.
 *
 * @param {Function} func
 * @param {Number} wait
 * @param {Object=} options
 * @return {Function}
 *
 * @see https://github.com/jashkenas/underscore
 */
function throttle(func, wait, options) {
  let timeout = void 0,
    context = void 0,
    args = void 0,
    result = void 0;
  let previous = 0;
  if (!options) options = {};

  const later = function later() {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  const throttled = function throttled() {
    const at = now();
    if (!previous && options.leading === false) previous = at;
    const remaining = wait - (at - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = at;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

const MARGIN_TYPE = {
  ltr: ["marginLeft", "marginRight"],
  rtl: ["marginRight", "marginLeft"],
};

function Gaps(Glide, Components, Events) {
  const Gaps = {
    /**
     * Applies gaps between slides. First and last
     * slides do not receive it's edge margins.
     *
     * @param {HTMLCollection} slides
     * @return {Void}
     */
    apply: function apply(slides) {
      for (let i = 0, len = slides.length; i < len; i++) {
        const style = slides[i].style;
        const direction = Components.Direction.value;

        if (i !== 0) {
          style[MARGIN_TYPE[direction][0]] = this.value / 2 + "px";
        } else {
          style[MARGIN_TYPE[direction][0]] = "";
        }

        if (i !== slides.length - 1) {
          style[MARGIN_TYPE[direction][1]] = this.value / 2 + "px";
        } else {
          style[MARGIN_TYPE[direction][1]] = "";
        }
      }
    },

    /**
     * Removes gaps from the slides.
     *
     * @param {HTMLCollection} slides
     * @returns {Void}
     */
    remove: function remove(slides) {
      for (let i = 0, len = slides.length; i < len; i++) {
        const style = slides[i].style;

        style.marginLeft = "";
        style.marginRight = "";
      }
    },
  };

  define(Gaps, "value", {
    /**
     * Gets value of the gap.
     *
     * @returns {Number}
     */
    get: function get() {
      return toInt(Glide.settings.gap);
    },
  });

  define(Gaps, "grow", {
    /**
     * Gets additional dimentions value caused by gaps.
     * Used to increase width of the slides wrapper.
     *
     * @returns {Number}
     */
    get: function get() {
      return Gaps.value * Components.Sizes.length;
    },
  });

  define(Gaps, "reductor", {
    /**
     * Gets reduction value caused by gaps.
     * Used to subtract width of the slides.
     *
     * @returns {Number}
     */
    get: function get() {
      const perView = Glide.settings.perView;

      return (Gaps.value * (perView - 1)) / perView;
    },
  });

  /**
   * Apply calculated gaps:
   * - after building, so slides (including clones) will receive proper margins
   * - on updating via API, to recalculate gaps with new options
   */
  Events.on(
    ["build.after", "update"],
    throttle(function () {
      Gaps.apply(Components.Html.wrapper.children);
    }, 30)
  );

  /**
   * Remove gaps:
   * - on destroying to bring markup to its inital state
   */
  Events.on("destroy", function () {
    Gaps.remove(Components.Html.wrapper.children);
  });

  return Gaps;
}

/**
 * Finds siblings nodes of the passed node.
 *
 * @param  {Element} node
 * @return {Array}
 */
function siblings(node) {
  if (node && node.parentNode) {
    let n = node.parentNode.firstChild;
    const matched = [];

    for (; n; n = n.nextSibling) {
      if (n.nodeType === 1 && n !== node) {
        matched.push(n);
      }
    }

    return matched;
  }

  return [];
}

/**
 * Checks if passed node exist and is a valid element.
 *
 * @param  {Element} node
 * @return {Boolean}
 */
function exist(node) {
  if (node && node instanceof window.HTMLElement) {
    return true;
  }

  return false;
}

const TRACK_SELECTOR = '[data-glide-el="track"]';

function Html(Glide, Components, Events) {
  const Html = {
    /**
     * Setup slider HTML nodes.
     *
     * @param {Glide} glide
     */
    mount: function mount() {
      this.root = Glide.selector;
      this.root.classList.add("glide--mounted");
      this.track = this.root.querySelector(TRACK_SELECTOR);
      this.slides = [];

      let realSlideIdx = 0;

      for (let i = 0; i < this.wrapper.children.length; i++) {
        const slide = this.wrapper.children[i];
        const isClone = slide.classList.contains(
          Glide.settings.classes.slide.clone
        );
        if (!isClone) {
          slide.setAttribute("data-glide-idx", realSlideIdx);
          this.slides.push(slide);
          realSlideIdx++;
        }
      }
    },
    destroy: function destroy() {
      this.root.classList.remove("glide--mounted");
    },
  };

  define(Html, "root", {
    /**
     * Gets node of the glide main element.
     *
     * @return {Object}
     */
    get: function get() {
      return Html._r;
    },

    /**
     * Sets node of the glide main element.
     *
     * @return {Object}
     */
    set: function set(r) {
      if (isString(r)) {
        r = document.querySelector(r);
      }

      if (exist(r)) {
        Html._r = r;
      } else {
        warn("Root element must be a existing Html node");
      }
    },
  });

  define(Html, "track", {
    /**
     * Gets node of the glide track with slides.
     *
     * @return {Object}
     */
    get: function get() {
      return Html._t;
    },

    /**
     * Sets node of the glide track with slides.
     *
     * @return {Object}
     */
    set: function set(t) {
      if (exist(t)) {
        Html._t = t;
      } else {
        warn(
          "Could not find track element. Please use " +
            TRACK_SELECTOR +
            " attribute."
        );
      }
    },
  });

  define(Html, "wrapper", {
    /**
     * Gets node of the slides wrapper.
     *
     * @return {Object}
     */
    get: function get() {
      return Html.track.children[0];
    },
  });

  Events.on("destroy", function () {
    return Html.destroy();
  });

  return Html;
}

function Peek(Glide, Components, Events) {
  const Peek = {
    /**
     * Setups how much to peek based on settings.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.value = Glide.settings.peek;
    },
  };

  define(Peek, "value", {
    /**
     * Gets value of the peek.
     *
     * @returns {Number|Object}
     */
    get: function get() {
      return Peek._v;
    },

    /**
     * Sets value of the peek.
     *
     * @param {Number|Object} value
     * @return {Void}
     */
    set: function set(value) {
      if (isObject(value)) {
        value.before = toInt(value.before);
        value.after = toInt(value.after);
      } else {
        value = toInt(value);
      }

      Peek._v = value;
    },
  });

  define(Peek, "reductor", {
    /**
     * Gets reduction value caused by peek.
     *
     * @returns {Number}
     */
    get: function get() {
      const value = Peek.value;
      const perView = Glide.settings.perView;

      if (isObject(value)) {
        return value.before / perView + value.after / perView;
      }

      return (value * 2) / perView;
    },
  });

  /**
   * Recalculate peeking sizes on:
   * - when resizing window to update to proper percents
   */
  Events.on(["resize", "update"], function () {
    Peek.mount();
  });

  return Peek;
}

function Move(Glide, Components, Events) {
  const Move = {
    /**
     * Constructs move component.
     *
     * @returns {Void}
     */
    mount: function mount() {
      this._o = 0;
    },

    /**
     * Calculates a movement value based on passed offset and currently active index.
     *
     * @param  {Number} offset
     * @return {Void}
     */
    make: function make() {
      const _this = this;

      const offset =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.offset = offset;

      Events.emit("move", {
        movement: this.value,
      });

      Components.Transition.after(function () {
        Events.emit("move.after", {
          movement: _this.value,
        });
      });
    },
  };

  define(Move, "offset", {
    /**
     * Gets an offset value used to modify current translate.
     *
     * @return {Object}
     */
    get: function get() {
      return Move._o;
    },

    /**
     * Sets an offset value used to modify current translate.
     *
     * @return {Object}
     */
    set: function set(value) {
      Move._o = !isUndefined(value) ? toInt(value) : 0;
    },
  });

  define(Move, "translate", {
    /**
     * Gets a raw movement value.
     *
     * @return {Number}
     */
    get: function get() {
      return Components.Sizes.slideWidth * Glide.index;
    },
  });

  define(Move, "value", {
    /**
     * Gets an actual movement value corrected by offset.
     *
     * @return {Number}
     */
    get: function get() {
      const offset = this.offset;
      const translate = this.translate;

      if (Components.Direction.is("rtl")) {
        return translate + offset;
      }

      return translate - offset;
    },
  });

  /**
   * Make movement to proper slide on:
   * - before build, so glide will start at `startAt` index
   * - on each standard run to move to newly calculated index
   */
  Events.on(["build.before", "run"], function () {
    Move.make();
  });

  return Move;
}

function Sizes(Glide, Components, Events) {
  const Sizes = {
    /**
     * Setups dimentions of slides.
     *
     * @return {Void}
     */
    setupSlides: function setupSlides() {
      const width = this.slideWidth + "px";
      const slides = Components.Html.slides;

      for (let i = 0; i < slides.length; i++) {
        slides[i].style.width = width;
      }
    },

    /**
     * Setups dimentions of slides wrapper.
     *
     * @return {Void}
     */
    setupWrapper: function setupWrapper() {
      Components.Html.wrapper.style.width = this.wrapperSize + "px";
    },

    /**
     * Removes applied styles from HTML elements.
     *
     * @returns {Void}
     */
    remove: function remove() {
      const slides = Components.Html.slides;

      for (let i = 0; i < slides.length; i++) {
        slides[i].style.width = "";
      }

      Components.Html.wrapper.style.width = "";
    },
  };

  define(Sizes, "length", {
    /**
     * Gets count number of the slides.
     *
     * @return {Number}
     */
    get: function get() {
      return Components.Html.slides.length;
    },
  });

  define(Sizes, "width", {
    /**
     * Gets width value of the slider (visible area).
     *
     * @return {Number}
     */
    get: function get() {
      const _Components$Html = Components.Html,
        root = _Components$Html.root,
        track = _Components$Html.track;

      const element = Glide.settings.sizeByTrack ? track : root;
      return element.getBoundingClientRect().width;
    },
  });

  define(Sizes, "wrapperSize", {
    /**
     * Gets size of the slides wrapper.
     *
     * @return {Number}
     */
    get: function get() {
      return (
        Sizes.slideWidth * Sizes.length +
        Components.Gaps.grow +
        Components.Clones.grow
      );
    },
  });

  define(Sizes, "slideWidth", {
    /**
     * Gets width value of a single slide.
     *
     * @return {Number}
     */
    get: function get() {
      return (
        Sizes.width / Glide.settings.perView -
        Components.Peek.reductor -
        Components.Gaps.reductor
      );
    },
  });

  /**
   * Apply calculated glide's dimensions:
   * - before building, so other dimentions (e.g. translate) will be calculated propertly
   * - when resizing window to recalculate sildes dimensions
   * - on updating via API, to calculate dimensions based on new options
   */
  Events.on(["build.before", "resize", "update"], function () {
    Sizes.setupSlides();
    Sizes.setupWrapper();
  });

  /**
   * Remove calculated glide's dimensions:
   * - on destoting to bring markup to its inital state
   */
  Events.on("destroy", function () {
    Sizes.remove();
  });

  return Sizes;
}

function Build(Glide, Components, Events) {
  const Build = {
    /**
     * Init glide building. Adds classes, sets
     * dimensions and setups initial state.
     *
     * @return {Void}
     */
    mount: function mount() {
      Events.emit("build.before");

      this.activeClass();

      Events.emit("build.after");
    },

    /**
     * Sets active class to current slide.
     *
     * @return {Void}
     */
    activeClass: function activeClass() {
      const classes = Glide.settings.classes;
      const slide = Components.Html.slides[Glide.index];

      if (slide) {
        slide.classList.add(classes.slide.active);

        siblings(slide).forEach(function (sibling) {
          sibling.classList.remove(classes.slide.active);
        });
      }
    },

    /**
     * Removes HTML classes applied at building.
     *
     * @return {Void}
     */
    removeClasses: function removeClasses() {
      const slide = Glide.settings.classes.slide;

      Components.Html.slides.forEach(function (sibling) {
        sibling.classList.remove(slide.active);
      });
    },
  };

  /**
   * Clear building classes:
   * - on destroying to bring HTML to its initial state
   * - on updating to remove classes before remounting component
   */
  Events.on(["destroy", "update"], function () {
    Build.removeClasses();
  });

  /**
   * Remount component:
   * - on resizing of the window to calculate new dimentions
   * - on updating settings via API
   */
  Events.on(["resize", "update"], function () {
    Build.mount();
  });

  /**
   * Swap active class of current slide:
   * - after each move to the new index
   */
  Events.on("move.after", function () {
    Build.activeClass();
  });

  return Build;
}

function Clones(Glide, Components, Events) {
  const Clones = {
    /**
     * Create pattern map and collect slides to be cloned.
     */
    mount: function mount() {
      this.items = [];

      if (Glide.settings.loop) {
        this.items = this.collect();
        Events.emit("clones.after");
      }
    },

    /**
     * Collect clones with pattern.
     *
     * @return {[]}
     */
    collect: function collect() {
      const items =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      const slides = Components.Html.slides;
      const _Glide$settings = Glide.settings,
        perView = _Glide$settings.perView,
        cloneRatio = _Glide$settings.cloneRatio,
        classes = _Glide$settings.classes;

      if (slides.length !== 0) {
        const peekIncrementer = +!!Glide.settings.peek;
        const cloneCount = perView + peekIncrementer + Math.round(perView / 2);
        const append = slides.slice(0, cloneCount).reverse();
        const prepend = slides.slice(cloneCount * -1);

        for (
          let r = 0;
          r < Math.max(cloneRatio, Math.floor(perView / slides.length));
          r++
        ) {
          for (let i = 0; i < append.length; i++) {
            const clone = append[i].cloneNode(true);

            clone.classList.add(classes.slide.clone);

            items.push(clone);
          }

          for (let _i = 0; _i < prepend.length; _i++) {
            const _clone = prepend[_i].cloneNode(true);

            _clone.classList.add(classes.slide.clone);

            items.unshift(_clone);
          }
        }
      }

      return items;
    },

    /**
     * Append cloned slides with generated pattern.
     *
     * @return {Void}
     */
    append: function append() {
      const items = this.items;
      const _Components$Html = Components.Html,
        wrapper = _Components$Html.wrapper,
        slides = _Components$Html.slides;

      const half = Math.floor(items.length / 2);
      const prepend = items.slice(0, half).reverse();
      const append = items.slice(half * -1).reverse();
      const width = Components.Sizes.slideWidth + "px";

      for (let i = 0; i < append.length; i++) {
        wrapper.appendChild(append[i]);
      }

      for (let _i2 = 0; _i2 < prepend.length; _i2++) {
        wrapper.insertBefore(prepend[_i2], slides[0]);
      }

      for (let _i3 = 0; _i3 < items.length; _i3++) {
        items[_i3].style.width = width;
      }
    },

    /**
     * Remove all cloned slides.
     *
     * @return {Void}
     */
    remove: function remove() {
      const items = this.items;

      for (let i = 0; i < items.length; i++) {
        Components.Html.wrapper.removeChild(items[i]);
      }
    },
  };

  define(Clones, "grow", {
    /**
     * Gets additional dimentions value caused by clones.
     *
     * @return {Number}
     */
    get: function get() {
      return (
        (Components.Sizes.slideWidth + Components.Gaps.value) *
        Clones.items.length
      );
    },
  });

  /**
   * Append additional slide's clones:
   * - while glide's type is `carousel`
   */
  Events.on("update", function () {
    Clones.remove();
    Clones.mount();
    Clones.append();
  });

  /**
   * Append additional slide's clones:
   * - while glide's type is `carousel`
   */
  Events.on("build.before", function () {
    if (Glide.settings.loop) {
      Clones.append();
    }
  });

  /**
   * Remove clones HTMLElements:
   * - on destroying, to bring HTML to its initial state
   */
  Events.on("destroy", function () {
    Clones.remove();
  });

  return Clones;
}

const EventsBinder = (function () {
  /**
   * Construct a EventsBinder instance.
   */
  function EventsBinder() {
    const listeners =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, EventsBinder);

    this.listeners = listeners;
  }

  /**
   * Adds events listeners to arrows HTML elements.
   *
   * @param  {String|Array} events
   * @param  {Element|Window|Document} el
   * @param  {Function} closure
   * @param  {Boolean|Object} capture
   * @return {Void}
   */

  createClass(EventsBinder, [
    {
      key: "on",
      value: function on(events, el, closure) {
        const capture =
          arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : false;

        if (isString(events)) {
          events = [events];
        }

        for (let i = 0; i < events.length; i++) {
          this.listeners[events[i]] = closure;

          el.addEventListener(events[i], this.listeners[events[i]], capture);
        }
      },

      /**
       * Removes event listeners from arrows HTML elements.
       *
       * @param  {String|Array} events
       * @param  {Element|Window|Document} el
       * @param  {Boolean|Object} capture
       * @return {Void}
       */
    },
    {
      key: "off",
      value: function off(events, el) {
        const capture =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : false;

        if (isString(events)) {
          events = [events];
        }

        for (let i = 0; i < events.length; i++) {
          el.removeEventListener(events[i], this.listeners[events[i]], capture);
        }
      },

      /**
       * Destroy collected listeners.
       *
       * @returns {Void}
       */
    },
    {
      key: "destroy",
      value: function destroy() {
        delete this.listeners;
      },
    },
  ]);
  return EventsBinder;
})();

function Resize(Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  const Binder = new EventsBinder();

  const Resize = {
    /**
     * Initializes window bindings.
     */
    mount: function mount() {
      this.bind();
    },

    /**
     * Binds `rezsize` listener to the window.
     * It's a costly event, so we are debouncing it.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on(
        "resize",
        window,
        throttle(function () {
          Events.emit("resize");
        }, Glide.settings.throttle)
      );
    },

    /**
     * Unbinds listeners from the window.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off("resize", window);
    },
  };

  /**
   * Remove bindings from window:
   * - on destroying, to remove added EventListener
   */
  Events.on("destroy", function () {
    Resize.unbind();
    Binder.destroy();
  });

  return Resize;
}

const VALID_DIRECTIONS = ["ltr", "rtl"];
const FLIPED_MOVEMENTS = {
  ">": "<",
  "<": ">",
  "=": "=",
};

function Direction(Glide, Components, Events) {
  const Direction = {
    /**
     * Setups gap value based on settings.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.value = Glide.settings.direction;
    },

    /**
     * Resolves pattern based on direction value
     *
     * @param {String} pattern
     * @returns {String}
     */
    resolve: function resolve(pattern) {
      const token = pattern.slice(0, 1);

      if (this.is("rtl")) {
        return pattern.split(token).join(FLIPED_MOVEMENTS[token]);
      }

      return pattern;
    },

    /**
     * Checks value of direction mode.
     *
     * @param {String} direction
     * @returns {Boolean}
     */
    is: function is(direction) {
      return this.value === direction;
    },

    /**
     * Applies direction class to the root HTML element.
     *
     * @return {Void}
     */
    addClass: function addClass() {
      Components.Html.root.classList.add(
        Glide.settings.classes.direction[this.value]
      );
    },

    /**
     * Removes direction class from the root HTML element.
     *
     * @return {Void}
     */
    removeClass: function removeClass() {
      Components.Html.root.classList.remove(
        Glide.settings.classes.direction[this.value]
      );
    },
  };

  define(Direction, "value", {
    /**
     * Gets value of the direction.
     *
     * @returns {Number}
     */
    get: function get() {
      return Direction._v;
    },

    /**
     * Sets value of the direction.
     *
     * @param {String} value
     * @return {Void}
     */
    set: function set(value) {
      if (VALID_DIRECTIONS.indexOf(value) > -1) {
        Direction._v = value;
      } else {
        warn("Direction value must be `ltr` or `rtl`");
      }
    },
  });

  /**
   * Clear direction class:
   * - on destroy to bring HTML to its initial state
   * - on update to remove class before reappling bellow
   */
  Events.on(["destroy", "update"], function () {
    Direction.removeClass();
  });

  /**
   * Remount component:
   * - on update to reflect changes in direction value
   */
  Events.on("update", function () {
    Direction.mount();
  });

  /**
   * Apply direction class:
   * - before building to apply class for the first time
   * - on updating to reapply direction class that may changed
   */
  Events.on(["build.before", "update"], function () {
    Direction.addClass();
  });

  return Direction;
}

/**
 * Reflects value of glide movement.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Rtl(Glide, Components) {
  /**
   * Negates the passed translate if glide is in RTL option.
   *
   * @param  {Number} translate
   * @return {Number}
   */
  return function (translate) {
    if (Components.Direction.is("rtl")) {
      return -translate;
    }

    return translate;
  };
}

/**
 * Updates glide movement with a `gap` settings.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Gap(Glide, Components) {
  /**
   * Modifies passed translate value with number in the `gap` settings.
   *
   * @param  {Number} translate
   * @return {Number}
   */
  return function (translate) {
    const multiplier = Math.floor(translate / Components.Sizes.slideWidth);

    return translate + Components.Gaps.value * multiplier;
  };
}

/**
 * Updates glide movement with width of additional clones width.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Grow(Glide, Components) {
  /**
   * Adds to the passed translate width of the half of clones.
   *
   * @param  {Number} translate
   * @return {Number}
   */
  return function (translate) {
    return translate + Components.Clones.grow / 2;
  };
}

/**
 * Updates glide movement with a `peek` settings.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Peeking(Glide, Components) {
  /**
   * Modifies passed translate value with a `peek` setting.
   *
   * @param  {Number} translate
   * @return {Number}
   */
  return function (translate) {
    if (Glide.settings.focusAt >= 0) {
      const peek = Components.Peek.value;

      if (isObject(peek)) {
        return translate - peek.before;
      }

      return translate - peek;
    }

    return translate;
  };
}

/**
 * Updates glide movement with a `focusAt` settings.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Focusing(Glide, Components) {
  /**
   * Modifies passed translate value with index in the `focusAt` setting.
   *
   * @param  {Number} translate
   * @return {Number}
   */
  return function (translate) {
    const gap = Components.Gaps.value;
    const width = Components.Sizes.width;
    const focusAt = Glide.settings.focusAt;
    const slideWidth = Components.Sizes.slideWidth;

    if (focusAt === "center") {
      return translate - (width / 2 - slideWidth / 2);
    }

    return translate - slideWidth * focusAt - gap * focusAt;
  };
}

/**
 * Applies diffrent transformers on translate value.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function mutator(Glide, Components, Events) {
  /**
   * Merge instance transformers with collection of default transformers.
   * It's important that the Rtl component be last on the list,
   * so it reflects all previous transformations.
   *
   * @type {Array}
   */
  const TRANSFORMERS = [Gap, Grow, Peeking, Focusing].concat(Glide._t, [Rtl]);

  /**
   * Piplines translate value with registered transformers.
   *
   * @param  {Number} translate
   * @return {Number}
   */
  return function (translate) {
    for (let i = 0; i < TRANSFORMERS.length; i++) {
      const transformer = TRANSFORMERS[i];

      if (isFunction(transformer) && isFunction(transformer())) {
        translate = transformer(Glide, Components, Events)(translate);
      } else {
        warn("Transformer should be a function that returns the function");
      }
    }

    return translate;
  };
}

function Translate(Glide, Components, Events) {
  const Translate = {
    /**
     * Sets value of translate on HTML element.
     *
     * @param {Number} value
     * @return {Void}
     */
    set: function set(value) {
      const transform = mutator(Glide, Components, Events)(value);

      Components.Html.wrapper.style.transform =
        "translate3d(" + -1 * transform + "px, 0px, 0px)";
    },

    /**
     * Removes value of translate from HTML element.
     *
     * @return {Void}
     */
    remove: function remove() {
      Components.Html.wrapper.style.transform = "";
    },
  };

  /**
   * Set new translate value:
   * - on move to reflect index change
   * - on updating via API to reflect possible changes in options
   */
  Events.on("move", function (context) {
    const length = Components.Sizes.length;
    const width = Components.Sizes.slideWidth;

    if (Glide.settings.loop && Components.Run.isOffset("<")) {
      Components.Transition.after(function () {
        Events.emit("translate.jump");

        Translate.set(width * Glide.index);
      });

      return Translate.set(-(width * (length - Glide.index)));
    }

    if (Glide.settings.loop && Components.Run.isOffset(">")) {
      Components.Transition.after(function () {
        Events.emit("translate.jump");

        Translate.set(width * Glide.index);
      });

      return Translate.set(width * (length + Glide.index));
    }

    return Translate.set(context.movement);
  });

  /**
   * Remove translate:
   * - on destroying to bring markup to its inital state
   */
  Events.on("destroy", function () {
    Translate.remove();
  });

  return Translate;
}

function Transition(Glide, Components, Events) {
  /**
   * Holds inactivity status of transition.
   * When true transition is not applied.
   *
   * @type {Boolean}
   */
  let disabled = false;

  const Transition = {
    /**
     * Composes string of the CSS transition.
     *
     * @param {String} property
     * @return {String}
     */
    compose: function compose(property) {
      const settings = Glide.settings;

      if (!disabled) {
        return (
          property + " " + this.duration + "ms " + settings.animationTimingFunc
        );
      }

      return property + " 0ms " + settings.animationTimingFunc;
    },

    /**
     * Sets value of transition on HTML element.
     *
     * @param {String=} property
     * @return {Void}
     */
    set: function set() {
      const property =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : "transform";

      Components.Html.wrapper.style.transition = this.compose(property);
    },

    /**
     * Removes value of transition from HTML element.
     *
     * @return {Void}
     */
    remove: function remove() {
      Components.Html.wrapper.style.transition = "";
    },

    /**
     * Runs callback after animation.
     *
     * @param  {Function} callback
     * @return {Void}
     */
    after: function after(callback) {
      setTimeout(function () {
        callback();
      }, this.duration);
    },

    /**
     * Enable transition.
     *
     * @return {Void}
     */
    enable: function enable() {
      disabled = false;

      this.set();
    },

    /**
     * Disable transition.
     *
     * @return {Void}
     */
    disable: function disable() {
      disabled = true;

      this.set();
    },
  };

  define(Transition, "duration", {
    /**
     * Gets duration of the transition based
     * on currently running animation type.
     *
     * @return {Number}
     */
    get: function get() {
      const settings = Glide.settings;

      if (!settings.loop && Components.Run.offset) {
        return settings.rewindDuration;
      }

      return settings.animationDuration;
    },
  });

  /**
   * Set transition `style` value:
   * - on each moving, because it may be cleared by offset move
   */
  Events.on("move", function () {
    Transition.set();
  });

  /**
   * Disable transition:
   * - before initial build to avoid transitioning from `0` to `startAt` index
   * - while resizing window and recalculating dimentions
   * - on jumping from offset transition at start and end edges in `carousel` type
   */
  Events.on(["build.before", "resize", "translate.jump"], function () {
    Transition.disable();
  });

  /**
   * Enable transition:
   * - on each running, because it may be disabled by offset move
   */
  Events.on("run", function () {
    Transition.enable();
  });

  /**
   * Remove transition:
   * - on destroying to bring markup to its inital state
   */
  Events.on("destroy", function () {
    Transition.remove();
  });

  return Transition;
}

/**
 * Test via a getter in the options object to see
 * if the passive property is accessed.
 *
 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
 */

let supportsPassive = false;

try {
  const opts = Object.defineProperty({}, "passive", {
    get: function get() {
      supportsPassive = true;
    },
  });

  window.addEventListener("testPassive", null, opts);
  window.removeEventListener("testPassive", null, opts);
} catch (e) {}

const supportsPassive$1 = supportsPassive;

const START_EVENTS = ["touchstart", "mousedown"];
const MOVE_EVENTS = ["touchmove", "mousemove"];
const END_EVENTS = ["touchend", "touchcancel", "mouseup", "mouseleave"];
const MOUSE_EVENTS = ["mousedown", "mousemove", "mouseup", "mouseleave"];

function swipe(Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  const Binder = new EventsBinder();

  let swipeSin = 0;
  let swipeStartX = 0;
  let swipeStartY = 0;
  let disabled = false;
  const capture = supportsPassive$1 ? { passive: true } : false;

  const Swipe = {
    /**
     * Initializes swipe bindings.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.bindSwipeStart();
    },

    /**
     * Handler for `swipestart` event. Calculates entry points of the user's tap.
     *
     * @param {Object} event
     * @return {Void}
     */
    start: function start(event) {
      if (!disabled && !Glide.disabled) {
        this.disable();

        const swipe = this.touches(event);

        swipeSin = null;
        swipeStartX = toInt(swipe.pageX);
        swipeStartY = toInt(swipe.pageY);

        this.bindSwipeMove();
        this.bindSwipeEnd();

        Events.emit("swipe.start");
      }
    },

    /**
     * Handler for `swipemove` event. Calculates user's tap angle and distance.
     *
     * @param {Object} event
     */
    move: function move(event) {
      if (!Glide.disabled) {
        const _Glide$settings = Glide.settings,
          touchAngle = _Glide$settings.touchAngle,
          touchRatio = _Glide$settings.touchRatio,
          classes = _Glide$settings.classes;

        const swipe = this.touches(event);

        const subExSx = toInt(swipe.pageX) - swipeStartX;
        const subEySy = toInt(swipe.pageY) - swipeStartY;
        const powEX = Math.abs(subExSx << 2);
        const powEY = Math.abs(subEySy << 2);
        const swipeHypotenuse = Math.sqrt(powEX + powEY);
        const swipeCathetus = Math.sqrt(powEY);

        swipeSin = Math.asin(swipeCathetus / swipeHypotenuse);

        if ((swipeSin * 180) / Math.PI < touchAngle) {
          event.stopPropagation();

          Components.Move.make(subExSx * toFloat(touchRatio));

          Components.Html.root.classList.add(classes.dragging);

          Events.emit("swipe.move");
        } else {
          return false;
        }
      }
    },

    /**
     * Handler for `swipeend` event. Finitializes user's tap and decides about glide move.
     *
     * @param {Object} event
     * @return {Void}
     */
    end: function end(event) {
      if (!Glide.disabled) {
        const settings = Glide.settings;

        const swipe = this.touches(event);
        const threshold = this.threshold(event);

        const swipeDistance = swipe.pageX - swipeStartX;
        const swipeDeg = (swipeSin * 180) / Math.PI;
        const steps = toInt(settings[settings.perSwipe]);

        this.enable();

        if (swipeDistance > threshold && swipeDeg < settings.touchAngle) {
          Components.Run.make("" + Components.Direction.resolve("<") + steps);
        } else if (
          swipeDistance < -threshold &&
          swipeDeg < settings.touchAngle
        ) {
          Components.Run.make("" + Components.Direction.resolve(">") + steps);
        } else {
          // While swipe don't reach distance apply previous transform.
          Components.Move.make();
        }

        Components.Html.track.classList.remove(settings.classes.dragging);

        this.unbindSwipeMove();
        this.unbindSwipeEnd();

        Events.emit("swipe.end");
      }
    },

    /**
     * Binds swipe's starting event.
     *
     * @return {Void}
     */
    bindSwipeStart: function bindSwipeStart() {
      const _this = this;

      const settings = Glide.settings;

      if (settings.swipeThreshold) {
        Binder.on(
          START_EVENTS[0],
          Components.Html.wrapper,
          function (event) {
            _this.start(event);
          },
          capture
        );
      }

      if (settings.dragThreshold) {
        Binder.on(
          START_EVENTS[1],
          Components.Html.wrapper,
          function (event) {
            _this.start(event);
          },
          capture
        );
      }
    },

    /**
     * Unbinds swipe's starting event.
     *
     * @return {Void}
     */
    unbindSwipeStart: function unbindSwipeStart() {
      Binder.off(START_EVENTS[0], Components.Html.wrapper, capture);
      Binder.off(START_EVENTS[1], Components.Html.wrapper, capture);
    },

    /**
     * Binds swipe's moving event.
     *
     * @return {Void}
     */
    bindSwipeMove: function bindSwipeMove() {
      const _this2 = this;

      Binder.on(
        MOVE_EVENTS,
        Components.Html.wrapper,
        throttle(function (event) {
          _this2.move(event);
        }, Glide.settings.throttle),
        capture
      );
    },

    /**
     * Unbinds swipe's moving event.
     *
     * @return {Void}
     */
    unbindSwipeMove: function unbindSwipeMove() {
      Binder.off(MOVE_EVENTS, Components.Html.wrapper, capture);
    },

    /**
     * Binds swipe's ending event.
     *
     * @return {Void}
     */
    bindSwipeEnd: function bindSwipeEnd() {
      const _this3 = this;

      Binder.on(END_EVENTS, Components.Html.wrapper, function (event) {
        _this3.end(event);
      });
    },

    /**
     * Unbinds swipe's ending event.
     *
     * @return {Void}
     */
    unbindSwipeEnd: function unbindSwipeEnd() {
      Binder.off(END_EVENTS, Components.Html.wrapper);
    },

    /**
     * Normalizes event touches points accorting to different types.
     *
     * @param {Object} event
     */
    touches: function touches(event) {
      if (MOUSE_EVENTS.indexOf(event.type) > -1) {
        return event;
      }

      return event.touches[0] || event.changedTouches[0];
    },

    /**
     * Gets value of minimum swipe distance settings based on event type.
     *
     * @return {Number}
     */
    threshold: function threshold(event) {
      const settings = Glide.settings;

      if (MOUSE_EVENTS.indexOf(event.type) > -1) {
        return settings.dragThreshold;
      }

      return settings.swipeThreshold;
    },

    /**
     * Enables swipe event.
     *
     * @return {self}
     */
    enable: function enable() {
      disabled = false;

      Components.Transition.enable();

      return this;
    },

    /**
     * Disables swipe event.
     *
     * @return {self}
     */
    disable: function disable() {
      disabled = true;

      Components.Transition.disable();

      return this;
    },
  };

  /**
   * Add component class:
   * - after initial building
   */
  Events.on("build.after", function () {
    Components.Html.root.classList.add(Glide.settings.classes.swipeable);
  });

  /**
   * Remove swiping bindings:
   * - on destroying, to remove added EventListeners and classes
   */
  Events.on("destroy", function () {
    Swipe.unbindSwipeStart();
    Swipe.unbindSwipeMove();
    Swipe.unbindSwipeEnd();
    Components.Html.root.classList.remove(Glide.settings.classes.swipeable);
    Binder.destroy();
  });

  return Swipe;
}

function images(Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  const Binder = new EventsBinder();

  const Images = {
    /**
     * Binds listener to glide wrapper.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.bind();
    },

    /**
     * Binds `dragstart` event on wrapper to prevent dragging images.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on("dragstart", Components.Html.wrapper, this.dragstart);
    },

    /**
     * Unbinds `dragstart` event on wrapper.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off("dragstart", Components.Html.wrapper);
    },

    /**
     * Event handler. Prevents dragging.
     *
     * @return {Void}
     */
    dragstart: function dragstart(event) {
      event.preventDefault();
    },
  };

  /**
   * Remove bindings from images:
   * - on destroying, to remove added EventListeners
   */
  Events.on("destroy", function () {
    Images.unbind();
    Binder.destroy();
  });

  return Images;
}

function anchors(Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  const Binder = new EventsBinder();

  /**
   * Holds detaching status of anchors.
   * Prevents detaching of already detached anchors.
   *
   * @private
   * @type {Boolean}
   */
  let detached = false;

  /**
   * Holds preventing status of anchors.
   * If `true` redirection after click will be disabled.
   *
   * @private
   * @type {Boolean}
   */
  let prevented = false;

  const Anchors = {
    /**
     * Setups a initial state of anchors component.
     *
     * @returns {Void}
     */
    mount: function mount() {
      /**
       * Holds collection of anchors elements.
       *
       * @private
       * @type {HTMLCollection}
       */
      this._a = Components.Html.wrapper.querySelectorAll("a");

      this.bind();
    },

    /**
     * Binds events to anchors inside a track.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on("click", Components.Html.wrapper, this.click);
    },

    /**
     * Unbinds events attached to anchors inside a track.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off("click", Components.Html.wrapper);
    },

    /**
     * Handler for click event. Prevents clicks when glide is in `prevent` status.
     *
     * @param  {Object} event
     * @return {Void}
     */
    click: function click(event) {
      if (prevented) {
        event.stopPropagation();
        event.preventDefault();
      }
    },

    /**
     * Detaches anchors click event inside glide.
     *
     * @return {self}
     */
    detach: function detach() {
      prevented = true;

      if (!detached) {
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].draggable = false;

          this.items[i].setAttribute(
            "data-href",
            this.items[i].getAttribute("href")
          );

          this.items[i].removeAttribute("href");
        }

        detached = true;
      }

      return this;
    },

    /**
     * Attaches anchors click events inside glide.
     *
     * @return {self}
     */
    attach: function attach() {
      prevented = false;

      if (detached) {
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].draggable = true;

          this.items[i].setAttribute(
            "href",
            this.items[i].getAttribute("data-href")
          );
        }

        detached = false;
      }

      return this;
    },
  };

  define(Anchors, "items", {
    /**
     * Gets collection of the arrows HTML elements.
     *
     * @return {HTMLElement[]}
     */
    get: function get() {
      return Anchors._a;
    },
  });

  /**
   * Detach anchors inside slides:
   * - on swiping, so they won't redirect to its `href` attributes
   */
  Events.on("swipe.move", function () {
    Anchors.detach();
  });

  /**
   * Attach anchors inside slides:
   * - after swiping and transitions ends, so they can redirect after click again
   */
  Events.on("swipe.end", function () {
    Components.Transition.after(function () {
      Anchors.attach();
    });
  });

  /**
   * Unbind anchors inside slides:
   * - on destroying, to bring anchors to its initial state
   */
  Events.on("destroy", function () {
    Anchors.attach();
    Anchors.unbind();
    Binder.destroy();
  });

  return Anchors;
}

const NAV_SELECTOR = '[data-glide-el="controls[nav]"]';
const CONTROLS_SELECTOR = '[data-glide-el^="controls"]';
const PREVIOUS_CONTROLS_SELECTOR = CONTROLS_SELECTOR + ' [data-glide-dir*="<"]';
const NEXT_CONTROLS_SELECTOR = CONTROLS_SELECTOR + ' [data-glide-dir*=">"]';

function controls(Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  const Binder = new EventsBinder();

  const capture = supportsPassive$1 ? { passive: true } : false;

  var Controls = {
    /**
     * Inits arrows. Binds events listeners
     * to the arrows HTML elements.
     *
     * @return {Void}
     */
    mount: function mount() {
      /**
       * Collection of navigation HTML elements.
       *
       * @private
       * @type {HTMLCollection}
       */
      this._n = Components.Html.root.querySelectorAll(NAV_SELECTOR);

      /**
       * Collection of controls HTML elements.
       *
       * @private
       * @type {HTMLCollection}
       */
      this._c = Components.Html.root.querySelectorAll(CONTROLS_SELECTOR);

      /**
       * Collection of arrow control HTML elements.
       *
       * @private
       * @type {Object}
       */
      this._arrowControls = {
        previous: Components.Html.root.querySelectorAll(
          PREVIOUS_CONTROLS_SELECTOR
        ),
        next: Components.Html.root.querySelectorAll(NEXT_CONTROLS_SELECTOR),
      };

      this.addBindings();
    },

    /**
     * Sets active class to current slide.
     *
     * @return {Void}
     */
    setActive: function setActive() {
      for (let i = 0; i < this._n.length; i++) {
        this.addClass(this._n[i].children);
      }
    },

    /**
     * Removes active class to current slide.
     *
     * @return {Void}
     */
    removeActive: function removeActive() {
      for (let i = 0; i < this._n.length; i++) {
        this.removeClass(this._n[i].children);
      }
    },

    /**
     * Toggles active class on items inside navigation.
     *
     * @param  {HTMLElement} controls
     * @return {Void}
     */
    addClass: function addClass(controls) {
      const settings = Glide.settings;
      const item = controls[Glide.index];

      if (!item) {
        return;
      }

      if (item) {
        item.classList.add(settings.classes.nav.active);

        siblings(item).forEach(function (sibling) {
          sibling.classList.remove(settings.classes.nav.active);
        });
      }
    },

    /**
     * Removes active class from active control.
     *
     * @param  {HTMLElement} controls
     * @return {Void}
     */
    removeClass: function removeClass(controls) {
      const item = controls[Glide.index];

      if (item) {
        item.classList.remove(Glide.settings.classes.nav.active);
      }
    },

    /**
     * Calculates, removes or adds `Glide.settings.classes.disabledArrow` class on the control arrows
     */
    setArrowState: function setArrowState() {
      if (Glide.settings.rewind) {
        return;
      }

      const next = Controls._arrowControls.next;
      const previous = Controls._arrowControls.previous;

      this.resetArrowState(next, previous);

      if (Glide.settings.loop) {
        return;
      }

      if (Glide.index === 0) {
        this.disableArrow(previous);
      }

      if (Glide.index === Components.Run.length) {
        this.disableArrow(next);
      }
    },

    /**
     * Removes `Glide.settings.classes.disabledArrow` from given NodeList elements
     *
     * @param {NodeList[]} lists
     */
    resetArrowState: function resetArrowState() {
      const settings = Glide.settings;

      for (
        var _len = arguments.length, lists = Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        lists[_key] = arguments[_key];
      }

      lists.forEach(function (list) {
        list.forEach(function (element) {
          element.classList.remove(settings.classes.arrow.disabled);
        });
      });
    },

    /**
     * Adds `Glide.settings.classes.disabledArrow` to given NodeList elements
     *
     * @param {NodeList[]} lists
     */
    disableArrow: function disableArrow() {
      const settings = Glide.settings;

      for (
        var _len2 = arguments.length, lists = Array(_len2), _key2 = 0;
        _key2 < _len2;
        _key2++
      ) {
        lists[_key2] = arguments[_key2];
      }

      lists.forEach(function (list) {
        list.forEach(function (element) {
          element.classList.add(settings.classes.arrow.disabled);
        });
      });
    },

    /**
     * Adds handles to the each group of controls.
     *
     * @return {Void}
     */
    addBindings: function addBindings() {
      for (let i = 0; i < this._c.length; i++) {
        this.bind(this._c[i].children);
      }
    },

    /**
     * Removes handles from the each group of controls.
     *
     * @return {Void}
     */
    removeBindings: function removeBindings() {
      for (let i = 0; i < this._c.length; i++) {
        this.unbind(this._c[i].children);
      }
    },

    /**
     * Binds events to arrows HTML elements.
     *
     * @param {HTMLCollection} elements
     * @return {Void}
     */
    bind: function bind(elements) {
      for (let i = 0; i < elements.length; i++) {
        Binder.on("click", elements[i], this.click);
        Binder.on("touchstart", elements[i], this.click, capture);
      }
    },

    /**
     * Unbinds events binded to the arrows HTML elements.
     *
     * @param {HTMLCollection} elements
     * @return {Void}
     */
    unbind: function unbind(elements) {
      for (let i = 0; i < elements.length; i++) {
        Binder.off(["click", "touchstart"], elements[i]);
      }
    },

    /**
     * Handles `click` event on the arrows HTML elements.
     * Moves slider in direction given via the
     * `data-glide-dir` attribute.
     *
     * @param {Object} event
     * @return {void}
     */
    click: function click(event) {
      if (!supportsPassive$1 && event.type === "touchstart") {
        event.preventDefault();
      }

      const direction = event.currentTarget.getAttribute("data-glide-dir");

      Components.Run.make(Components.Direction.resolve(direction));
    },
  };

  define(Controls, "items", {
    /**
     * Gets collection of the controls HTML elements.
     *
     * @return {HTMLElement[]}
     */
    get: function get() {
      return Controls._c;
    },
  });

  /**
   * Swap active class of current navigation item:
   * - after mounting to set it to initial index
   * - after each move to the new index
   */
  Events.on(["mount.after", "move.after"], function () {
    Controls.setActive();
  });

  /**
   * Add or remove disabled class of arrow elements
   */
  Events.on(["mount.after", "run"], function () {
    Controls.setArrowState();
  });

  /**
   * Remove bindings and HTML Classes:
   * - on destroying, to bring markup to its initial state
   */
  Events.on("destroy", function () {
    Controls.removeBindings();
    Controls.removeActive();
    Binder.destroy();
  });

  return Controls;
}

function keyboard(Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  const Binder = new EventsBinder();

  const Keyboard = {
    /**
     * Binds keyboard events on component mount.
     *
     * @return {Void}
     */
    mount: function mount() {
      if (Glide.settings.keyboard) {
        this.bind();
      }
    },

    /**
     * Adds keyboard press events.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on("keyup", document, this.press);
    },

    /**
     * Removes keyboard press events.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off("keyup", document);
    },

    /**
     * Handles keyboard's arrows press and moving glide foward and backward.
     *
     * @param  {Object} event
     * @return {Void}
     */
    press: function press(event) {
      let perSwipe = Glide.settings.perSwipe;

      perSwipe = typeof perSwipe === "number" ? perSwipe : "";

      if (event.keyCode === 39) {
        Components.Run.make(Components.Direction.resolve(perSwipe + ">"));
      }

      if (event.keyCode === 37) {
        Components.Run.make(Components.Direction.resolve(perSwipe + "<"));
      }
    },
  };

  /**
   * Remove bindings from keyboard:
   * - on destroying to remove added events
   * - on updating to remove events before remounting
   */
  Events.on(["destroy", "update"], function () {
    Keyboard.unbind();
  });

  /**
   * Remount component
   * - on updating to reflect potential changes in settings
   */
  Events.on("update", function () {
    Keyboard.mount();
  });

  /**
   * Destroy binder:
   * - on destroying to remove listeners
   */
  Events.on("destroy", function () {
    Binder.destroy();
  });

  return Keyboard;
}

function autoplay(Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  const Binder = new EventsBinder();

  const Autoplay = {
    /**
     * Initializes autoplaying and events.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.start();

      if (Glide.settings.hoverpause) {
        this.bind();
      }
    },

    /**
     * Starts autoplaying in configured interval.
     *
     * @param {Boolean|Number} force Run autoplaying with passed interval regardless of `autoplay` settings
     * @return {Void}
     */
    start: function start() {
      const _this = this;

      if (Glide.settings.autoplay) {
        if (isUndefined(this._i)) {
          this._i = setInterval(function () {
            _this.stop();

            Components.Run.make(">");

            _this.start();

            Events.emit("autoplay");
          }, this.time);
        }
      }
    },

    /**
     * Stops autorunning of the glide.
     *
     * @return {Void}
     */
    stop: function stop() {
      this._i = clearInterval(this._i);
    },

    /**
     * Stops autoplaying while mouse is over glide's area.
     *
     * @return {Void}
     */
    bind: function bind() {
      const _this2 = this;

      Binder.on("mouseenter", Components.Html.root, function () {
        _this2.stop();

        Events.emit("autoplay.enter");
      });

      Binder.on("mouseleave", Components.Html.root, function () {
        _this2.start();

        Events.emit("autoplay.leave");
      });
    },

    /**
     * Unbind mouseover events.
     *
     * @returns {Void}
     */
    unbind: function unbind() {
      Binder.off(["mouseover", "mouseout"], Components.Html.root);
    },
  };

  define(Autoplay, "time", {
    /**
     * Gets time period value for the autoplay interval. Prioritizes
     * times in `data-glide-autoplay` attrubutes over options.
     *
     * @return {Number}
     */
    get: function get() {
      const autoplay = Components.Html.slides[Glide.index].getAttribute(
        "data-glide-autoplay"
      );

      if (autoplay) {
        return toInt(autoplay);
      }

      return toInt(Glide.settings.autoplay);
    },
  });

  /**
   * Stop autoplaying and unbind events:
   * - on destroying, to clear defined interval
   * - on updating via API to reset interval that may changed
   */
  Events.on(["destroy", "update"], function () {
    Autoplay.unbind();
  });

  /**
   * Stop autoplaying:
   * - before each run, to restart autoplaying
   * - on pausing via API
   * - on destroying, to clear defined interval
   * - while starting a swipe
   * - on updating via API to reset interval that may changed
   */
  Events.on(
    ["run.before", "pause", "destroy", "swipe.start", "update"],
    function () {
      Autoplay.stop();
    }
  );

  /**
   * Start autoplaying:
   * - after each run, to restart autoplaying
   * - on playing via API
   * - while ending a swipe
   */
  Events.on(["run.after", "play", "swipe.end"], function () {
    Autoplay.start();
  });

  /**
   * Remount autoplaying:
   * - on updating via API to reset interval that may changed
   */
  Events.on("update", function () {
    Autoplay.mount();
  });

  /**
   * Destroy a binder:
   * - on destroying glide instance to clearup listeners
   */
  Events.on("destroy", function () {
    Binder.destroy();
  });

  return Autoplay;
}

/**
 * Sorts keys of breakpoint object so they will be ordered from lower to bigger.
 *
 * @param {Object} points
 * @returns {Object}
 */
function sortBreakpoints(points) {
  if (isObject(points)) {
    return sortKeys(points);
  } else {
    warn("Breakpoints option must be an object");
  }

  return {};
}

function breakpoints(Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  const Binder = new EventsBinder();

  /**
   * Holds reference to settings.
   *
   * @type {Object}
   */
  const settings = Glide.settings;

  /**
   * Holds reference to breakpoints object in settings. Sorts breakpoints
   * from smaller to larger. It is required in order to proper
   * matching currently active breakpoint settings.
   *
   * @type {Object}
   */
  let points = sortBreakpoints(settings.breakpoints);

  /**
   * Cache initial settings before overwritting.
   *
   * @type {Object}
   */
  let defaults = _extends({}, settings);

  const Breakpoints = {
    /**
     * Matches settings for currectly matching media breakpoint.
     *
     * @param {Object} points
     * @returns {Object}
     */
    match: function match(points) {
      if (typeof window.matchMedia !== "undefined") {
        for (const point in points) {
          if (points.hasOwnProperty(point)) {
            if (window.matchMedia("(max-width: " + point + "px)").matches) {
              return points[point];
            }
          }
        }
      }

      return defaults;
    },
  };

  /**
   * Overwrite instance settings with currently matching breakpoint settings.
   * This happens right after component initialization.
   */
  _extends(settings, Breakpoints.match(points));

  /**
   * Update glide with settings of matched brekpoint:
   * - window resize to update slider
   */
  Binder.on(
    "resize",
    window,
    throttle(function () {
      Glide.settings = mergeDeep(settings, Breakpoints.match(points));
    }, Glide.settings.throttle)
  );

  /**
   * Resort and update default settings:
   * - on reinit via API, so breakpoint matching will be performed with options
   */
  Events.on("update", function () {
    points = sortBreakpoints(points);

    defaults = _extends({}, settings);
  });

  /**
   * Unbind resize listener:
   * - on destroying, to bring markup to its initial state
   */
  Events.on("destroy", function () {
    Binder.off("resize", window);
  });

  return Breakpoints;
}

const COMPONENTS = {
  Html: Html,
  Translate: Translate,
  Transition: Transition,
  Direction: Direction,
  Peek: Peek,
  Sizes: Sizes,
  Gaps: Gaps,
  Move: Move,
  Clones: Clones,
  Resize: Resize,
  Build: Build,
  Run: Run,
};

const Glide$1 = (function (_Core) {
  inherits(Glide$$1, _Core);

  function Glide$$1() {
    classCallCheck(this, Glide$$1);
    return possibleConstructorReturn(
      this,
      (Glide$$1.__proto__ || Object.getPrototypeOf(Glide$$1)).apply(
        this,
        arguments
      )
    );
  }

  createClass(Glide$$1, [
    {
      key: "mount",
      value: function mount() {
        const extensions =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : {};

        return get(
          Glide$$1.prototype.__proto__ ||
            Object.getPrototypeOf(Glide$$1.prototype),
          "mount",
          this
        ).call(this, _extends({}, COMPONENTS, extensions));
      },
    },
  ]);
  return Glide$$1;
})(Glide);

export default Glide$1;
export {
  swipe as Swipe,
  images as Images,
  anchors as Anchors,
  controls as Controls,
  keyboard as Keyboard,
  autoplay as Autoplay,
  breakpoints as Breakpoints,
  throttle,
};
