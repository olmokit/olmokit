<?php

namespace LaravelFrontend\Meta;

use Exception;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Artisan;
use GuzzleHttp\RequestOptions;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Handler\CurlHandler;
use Spatie\Crawler\Crawler;
use Spatie\Crawler\CrawlProfiles\CrawlInternalUrls;
use LaravelFrontend\Cacher\Cacher;
use LaravelFrontend\Cacher\CacherTags;
use LaravelFrontend\I18n\I18n;
use LaravelFrontend\Meta\Visitor;
use LaravelFrontend\Meta\LogsController;

class HooksController extends Controller
{
    const VISITOR_LOGS_PATH = 'logs/visit.log';

    /**
     * It wipes out all "system" caches and regenerate them, in regards to custom
     * cache it just deletes the `'data'` tagged one.
     *
     * @return void
     */
    public function clearAll()
    {
        $msg = "Clear 'all' cache hook called successfully.";
        Cacher::clearAllCaches();
        return $this->getMsg($msg);
    }

    /**
     * It wipes out all `'system'` cache
     *
     * @return void
     */
    public function clearSystem()
    {
        $msg = "Clear 'system' cache hook called successfully.";
        $msg .= ' ' . Cacher::clearSystemCaches();
        $msg .= ' ' . Cacher::generateSystemCaches();
        return $this->getMsg($msg);
    }

    /**
     * It wipes out all `'data'` tagged custom cache
     *
     * @return void
     */
    public function clearData()
    {
        $msg = "Clear 'data' cache hook called successfully.";
        Cacher::clearCacheData();
        return $this->getMsg($msg);
    }

    /**
     * It wipes out all `'structure'` tagged custom cache
     *
     * @return void
     */
    public function clearStructure()
    {
        $msg = "Clear 'structure' cache hook called successfully.";
        Cacher::clearCacheStructure();
        return $this->getMsg($msg);
    }

    /**
     * It wipes out all `'structure'` tagged custom cache
     *
     * @return void
     */
    public function clearCustom()
    {
        $msg = "Clear 'custom' cache hook called successfully.";
        Cacher::clearCacheCustom();
        return $this->getMsg($msg);
    }

    /**
     * Clear `'models'` tagged custom cache
     *
     * @return void
     */
    public function clearModels()
    {
        $msg = "Clear 'models' cache hook called successfully.";
        Cacher::clearCacheModels();
        return $this->getMsg($msg);
    }

    /**
     * Clear `'model.{modelName}'` tagged custom cache
     *
     * @param string $modelName
     * @return void
     */
    public function clearModel(string $modelName = '')
    {
        $msg = "Clear 'model.$modelName' cache hook called successfully.";
        Cacher::clearCacheModel($modelName);
        return $this->getMsg($msg);
    }

    /**
     * Clear `'routes'` tagged custom cache
     *
     * @return void
     */
    public function clearRoutes()
    {
        $msg = "Clear 'routes' cache hook called successfully.";
        Cacher::clearCacheRoutes();
        return $this->getMsg($msg);
    }

    /**
     * Clear `'route.{routeId}'` tagged custom cache
     *
     * @param string $routeId
     * @return void
     */
    public function clearRoute(string $routeId = '')
    {
        $msg = "Clear 'route.$routeId' cache hook called successfully.";
        Cacher::clearCacheRoute($routeId);
        return $this->getMsg($msg);
    }

    /**
     * Clear `'forms'` tagged custom cache
     *
     * @return void
     */
    public function clearForms()
    {
        $msg = "Clear 'forms' cache hook called successfully.";
        Cacher::clearCacheForms();
        return $this->getMsg($msg);
    }

    /**
     * Clear `'form.{formId}'` tagged custom cache
     *
     * @param string $formId
     * @return void
     */
    public function clearForm(string $formId = '')
    {
        $msg = "Clear 'form.$formId' cache hook called successfully.";
        Cacher::clearCacheForm($formId);
        return $this->getMsg($msg);
    }

    /**
     * Clear `'img'` tagged custom cache
     *
     * @return void
     */
    public function clearImg()
    {
        $msg = "Clear 'img' cache hook called successfully.";
        Cacher::clearCacheImg();
        return $this->getMsg($msg);
    }

    /**
     * Clear all `'translations'` tagged custom cache
     *
     * @return void
     */
    public function clearTranslations()
    {
        $msg = "Clear 'translations' cache hook called successfully.";
        Cacher::clearCacheTranslations();
        return $this->getMsg($msg);
    }

    /**
     * Clear specific locale's `'translations'` tagged custom cache
     *
     * @param string $locale
     * @return void
     */
    public function clearTranslation(string $locale = '')
    {
        $msg = "Clear '$locale translations' cache hook called successfully.";
        Cacher::clearCacheTranslations($locale);
        return $this->getMsg($msg);
    }

