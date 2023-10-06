import type { Deferred } from "@olmokit/utils/Defer";
import { Emitter } from "@olmokit/utils/Emitter";

export type DialogOptions = {
  /** Identifier to recycle the DOM on close/open, setting this to a string will not destroy the Dialog DOM on close and reuse it on next open */
  id?: string;
  /** Template string with/without HTML to render in the dialog content */
  tpl?: string;
  /** Optional class name/s to add to the root dialog element */
  rootClass?: string;
  /**
   * Transition duration in `"ms"`
   *
   * @default 300
   */
  transition?: number;
  /** Fill gaps targets array, an iterable list of element to fill gaps of when locking scroll on dialog open */
  gaps?: HTMLElement[] | NodeListOf<HTMLElement>;
};

export type DialogInstance<CustomDialogInstance = {}> = CustomDialogInstance & {
  // ReturnType<typeof Dialog>;
  /** Optional dialog id */
  id?: string;
  /** Dialog root element */
  $root: HTMLElement;
  /** Dialog cage, useful reference because scrollLock acts on this element */
  $cage: HTMLElement;
  /** Dialog wrap, useful reference for custom animations on open/close */
  $wrap: HTMLElement;
  /** Dialog content, useful reference for dynamically rendered dialogs */
  $content: HTMLElement;
  /** Flags whether the diloag is currently opened or not */
  opened: boolean;
  /**
   * Promise interface to do things once the dialog will be open.
   * Useful when extending the dialog to set custom behaviours in a pre-open hook.
   */
  willOpen: Deferred<boolean>;
  /** Open dialog programmatically, `customData` will be passed to `opening` and `closed` opened */
  open: <TDataOpen extends DialogEventsData>(customData?: TDataOpen) => void;
  /** Close dialog programmatically, `customData` will be passed to `closing` and `closed` hooks */
  close: <TDataClose extends DialogEventsData>(
    event: Event,
    customData?: TDataClose,
  ) => void;
  /** Destroy the dialog, unbind its listeners */
  destroy: () => void;
  /** Renders a HTML string inside the dialog `$content` element */
  render: (content: string) => void;
  /** Add loading status (`is-loading` class on `$root` element) */
  load: () => void;
  /** Remove loading status (`is-loading` class on `$root` element) */
  loaded: () => void;
  /** Event listener for dialog events */
  on: ReturnType<typeof Emitter>["on"];
};

export type DialogHooks = {
  /** Called just after the dialog template has been appended to the DOM (if not already there) and listeners are binded */
  mounted?: (dialog: DialogInstance) => void;
  /** Called just after the dialog dynamic template (if any) has rendered */
  rendered?: (dialog: DialogInstance) => void;
  /** Called just before the dialog is closing */
  closing?: <T>(dialog: DialogInstance, customData: T) => void;
  /** Called just after the dialog has closed */
  closed?: <T>(dialog: DialogInstance, customData: T) => void;
  /** Called just before the dialog is opening */
  opening?: <T>(dialog: DialogInstance, customData: T) => void;
  /** Called just after the dialog has opened */
  opened?: <T>(dialog: DialogInstance, customData: T) => void;
};

export type DialogSkeleton = {
  $root: HTMLElement;
  $backdrop: HTMLElement;
  $cage: HTMLElement;
  $wrap: HTMLElement;
  $content: HTMLElement;
  $centerer?: HTMLElement;
  $loader?: HTMLElement;
};

export type DialogCreator = () => DialogSkeleton;

export type DialogEventsData = object;

export type DialogEvents = {
  /** Called just after the dialog template has been appended to the DOM (if not already there) and listeners are binded */
  mounted: DialogEventsData;
  /** Called just after the dialog dynamic template (if any) has rendered */
  rendered: DialogEventsData;
  /** Called just before the dialog is closing */
  closing: DialogEventsData;
  /** Called just after the dialog has closed */
  closed: DialogEventsData;
  /** Called just before the dialog is opening */
  opening: DialogEventsData;
  /** Called just after the dialog has opened */
  opened: DialogEventsData;
};
