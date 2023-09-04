<?php

namespace LaravelFrontend\Cms;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use LaravelFrontend\Cacher\CacherTags;
use LaravelFrontend\Helpers\Helpers;
use LaravelFrontend\I18n\I18n;
use LaravelFrontend\Auth\AuthApi;

class CmsApi
{
  public static $structure = null;

  /**
   * Either `null` or an associative `array` where keys are the `locale` codes
   */
  public static $translations = null;

  /**
   * CMS API GET request
   *
   * @param string $url
   * @param string $cacheKey
   * @param callable|null [$adapter=null]
   * @param callable|array $cacheTags
   * @return array|bool
   */
  public static function get(
    string $url = '',
    string $cacheKey = '',
    callable $adapter = null,
    $cacheTags = [CacherTags::data]
  ) {
    return Helpers::apiGet(
      $url,
      $cacheKey,
      $adapter,
      'env.CMS_API_CACHE',
      'array',
      $cacheTags
    );
  }

  /**
   * CMS API POST request
   *
   * @param string $url
   * @param array $requestBody Serializable body of the POST request
   * @param string $cacheKey
   * @param callable|null [$adapter=null]
   * @param callable|array $cacheTags
   * @return array|bool
   */
  public static function post(
    string $url = '',
    array $requestBody = [],
    string $cacheKey = '',
    callable $adapter = null,
    $cacheTags = [CacherTags::data]
  ) {
    return Helpers::apiPost(
      $url,
      $requestBody,
      $cacheKey,
      $adapter,
      'env.CMS_API_CACHE',
      'array',
      $cacheTags
    );
  }

  /**
   * Get CMS API endpoint URL
   *
   * @param string $endpoint The API endpoint path
   * @return string
   */
  public static function getEndpointUrl(string $endpoint = ''): string
  {
    return Helpers::getEndpointUrlApi($endpoint, 'env.CMS_API_URL');
  }

  /**
   * Get API data from remote server
   *
   * Generic public function to retrieve JSON data from the CMS Api with
   * opt-out cache. Returned data will be parsed as a PHP multidimensional
   * array. The endpoint can contain `{locale}/some-endpoint`, that will be
   * automatically interpolated to the current locale.
   *
   * @param string endpoint
   * @param bool $cache
   * @param callable|null [$adapter=null]
   * @param callable|array $cacheTags
   * @return boolean|array
   */
  public static function getData(
    string $endpoint = '',
    bool $cache = true,
    callable $adapter = null,
    $cacheTags = [CacherTags::data, CacherTags::custom]
  ) {
    $endpoint = str_replace('{locale}', App::getLocale(), $endpoint);
    $requestUrl = self::getEndpointUrl($endpoint);
    $cacheKey = $cache ? 'cmsapi.data.' . $requestUrl : '';

    $data = self::get($requestUrl, $cacheKey, $adapter, $cacheTags);

    return $data;
  }

  /**
   * POST data to remote server
   *
   * Generic public function to send JSON data to the CMS Api with
   * opt-out cache. Returned data will be parsed as a PHP multidimensional
   * array. The endpoint can contain `{locale}/some-endpoint`, that will be
   * automatically interpolated to the current locale.
   *
   * @param string endpoint
   * @param array $requestBody Serializable body of the POST request
   * @param bool $cache
   * @param callable|null [$adapter=null]
   * @param callable|array $cacheTags
   * @return boolean|array
   */
  public static function postData(
    string $endpoint = '',
    array $requestBody = [],
    bool $cache = true,
    callable $adapter = null,
    $cacheTags = [CacherTags::data, CacherTags::custom]
  ) {
    $endpoint = str_replace('{locale}', App::getLocale(), $endpoint);
    $requestUrl = self::getEndpointUrl($endpoint);
    $cacheKey = $cache ? 'cmsapi.data.' . $requestUrl : '';

    $data = self::post(
      $requestUrl,
      $requestBody,
      $cacheKey,
      $adapter,
      $cacheTags
    );

    return $data;
  }

  /**
   * Get all models with a certain model name. This is the conventional method
   * to use to retrieve all models data from Olmo CMS according to the
   * standardised endpoint `/{locale}/allmodel/{modelName}`.
   *
   * This methods help in the distinction of the cache tags. When using this
   * method we tag the cache with two additional tags other than the standard
   * `data`: `models` and `models.{modelName}`. The cache key instead simply
   * uses the `modelName` so that we can expose a simple hook URL in order to
   * empty the related models' cache.
   *
   * @param string $modelName
   * @param array $requestBody
   * @param string $locale
   * @param boolean $cache
   * @param callable|null $adapter
   * @param string $urlPrefix
   * @return void
   */
  public static function getAllModels(
    string $modelName = '',
    array $requestBody = [],
    string $locale = '',
    bool $cache = true,
    callable $adapter = null,
    string $urlPrefix = '/allmodel/'
  ) {
    $debug = false;
    // we do not pass an endpoint URL as argument but, to keep the api use
    // consistent, we still want to support the [debug] string interpolation
    // in the given modelName first argument. To achieve this we must manage
    // the interpolated flag here and add it to the constructed endpoint URL
    // in order to let the Helpers::post do its work with it later on
    if (Str::contains($modelName, '[debug]')) {
      $modelName = str_replace('[debug]', '', $modelName);
      $debug = true;
    }
    $locale = $locale ? $locale : App::getLocale();
    $endpoint = $locale . $urlPrefix . $modelName;
    $requestUrl = self::getEndpointUrl($endpoint);
    $cacheKey = $cache
      ? Helpers::getCacheKey('cmsapi.data.models.' . $endpoint)
      : '';

    if ($debug) {
      $requestUrl = "[debug]$endpoint";
    }

    $data = self::post($requestUrl, $requestBody, $cacheKey, $adapter, [
      CacherTags::data,
      CacherTags::models,
      CacherTags::model($modelName),
    ]);

    return $data;
  }

