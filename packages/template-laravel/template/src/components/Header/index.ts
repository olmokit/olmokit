import "components/Hamburger";
import { I18nLinks } from "@olmokit/core/i18n/links";
import { Header as BaseHeader } from "@olmokit/components/Header";
// import "utils/logo.scss";
import "./index.scss";

/**
 * Component: Header
 *
 */
export function Header() {
  const header = BaseHeader();
  I18nLinks();

  return {
    /**
     * Set variant
     *
     * @param {"light" | "dark"} variant
     */
    setVariant(variant) {
      const { className } = header.$root;
      header.$root.className = className.replace(
        /(is-).+(\s*)/,
        `$1${variant}$2`
      );
    },
  };
}
