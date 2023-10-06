import { updateFormsRedirectFromUrl } from "../redirect";
import { setTimezone } from "../timezone";

export function AuthForm() {
  setTimezone();
  updateFormsRedirectFromUrl();
}

export default AuthForm;
