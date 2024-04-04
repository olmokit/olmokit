<?php

namespace LaravelFrontend\App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Routing\Router;

class Kernel extends HttpKernel
{
    /**
     * Create a new HTTP kernel instance.
     *
     * @laravel-frontend see original contructor code at
     * https://github.com/laravel/framework/blob/9.x/src/Illuminate/Foundation/Http/Kernel.php#L106-L119
     * we add the initial if ztatement
     *
     * @param  \Illuminate\Contracts\Foundation\Application  $app
     * @param  \Illuminate\Routing\Router  $router
     * @return void
     */
    public function __construct(Application $app, Router $router)
    {
        if (class_exists('\resources\middlewares\Middlewares')) {
            $this->middleware = array_merge(
                $this->middleware,
                \resources\middlewares\Middlewares::$global,
            );
            $this->middlewareGroups = array_merge_recursive(
                $this->middlewareGroups,
                [
                    'web' => \resources\middlewares\Middlewares::$web,
                ],
            );
            $this->routeMiddleware = array_merge(
                $this->routeMiddleware,
                \resources\middlewares\Middlewares::$named,
            );
        }

        $this->app = $app;
        $this->router = $router;

        $this->syncMiddlewareToRouter();
    }

    protected $bootstrappers = [
        \Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables::class,
        \LaravelFrontend\Illuminate\Foundation\Bootstrap\LoadConfiguration::class,
        \Illuminate\Foundation\Bootstrap\HandleExceptions::class,
        \Illuminate\Foundation\Bootstrap\RegisterFacades::class,
        \Illuminate\Foundation\Bootstrap\RegisterProviders::class,
        \Illuminate\Foundation\Bootstrap\BootProviders::class,
    ];

    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array
     */
    protected $middleware = [
        // \LaravelFrontend\App\Http\Middleware\TrustHosts::class,
        // \LaravelFrontend\App\Http\Middleware\TrustProxies::class,
        // \Illuminate\Http\Middleware\Cors\HandleCors::class,
        \Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance::class,
        // \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        // \Illuminate\Foundation\Http\Middleware\TrimStrings::class,
        // \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \LaravelFrontend\App\Middleware\Base::class,
        \LaravelFrontend\I18n\Middleware::class,
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'web' => [
            \Illuminate\Cookie\Middleware\EncryptCookies::class, // @laravel-frontend: use default middleware instead one from custom App
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            // \Illuminate\Session\Middleware\AuthenticateSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class, // @laravel-frontend: use default middleware instead one from custom App
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        'api' => [
            'throttle:60,1',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        // @laravel-frontend:
        'web-optimize' => [
            \RenatoMarinho\LaravelPageSpeed\Middleware\RemoveComments::class,
            \RenatoMarinho\LaravelPageSpeed\Middleware\CollapseWhitespace::class,
        ],

        // @laravel-frontend:
        'meta' => [
            'throttle:60,1',
            \LaravelFrontend\Meta\MetaMiddleware::class,
            \LaravelFrontend\App\Middleware\SeoNoindex::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array
     */
    protected $routeMiddleware = [
        'page-cache' => \LaravelFrontend\App\Middleware\CacheResponse::class,
        'dev.only' => \LaravelFrontend\App\Middleware\DevOnly::class,
        'seo.noindex' => \LaravelFrontend\App\Middleware\SeoNoindex::class,
        'auth' => \LaravelFrontend\Auth\MiddlewareAuthOnly::class,
        'auth.activate' => \LaravelFrontend\Auth\MiddlewareActivate::class,
        'auth.unauthonly' => \LaravelFrontend\Auth\MiddlewareUnauthOnly::class,
        'checkout' => \LaravelFrontend\Cms\MiddlewareCheckout::class,
        'checkout-onepage' => \LaravelFrontend\Cms\MiddlewareCheckoutOnepage::class,

        // 'auth.verifiedonly' => \LaravelFrontend\Auth\MiddlewareVerifiedOnly::class,
        // 'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
        // 'auth' => \LaravelFrontend\App\Http\Middleware\Authenticate::class,
        // 'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        // 'auth.session' => \Illuminate\Session\Middleware\AuthenticateSession::class,
        // 'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
        // 'can' => \Illuminate\Auth\Middleware\Authorize::class,
        // 'guest' => \LaravelFrontend\App\Http\Middleware\RedirectIfAuthenticated::class,
        // 'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,
        // 'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        // 'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
    ];
}
