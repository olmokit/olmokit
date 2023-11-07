<?php

namespace LaravelFrontend\Helpers;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Route;
use LaravelFrontend\Cacher\CacherTags;
use LaravelFrontend\Cms\CmsApi;
use LaravelFrontend\I18n\I18n;

class Helpers
{
    public static $routesMap;

    /**
     * Suffix this package version to a cache key to avoid inconsistencies
     * problem after updates
     *
     * We check that the class exists to support composer version 1
     *
     * @param string $input
     * @return string
     */
    public static function getVersionedKey(string $input = '')
    {
        $ver = class_exists('\Composer\InstalledVersions')
            ? \Composer\InstalledVersions::getVersion(
                    'olmo/laravel-frontend'
                ) ?? ''
            : '';

        return $input . '___v' . $ver;
    }

    /**
     * Utility to create a cache key given the input string. It allows us to
     * enable some app wide generic transforms.
     *
     * @param string $input
     * @param bool $versioned
     * @return string
     */
    public static function getCacheKey(
        string $input = '',
        bool $versioned = false
    ) {
        return $versioned ? self::getVersionedKey(md5($input)) : md5($input);
    }

    /**
     * Check if a route exists in the folder structure
     *
     * This allows to have routes that are completely static in the frontend
     * codebase without having a correspective data endpoint from the API
     *
     * @param string $route
     * @return bool
     */
    public static function routeExists(string $route = '')
    {
        if (
            $route &&
            file_exists(resource_path(self::routeView($route) . '.blade.php'))
        ) {
            return true;
        }

        return false;
    }

    /**
     * Get route name, it takes into account the locale prefix that might eventually
     * be prefixed to the route name/id.
     *
     * @param string $route
     * @return string
     */
    public static function routeName(string $route = '')
    {
        $hideDefaultLocaleUrl = config(
            'laravel-frontend.i18n.hide_default_locale_in_url'
        );
        if ($hideDefaultLocaleUrl) {
            return $route;
        }
        $currentLocale = App::getLocale();

        return $currentLocale . '.' . $route;
    }

    /**
     * Get route view path, defaults to the following path from root folder:
     * `/resources/routes/Route{$route}.blade.php`
     *
     * @return string
     */
    public static function routeView(string $route = '')
    {
        return 'routes/' . self::routeFilename($route, 'index');
    }

    /**
     * Guess route's class name
     *
     * @param string $route The route id/name/folder name, all coincides
     * @return string
     */
    public static function routeClassName(string $route = '')
    {
        $shortName = Str::ucfirst(Str::camel($route));
        return 'resources\\routes\\Route' . $shortName;
    }

    /**
     * Format route and given filename according to our routes's naming
     * convention
     *
     * @param string $route
     * @param string $srcFilename
     * @return string
     */
    public static function routeFilename(
        string $route = '',
        $srcFilename
    ): string {
        if ($srcFilename && $srcFilename !== 'index') {
            $route .= '_' . $srcFilename;
        }

        return 'Route' . Str::ucfirst(Str::camel($route));
    }

    /**
     * Transform route pattern from a `:dynamic-slug` syntax to laravel's
     * `{dynamic-slug?}
     *
     * @param string $path
     * @return string
     */
    private static function routePattern(string $path = '')
    {
        $output = '';
        $path = str_replace('//', '/', $path);

        foreach (explode('/', $path) as $part) {
            if (Str::startsWith($part, ':')) {
                $output .= '/{' . str_replace(':', '', $part) . '}';
            } else {
                $output .= '/' . $part;
                // $output .= $part;
            }
        }
        $output = formatUrlPath($output);

        return $output;
    }

    /**
     * Get route class name with fallback
     *
     * @param string $routeId
     * @return string
     */
    private static function getRouteClassName(string $routeId = '')
    {
        // get the right class name for this route's controller
        $class = self::routeClassName($routeId);
        // if it does not exist...
        if (!class_exists($class)) {
            // ...use a fallback Base controller
            $class = 'LaravelFrontend\App\Controllers\Base';
        }
        return $class;
    }

