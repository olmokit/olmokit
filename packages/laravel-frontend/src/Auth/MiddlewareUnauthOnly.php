<?php

namespace LaravelFrontend\Auth;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use LaravelFrontend\Auth\AuthApi;
use LaravelFrontend\Helpers\Helpers;

class MiddlewareUnauthOnly
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
        // redirect if authenticated
        if (AuthApi::check()) {
            $route = config('laravel-frontend.auth.routesMap.profile');
            $hasRoute = Helpers::routeExists($route);
            if ($hasRoute) {
                return Redirect::to(to($route), 302);
            }
        }

        return $next($request);
    }
}
