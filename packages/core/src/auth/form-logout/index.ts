import { FormsBase, type FormsBaseOptions } from "../../forms/base";
import { AuthForm } from "../form";
import "./index.scss";

/**
 * Core: Auth Form Logout
 */
export function AuthFormLogout(
  $root?: HTMLElement,
  options: FormsBaseOptions = {},
) {
  AuthForm();
  return FormsBase($root, ".authFormLogout", options);
}

export default AuthFormLogout;
