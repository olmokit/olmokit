<?php

namespace LaravelFrontend\App\Middleware;

use Illuminate\Http\Request;
use Closure;

class SeoNoindex
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
    $response = $next($request);
    // @see https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#xrobotstag
    // noindex, nofollow, noarchive, notranslate, noimageindex
    $response->header('X-Robots-Tag', 'none');
    return $response;
  }
}
