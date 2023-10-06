import { FormsBase, type FormsBaseOptions } from "../../forms/base";
import { AuthForm } from "../form";
import "./index.scss";

/**
 * Core: Auth Form PasswordChange
 */
export function AuthFormPasswordChange(
  $root?: HTMLElement,
  options: FormsBaseOptions = {},
) {
  AuthForm();
  return FormsBase($root, ".authFormPasswordChange", options);
}

export default AuthFormPasswordChange;
