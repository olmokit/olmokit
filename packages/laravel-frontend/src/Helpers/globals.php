<?php

if (!function_exists('formatUrl')) {
  /**
   * Format URL (absolute)
   *
   * Here we can set a standard for trailing/untrailing slash and, eventually,
   * make it optional. Now we enforce a trailing slash on all URLs.
   *
   * @param string $url
   * @return string
   */
  function formatUrl(string $url = ''): string
  {
    $parts = explode('?', $url);
    // TODO: use config('env.URL_TRAILING_SLASH')
    $pre = rtrim($parts[0], '/') . '/';

    return isset($parts[1]) ? $pre . '?' . $parts[1] : $pre;
  }
}

if (!function_exists('formatUrlPath')) {
  /**
   * Format URL path (don't pass here an absolute URL!)
   *
   * Here we can set a standard for trailing/untrailing slash and, eventually,
   * make it optional. Now we enforce a trailing slash on all URLs.
   *
   * @param string $path
   * @return string
   */
  function formatUrlPath(string $path = ''): string
  {
    // TODO: use config('env.URL_TRAILING_SLASH')
    return preg_replace('#/+#', '/', "/$path/");
  }
}

if (!function_exists('linkUrl')) {
  /**
   * Link URL
   *
   * @param string $slug
   * @param string|null $locale
   * @return string
   */
  function linkUrl(string $slug = '', $locale = ''): string
  {
    $baseUrl = config('env.APP_URL');
    $prefix = $locale ? \LaravelFrontend\I18n\I18n::getUrlPrefix($locale) : '';
    return rtrim($baseUrl, '/') . formatUrlPath($prefix . $slug);
  }
}

if (!function_exists('media')) {
  /**
   * Helper to output a an absolute URL to remote media file
   *
   * @see \LaravelFrontend\Cms\CmsApi::getMediaUrl
   * @param string $path
   * @return string
   */
  function media(string $path = ''): string
  {
    return \LaravelFrontend\Cms\CmsApi::getMediaUrl($path);
  }
}

if (!function_exists('assets')) {
  /**
   * Helper to output the URL where the frontend managed assets live
   *
   * @see \LaravelFrontend\Cms\CmsApi::getMediaUrl
   * @param string $path Optional relative path to append to the assets base URL
   * @return string
   */
  function assets(string $path = ''): string
  {
    // append the `/assets` path, TODO: it'd be better to not hardcode this
    $url = rtrim(config('env.PUBLIC_URL'), '/') . '/assets/';
    if ($path) {
      $url .= ltrim($path, '/');
    }
    return $url;
  }
}

if (!function_exists('to')) {
  /**
   * To, link generator helper function
   *
   * @param string $route The unique route name
   * @return string
   */
  function to($route, $args = []): string
  {
    $locale = app()->getLocale();

    // this should not happen but let's check it anwyway
    if (!$locale) {
      $locale = \LaravelFrontend\I18n\I18n::get()['default_locale'];
    }

    if (
      // don't put checks here, assume that the developer create a link
      // with a known route id/name, if it doesn't it's right to badly throw
      $routeInfo = \LaravelFrontend\Helpers\Helpers::getRoutesMap()[$route]
    ) {
      // get the path from the routes structure using the current locale
      $path = $routeInfo['slug'][$locale]['path'] ?? '';

      foreach ($args as $key => $value) {
        $path = str_replace(":$key", $value, $path);
      }
      return linkUrl($path);
    }

    return '';
  }
}

if (!function_exists('t')) {
  /**
   * Helper to use static translated strings from .csv file with, optionally,
   * interpolated variables
   *
   * @param string $key
   * @param array|null $args
   * @return string
   */
  function t(string $key = '', $args = null): string
  {
    $strings = app()
      ->make('i18n')
      ->getTranslations();

    if (!isset($strings[$key])) {
      return $key;
    }

    $output = $strings[$key];

    if ($args) {
      foreach ($args as $key => $value) {
        $output = str_replace(":$key", $value, $output);
      }
    }

    return $output;
  }
}

if (!function_exists('download')) {
  /**
   * Helper to expose a download URL pointing to a `src/assets/media` file
   *
   * @see \LaravelFrontend\App\Controllers\Download::getUrl
   * @param string $path
   * @param boolean $viewIt
   * @return string
   */
  function download(string $path, bool $viewIt = false): string
  {
    return \LaravelFrontend\App\Controllers\Download::getUrl($path, $viewIt);
  }
}

if (!function_exists('downloadWithAuth')) {
  /**
   * Helper to expose a download URL pointing to a `src/assets/media` file
   * protected by authentication
   *
   * @see LaravelFrontend\App\Controllers\Download::getUrl
   * @param string $path
   * @param boolean $viewIt
   * @return string
   */
  function downloadWithAuth(string $path, bool $viewIt = false): string
  {
    return \LaravelFrontend\App\Controllers\Download::getUrl(
      $path,
      $viewIt,
      true
    );
  }
}

if (!function_exists('item')) {
  /**
   * Entity "Item" helper, it provides array access to the given and augmented
   * data to ease the use in the template
   *
   * @param array $data
   * @param array $config
   * @return \LaravelFrontend\Helpers\Item
   */
  function item(array $data = [], array $config = [])
  {
    $item = new \LaravelFrontend\Helpers\Item($data, $config);
    return $item;
  }
}

?>
