import { $ } from "@olmokit/dom/$";
import { Collapsable } from "../../collapsable";
import "../../progress/loading.scss";
import { OlmoformsBase } from "../base";
import type { Olmoforms } from "../types";
import "./index.scss";

/**
 * Olmoforms initialiser variant: withFeedback, it adds automatic feedback area
 * collapsing/uncollapsing
 */
export const OlmoformsWithFeedback: Olmoforms.Initialiser = (
  rootSelector,
  hooks = {},
  adapters,
  checkers
) => {
  const instance = OlmoformsBase(
    rootSelector,
    {
      ...hooks,
      before: handleBefore,
      succeded: handleSucceded,
      failed: handleFailed,
    },
    adapters,
    checkers
  );

  const $feedback = $(".of:feedback", instance.$root);
  const $success = $(".of:feedback__success", $feedback);
  const $failure = $(".of:feedback__failure", $feedback);
  const areaForm = Collapsable(instance.$form);
  const areaFeedback = Collapsable($feedback);
  const { before, succeded, failed } = hooks;

  toggle($failure, false);
  toggle($success, false);

  areaFeedback?.collapse(true);

  function handleBefore() {
    areaFeedback?.collapse();
    if (before) before(instance);
  }

  function handleSucceded() {
    toggle($success, true);
    toggle($failure, false);
    areaForm?.collapse();
    areaFeedback?.expand();
    if (succeded) succeded(instance);
  }

  function handleFailed() {
    toggle($success, false);
    toggle($failure, true);
    areaFeedback?.expand();
    if (failed) failed(instance);
  }

  function toggle(el: HTMLElement, show?: boolean) {
    el.style.display = show ? "block" : "none";
  }

  return instance;
};

export default OlmoformsWithFeedback;
