import { addressOn } from "@olmokit/core/address";
import { AddressBtnRemove } from "./BtnRemove";
import { AddressBtnSetDefault } from "./BtnSetDefault";

/**
 * Component: AddressList
 */
export function AddressList() {
  AddressBtnRemove();
  AddressBtnSetDefault();

  addressOn("remove:ok", (data) => {
    data?.$item.remove();
  });

  addressOn("setdefault:ok", () => {
    location.reload();
  });
}
