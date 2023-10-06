import { hydrateCart } from "@olmokit/core/cart";
import { hydrateWishlist } from "@olmokit/core/wishlist";
import "./Preview.scss";

/**
 * Component: CartPreview
 */
export function CartPreview() {
  hydrateWishlist(".CartPreview:");
  hydrateCart(".CartPreview:");
}
