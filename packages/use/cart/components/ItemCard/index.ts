// import { initWishlist } from "@olmokit/core/wishlist";
import { initCart } from "@olmokit/core/cart";
import FormsSelectMaterial from "@olmokit/core/forms/select/material";
import { initItems } from "@olmokit/core/helpers/item";
// import { WishlistBtn } from "components/Wishlist/Btn";
import { CartBtnAdd } from "../Cart/BtnAdd";
import { CartBtnRemove } from "../Cart/BtnRemove";
import "./index.scss";

/**
 * Component: ItemCard
 */
export function ItemCard() {
  initItems();
  // initWishlist();
  initCart();

  // WishlistBtn();
  CartBtnAdd();
  CartBtnRemove();

  FormsSelectMaterial();
}
