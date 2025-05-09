import { $ } from "@olmokit/dom/$";
import { addClass } from "@olmokit/dom/addClass";
import { getDataAttr } from "@olmokit/dom/getDataAttr";
import { removeClass } from "@olmokit/dom/removeClass";
import { Uploader } from "../../forms/file/olmoindex";
import { Validation, type ValidationError } from "../../forms/validation";
import { scrollTo } from "../../scroll/scrollTo";
import { adaptDataForContact } from "../adapters";
import { getFormData, getTypeFile } from "../helpers";
import { submitContact } from "../submitters";
import type { Olmoforms } from "../types";
import "./index.scss";

/**
 * Olmoforms basic initialiser, it provides the standard Olmoforms behaviour and
 * comunication with the server
 */
export const OlmoformsBase: Olmoforms.Initialiser = (
  rootSelector = ".ofForm:",
  hooks = {},
  adapters = {},
  // checkers = {}
) => {
  const $root = $(rootSelector);
  const $form = $(".of:", $root) as HTMLFormElement;
  const $submit = $("[type='submit']", $form) as HTMLButtonElement;
  const action = getDataAttr($form, "action") || "";
  const instance = {
    $root,
    $form,
    $submit,
    action,
    destroy,
    boot
  };
  let bootCheck = false; 

  // init form validation
  const validation = Validation($form, {
    onerror: handleInvalidSubmit,
    onsuccess: handleValidSubmit,
  });

  /**
   * Handle invalid submission attempt (before sending to server)
   *
   * Default behaviour is to scroll to first element with error
   */
  function handleInvalidSubmit(errors: ValidationError[]) {
    const firstEl = errors[0].element;

    scrollTo(firstEl, {
      offset: 100,
      onstop: () => firstEl.focus(),
    });
  }

  /**
   * Handle valid submission attempt (before sending to server)
   */
  function handleValidSubmit() {
    callHookSafely("before", instance);

    onSubmitStart();

    if(bootCheck){
      handleFailed();
      return;
    }

    /**
     * Inserire questa funzione dentro submitActionChecker
     * e gestisci la condizione li dentro per poter avere una scrittura più pulita
     */
    const typeFile = getTypeFile($form);

    return new Promise<void>((resolve, reject) => {
      /**
       * This is a massive change
       * Uploaded the file first then if the reply is true
       * go ahead
       */
      submitActionChecker(rootSelector, typeFile).then((e) => {
        const formDataRaw = getFormData($form);
        let dataContact = { ...formDataRaw };
        if (adapters.contact) {
          dataContact = adapters.contact(dataContact, action);
        } else {
          dataContact = adaptDataForContact(dataContact);
        }

        if (e == true) {
          console.log("sending");
          submitContact(dataContact, action)
            .then((response) => {
              const { data } = response;
              const element = {
                data: data,
                formData: dataContact
              }
              callHookSafely("sent", element);
              handleSucceded();
              resolve();
            })
            .catch(() => {
              handleFailed();
              reject();
            });
        } else {
          console.log(
            "Ciao Vez, something deeply wrong happened! Take a deep breath..."
          );
        }
      });
    });
  }

  const submitActionChecker = async (
    rootSelector: string,
    typeFile?: boolean
  ) => {
    try {
      let response;

      if (typeFile) {
        response = await Uploader(rootSelector);
      } else {
        response = true;
      }

      if (response) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }; 

  /**
   * Call hook safely (if defined)
   */
  function callHookSafely(hookName: keyof Olmoforms.Hooks, specificData: any) {
    if (hooks[hookName]) hooks[hookName]?.(specificData, action);
  }

  function boot() {
    bootCheck = true;
  }  

  /**
   * Handle succeded ajax response
   */
  function handleSucceded() {
    onSubmitEnd();
    callHookSafely("succeded", instance);
  }

  /**
   * Handle failed ajax response
   */
  function handleFailed() {
    onSubmitEnd();
    callHookSafely("failed", instance);
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

  /**
   * Destroy olmoforms instance
   *
   */
  function destroy() {
    validation.destroy();
  }

  return instance;
};

export default OlmoformsBase;
