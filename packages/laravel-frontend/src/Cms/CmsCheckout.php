<?php

namespace LaravelFrontend\Cms;

use LaravelFrontend\Helpers\Helpers;

class CmsCheckout
{
    /**
     * Get route name and localised url for the given type of feature
     *
     * @param "auth"|"details"|"payment"|"summary"|"completed" $type
     * @return void
     */
    public static function getRoute(string $type, bool $allInfo = false)
    {
        $route = config('laravel-frontend.checkout.routesMap')[$type];
        $routeName = Helpers::routeName($route);
        $url = to($route);
        return $allInfo ? ['name' => $routeName, 'url' => $url] : $url;
    }

    /**
     * Get the "middleware" like local action url, forms will be posted there
     *
     * @param "auth"|"shipping"|"payment"|"summary"|"completed" $type
     * @return void
     */
    public static function getLocalActionUrl(string $type)
    {
        return rtrim(config('env.APP_URL'), '/') .
            formatUrlPath("/_/cms/checkout/$type");
    }
}
