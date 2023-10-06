import { FormsBase, type FormsBaseOptions } from "../../forms/base";
import { AuthForm } from "../form";
import "./index.scss";

/**
 * Core: Auth Form Login
 */
export function AuthFormLogin(
  $root?: HTMLElement,
  options: FormsBaseOptions = {},
) {
  AuthForm();
  return FormsBase($root, ".authFormLogin", options);
}

export default AuthFormLogin;