    /**
     * Get filesystem routes
     *
     * These are the routes determined byt folder structure, the array is build
     * up in the same shape as what returned by the `/structure` CMS API endpoint
     * under the key `routes`. We add the 'type' here, we also add it in the
     * getRoutesMap method above to the cms routes (= to 'cms')
     *
     * @return array
     */
    private static function getFsRoutes()
    {
        $routes = [];

        $i18n = I18n::get();
        $defaultLocale = $i18n['default_locale'];

        $files = glob(resource_path('routes') . '/*blade.php');

        foreach ($files as $filename) {
            $id = basename($filename);
            $id = str_replace('.blade.php', '', $id);
            $id = str_replace('Route', '', $id);
            $id = strtolower($id);

            // in "static mode" "home" means empty slug
            $slug = $id === 'home' ? '' : $id;
            $slugs = [];

            foreach ($i18n['locales'] as $locale) {
                $slugs[$locale] = $slug;
            }

            $routes[$id] = [
                'id' => $id,
                'type' => 'fs',
                'slug' => $slugs,
            ];
        }

        // dd($routes);

        return $routes;
    }

    /**
     * Build a map of the routes by route uniqe names merging the static ones
     * based on the folder structure and the remote ones defined by the CMS API.
     *
     * In this array each route must be of a particular shape, the routesMap
     * array will look like:
     *
     * ```php
     * [
     *   'uniqueroutename' => [
     *     'id' => 'uniqueroutename',
     *     'type' => 'fs' | 'cms', ('fs' stands for filesystem)
     *     'slug' => [
     *        'locale' => 'localised-url-with/:optional-dynamic-params'
     *     ]
     *   ]
     * ]
     * ```
     *
     * @return array
     */
    public static function getRoutesMap()
    {
        if (self::$routesMap) {
            return self::$routesMap;
        }

        $cacheKey = self::getCacheKey('helpers.routesMap', true);

        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $routesMap = [];

        // first determine the routes based on the folder structure
        $fsRoutes = self::getFsRoutes();

        // retrieve the ones defined remotely
        $cmsRoutes = CmsApi::getRoutes();

        // now first set the filesystem routes and then overwrite with those
        // defined in the cms api/structure response
        $routesMap = $fsRoutes;
        foreach ($cmsRoutes as $routeInfo) {
            $routeInfo['type'] = 'cms';
            $routesMap[$routeInfo['id']] = $routeInfo;
        }

        $routesMap = self::groupOverlappingRoutes($routesMap);

        $defaultLocale = I18n::get()['default_locale'];
        $enforceLocalisedUrls = config(
            'laravel-frontend.i18n.enforce_localised_urls'
        );
        $hideDefaultLocaleUrl = config(
            'laravel-frontend.i18n.hide_default_locale_in_url'
        );

        foreach ($routesMap as $routeId => $routeInfo) {
            // check if we need to add the locale to the URL path
            $addLocale = $enforceLocalisedUrls
                ? true
                : count($routeInfo['slug']) > 1;
            $rootRoute = false;

            // get the right class name for this route's controller
            $class = self::getRouteClassName($routeId);

            $routeInfo['class'] = $class;

            // now manage the localised slugs for this route
            foreach ($routeInfo['slug'] as $locale => $slug) {
                // allow the route to override its localised slug from its controller
                if (isset($class::$slug) && isset($class::$slug[$locale])) {
                    $slug = $class::$slug[$locale];
                }

                // we need to check if we are managing the default locale here
                if ($hideDefaultLocaleUrl && $locale === $defaultLocale) {
                    $addLocale = false;
                } else {
                    $addLocale = true;
                }

                // TODO: use config('env.URL_TRAILING_SLASH')
                $path = $addLocale ? "$locale/$slug" : $slug;
                $path = rtrim($path, '/') . '/';
                // determine the route name for laravel router
                $name = $addLocale ? "$locale.$routeId" : $routeId;
                $pattern = self::routePattern($path);
                // grab the first pattern piece, we need to check that it is not
                // a simple underscore as that marks the internal routes patterns
                // that should not be treated here. We are only interested in the
                // first pattern part if it is a dynamic portion, e.g. `{some-slug}`
                // and we clean it up of curly brackets and question marks
                // since we use it later with `->where(...)`
                $firstPatternPart = explode('/', $pattern)[1];
                $firstPatternPart = Str::contains($firstPatternPart, '{')
                    ? str_replace(['{', '}', '?'], '', $firstPatternPart)
                    : 0;

                // add the new data in the route map
                $routeInfo['slug'][$locale] = [
                    'name' => $name,
                    'path' => $path,
                    'pattern' => $pattern,
                    'firstPatternPart' => $firstPatternPart,
                    'slug' => $slug,
                ];

                $routeInfo['dynamic'] = str_starts_with($slug, ':');
            }

            $routesMap[$routeId] = $routeInfo;
        }

        // sort dynamic routes as last and static as first in order to make the
        // laravel router register our routes in the correct way: static pathnames
        // must be registered before dyamic ones.
        uasort($routesMap, fn($a, $b) => $a['dynamic'] <=> $b['dynamic']);

        self::$routesMap = $routesMap;

        // cache it
        Cache::tags([CacherTags::data, CacherTags::structure])->put(
            $cacheKey,
            $routesMap
        );

        return $routesMap;
    }

