import { $ } from "@olmokit/dom/$";
import { $all } from "@olmokit/dom/$all";
import { addClass } from "@olmokit/dom/addClass";
import { forEach } from "@olmokit/dom/forEach";
import { off } from "@olmokit/dom/off";
import { on } from "@olmokit/dom/on";
import { removeClass } from "@olmokit/dom/removeClass";
import { triggerEvent } from "../helpers";
import "./index.scss";

/**
 * Auto initialise all spinners existing in DOM
 *
 * @export
 * @returns
 */
export function spinners() {
  const spinners: ReturnType<typeof Spinner>[] = [];

  forEach($all(".spinner"), ($spinner) => {
    if ($spinner) {
      const spinner = Spinner($spinner);
      spinners.push(spinner);
    }
  });

  return {
    destroy() {
      spinners.forEach((spinner) => {
        spinner.destroy();
      });
    },
  };
}

/**
 * Spinner form control
 */
export function Spinner($root: HTMLElement) {
  const $btnIncrement = $<HTMLButtonElement>(".spinnerInc", $root);
  const $btnDecrement = $<HTMLButtonElement>(".spinnerDec", $root);
  const $input = $<HTMLInputElement>(".spinnerControl", $root);

  let maxValue = 99999;
  let minValue = 0;
  let step = 1;
  let newValue;

  // read input attributes (min, max and step)
  if ($input.hasAttribute("max")) {
    maxValue = parseFloat($input.getAttribute("max") || "");
  }
  if ($input.hasAttribute("min")) {
    minValue = parseFloat($input.getAttribute("min") || "");
  }
  if ($input.hasAttribute("step")) {
    step = parseFloat($input.getAttribute("step") || "");
  }

  // change the number input type to text
  $input.setAttribute("type", "text");

  // if there is there no pattern attribute, set it to only accept numbers
  if (!$input.hasAttribute("pattern")) {
    $input.setAttribute("pattern", "[0-9]");
  }

  // add click events to the add and remove buttons
  on($btnIncrement, "click", handleClickIncrease);
  on($btnDecrement, "click", handleClickDecrease);

  manageBtnStatus();

  function enableBtn($btn: HTMLButtonElement) {
    $btn.disabled = false;
    removeClass($btn, "is-disabled");
  }

  function disableBtn($btn: HTMLButtonElement) {
    $btn.disabled = true;
    addClass($btn, "is-disabled");
  }

  function manageBtnStatus() {
    const current = parseFloat($input.value);

    if (current <= minValue) {
      disableBtn($btnDecrement);
    } else {
      enableBtn($btnDecrement);
    }
    if (current >= maxValue) {
      disableBtn($btnIncrement);
    } else {
      enableBtn($btnIncrement);
    }
  }

  function handleClickIncrease(event: MouseEvent) {
    newValue = parseFloat($input.value) + step;

    // if the value is less than the max value
    if (newValue <= maxValue) {
      // add one to the number input value
      $input.value = newValue.toString();
      triggerEvent($input);
    }
    manageBtnStatus();
    event.preventDefault();
  }

  function handleClickDecrease(event: MouseEvent) {
    newValue = parseFloat($input.value) - step;
    // if the number input value is bigger than the min value, reduce the the value by 1
    if (newValue >= minValue) {
      $input.value = newValue.toString();
      triggerEvent($input);
    }
    manageBtnStatus();
    event.preventDefault();
  }

  return {
    destroy() {
      off($btnIncrement, "click", handleClickIncrease);
      off($btnDecrement, "click", handleClickDecrease);
    },
  };
}
