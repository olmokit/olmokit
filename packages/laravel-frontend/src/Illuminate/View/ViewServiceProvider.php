<?php

namespace LaravelFrontend\Illuminate\View;

use Illuminate\View\ViewServiceProvider as Base;
use LaravelFrontend\Illuminate\View\Compilers\BladeCompiler;

class ViewServiceProvider extends Base
{
    /**
     * Register the Blade compiler implementation.
     *
     * @return void
     */
    public function registerBladeCompiler()
    {
        $this->app->singleton('blade.compiler', function ($app) {
            return tap(
                new BladeCompiler(
                    $app['files'],
                    $app['config']['view.compiled'],
                    $app['config']->get('view.relative_hash', false)
                        ? $app->basePath()
                        : '',
                    $app['config']->get('view.cache', true),
                    $app['config']->get('view.compiled_extension', 'php')
                ),
                function ($blade) {
                    $blade->component(
                        'dynamic-component',
                        DynamicComponent::class
                    );
                }
            );
        });
    }
}
