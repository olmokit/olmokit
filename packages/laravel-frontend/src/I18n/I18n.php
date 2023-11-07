<?php

namespace LaravelFrontend\I18n;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use LaravelFrontend\Cacher\CacherTags;
use LaravelFrontend\Cms\CmsApi;
use Illuminate\Http\Request;

class I18n
{
    public static $translations;

    /**
     * Get i18n information from API
     *
     * @return array
     */
    public static function get(): array
    {
        return CmsApi::getI18n();
    }

    /**
     * Get url locale prefix, the fact of having a localised URL even when there
     * is only one language is configurable, so take it into account.
     *
     * @param string $locale If not given it will use the current locale
     * @return string
     */
    public static function getUrlPrefix($locale = ''): string
    {
        $locale = $locale ? $locale : App::getLocale();
        $i18n = self::get();
        $locales = $i18n['locales'];
        $defaultLocale = $i18n['default_locale'];

        if ($locale === $defaultLocale) {
            if (
                count($locales) === 1 &&
                !config('laravel-frontend.i18n.enforce_localised_urls')
            ) {
                return '/';
            }
            if (
                count($locales) > 1 &&
                config('laravel-frontend.i18n.hide_default_locale_in_url')
            ) {
                return '/';
            }
        }

        return $locale . '/';
    }

    /**
     * Get switch URL in order to have link based language switcher
     *
     * The URL here must match the I18n route structure
     *
     * @param string $locale
     * @param string $url
     * @return string
     */
    public static function getSwitchUrl(string $locale = '', string $url = '')
    {
        return rtrim(config('env.APP_URL'), '/') .
            '/_/i18n/switch?locale=' .
            $locale .
            '&url=' .
            urlencode($url);
    }

    /**
     * Is valid locale
     *
     * @param string $locale
     * @return boolean
     */
    public static function isValidLocale($locale): bool
    {
        $i18n = self::get();

        return in_array($locale, $i18n['locales']);
    }

    /**
     * Extract locale form relative URL path
     *
     * @param string $path
     * @return string
     */
    public static function extractLocaleFromPath(string $path = ''): string
    {
        $pathParts = explode('/', ltrim($path, '/'));
        $locale = $pathParts[0];
        return $locale;
    }

    /**
     * Extract locale form absolute URL
     *
     * @param string $url
     * @return string
     */
    public static function extractLocaleFromUrl(string $url = ''): string
    {
        $path = parse_url($url, PHP_URL_PATH);
        return self::extractLocaleFromPath($path);
    }

    /**
     * Get statically translated strings for current locale from .csv file
     *
     * @return array
     */
    public static function getTranslations(): array
    {
        if (self::$translations) {
            return self::$translations;
        }

        $local = [];
        $remote = self::getRemoteTranslations();

        // during development merge the statically defined strings with the remote
        // ones in order to avoid slowing down development due to newly inserted
        // strings not yet available through the CMS, as well as allowing a easy
        // initial development where the CMS provided data is not yet ready.

        // TODO: here we could enhance this feature with an automatic notification
        // system that informs developers of mismatches between locally/statically
        // defined translations' keys and remotely defined ones
        if (empty($remote) || config('env.DEVELOPMENT')) {
            $local = self::getLocalTranslations();
            $all = array_merge($local, $remote);
            // $diff = array_diff_assoc($local, $remote);
            // dd($diff);
        } else {
            $all = $remote;
        }

        self::$translations = $all;

        return $all;
    }

    /**
     * Get statically translated strings for current locale from local .csv file
     *
     * @return array
     */
    public static function getLocalTranslations(): array
    {
        $data = [];
        $locale = App::getLocale();

        if (config('env.DEVELOPMENT')) {
            // never use cache during development
            $data = self::parseLocalTranslations($locale);
        } else {
            // always use cache in production (whatever env...)
            $cacheKey = "i18n.localTranslations.$locale";

            if (Cache::has($cacheKey)) {
                return Cache::get($cacheKey);
            }

            $data = self::parseLocalTranslations($locale);

            Cache::tags([
                CacherTags::data,
                CacherTags::translations,
                CacherTags::translation($locale),
            ])->put($cacheKey, $data);
        }

        return $data;
    }

    /**
     * Parse statically translated strings for current locale from local .csv file
     *
     * @return array
     */
    public static function parseLocalTranslations($locale = ''): array
    {
        $data = [];
        $filepath = resource_path('/translations.csv');

        if (!file_exists($filepath)) {
            exit(
                'LaravelFrontend: missing translation file at resources/translations.csv'
            );
        }

        $file = file($filepath);
        $localeIdx = 0;

        // grab first line
        if (isset($file[0])) {
            $firstRow = str_getcsv($file[0]);
            // loop through first line first row's cells
            foreach ($firstRow as $column) {
                // get the right column index and break
                if (trim($column) === $locale) {
                    break;
                }
                $localeIdx++;
            }
        }

        // now loop through all lines and associate the right key to the right
        // localised string
        foreach ($file as $line) {
            $row = str_getcsv($line);

            // try to get the correct one
            if (isset($row[$localeIdx])) {
                $data[$row[0]] = trim($row[$localeIdx]);
            }
            // fallback to default language one (the first column, to ease the
            // process during development)
            elseif (isset($row[1])) {
                $data[$row[0]] = trim($row[1]);
            }
            // otherwise return a helpful string to detect the missing
            // translation
            else {
                $data[$row[0]] = 'Untranslated key "' . $row[0] . '"';
            }
        }

        return $data;
    }

    /**
     * Get remotely translated strings for current locale
     *
     * @return array
     */
    public static function getRemoteTranslations(): array
    {
        $data = CmsApi::getTranslations();
        return $data ?? [];
    }

    /**
     * Get statically translated string by key
     *
     * @return void
     */
    public static function getTrans(string $key = ''): string
    {
        $translations = self::getTranslations();

        return $translations[$key] ?? 'Untranslated key "' . $key . '"';
    }
}
