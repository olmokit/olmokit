<?php

namespace LaravelFrontend\I18n;

use Illuminate\Support\ServiceProvider;
use LaravelFrontend\I18n\I18n;

class I18nServiceProvider extends ServiceProvider
{
  /**
   * Register the application services.
   *
   * @return void
   */
  public function register()
  {
    $this->app->singleton('i18n', function ($app) {
      return new I18n($app);
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
