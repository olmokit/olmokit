import { $ } from "@olmokit/dom";
import { hasGtm } from "@olmokit/core/analytics";
import { AuthFormRegister } from "@olmokit/core/auth/form-register";
import "@olmokit/core/forms/checkbox";
import FormsInputMaterial from "@olmokit/core/forms/input/material";
import FormsSelectMaterial from "@olmokit/core/forms/select/material";
import "./Register.scss";

/**
 * Component: AuthRegister
 */
export function AuthRegister($root?: HTMLElement) {
  $root = $root ? $<HTMLElement>(".AuthRegister:", $root) : $root;
  const $error = $(".error", $root);

  FormsInputMaterial();
  FormsSelectMaterial();

  AuthFormRegister($root, {
    succeded: (formData, instance, response) => {
      $error.innerHTML = response.data.msg || "";

      const {
        password,
        passwordcheck,
        _redirect,
        _timezone_offset,
        _token,
        ...userTrackData
      } = formData;

      if (hasGtm()) {
        window.dataLayer.push({
          ...userTrackData,
          userId: response.data?.user?.id,
          event: "form sended",
          form: "Sign Up",
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
