import { $ } from "@olmokit/dom";
import { hasGtm } from "@olmokit/core/analytics";
import { AuthFormLogin } from "@olmokit/core/auth/form-login";
import "@olmokit/core/forms/checkbox";
import FormsInputMaterial from "@olmokit/core/forms/input/material";
import "./Login.scss";

/**
 * Component: AuthLogin
 */
export function AuthLogin($root?: HTMLElement) {
  $root = $root ? $<HTMLElement>(".AuthLogin:", $root) : $root;
  const $error = $(".error", $root);

  FormsInputMaterial();

  AuthFormLogin($root, {
    succeded: (formData, instance, response) => {
      $error.innerHTML = response?.data?.msg || "";

      const {
        id,
        password,
        token,
        token_active,
        end_session,
        ...userTrackData
      } = response.data.user;

      if (hasGtm()) {
        window.dataLayer.push({
          ...userTrackData,
          userId: id,
          event: "form sended",
          form: "Login",
          eventCallback: function () {
            location.href = response.data.redirect;
          },
          eventTimeout: 2000,
        });
      } else {
        location.href = response.data.redirect;
      }
    },
    failed: (formData, instance, response) => {
      $error.innerHTML = response.data;
      setTimeout(() => {
        $error.innerHTML = "";
      }, 3000);
    },
  });
}
