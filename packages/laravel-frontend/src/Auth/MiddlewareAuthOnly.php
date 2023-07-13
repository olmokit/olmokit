<?php

namespace LaravelFrontend\Auth;

use Closure;
use Illuminate\Http\Request;
use LaravelFrontend\Auth\AuthApi;

class MiddlewareAuthOnly
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
    // redirect if unauthenticated
    if (!AuthApi::check()) {
      AuthApi::setLoginRedirect($request->url());
      abort(403);
    }

    return $next($request);
  }
}
