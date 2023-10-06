import { AuthFormPasswordReset } from "@olmokit/core/auth/form-password-reset";
import "@olmokit/core/forms/checkbox";
import FormsInputMaterial from "@olmokit/core/forms/input/material";
import "./PasswordReset.scss";

/**
 * Component: AuthPasswordReset
 */
export function AuthPasswordReset($root?: HTMLElement) {
  FormsInputMaterial();
  AuthFormPasswordReset($root);
}
