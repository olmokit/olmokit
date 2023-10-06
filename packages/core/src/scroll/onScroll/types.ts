// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ScrollTrigger {
  export type Trigger = {
    add: (
      target: OnScroll.InitialiserTarget,
      options: OnScroll.Options,
    ) => Trigger;
    element: HTMLElement;
    target: any;
  };

  export type Target = any;

  export type Callback = (trigger?: Trigger) => void;

  export type Options = {
    once?: boolean;
    offset?: {
      viewport?: {
        x?: number | ((frame: any, direction: any) => number);
        y?: number | ((frame: any, direction: any) => number);
      };
      element?: {
        x?: number | ((rect: any, direction: any) => number);
        y?: number | ((rect: any, direction: any) => number);
      };
    };
    toggle?: {
      class?: {
        in?: string | string[];
        out?: string | string[];
      };
      callback?: {
        in?: Callback;
        visible?: Callback;
        out?: Callback;
      };
    };
  };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OnScroll {
  export type Trigger = ScrollTrigger.Trigger;

  export type Target = ScrollTrigger.Target;

  export type TriggerCallback = ScrollTrigger.Callback;

  export type TriggerOptions = ScrollTrigger.Options;

  /** Simplified options interface for `ScrollTrigger` */
  export type Options = {
    onin?: (element: HTMLElement) => any;
    onout?: (element: HTMLElement) => any;
    onchange?: (element: HTMLElement) => any;
    once?: boolean;
  };

  export type InitialiserTarget = string | HTMLElement;

  export type InitaliserOptions = Options["onin"] | (Options & TriggerOptions);

  export type Initaliser = (
    target: InitialiserTarget,
    optionsOrOnin: InitaliserOptions,
  ) => { trigger: Trigger; target: Target };
}
