<?php

namespace LaravelFrontend\App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
// use Illuminate\Support\Facades\Exception;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\View;
use LaravelFrontend\Helpers\Helpers;

class Handler extends ExceptionHandler
{
  /**
   * A list of the exception types that are not reported.
   *
   * @var array
   */
  protected $dontReport = [
    //
  ];

  /**
   * A list of the inputs that are never flashed for validation exceptions.
   *
   * @var array
   */
  protected $dontFlash = ['password', 'password_confirmation'];

  /**
   * Register the exception handling callbacks for the application.
   *
   * @return void
   */
  public function register()
  {
  }

  /**
   * Render
   *
   * @laravel-frontend: here we don't follow standard behaviour, for SEO and
   * Analytics purposes we always redirect error pages to their specific
   * localised URLs.
   *
   * @see https://stackoverflow.com/a/58757887/1938970
   * @param [type] $request
   * @param Exception $exception
   * @return void
   */
  public function render($request, $exception)
  {
    if ($this->isHttpException($exception)) {
      $code = $exception->getStatusCode();
      $route = $code . '';
      $specialRoute = '';

      switch ($exception->getStatusCode()) {
        // ideal route is the login one
        case 403:
          $specialRoute = config('laravel-frontend.auth.routesMap.login');
          break;
        // special super static maintenance route
        case 503:
          View::share('data', []);
          View::share('route', '503');
          View::share('useBarba', false);
          View::share('langs', []);

          return Response::view('routes.Route503');
      }

      // check if there is a template for a special route to handle this
      // particular exception, e.g. the 403 error handling
      if ($specialRoute && Helpers::routeExists($specialRoute)) {
        return Redirect::to(to($specialRoute));
      }

      // check if there is a template for the ideal route, the route name
      // must match the exception code, if it exists use it
      if (Helpers::routeExists($route)) {
        return Redirect::to(to($route));
      }

      // otherwise let's assume there is 500 page template and try to
      // render it
      if (Helpers::routeExists('500')) {
        return Redirect::to(to('500'));
      }

      // otherwise return laravel exception view
      return $this->renderHttpException($exception);
    }

    return parent::render($request, $exception);
  }
}
