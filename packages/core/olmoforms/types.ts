// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Olmoforms {
  /**
   * @param rootSelector The DOM selector to run olmoforms upon
   */
  export type Initialiser = (
    rootSelector: string,
    hooks?: Hooks,
    adapters?: Adapters,
    checkers?: Checkers
  ) => Instance;

  export type Hooks = {
    /** Called just before a valid submission attempt */
    before?: (instance: Instance) => void;
    /** Called just after a succesfull server response */
    succeded?: (instance: Instance) => void;
    /** Called just after a failed server response */
    failed?: (instance: Instance) => void;
    /** Called on successful submitted data, it passes along the sent data, useful for analytics tracking */
    sent?: (formData: Object, action: string) => void;
  };

  export type Adapters = {
    /** Data adapter for standard contact forms */
    contact?: (formData: Object, action: string) => Object;
    /** Data adapter for mailchimp newsletter form data */
    mailchimp?: (formData: Object, action: string) => Object;
    /** Data adapter for csv form data */
    csv?: (formData: Object, action: string) => Object;
  };

  export type Checkers = {
    /** Checker to determine if the user wants to subscribe to the newsletter */
    newsletter?: (formData: Object) => boolean;
  };

  export type Instance = {
    $root: HTMLElement;
    $form: HTMLFormElement;
    $submit: HTMLButtonElement;
    action: string;
    destroy: () => void;
  };
}
