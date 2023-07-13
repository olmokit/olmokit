<?php

namespace LaravelFrontend\App\Middleware;

use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Silber\PageCache\Middleware\CacheResponse as BaseCacheResponse;
use LaravelFrontend\Auth\AuthApi;

class CacheResponse extends BaseCacheResponse
{
  protected function shouldCache(Request $request, Response $response)
  {
    // don't cache pages if:
    // 1) the URL contains a query string
    // 2) we are developing locally
    // 3) user is authenticated
    if (
      $request->getQueryString() ||
      App::environment() === 'local' ||
      AuthApi::check()
    ) {
      return false;
    }

    return parent::shouldCache($request, $response);
  }
}