    /**
     * Deploy end hook
     *
     * @return void
     */
    public function deployEnd()
    {
        $msg = 'Deploy end hook called successfully.';

        $cachesToClear = config('env.CI_CLEAR_CACHE') ?? [CacherTags::data];
        $envCachesToClear = config('env.CI_CLEAR_CACHE');

        if ($envCachesToClear) {
            $cachesToClear = explode(',', $envCachesToClear);
        } elseif ($envCachesToClear == false) {
            $cachesToClear = [];
        }
        // dd($cachesToClear);

        $msg .= ' ' . Cacher::clearSystemCaches();
        $msg .= ' ' . Cacher::clearCaches($cachesToClear);

        try {
            Artisan::call('dump-autoload');
        } catch (Exception $e) {
            // it should not matter, on some servers setup it seems composer.phar
            // is not usable. Hopefully we do not need to rely on that.
            $msg .= ' Execution of "dump-autoload" failed.';
        }

        $msg .= ' ' . Cacher::generateSystemCaches();

        // in case we will use https://github.com/appstract/laravel-opcache:
        // Artisan::call('opcache:compile', ['force']);

        $visitMode = config('env.CI_VISIT_MODE') ?? 'php';

        if ($visitMode === 'php') {
            echo $this->getMsg($msg . $this->getPreVisitMsg());
            $this->visit();
        } else {
            return $this->getMsg($msg);
        }
    }

    /**
     * Crawl all website's links to re-generate cache
     */
    public function visit()
    {
        $msg = 'Visit hook called successfully.';

        $url = config('env.APP_URL');
        $logsPath = storage_path(LogsController::VISITOR_LOGS_PATH);
        // $logsUrl = $this->getVisitLogsUrl();

        // if a website home needs the locale we need to add it otherwise
        // the crawler will stop immediately not following the home redirect
        // for some reasons...despite the ALLOW_REDIRECTS passed to guzzle
        // below
        if (!config('laravel-frontend.i18n.hide_default_locale_in_url')) {
            $defaultLocale = I18n::get()['default_locale'];
            $url .= formatUrlPath('/' . $defaultLocale);
        }

        $url = formatUrl($url);

        // if the request does not contain query params just terminate
        // immediately to act as a non-blocking request, this function
        // will continue to run in the background
        // FIXME: this does not work witout php-fpm
        // session_write_close();
        // fastcgi_finish_request();

        // pass request options to Guzzle client
        // @see https://github.com/spatie/crawler/issues/63
        // @see https://github.com/spatie/crawler/issues/182
        $handler = new CurlHandler();
        $stack = HandlerStack::create($handler); // Wrap w/ middleware
        $requestOptions = [
            RequestOptions::COOKIES => true,
            RequestOptions::CONNECT_TIMEOUT => 20,
            RequestOptions::TIMEOUT => 20,
            RequestOptions::HEADERS => [
                'User-Agent' => '*',
            ],
            RequestOptions::ALLOW_REDIRECTS => false,
            'handler' => $stack,
        ];

        if (
            Str::contains($url, '.acanto.') /* || App::environment() === 'dev'*/
        ) {
            $requestOptions[RequestOptions::AUTH] = ['acanto', 'acanto'];
        }

        $crawler = Crawler::create($requestOptions)
            ->setCrawlObserver(new Visitor($logsPath))
            // ->setDelayBetweenRequests(10)
            // ->doNotExecuteJavaScript()
            ->setMaximumResponseSize(1024 * 1024 * 3) // 3MB
            ->setCrawlProfile(new CrawlInternalUrls($url))
            ->acceptNofollowLinks();

        // ignore robots on dev/staging as they are always set to disallow by
        // default
        // if (!in_array(App::environment(), ['production', 'prod'])) {
        // }
        $crawler->ignoreRobots();

        $crawler->startCrawling($url);

        return $this->getMsg($msg);
    }

    /**
     * Is called from console simple check
     *
     * @return 'plain' | 'html'
     */
    private function isCalledFromConsole()
    {
        if (count($_GET)) {
            return false;
        }
        return true;
    }

    /**
     * Has rich output check
     *
     * @return 'plain' | 'html'
     */
    private function hasRichOutput()
    {
        return !$this->isCalledFromConsole() || config('env.DEVELOPMENT');
    }

    /**
     * Get output formatted
     *
     * @return void
     */
    private function format(string $txt = '')
    {
        return '<code>' . nl2br($txt) . '</code>';
    }

    /**
     * Get plain or rich msg
     *
     * @return void
     */
    private function getMsg(string $txt = '')
    {
        if ($this->hasRichOutput()) {
            return $this->format($txt);
        }
        return $txt;
    }

    /**
     * Get visit logs URL
     *
     * @return string
     */
    private function getVisitLogsUrl()
    {
        $url = config('env.APP_URL');
        $logsPath = storage_path(self::VISITOR_LOGS_PATH);
        return $url . '/_/logs/visit?' . config('env.HOOKS_ALLOWED_PARAM');
    }

    /**
     * Get pre-visit task msg
     *
     * @return string
     */
    private function getPreVisitMsg()
    {
        $logsUrl = $this->getVisitLogsUrl();
        $msg = '';
        $msg .= PHP_EOL . 'Now the visit task will run in php mode.';
        if ($this->hasRichOutput()) {
            $msg .=
                PHP_EOL . "You can <a href=$logsUrl>see the live logs here</a>";
        } else {
            $msg .= PHP_EOL . "Check $logsUrl" . PHP_EOL;
        }
        return $msg;
    }
}

?>
