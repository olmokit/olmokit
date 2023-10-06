declare interface Window {
  /** Configuration data related to the server environment exposed by the build script. */
  __CONFIG: {
    /** Base application URL (value coming server side) */
    baseUrl: string;
    /** CMS Api base URL (value coming server side) */
    cmsApiUrl: string;
    /** Media remote base URL (value coming server side) */
    mediaUrl: string;
    /** Assets URL (where all frontend generated assets live, probably a subfolder
     * of the publich path, if a CDN is used this will be an absolute URL) */
    assetsUrl: string;
    /** The current locale as it comes from Laravel's `App::getLocale()` */
    locale: string;
    /** It indicates whether the current route is served by `page-cache` */
    cached: boolean;
    /** It indicates whether the user is authenticated or not, `null` if it is not determinable, e.g. with `page-cache` */
    authenticated: boolean | null;
    /** It indicates whether we have a guest user or not, `null` if it is not determinable, e.g. with `page-cache` */
    guest: boolean | null;
  };
}
