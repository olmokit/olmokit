import { FormsBase, type FormsBaseOptions } from "../../forms/base";
import { AuthForm } from "../form";
import "./index.scss";

/**
 * Core: AuthFormRegister
 */
export function AuthFormRegister(
  $root?: HTMLElement,
  options: FormsBaseOptions = {}
) {
  AuthForm();
  return FormsBase($root, ".authFormRegister", options);
}

export default AuthFormRegister;
