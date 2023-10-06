/* eslint-disable no-var */

// using global instead of Window interface allows to use the variables without
// `window.`, not a best practice but it ease the usage
// declare interface Window {
declare global {
  /** Data exposed from the server through `<x-data />` */
  var __DATA: { [key: string]: any };

  /** Exposed localization dictionaries on global scope */
  var __i18n: { [key: string]: any };

  /** Google analytics `dataLayer` */
  var dataLayer: any[];

  /** Google tag manager `object` */
  var google_tag_manager: any;

  /** Google `tag` */
  var gtag: any;
}

// this is to make the `declare global` working
export {};
