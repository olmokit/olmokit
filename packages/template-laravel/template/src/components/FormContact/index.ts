import "@olmokit/core/forms/checkbox";
import FormsInputMaterial from "@olmokit/core/forms/input/material";
// import FormsSelectMaterial from "@olmokit/core/forms/select/material";
import "@olmokit/core/forms/textarea/filled";
import { Olmoforms } from "@olmokit/core/olmoforms/feedback";
import "./index.scss";

/**
 * Component: FormContact
 *
 */
export function FormContact() {
  const olmoforms = Olmoforms(".FormContact:");

  FormsInputMaterial();

  return {
    destroy() {
      olmoforms.destroy();
    },
  };
}
