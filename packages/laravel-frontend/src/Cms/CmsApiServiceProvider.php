<?php

namespace LaravelFrontend\Cms;

use Illuminate\Support\ServiceProvider;
use LaravelFrontend\Cms\CmsApi;

class CmsApiServiceProvider extends ServiceProvider
{
    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('cmsapi', function () {
            return new CmsApi();
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(CmsApi $cmsApi)
    {
        $this->loadRoutesFrom(__DIR__ . '/routes.php');
    }
}