    /**
     * Get dynamic routes patterns
     *
     * This is a three steps operation, let's keep it in one function, but
     * follow the comments
     *
     * @param array $routesMap
     * @return void
     */
    private static function groupOverlappingRoutes($routesMap)
    {
        $buffer = [];
        $regexDynamic = '/:(.*?)\//m';

        // 1: First create a map of the dynamic pattern routes that are equal
        // among more than one route id
        foreach ($routesMap as $routeInfo) {
            $id = $routeInfo['id'];

            foreach ($routeInfo['slug'] as $locale => $path) {
                // add slashes to path to later simplify the regex and explode
                $path = preg_replace('#/+#', '/', "/$path/");

                // get the dynamic parts of the path, e.g. "my-slug" in
                // `/my-folder/:my-slug`
                preg_match_all($regexDynamic, $path, $matchesDynamic);

                // check that this path has at least one dynamic portion
                if (count($matchesDynamic)) {
                    // split the whole path in parts
                    $pathParts = array_filter(explode('/', $path), 'strlen');
                    // this will be the route pattern mask for this path
                    $pattern = '';
                    // idx to dynamically suffix multiple slugs in same path
                    $paramIdx = 0;

                    foreach ($pathParts as $part) {
                        $part = trim($part);
                        // detect a dynamic portion and add it to the route
                        // pattern it adds indexes if we have more than one slug
                        if (strpos($part, ':') === 0) {
                            $pattern .= '/:slug';
                            $pattern .= $paramIdx > 0 ? "-$paramIdx" : '';
                            $paramIdx++;
                        } else {
                            $pattern .= '/' . $part;
                        }
                    }

                    $buffer[$pattern] = $buffer[$pattern] ?? [
                        'ids' => [],
                        'slug' => [],
                    ];
                    $buffer[$pattern]['ids'][$id] = 1;
                    $buffer[$pattern]['type'] = $routeInfo['type'];
                    // TODO: maybe merge the slug here...is it needed?
                    $buffer[$pattern]['slug'] = $routeInfo['slug'];
                }
            }
        }

        // 2: First filter out unique route patterns, they do not need to be
        // grouped together as they differ in their static path portion.
        // Then add a "combined" unique route id for this route pattern, it will
        // be a string of the joined route ids, e.g. for two equal routes named
        // 'singleproduct' and 'singleservice' both of which have just '/:slug'
        // as their slug definition the route id will be
        // 'singleproduct|singleservice'
        // Finally flag the combined routes from the routesMap, we keep it in
        // the map as it is because it is still used to create dynamic links
        // but it won't be used in the `registerRoutes` function where we register
        // the actual route patterns into the laravel router.
        foreach ($buffer as $pattern => $patternData) {
            if (count($patternData['ids']) === 1) {
                unset($buffer[$pattern]);
            } else {
                $ids = array_keys($patternData['ids']);
                $patternData['id'] = implode('|', $ids);

                $buffer[$pattern] = $patternData;

                foreach ($ids as $id) {
                    $routesMap[$id]['inGroup'] = true;
                }
            }
        }

        // 3: Now normalise the array with the same shape as the `routes` array
        // retrieved bt the `/structure` CmsApi endpoint, which is also used by
        // the `getFsRoutes` when translating the local folders into the
        // routes map array. We add this combined route definition on the routes
        // map
        foreach ($buffer as $pattern => $patternData) {
            $routesMap[$patternData['id']] = [
                'id' => $patternData['id'],
                'grouped' => true,
                'slug' => $patternData['slug'],
            ];
        }

        return $routesMap;
    }

