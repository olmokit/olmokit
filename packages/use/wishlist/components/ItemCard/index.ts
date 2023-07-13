// import { CartBtnAdd } from "components/Cart/BtnAdd";
// import { CartBtnRemove } from "components/Cart/BtnRemove";
import FormsSelectMaterial from "@olmokit/core/forms/select/material";
import { initItems } from "@olmokit/core/helpers/item";
import { initWishlist } from "@olmokit/core/wishlist";
// import { initCart } from "@olmokit/core/cart";
import { WishlistBtn } from "../Wishlist/Btn";
import "./index.scss";

/**
 * Component: ItemCard
 */
export function ItemCard() {
  initItems();
  initWishlist();
  // initCart();

  WishlistBtn();
  // CartBtnAdd();
  // CartBtnRemove();

  FormsSelectMaterial();
}
