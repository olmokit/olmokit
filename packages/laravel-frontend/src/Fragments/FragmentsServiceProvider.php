<?php
namespace LaravelFrontend\Fragments;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;

class FragmentsServiceProvider extends ServiceProvider
{
  /**
   * Register any application services.
   *
   * @return void
   */
  public function register()
  {
    //
  }

  /**
   * Bootstrap any application services.
   *
   * @return void
   */
  public function boot()
  {
    if (
      !($this->app instanceof CachesRoutes && $this->app->routesAreCached())
    ) {
      $this->loadRoutesFrom(__DIR__ . '/routes.php');

      $fragmentsRoutes = fragments_path('routes.php');

      if (file_exists($fragmentsRoutes)) {
        Route::prefix('_/fragments')
          ->middleware(['web', 'seo.noindex'])
          ->group(function () {
            $this->loadRoutesFrom(fragments_path('routes.php'));
          });
      }
    }

    Blade::directive('fragment', function ($expression) {
      return "<?php if (isset(\$fragmentId) && \$fragmentId === {$expression}) { ?>";
    });
    Blade::directive('elsefragment', function () {
      return '<?php } else { ?>';
    });
    Blade::directive('endfragment', function () {
      return '<?php } ?>';
    });
  }
}