    /**
     * Dynamically register routes.
     *
     * @return void
     */
    public static function registerRoutes()
    {
        $router = app()->make('router');
        $routesMap = self::getRoutesMap();
        $middlewares = self::getWebMiddlewares();

        // dd($routesMap);

        foreach ($routesMap as $id => $data) {
            $home = false;
            $class = $data['class'];

            foreach ($data['slug'] as $slugData) {
                $slug = $slugData['slug'];
                $path = $slugData['path'];
                $name = $slugData['name'];
                $pattern = $slugData['pattern'];
                $firstPatternPart = $slugData['firstPatternPart'] ?? '';

                if ($slug) {
                    // grouped routes need to access the current route id from
                    // the CmsApi
                    if (isset($data['grouped'])) {
                        $route = $router
                            ->get($pattern, function () {
                                $routeId = CmsApi::getCurrentRequestRouteId();
                                $class = self::getRouteClassName($routeId);

                                return app()
                                    ->make($class)
                                    ->render();
                            })
                            ->name($name)
                            ->middleware($middlewares);
                        // normal routes instead get their class assigned upfront
                    } elseif (!isset($data['inGroup'])) {
                        $route = $router
                            ->get($pattern, [$class, 'render'])
                            ->name($name)
                            ->middleware($middlewares);
                    }

                    // where...because we don't to match patterns that start
                    // with /_/  as they are internal endpoints
                    if (isset($route) && $firstPatternPart) {
                        $route->where($firstPatternPart, '^(?!\_).+');
                    }
                } else {
                    // add special controller method handler for home page
                    if (!$home) {
                        $home = ['id' => $id, 'class' => $class];
                    }
                    // plus the usual localised route
                    $router
                        ->get($pattern, [$class, 'render'])
                        ->name($name)
                        ->middleware($middlewares);
                }
            }

            if ($home) {
                $router
                    ->get('/', [$home['class'], 'home'])
                    ->name($home['id'])
                    ->middleware($middlewares);
            }
        }
    }

    /**
     * Get the right 'web' middewares according to the environment
     *
     * @return string[]
     */
    public static function getWebMiddlewares()
    {
        return config('env.DEVELOPMENT') ? ['web'] : ['web-optimize', 'web'];
    }

