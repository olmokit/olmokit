import { Feature } from "@olmokit/cli/cli-laravel";

export class FeatureAuth extends Feature {
  description = "Basic scaffolding for apps with authentication.";

  routes() {
    return [
      {
        name: "login",
        alternativeNames: ["signin"],
      },
      {
        name: "passwordreset",
      },
      {
        name: "passwordrecovery",
      },
      {
        name: "register",
        alternativeNames: ["signup"],
      },
      {
        name: "profile",
        alternativeNames: ["account"],
      },
    ];
  }

  components() {
    return [{ name: "Auth" }];
  }

  middlewares() {
    return [];
  }
}

export default FeatureAuth;
