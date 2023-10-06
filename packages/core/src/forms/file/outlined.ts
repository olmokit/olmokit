import Variant from "../variant/outlined";
import "./index";
import "./outlined.scss";

export default function FormsFileOutlined() {
  const variant = Variant(".file");

  return {
    destroy() {
      variant.destroy();
    },
  };
}