    /**
     * Get request path for the current frontend requested URL
     *
     * When we do not enforce localised URLS and there is no valid slug in the
     * current URL request path we check if the option about hiding the default
     * locale in the URL is true and in that case we prefix the current requested
     * URL with the default locale
     *
     * @return string
     */
    public static function getCurrentRequestPath()
    {
        $slug = request()->path();
        $locale = I18n::extractLocaleFromPath($slug);
        $locale = I18n::isValidLocale($locale) ? $locale : '';

        if (
            !$locale &&
            config('laravel-frontend.i18n.hide_default_locale_in_url')
        ) {
            $locale = I18n::get()['default_locale'];
            $slug = $locale . '/' . $slug;

            // force set the locale in these occasions, otherwise the following
            // happens: I am visiting a website with two locales, English and
            // Italian, Italian is set as default and without a visible locale
            // in the URL (option `hide_default_locale_in_url`). My browser
            // is in English but I go directly to a page in Italian (e.g.
            // mywebsite.com/category-slug). This is a page whose URL structure
            // is shared by another route hence we get into this function because
            // the router does not know upfront which route template to render
            // for the given URL. We get here and we will use the default locale
            // Italian to retrieve the data from the CMS. That is correct. But
            // inside the I18nMiddleware the App locale has already been set
            // to my browser preference not having found a locale neither in the
            // URL nor in the Session. To correct this we override the App locale
            // here with the default one which is the one actually requested and
            // that this route will be presented with.
            App::setLocale($locale);
        }

        return $slug;
    }

    /**
     * Get Laravel internal endpoint URL (don't pass here an absolute URL!)
     *
     * Here we can set a standard for trailing/untrailing slash solely in
     * regards to the comunication with internal APIs. Now we follow the same
     * standard as in the public URLS and links by sing `formatUrlPath`
     *
     * @param string $endpoint The Laravel internal endpoint path
     * @return string
     */
    public static function getEndpointUrlInternal(string $endpoint = ''): string
    {
        $url = rtrim(config('env.APP_URL'), '/');

        return $url . formatUrlPath($endpoint);
    }

    /**
     * Get external API endpoint URL (don't pass here an absolute URL!)
     *
     * Here we can set a standard for trailing/untrailing slash solely in
     * regards to the comunication with external APIs. Now we enforce an
     * untrailing slash on all URLs.
     *
     * @param string $endpoint The API endpoint path
     * @param string $configEnvKey The env variable name that defines the url for this API
     * @return string
     */
    public static function getEndpointUrlApi(
        string $endpoint = '',
        string $configEnvKey = ''
    ): string {
        $url = rtrim(config($configEnvKey), '/');

        return $url . rtrim(str_replace('//', '/', "/$endpoint"), '/');
    }

    /**
     * Genric API GET request
     *
     * @param string $url
     * @param string $cacheKey
     * @param Callable|null $adapter
     * @param string $configEnvCacheKey The env variable name that defines if the cache for this API is enabled
     * @param string $parseDataAs Either 'array' or 'object' (sdtClass like)
     * @param callable|array $cacheTags
     * @return array|bool
     */
    public static function apiGet(
        string $url = '',
        string $cacheKey = '',
        callable $adapter = null,
        string $configEnvCacheKey = '',
        string $parseDataAs = 'array',
        $cacheTags = [CacherTags::data]
    ) {
        $debug = false;

        $cacheKey = $cacheKey ? self::getCacheKey($cacheKey) : '';

        if (Str::contains($url, '[debug]')) {
            $url = str_replace('[debug]', '', $url);
            $debug = true;
        }

        if (config($configEnvCacheKey) && $cacheKey && Cache::has($cacheKey)) {
            $data = Cache::get($cacheKey);
        } else {
            // $response = Http::get($url);
            $response = @file_get_contents($url);

            if (!$response) {
                // if ($response->failed()) {
                $data = false;
            } elseif ($response) {
                // else if ($response->successful()) {
                // dd($response);
                if ($parseDataAs == 'array') {
                    // $data = $response->json();
                    $data = json_decode($response, true);
                } else {
                    // $data = json_decode(json_encode($response->json()));
                    $data = json_decode(json_encode($response));
                }

                // allow to apply manual transformations before putting into
                // cache
                if ($adapter) {
                    $data = $adapter($data);
                }

                if ($cacheKey) {
                    $cacheTags = is_array($cacheTags)
                        ? $cacheTags
                        : $cacheTags($data);
                    Cache::tags($cacheTags)->put($cacheKey, $data);
                }
            }
        }

        if ($debug) {
            dd($url, $data);
        }

        return $data;
    }

