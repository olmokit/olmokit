<?php

namespace LaravelFrontend\Img;

use Illuminate\Support\ServiceProvider;
use LaravelFrontend\Img\Img;

class ImgServiceProvider extends ServiceProvider
{
    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('img', function () {
            return new Img('', []);
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
