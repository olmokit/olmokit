import { Feature } from "@olmokit/cli/cli-laravel";

export class FeatureCheckout extends Feature {
  description = "E-commerce cart scaffolding";

  routes() {
    return [];
  }

  components() {
    return [{ name: "Cart" }, { name: "ItemCard" }];
  }

  middlewares() {
    return [];
  }
}

export default FeatureCheckout;
