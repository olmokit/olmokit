<?php

namespace LaravelFrontend\Cacher;

use Illuminate\Support\Facades\Artisan;
use LaravelFrontend\Cacher\CacherTags;
use Illuminate\Support\Facades\Cache;

class Cacher
{
    /**
     * Clear all caches
     *
     * @return void
     */
    public static function clearAllCaches()
    {
        self::clearSystemCaches();
        self::clearCacheData();
        self::generateSystemCaches();
    }

    /**
     * Clear system caches
     *
     * We do not use `Artisan::call('optimize:clear');` because that also calls
     * `Artisan::call('cache:clear');` which we want to avoid as the `data` cache
     * is managed through tags.
     * @see https://github.com/swayok/alternative-laravel-cache
     * @see https://github.com/laravel/framework/blob/master/src/Illuminate/Foundation/Console/OptimizeClearCommand.php#L39-L43
     *
     * For OPcache we might use https://github.com/appstract/laravel-opcache
     *
     * @return string
     */
    public static function clearSystemCaches()
    {
        // clear opcache
        if (function_exists('opcache_reset')) {
            opcache_reset();
        }

        // clear laravel silber/page-cache
        Artisan::call('page-cache:clear');

        // clear and regenerate laravel caches
        Artisan::call('view:clear');
        Artisan::call('route:clear');
        Artisan::call('config:clear');
        Artisan::call('clear-compiled');

        return 'Cleared system cache.';
    }

    /**
     * Generate system caches, it regenerates laravel caches
     *
     * @return string
     */
    public static function generateSystemCaches()
    {
        Artisan::call('view:cache');
        Artisan::call('route:cache');
        Artisan::call('config:cache');

        return 'Generated system cache.';
    }

    /**
     * Clear the given cache tags (checking their existence)
     *
     * @param array $cacheTags
     * @return string
     */
    public static function clearCaches($cacheTags)
    {
        $tags = [];

        foreach ($cacheTags as $cacheTag) {
            if (CacherTags::exists($cacheTag)) {
                Artisan::call('cacher:clear ' . CacherTags::tag($cacheTag));
                $tags[] = $cacheTag;
            } else {
                throw new \Error(
                    "[Cacher]::clearCaches cach tag '$cacheTag' does not exists."
                );
            }
        }

        return count($tags)
            ? 'Cleared "' . implode(', ', $tags) . '" tagged cache.'
            : 'No tagged cache cleared.';
    }

    /**
     * Clear 'data' tagged cache
     *
     * NB: `structure`, `custom`, `models`, `routes` and `forms` all share the
     * `data` tag, so no need to clear those tags too here
     *
     * @return void
     */
    public static function clearCacheData()
    {
        // return self::clearCaches([CacherTags::data]);
        Artisan::call('cacher:clear ' . CacherTags::data);
    }

    /**
     * Clear 'structure' tagged cache
     *
     * @return void
     */
    public static function clearCacheStructure()
    {
        Artisan::call('cacher:clear ' . CacherTags::structure);
    }

    /**
     * Clear 'custom' tagged cache
     *
     * @return void
     */
    public static function clearCacheCustom()
    {
        Artisan::call('cacher:clear ' . CacherTags::custom);
    }

    /**
     * Clear 'models' tagged cache
     *
     * @return void
     */
    public static function clearCacheModels()
    {
        Artisan::call('cacher:clear ' . CacherTags::models);
    }

    /**
     * Clear single 'models.{modelName}' tagged cache
     *
     * @return void
     */
    public static function clearCacheModel(string $modelName = '')
    {
        // TODO: should it also clear all models cache?
        // self::clearCacheModels();

        Artisan::call('cacher:clear ' . CacherTags::model($modelName));
    }

    /**
     * Clear single 'routes.{routeId}' tagged cache (same as routeId)
     *
     * @return void
     */
    public static function clearCacheRoutes()
    {
        // clear laravel silber/page-cache
        Artisan::call('page-cache:clear');

        Artisan::call('cacher:clear ' . CacherTags::routes);
    }

    /**
     * Clear single 'routes.{routeId}' tagged cache (same as routeId)
     *
     * @return void
     */
    public static function clearCacheRoute(string $routeId = '')
    {
        Artisan::call('cacher:clear ' . CacherTags::route($routeId));
    }

    /**
     * Clear single 'singleRoute.{path}' no tagged cache just single route with cachekey
     * the $path option is the md5 crypted version of the route path
     *
     * @return void
     */
    public static function clearCacheSingleRoute(string $path = '')
    {
        Cache::forget($path);
        // Artisan::call('cacher:clear ' . CacherTags::singleRoute($path));
    }

    /**
     * Clear 'forms' tagged cache
     *
     * @return void
     */
    public static function clearCacheForms()
    {
        Artisan::call('cacher:clear ' . CacherTags::forms);
    }

    /**
     * Clear single 'forms.{formId}' tagged cache
     *
     * @return void
     */
    public static function clearCacheForm(string $formId = '')
    {
        Artisan::call('cacher:clear ' . CacherTags::form($formId));
    }

    /**
     * Clear 'img' tagged cache
     *
     * @return void
     */
    public static function clearCacheImg()
    {
        Artisan::call('cacher:clear ' . CacherTags::img);
    }

    /**
     * Clear all 'translations` or single 'translations.{locale}' tagged cache
     *
     * @return void
     */
    public static function clearCacheTranslations(string $locale = '')
    {
        if ($locale) {
            Artisan::call('cacher:clear ' . CacherTags::translation($locale));
        } else {
            Artisan::call('cacher:clear ' . CacherTags::translations);
        }
    }
}
