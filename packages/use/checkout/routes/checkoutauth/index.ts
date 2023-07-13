/**
 * @file Route: checkoutauth
 *
 * This file is compiled as a standalone entrypoint and it is included by
 * default in its blade template.
 * This is a "standard" route, it does not have a structure to follow, you are
 * sure the DOM is always ready and the JS will only be executed in this route.
 */
import "layouts/main";
import { CheckoutSteps } from "../../components/Checkout/Steps";
// import { FormsAuth } from "../../components/FormsAuth";
import "./index.scss";

CheckoutSteps();
// FormsAuth();
