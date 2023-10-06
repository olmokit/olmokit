import Variant from "../variant/material";
import "./index";
import "./material.scss";

export default function FormsFileMaterial() {
  const variant = Variant(".file");

  return {
    destroy() {
      variant.destroy();
    },
  };
}
