<?php

namespace LaravelFrontend\Cms;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use LaravelFrontend\Auth\AuthApi;
use LaravelFrontend\Cms\CmsCart;
use LaravelFrontend\Helpers\Helpers;

class MiddlewareCheckoutOnepage
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
        $route = config('laravel-frontend.auth.actionEndpoints')['login'];
        $routeName = Helpers::routeName($route);
        $url = to($route);
        $redir = ['name' => $routeName, 'url' => $url];        

        if (!AuthApi::check()) {
            if (!$request->routeIs($redir['name'])) {
                return Redirect::to($redir['url']);
            }
        }

        $response = CmsCart::get();

        if ($response->successful()) {
            $cart = $response->json();

            $shippingId = $cart['addresses']['shipping'];
            $billingId = $cart['addresses']['billing'];
            $shippingMethod = $cart['selectedshippingmethod'] ?? [];
            $paymentMethod = $cart['selectedpaymentmethod'];

        } else {
            return Redirect::to($redir['url']);
        }

        return $next($request);
    }
}
