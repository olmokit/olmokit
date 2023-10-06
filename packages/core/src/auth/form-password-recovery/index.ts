import { FormsBase, type FormsBaseOptions } from "../../forms/base";
import { AuthForm } from "../form";
import "./index.scss";

/**
 * Core: AuthFormPasswordRecovery
 */
export function AuthFormPasswordRecovery(
  $root?: HTMLElement,
  options: FormsBaseOptions = {},
) {
  AuthForm();
  return FormsBase($root, ".authFormPasswordRecovery", options);
}

export default AuthFormPasswordRecovery;
