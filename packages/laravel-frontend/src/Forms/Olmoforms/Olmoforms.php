<?php

namespace LaravelFrontend\Forms\Olmoforms;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use LaravelFrontend\Cacher\CacherTags;
use LaravelFrontend\Helpers\Helpers;
use LaravelFrontend\Forms\Form;

class Olmoforms
{
    /**
     * Get meta information about the desired Olmoforms's form by id/locale->id
     *
     * @param string|array $idOrIdsMap
     * @param bool $quickReturn
     * @return void
     */
    public static function getFormApiMeta(
        $idOrIdsMap,
        bool $quickReturn = false
    ) {
        $appUrl = config('env.APP_URL');
        $apiUrl = config('env.CMS_API_URL_FORM') ? config('env.CMS_API_URL_FORM') : config('env.CMS_API_URL');
        $token = config('env.OLMOFORMS_TOKEN');

        if (!$token || !$apiUrl) {
            if ($quickReturn) {
                return false;
            }
            exit(
                '[Olmoforms] You  must define a `OLMOFORMS_TOKEN` in the .env file'
            );
        }

        if (!$idOrIdsMap) {
            if ($quickReturn) {
                return false;
            }
            exit(
                '[Olmoforms] You must pass a form id as a string or an array of locale->id forms'
            );
        }

        if (is_array($idOrIdsMap)) {
            // if it is an array get the id for the current locale
            $id = $idOrIdsMap[App::getLocale()] ?? '';

            if (!$id) {
                exit(
                    '[Olmoforms] You must supply a valid form id for the current locale'
                );
            }
        } else {
            // if a single id just use that
            $id = $idOrIdsMap;
        }

        // construct olmform form's urls
        $url = "$apiUrl/_/form/$token/$id";
        $action = "$appUrl/_/forms/olmoforms/send/$id/";

        return [
            'token' => $token,
            'apiUrl' => $apiUrl,
            'appUrl' => $appUrl,
            'id' => $id,
            'url' => $url,
            'action' => $action,
        ];
    }

    /**
     * Get olmform form data
     *
     * @param string|array| $idOrIdsMap An array like [ 'en' => '195', 'it' => '196' ] or just the id
     * @return void
     */
    public static function get($idOrIdsMap)
    {
        $meta = self::getFormApiMeta($idOrIdsMap);

        // retrieve form data from olmform API
        $remoteData = self::getData($meta['url']) ?? [];
        // merge formData with basic meta data
        $formData = array_merge($remoteData, [
            'olmoforms' => $meta,
            'action' => $meta['action'], // TODO: create an internal endpoint
        ]);

        // process with our abstract form implementation
        $form = new Form($meta['id'], $formData);

        return $form->json();
    }

    /**
     * Prefill form data with given array
     *
     * @param array $form
     * @param array $values
     * @return array
     */
    public static function prefill(array $form = [], array $values = [])
    {
        $i = 0;
        foreach ($form['fields'] as $field) {
            $key = $field['name'];

            if (isset($values[$key])) {
                $form['fields'][$i]['value'] = $values[$key];
            }
            $i++;
        }

        return $form;
    }

    /**
     * Check that the given form id exists on olmforms, we strictly check for
     * `false` as that is what is return by `file_get_contents` on failure,
     *
     * @param string|array $idOrIdsMap
     * @return boolean
     */
    public static function isFromOlmoforms($idOrIdsMap)
    {
        $meta = self::getFormApiMeta($idOrIdsMap, true);
        if (!$meta) {
            return false;
        }
        $data = self::getData($meta['url']);

        return $data !== false;
    }

    /**
     * Get data remotely or from cache
     *
     * We check for `empty` as olmforms does not seem to return a 404
     * or an error status but an empty array, so we mimick what `file_get_contents`
     * would return in case of an actual failed request, it would return `false`
     *
     * FIXME: olmform side
     *
     * @param string $url
     * @return void
     */
    protected static function getData(string $url)
    {
        $cacheKey = Helpers::getCacheKey("olmoforms.$url", true);

        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $data = json_decode(file_get_contents($url), true);
        $formId = 'unknown';

        if (empty($data)) {
            $data = false;
        } else {
            $formId = $data['id'];
        }
        $data = self::cleanResponse($data);
        Cache::tags([
            CacherTags::data,
            CacherTags::forms,
            CacherTags::form($formId),
        ])->put($cacheKey, $data);

        return $data;
    }

    /**
     * Clean up Olmoforms data returned by its API, we just get and treat field's
     * data
     *
     * @param array|false $data The Olmoforms response data
     * @return array|false
     */
    public static function cleanResponse($data)
    {
        return [
            'fields' => $data['fields'],
        ];
    }
}
