<?php

namespace LaravelFrontend\Auth;

use Illuminate\Support\ServiceProvider;
use LaravelFrontend\Auth\AuthApi;

class AuthApiServiceProvider extends ServiceProvider
{
  /**
   * Register the application services.
   *
   * @return void
   */
  public function register()
  {
    $this->app->singleton('authapi', function ($app) {
      return new AuthApi();
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
