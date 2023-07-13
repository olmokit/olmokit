/* eslint-disable @typescript-eslint/no-unused-vars */
import { $ } from "@olmokit/dom/$";
import { addClass } from "@olmokit/dom/addClass";
import { getDataAttr } from "@olmokit/dom/getDataAttr";
import { removeClass } from "@olmokit/dom/removeClass";
import ajax, { type AjaxResponse } from "../ajax";
import ajaxLaravel from "../ajax/laravel";
// import scrollTo from "@olmokit/core/scroll/scrollTo";
import "../progress/loading.scss";
import { getFormData, getPostData } from "./helpers";
import {
  Validation,
  type ValidationError,
  type ValidationOptions,
} from "./validation";

type FormsBaseInstance = {
  $root: HTMLElement;
  $form: HTMLFormElement;
  $submit: HTMLButtonElement;
  destroy: () => any;
};

type FormBaseDefault = Record<string, string>;

/**
 * FIXME: we use `any` instead of generics here for now as we do not want to
 * enforce too many problems on the data structure, we might change this
 */
export type FormsBaseOptions = {
  /** If undefined the `<form action="...">` value will be used appending a `/ajax` suffix to the URL */
  endpoint?: string;
  /** The full URL to send the form to */
  url?: string;
  /** Called at an invalid submission attempt */
  invalid?: (errors: ValidationError[], instance: FormsBaseInstance) => void;
  /** Called at an invalid submission attempt */
  valid?: <T>(formData: any, instance: FormsBaseInstance) => void;
  /** Called just before a valid submission attempt */
  before?: <T>(formData: any, instance: FormsBaseInstance) => void;
  /** Called just after a succesfull server response */
  succeded?: <T = any, R = any>(
    formData: any,
    instance: FormsBaseInstance,
    response: AjaxResponse<any>
  ) => void;
  /** Called just after a failed server response */
  failed?: <T, R>(
    formData: any,
    instance: FormsBaseInstance,
    response: AjaxResponse<any>
  ) => void;
  /** Called on successful submitted data, it passes along the sent data, useful for analytics tracking */
  sent?: <T>(formData: T) => void;
};

/**
 * Core: FormsBase
 *
 * @param {HTMLElement} $form The root DOM Element that contains the `<form>`
 * @param {string} $string The `<form>` selector
 */
export function FormsBase(
  $root?: HTMLElement,
  selector = "form",
  options: FormsBaseOptions = {}
) {
  const $form = $(selector, $root) as HTMLFormElement;
  if (!$form) {
    if (process.env["NODE_ENV"] !== "production") {
      console.warn(
        `[@olmokit/core/forms/base] Initialised FormBase with a not existing DOM element '${selector}'`
      );
    }
    return;
  }
  $root = $root || $form;
  const $submit = $("[type='submit']", $form) as HTMLButtonElement;
  const instance = {
    $form,
    destroy,
  };
  const hasAjaxSubmit =
    !!getDataAttr($form, "ajax-submit") || !!options.endpoint || !!options.url;

  // init form validation
  const validationOptions = {
    onerror: handleInvalidSubmit,
  } as ValidationOptions;
  if (hasAjaxSubmit) validationOptions.onsuccess = handleValidSubmit;

  const validation = Validation($form, validationOptions);

  /**
   * Handle invalid submission attempt (before sending to server)
   *
   * Default behaviour might be to scroll to first element with error
   */
  function handleInvalidSubmit(errors: ValidationError[]) {
    callHookSafely("invalid", errors);
    // const firstEl = errors[0].element;

    // scrollTo(firstEl, {
    //   offset: 100,
    //   onstop: () => firstEl.focus(),
    // });
  }

  /**
   * Handle valid submit
   */
  function handleValidSubmit() {
    const formData = getFormData($form);

    callHookSafely("before", formData);

    onSubmitStart();

    callHookSafely("valid", formData);

    const { endpoint, url } = options;
    const requestUrl = url || endpoint || $form.action + "ajax/";
    const requestOptions = {
      method: "POST",
      data: getPostData(formData),
    } as const;
    const request = url
      ? ajax(requestUrl, requestOptions)
      : ajaxLaravel(requestUrl, requestOptions);

    request
      .then((response) => {
        onSubmitEnd();
        callHookSafely("succeded", formData, response);
        if (process.env["NODE_ENV"] !== "production") {
          console.log("success", response);
        }
      })
      .catch((response) => {
        onSubmitEnd();
        callHookSafely("failed", formData, response);
        if (process.env["NODE_ENV"] !== "production") {
          console.log("error", response);
        }
      });

    return request;
  }

  /**
   * Call hook safely (if defined)
   */
  function callHookSafely(
    hookName: keyof FormsBaseOptions,
    specificData: any,
    response = {}
  ) {
    // @ts-expect-error FIXME: core types
    if (options[hookName]) options[hookName](specificData, instance, response);
  }

  /**
   * On submit start default behaviour
   */
  function onSubmitStart() {
    $submit.disabled = true;
    addClass($root, "is-loading");
  }

  /**
   * On submit end default behaviour
   */
  function onSubmitEnd() {
    $submit.disabled = false;
    removeClass($root, "is-loading");
  }

  function destroy() {
    validation.destroy();
  }
}

export default FormsBase;