  /**
   * Request endpoint with authentication
   *
   * @param 'get'|'post'|'patch'|'put'|'delete' $method The request method
   * @param string $endpoint
   * @param null|array [$requestBody]
   * @return \Illuminate\Http\Client\Response
   */
  private static function requestWithAuth(
    string $method = 'get',
    string $endpoint = '',
    array $requestBody = []
  ) {
    $endpoint = str_replace('{locale}', App::getLocale(), $endpoint);
    $requestUrl = self::getEndpointUrl($endpoint);

    $response = AuthApi::requestWithAuth($method, $requestUrl, $requestBody);

    return $response;
  }

  /**
   * Get with authentication
   *
   * @param string $endpoint
   * @param null|array [$data]
   * @return \Illuminate\Http\Client\Response
   */
  public static function getWithAuth(string $endpoint, array $data = [])
  {
    return self::requestWithAuth('get', $endpoint, $data);
  }

  /**
   * Post with authentication
   *
   * @param string $endpoint
   * @param null|array [$data]
   * @return \Illuminate\Http\Client\Response
   */
  public static function postWithAuth(string $endpoint, array $data = [])
  {
    return self::requestWithAuth('post', $endpoint, $data);
  }

  /**
   * Patch with authentication
   *
   * @param string $endpoint
   * @param null|array [$data]
   * @return \Illuminate\Http\Client\Response
   */
  public static function patchWithAuth(string $endpoint, array $data = [])
  {
    return self::requestWithAuth('patch', $endpoint, $data);
  }

  /**
   * Put with authentication
   *
   * @param string $endpoint
   * @param null|array [$data]
   * @return \Illuminate\Http\Client\Response
   */
  public static function putWithAuth(string $endpoint, array $data = [])
  {
    return self::requestWithAuth('put', $endpoint, $data);
  }

  /**
   * Delete with authentication
   *
   * @param string $endpoint
   * @param null|array [$data]
   * @return \Illuminate\Http\Client\Response
   */
  public static function deleteWithAuth(string $endpoint, array $data = [])
  {
    return self::requestWithAuth('delete', $endpoint, $data);
  }

  /**
   * Get route's API data from remote server
   *
   * @param string slug
   * @param bool $cache
   * @param callable $adapter
   * @return boolean|array
   */
  public static function getRouteData(
    string $slug = '',
    bool $cache = true,
    callable $adapter = null
  ) {
    $requestUrl = self::getEndpointUrl($slug);
    $cacheKey = $cache ? 'cmsapi.route.' . $slug : '';

    $data = self::get($requestUrl, $cacheKey, $adapter, function ($routeData) {
      $cacheTags = [CacherTags::data, CacherTags::routes];

      if (isset($routeData['route']) && isset($routeData['route']['id'])) {
        $cacheTags[] = CacherTags::route($routeData['route']['id']);
      }
      return $cacheTags;
    });

    return $data;
  }

  /**
   * Get translations strings from API
   *
   * @return boolean|array
   */
  public static function getTranslations()
  {
    $locale = App::getLocale();

    if (self::$translations && isset(self::$translations[$locale])) {
      return self::$translations[$locale];
    }

    $requestUrl = self::getEndpointUrl("string-translations/$locale");
    $cacheKey = "cmsapi.translations.$locale";

    $data = self::get($requestUrl, $cacheKey, null, [
      CacherTags::data,
      CacherTags::translations,
      CacherTags::translation($locale),
    ]);

    $data = $data ? $data : [];

    self::$translations = self::$translations || [];
    self::$translations[$locale] = $data;

    return $data;
  }

  /**
   * Get structure information from API
   *
   * @return boolean|array
   */
  public static function getStructure()
  {
    if (self::$structure) {
      return self::$structure;
    }

    $requestUrl = self::getEndpointUrl('structure');
    $cacheKey = 'cmsapi.structure';

    $data = self::get($requestUrl, $cacheKey, null, [
      CacherTags::data,
      CacherTags::structure,
    ]);

    $data = $data ? $data : [];

    self::$structure = $data;

    return $data;
  }

  /**
   * Get routes information from API
   *
   * @return array
   */
  public static function getRoutes(): array
  {
    $structure = self::getStructure();

    if ($structure && isset($structure['routes'])) {
      return $structure['routes'];
    }

    return [];
  }

