import { FormsBase, type FormsBaseOptions } from "../../forms/base";
import { AuthForm } from "../form";
import "./index.scss";

/**
 * Core: AuthFormPasswordReset
 */
export function AuthFormPasswordReset(
  $root?: HTMLElement,
  options: FormsBaseOptions = {},
) {
  AuthForm();
  return FormsBase($root, ".authFormPasswordReset", options);
}

export default AuthFormPasswordReset;
