<?php

namespace LaravelFrontend\Cms;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use LaravelFrontend\Auth\AuthApi;
use LaravelFrontend\Cms\CmsCart;
use LaravelFrontend\Helpers\Helpers;

class MiddlewareCheckout
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // first check that all the `auth` step data is valid
        if (!AuthApi::check()) {
            $routeTarget = CmsCheckout::getRoute('auth', true);
            if (!$request->routeIs($routeTarget['name'])) {
                return Redirect::to($routeTarget['url'], 302);
            }
        }

        $response = CmsCart::get();

        if ($response->successful()) {
            $cart = $response->json();

            $shippingId = $cart['addresses']['shipping'];
            $billingId = $cart['addresses']['billing'];
            $shippingMethod = $cart['selectedshippingmethod'] ?? [];
            $paymentMethod = $cart['selectedpaymentmethod'];

            // check that all the `details` step data is valid
            if (
                empty($shippingMethod) ||
                ($shippingMethod['requiredShippingAddress'] && !$shippingId) ||
                ($shippingMethod['requiredBillingAddress'] && !$billingId)
            ) {
                $routeTarget = CmsCheckout::getRoute('details', true);
                if (!$request->routeIs($routeTarget['name'])) {
                    return Redirect::to($routeTarget['url'], 302);
                }
                // check that all the `payment` step data is valid
            } elseif (!$paymentMethod) {
                $routeTarget = CmsCheckout::getRoute('payment', true);
                if (!$request->routeIs($routeTarget['name'])) {
                    return Redirect::to($routeTarget['url'], 302);
                }
            }
        } else {
            return Redirect::to('/');
        }

        return $next($request);
    }
}
