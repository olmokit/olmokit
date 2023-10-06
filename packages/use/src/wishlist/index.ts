import { Feature } from "@olmokit/cli/cli-laravel";

export class FeatureWishlist extends Feature {
  description = "Components to manage and interact with a wishlist.";

  routes() {
    return [];
  }

  components() {
    return [{ name: "Wishlist" }, { name: "ItemCard" }];
  }

  middlewares() {
    return [];
  }
}

export default FeatureWishlist;
