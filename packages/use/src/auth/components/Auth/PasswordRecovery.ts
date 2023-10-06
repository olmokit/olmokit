import { AuthFormPasswordRecovery } from "@olmokit/core/auth/form-password-recovery";
import "@olmokit/core/forms/checkbox";
import FormsInputMaterial from "@olmokit/core/forms/input/material";
import "./PasswordRecovery.scss";

/**
 * Component: AuthPasswordRecovery
 */
export function AuthPasswordRecovery($root?: HTMLElement) {
  FormsInputMaterial();
  AuthFormPasswordRecovery($root);
}
