import { pathsFrontend as frontend } from "./frontend.js";
import { pathsLaravel as laravel } from "./laravel.js";
import { pathsSelf as self } from "./self.js";

/**
 * Paths of the projects's using this package
 */
export const paths = {
  /**
   * Frontend paths
   */
  frontend,
  /**
   * Laravel paths
   */
  laravel,
  /**
   * This cli's (context-aware) self paths
   */
  self,
};
