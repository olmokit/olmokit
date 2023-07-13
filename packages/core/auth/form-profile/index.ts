import { FormsBase, type FormsBaseOptions } from "../../forms/base";
import { AuthForm } from "../form";
import "./index.scss";

/**
 * Core: AuthFormProfile
 */
export function AuthFormProfile(
  $root?: HTMLElement,
  options: FormsBaseOptions = {}
) {
  AuthForm();
  return FormsBase($root, ".authFormProfile", options);
}

export default AuthFormProfile;
