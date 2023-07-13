import { addClass } from "@olmokit/dom/addClass";
import { off } from "@olmokit/dom/off";
import { on } from "@olmokit/dom/on";
import { removeClass } from "@olmokit/dom/removeClass";
import { toArray } from "@olmokit/dom/toArray";
import { getElementRules, getElementWrapper } from "../helpers";
import type { AnyFormHTMLElement } from "../types";
import { isEmail, isFilesize, isRequired } from "../validators";

export type ValidationValidator<TElement extends AnyFormHTMLElement> = {
  /* The form node that has errors */
  element?: TElement;
  /* The message to show when validity is false */
  msg: string;

  /* The function that validates the input */
  validate: (input: TElement) => boolean | Promise<any>;
};

/**
 * The Name of the validator, besides the standard ones, like
 * `<input type="email">` custom validators will be to added here with a name
 * which should be put on the related input field as data attribute value of
 * `data-validation="custom"`. validates the input
 */
type ValidationValidators = Record<string, ValidationValidator<any>>;

export type ValidationOptions = {
  /* Called when user has submitted a valid form */
  onsuccess?: () => any;
  /* Called when user has submitted an invalid form */
  onerror?: (errors: ValidationError[]) => any;
  /* Custom validators */
  validators?: ValidationValidators;
};

export type ValidationError = {
  /* The error DOM element */
  element: AnyFormHTMLElement;
  /* The error name */
  name: string;
  /* The error message */
  msg: string;
};

const DEFAULT_VALIDATORS = {
  required: {
    validate: isRequired,
    msg: "", // TODO: i18n text
  },
  email: {
    validate: isEmail,
    msg: "", // TODO: i18n text
  },
  file: {
    validate: isFilesize,
    msg: "", // TODO: i18n text
  },
};

const CLASSNAME_INVALID = "invalid";
const CLASSNAME_VALID = "valid";
const CLASSNAME_TOUCHED = "touched";

/**
 * Set form element as valid ("manually")
 */
export function setAsValid($element: AnyFormHTMLElement) {
  const wrapper = getElementWrapper($element);
  removeClass(wrapper, CLASSNAME_INVALID);
  addClass(wrapper, CLASSNAME_VALID);
}

/**
 * Set form element as invalid ("manually")
 */
export function setAsInvalid($element: AnyFormHTMLElement) {
  const wrapper = getElementWrapper($element);
  addClass(wrapper, CLASSNAME_INVALID);
  removeClass(wrapper, CLASSNAME_VALID);
}

/**
 * Validation
 *
 * Native API is:
 * ```
 * element.setCustomValidity("error message");
 * element.checkValidity(); // returns boolean
 * element.reportValidity(); // shows error message
 * ```
 *
 * The validity object for e.g. a textarea is:
 * ```
 * textarea.validty = {
 *   badInput: false,
 *   customError: false,
 *   patternMismatch: false,
 *   rangeOverflow: false,
 *   rangeUnderflow: false,
 *   stepMismatch: false,
 *   tooLong: false,
 *   tooShort: false,
 *   typeMismatch: false,
 *   valid: false,
 *   valueMissing: false
 * }
 * ```
 *
 * @see https://caniuse.com/#search=form%20valid for native support
 */
export function Validation(
  form: HTMLFormElement,
  { validators = {}, onsuccess, onerror }: ValidationOptions
) {
  // @ts-expect-error FIXME: core types
  const allValidators: Record<string, ValidationValidator<any>> = {
    ...DEFAULT_VALIDATORS,
    ...validators,
  };

  // const elements = form.querySelectorAll("input, select, textarea");
  const elements = toArray(form.elements).filter(
    (el) => el.tagName !== "BUTTON"
  ) as AnyFormHTMLElement[];

  // remove native HTML5 validation, leave it in HTML for no JS support
  form.setAttribute("novalidate", "true");

  // bind submit event
  on(form, "submit", handleSubmit);

  // bind input events
  for (let i = 0; i < elements.length; i++) {
    const input = elements[i];
    on(input, "keyup", setTouchState);
    on(input, "keyup", validateElementIfTouched);
    on(input, "blur", validateElementIfTouched);
    on(input, "change", validateElement);
  }

  /**
   * Set touch state and immediately deregister listener, don't consider pressing
   * the TAB key as an actual typing input
   */
  function setTouchState(this: AnyFormHTMLElement, event: KeyboardEvent) {
    if (event.keyCode !== 9) {
      // 9 is TABKEY
      const wrapper = getElementWrapper(this);
      addClass(wrapper, CLASSNAME_TOUCHED);
      off(this, "keyup", setTouchState);
    }
  }

  /**
   * Validate Form element only if it has been already touched
   */
  function validateElementIfTouched(this: AnyFormHTMLElement) {
    const wrapper = getElementWrapper(this);
    if (!wrapper.classList.contains(CLASSNAME_TOUCHED)) {
      return [];
    }
    return validateElement.call(this) as ReturnType<typeof validateElement>;
  }

  /**
   * Validate Form element
   */
  function validateElement(this: AnyFormHTMLElement) {
    const wrapper = getElementWrapper(this);
    const rules = getElementRules(this);
    const errors = [] as ValidationError[];
    let i = 0;

    while (i < rules.length) {
      const rule = rules[i];
      const validator = allValidators[rule];

      if (!this.disabled && !validator.validate(this)) {
        addClass(wrapper, CLASSNAME_INVALID);
        removeClass(wrapper, CLASSNAME_VALID);
        errors.push({ element: this, name: rule, msg: validator.msg });

        // here we just show the first error among the rules defined for this
        // element, maybe put an option to return all errors associated with
        // this element's rules
        break;
      }

      removeClass(wrapper, CLASSNAME_INVALID);
      addClass(wrapper, CLASSNAME_VALID);

      i++;
    }

    return errors;
  }

  /**
   * Handle form submit
   */
  function handleSubmit(event: Event) {
    let errors = [] as ValidationError[];

    for (let i = 0; i < elements.length; i++) {
      errors = errors.concat(validateElement.call(elements[i]));
    }

    if (errors.length) {
      // console.log("forms.validation->errors on submit", errors);
      if (onerror) onerror(errors);
      event.preventDefault();
      return;
    }

    if (onsuccess) {
      onsuccess();
      event.preventDefault();
      return;
    }
  }

  return {
    destroy() {
      // bind submit event
      off(form, "submit", handleSubmit);

      // bind input events
      for (let i = 0; i < elements.length; i++) {
        const input = elements[i];
        off(input, "keyup", setTouchState);
        off(input, "keyup", validateElementIfTouched);
        off(input, "blur", validateElementIfTouched);
        off(input, "change", validateElement);
      }
    },
  };
}

export default Validation;
