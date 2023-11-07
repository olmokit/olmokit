<?php

namespace LaravelFrontend\App\Middleware;

use Illuminate\Http\Request;
use LaravelFrontend\Helpers\Helpers;
// use Illuminate\Support\Facades\Redirect;
use Closure;

class Base
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
        // manage trailing/untrailing slashes
        // $url = $request->fullUrl();
        // $urlMinusSlash = rtrim($url, '/');
        // // if (config('frontend.TRAILING_SLASH')) {}
        // if ($url === $urlMinusSlash) {
        //     return Redirect::to($url.'/', 301);
        // }

        // ensure that the routes map is always built upfront
        Helpers::getRoutesMap();

        return $next($request);
    }
}
