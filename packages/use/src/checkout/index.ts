import { Feature } from "@olmokit/cli/cli-laravel";

export class FeatureCheckout extends Feature {
  description = "E-commerce checkout scaffolding";

  routes() {
    return [
      {
        name: "checkoutauth",
      },
      {
        name: "checkoutdetails",
      },
      {
        name: "checkoutpayment",
      },
      {
        name: "checkoutsummary",
      },
      {
        name: "checkoutcompleted",
      },
    ];
  }

  components() {
    return [{ name: "Checkout" }];
  }

  middlewares() {
    return [];
  }
}

export default FeatureCheckout;
