<?php

namespace LaravelFrontend\Forms\Olmoforms;

use Illuminate\Support\ServiceProvider;
use LaravelFrontend\Forms\Olmoforms\Olmoforms;

class OlmoformsServiceProvider extends ServiceProvider
{
  /**
   * Register the application services.
   *
   * @return void
   */
  public function register()
  {
    $this->app->singleton('olmoforms', function ($app) {
      return new Olmoforms($app);
    });
  }

  /**
   * Bootstrap any package services.
   *
   * @return void
   */
  public function boot()
  {
    $this->loadRoutesFrom(__DIR__ . '/routes.php');
  }
}
