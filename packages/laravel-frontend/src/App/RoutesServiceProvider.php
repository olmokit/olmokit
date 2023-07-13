<?php

namespace LaravelFrontend\App;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use LaravelFrontend\Helpers\Helpers;

class RoutesServiceProvider extends ServiceProvider
{
  /**
   * This namespace is applied to your controller routes.
   *
   * In addition, it is set as the URL generator's root namespace.
   *
   * @laravel-frontend This is set to an empty string to allow having route controllers
   * on a per route folder. That also requires to edit the composer.json
   * to autoload those "displaced" controllers' classes. For that we just use
   * ps-4 autoload convention where the namespace should follow the path
   * folder/file naming. This allows us to don't dump-autoload each time we
   * create a new route
   *
   * @see https://stackoverflow.com/a/35852279/1938970
   * @see https://bit.ly/33AXCbB
   * @see https://bit.ly/33AD3fh
   *
   * @var string
   */
  protected $namespace = '';

  /**
   * Define your route model bindings, pattern filters, etc.
   *
   * @return void
   */
  public function boot()
  {
    if (
      !($this->app instanceof CachesRoutes && $this->app->routesAreCached())
    ) {
      require __DIR__ . '/routes.php';

      Helpers::registerRoutes();

      $customRoutes = resource_path('routes/routes.php');

      if (file_exists($customRoutes)) {
        require $customRoutes;
      }
    }
  }
}
