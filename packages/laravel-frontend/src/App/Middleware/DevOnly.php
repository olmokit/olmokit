<?php

namespace LaravelFrontend\App\Middleware;

use Illuminate\Support\Facades\App;
use Closure;

class DevOnly
{
  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @return mixed
   */
  public function handle($request, Closure $next)
  {
    if (!config('env.DEVELOPMENT')) {
      abort(404);
    }

    return $next($request);
  }
}