  /**
   * Get i18n information from API
   *
   * @return array
   */
  public static function getI18n(): array
  {
    $locales = config('laravel-frontend.i18n.locales');
    $defaultLocale = config('laravel-frontend.i18n.default_locale');

    $structure = self::getStructure();

    if ($structure && isset($structure['i18n'])) {
      $i18n = $structure['i18n'];
      // let's be sure that the API that does not return empty data
      $i18n['locales'] = $i18n['locales'] ?: $locales;
      $i18n['default_locale'] = $i18n['default_locale'] ?: $defaultLocale;
      return $i18n;
    }

    return [
      'locales' => $locales ?? [$defaultLocale],
      'default_locale' => $defaultLocale,
    ];
  }

  /**
   * Get assets information from API
   *
   * @return array
   */
  public static function getAssets(): array
  {
    $structure = self::getStructure();

    if ($structure && isset($structure['assets'])) {
      return $structure['assets'];
    }

    return [
      'media' => '/',
      'local' => '/',
    ];
  }

  /**
   * Get remote media base URL
   *
   * It returns the base media absolute URL normalising the initial/ending
   * slashes. An optional relative path to append can passed to construct the
   * desired full media URL.
   *
   * @param string $path Optional relative path to append to the media base URL
   * @param string $source Default ``, when `storage` it picks the `local` key
   * from the remote structure->assets object
   * @return string
   */
  public static function getMediaUrl(
    string $path = '',
    string $source = ''
  ): string {
    $key = $source == 'storage' ? 'local' : 'media';

    $url = rtrim(self::getAssets()[$key], '/');
    if ($path) {
      $url .= '/' . ltrim($path, '/');
    }

    return $url;
  }

  /**
   * Get analytics information from API according to current environment
   *
   * @return array
   */
  public static function getAnalytics(): array
  {
    $structure = self::getStructure();

    if ($structure && isset($structure['analytics'])) {
      $env = App::environment();

      // env local:
      if (config('env.DEVELOPMENT')) {
        $gtmHeader = '';
        $gtmBody = '';
      }
      // env production:
      elseif ($env === 'production' || $env === 'prod') {
        $gtmHeader = $structure['analytics']['gtm_header_prod'] ?? '';
        $gtmBody = $structure['analytics']['gtm_body_prod'] ?? '';
      }
      // env staging | dev:
      else {
        $gtmHeader = $structure['analytics']['gtm_header'] ?? '';
        $gtmBody = $structure['analytics']['gtm_body'] ?? '';
      }

      // clean up the parsed values and leave the rest, if anything...
      $analytics = \array_diff_key($structure['analytics'], [
        'gtm_header' => 1,
        'gtm_header_prod' => 1,
        'gtm_body_prod' => 1,
        'gtm_body' => 1,
      ]);

      // add the correct values, with different keys just to make it clear
      // that these values are not exactly the same as returned by the CMS
      $analytics['gtmHeader'] = $gtmHeader;
      $analytics['gtmBody'] = $gtmBody;

      return $analytics;
    }

    return [
      'gtmHeader' => '',
      'gtmBody' => '',
    ];
  }

  /**
   * Get meta information about the CMS API
   *
   * @return array
   */
  public static function getMeta(): array
  {
    $structure = self::getStructure();

    if ($structure && isset($structure['api'])) {
      return $structure['api'];
    }

    return [
      'name' => 'unknown',
      'version' => 'unknown',
    ];
  }

  /**
   * Get seo information from API according to current environment
   *
   * @return array
   */
  public static function getSeo(): array
  {
    $structure = self::getStructure();

    if ($structure && isset($structure['seo'])) {
      return $structure['seo'];
    }

    // index is true by default if there are more than one locale
    $defaultSitemapIndex = count(I18n::get()['locales']) > 1;

    return [
      'sitemap_index' => $defaultSitemapIndex,
    ];
  }

  /**
   * Get sitemap information from API /api/sitemap/sitemap
   *
   * @param string locale
   * @return array
   */
  public static function getSitemap(string $locale = ''): array
  {
    $sitemap = self::getData('/sitemap/' . $locale);

    return $sitemap;
  }

  /**
   * Get robots.txt content from API
   *
   * @return boolean|array
   */
  public static function getRobotsData()
  {
    $requestUrl = self::getEndpointUrl('robots.txt');
    $data = @file_get_contents($requestUrl);

    return $data;
  }

  /**
   * Get currently request route id reading the remote data under the `route.id`
   * key
   *
   * @return string
   */
  public static function getCurrentRequestRouteId()
  {
    $slug = Helpers::getCurrentRequestPath();
    $cacheKey = Helpers::getCacheKey("cmsapi.routeTemplate.$slug");

    if (Cache::has($cacheKey)) {
      return Cache::get($cacheKey);
    }

    $routeId = '';
    $routeData = self::getRouteData($slug, false);

    if (isset($routeData['route']) && isset($routeData['route']['id'])) {
      $routeId = $routeData['route']['id'];

      Cache::tags([
        CacherTags::data,
        CacherTags::structure,
        CacherTags::route($routeId),
      ])->put($cacheKey, $routeId);
    }

    return $routeId;
  }
}
