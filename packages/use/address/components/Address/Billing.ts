// import { $ } from "@olmokit/dom";
import { AddressFormBilling } from "@olmokit/core/address/form";
import FormsInputMaterial from "@olmokit/core/forms/input/material";
import FormsSelectMaterial from "@olmokit/core/forms/select/material";
import "./Billing.scss";

/**
 * Component: AddressBilling
 */
export function AddressBilling($root?: HTMLElement) {
  AddressFormBilling($root);
  FormsInputMaterial();
  FormsSelectMaterial();
}
