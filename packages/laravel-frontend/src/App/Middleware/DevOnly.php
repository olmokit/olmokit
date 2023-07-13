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
    if (App::environment() !== 'local') {
      abort(404);
    }

    return $next($request);
  }
}
