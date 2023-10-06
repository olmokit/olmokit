// import { $ } from "@olmokit/dom";
import { AddressFormShipping } from "@olmokit/core/address/form";
import FormsInputMaterial from "@olmokit/core/forms/input/material";
import FormsSelectMaterial from "@olmokit/core/forms/select/material";
import "./Shipping.scss";

/**
 * Component: AddressShipping
 */
export function AddressShipping($root?: HTMLElement) {
  AddressFormShipping($root);
  FormsInputMaterial();
  FormsSelectMaterial();
}
