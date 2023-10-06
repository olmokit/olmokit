import { Feature } from "@olmokit/cli/cli-laravel";

export class FeatureAddress extends Feature {
  description = "Manage shipping/billing addresses.";

  routes() {
    return [];
  }

  components() {
    return [{ name: "Address" }];
  }

  middlewares() {
    return [];
  }
}

export default FeatureAddress;