    /**
     * Genric API POST request
     *
     * @param string $url
     * @param array $requestBody Serializable body of the POST request
     * @param string $cacheKey
     * @param Callable|null $adapter
     * @param string $configEnvCacheKey The env variable name that defines if the cache for this API is enabled
     * @param string $parseDataAs Either 'array' or 'object' (sdtClass like)
     * @param callable|array $cacheTags
     * @return array|bool
     */
    public static function apiPost(
        string $url = '',
        array $requestBody = [],
        string $cacheKey = '',
        callable $adapter = null,
        string $configEnvCacheKey = '',
        string $parseDataAs = 'array',
        $cacheTags = [CacherTags::data]
    ) {
        $debug = false;

        if (Str::contains($url, '[debug]')) {
            $url = str_replace('[debug]', '', $url);
            $debug = true;
        }

        $cacheKey = $cacheKey
            ? hash('ripemd160', $cacheKey . ':body=' . serialize($requestBody))
            : '';
        $cacheKey = $cacheKey ? self::getCacheKey($cacheKey) : '';

        if (config($configEnvCacheKey) && $cacheKey && Cache::has($cacheKey)) {
            $data = Cache::get($cacheKey);
        } else {
            $response = Http::post($url, $requestBody);

            if ($response->failed()) {
                $data = false;
            } elseif ($response->successful()) {
                // dd($response);
                if ($parseDataAs == 'array') {
                    $data = $response->json();
                } else {
                    $data = json_decode(json_encode($response->json()));
                }

                // allow to apply manual transformations before putting into
                // cache
                if ($adapter) {
                    $data = $adapter($data);
                }

                if ($cacheKey) {
                    $cacheTags = is_array($cacheTags)
                        ? $cacheTags
                        : $cacheTags($data);
                    Cache::tags($cacheTags)->put($cacheKey, $data);
                }
            }
        }

        if ($debug) {
            dd($url, $requestBody, $data);
        }

        return $data;
    }

    /**
     * Strip given param names from URL (absolute)
     *
     * @param string $url
     * @param array $params
     * @return string
     */
    public static function stripParamsFromUrl(
        string $url = '',
        array $params = []
    ): string {
        $output = $url;
        $parsed = parse_url($url);

        if (isset($parsed['query'])) {
            $output = strtok($url, '?');
            $queryOld = $parsed['query'];
            parse_str($queryOld, $parameters);

            foreach ($params as $param) {
                unset($parameters[$param]);
            }

            $queryNew = http_build_query($parameters);
            $output .= $queryNew ? '?' . $queryNew : '';
        }

        return $output;
    }

    /**
     * Flash session in a coherent way
     *
     * @param string $namespace
     * @param string $msgRaw
     * @param string $msgKey
     * @return void
     */
    public static function flashStatus(
        string $namespace = '',
        string $msgRaw = '',
        string $msgKey = ''
    ) {
        $value = $msgRaw ? "[raw][key=$msgKey]$msgRaw" : $msgKey;
        Session::flash($namespace . '_status', $value);
    }

    /**
     * Get current route name without locale, either if that is included (e.g. `en.singlepage`) or not (single language websites).
     *
     * TODO: use it also at https://github.com/olmokit/olmokit/-/blob/master/packages/laravel-frontend/src/App/Controllers/Base.php#L402
     */
    public static function getCurrentRouteName()
    {
        $localePrefix = App::getLocale() . '.';
        $route = Route::currentRouteName();
        if (substr($route, 0, strlen($localePrefix)) == $localePrefix) {
            $route = substr($route, strlen($localePrefix));
        }
        return $route;
    }
}
