<?php

namespace LaravelFrontend\App\Controllers;

use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\App;

use LaravelFrontend\Cms\CmsApi;
use LaravelFrontend\I18n\I18n;

class Sitemap
{
    /**
     * Get sitemap url
     *
     * @param string $locale
     * @return void
     */
    private static function getLocalisedSitemapUrl(string $locale = '')
    {
        return rtrim(config('env.APP_URL'), '/') .
            '/' .
            $locale .
            '-sitemap.xml';
    }

    /**
     * Actually render a sitemap for the given locale/lang, it first checks
     * if the component to render it exists, otherwise it just 404s.
     *
     * This function is used both by the default and the localised route
     * render methods.
     *
     * @param string $lang
     * @return void
     */
    private static function renderLocalisedSitemap(string $lang = '')
    {
        if (!View::exists('components.Sitemap')) {
            abort(404);
        }

        $sitemap = CmsApi::getSitemap($lang);

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $header =
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        $footer = '</urlset>';

        $view = View::make('components.Sitemap', [
            'lang' => $lang,
            'file' => $xml,
            'header' => $header,
            'footer' => $footer,
            'sitemap' => $sitemap,
        ])->render();

        return response($view)->header('Content-Type', 'text/xml');
    }

    /**
     * Handler for `sitemap.xml` route
     *
     * @return View
     */
    public function default()
    {
        $i18n = I18n::get();

        if (count($i18n['locales']) > 1) {
            return redirect('/sitemap-index.xml');
        }

        $locale = App::getLocale();
        return self::renderLocalisedSitemap($locale);
    }

    /**
     * Handler for `sitemap-index.xml` route
     *
     * @return View
     */
    public function index()
    {
        $seo = CmsApi::getSeo();

        if ($seo['sitemap_index']) {
            $i18n = I18n::get();
            $xml =
                '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

            foreach ($i18n['locales'] as $locale) {
                $xml .=
                    '<sitemap><loc>' .
                    self::getLocalisedSitemapUrl($locale) .
                    '</loc></sitemap>';
            }

            $xml .= '</sitemapindex>';

            return Response::make($xml, 200, [
                'Content-Type' => 'text/xml',
            ]);
        }

        abort(404);
    }

    /**
     * Handler for localised `{locale}-sitemap.xml` routes
     *
     * @param string $locale
     * @return View
     */
    public function localised(string $locale = '')
    {
        // $lang = explode('-', $locale);
        return self::renderLocalisedSitemap($locale);
    }
}
