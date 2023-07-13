import { AuthFormPasswordChange } from "@olmokit/core/auth/form-password-change";
import { AuthFormProfile } from "@olmokit/core/auth/form-profile";
import "@olmokit/core/forms/checkbox";
import FormsInputMaterial from "@olmokit/core/forms/input/material";
import FormsSelectMaterial from "@olmokit/core/forms/select/material";
import "./Profile.scss";

/**
 * Component: AuthProfile
 */
export function AuthProfile($root?: HTMLElement) {
  FormsInputMaterial();
  FormsSelectMaterial();
  AuthFormProfile($root);
  AuthFormPasswordChange($root);
}
