<?php

namespace LaravelFrontend\App\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Str;
use LaravelFrontend\I18n\I18n;
use LaravelFrontend\Cms\CmsApi;
use LaravelFrontend\Helpers\Helpers;

class Base extends Controller
{
  /**
   * The route's folder name
   *
   * @var string
   */
  public $route = '';

  /**
   * Stores on the instance the remotely fetched api data, so that we can use
   * that data outside of the `render` method and apply our conventions to
   * look for a custom controller class defined in the
   * routes/{route}.index.php. The route can be defined in fact in the
   * api response using the class property `apiSlug` as fallback.
   * The purpose to have this data on a class prpperty is simply to don't call
   * the `getApidata` twice (despite its response is cached).
   *
   * @var null|array
   */
  public $cmsApiData = null;

  /**
   * The remote API endpoint slug for this route, the API fetching URL will
   * be precedeed by the CMS_API_URL and the current locale as such:
   * `$CMS_API_URL/$locale/$slug`
   *
   * @var null|string
   */
  public $cmsApiSlug = null;

  /**
   * By default routes need the CmsApi data, setting this to `false` allows
   * a route to be defined and managed completely by the frontend alone.
   *
   * @var null|string
   */
  public $useCmsApi = true;

  /**
   * Use barba.js for this route
   *
   * @var bool
   */
  public $useBarba = false;

  /**
   * Use data cache for this route
   *
   * @var bool
   */
  public $useCache = true;

  /**
   * Route's status code
   *
   * @var integer
   */
  public $statusCode = 200;

  /**
   * Flag for exception's routes
   *
   * @var string
   */
  public $isErrorRoute = false;

  /**
   * The requested slug path as it is
   *
   * @var string
   */
  private $slugRequested = '';

  /**
   * The requested slug path without the locale (if any)
   *
   * @var string
   */
  private $slugCleaned = '';

  /**
   * Allows a route to skip automatic data caching
   *
   * @return void
   */
  protected function disableCache()
  {
    $this->useCache = false;
  }

  /**
   * Abstract function to add custom variables on the root level from a
   * specific controller, e.g. returning `['me' => [ 'name' => 'Olmo' ] ]`
   * you will have in your blade template the variable accessible as such
   * `{{ me.name }}`
   *
   * @return array
   */
  protected function addVars(): array
  {
    return [];
  }

  /**
   * Same as above but to use in custom controllers within this library that
   * a project would extend. This allows to do avoid "stealing" the `addVars`
   * method to the usual controller route's class leaving the "familiar" API
   * as usual
   *
   * @return array
   */
  protected function _addVars(): array
  {
    return [];
  }

  /**
   * Abstract function to add custom data on the view from a specific
   * controller on the `$data` variable, that is by default filled with the
   * remote data from the server API
   *
   * @return array
   */
  protected function addData(): array
  {
    return [];
  }

  /**
   * Get API request slug,
   *
   * By default it will use the slug coming from the dynamic route defintion
   * in routes/web.php. To override this behaviour a controller can either
   * override this method or simply define on its class a custom slug with:
   *
   * ```php
   * class MyController extends base {
   *     protected $cmsApiSlug = 'my-special-endpoint/can-have-slashes';
   * }
   * ```
   *
   * @return string
   */
  protected function getApiRequestSlug(string $slug = '')
  {
    return $this->cmsApiSlug ?? $slug;
  }

  /**
   * Get API data from remote server and set it on instance
   *
   * @return array
   */
  protected function getApiData(string $slug = '')
  {
    $this->cmsApiData = CmsApi::getRouteData(
      $this->getApiRequestSlug($slug),
      $this->useCache,
      [$this, 'processApiData']
    );
    return $this->cmsApiData;
  }

  /**
   * Get static data
   *
   * @return array
   */
  protected function getStaticData(): array
  {
    $data = [];
    if (file_exists($path = resource_path($this->getStaticDataPath()))) {
      $data = json_decode(file_get_contents($path), true);
    }
    return $data;
  }

  /**
   * Get test data
   *
   * @return array
   */
  protected function getTestData(): array
  {
    $data = [];
    if (file_exists($testPath = resource_path($this->getTestDataPath()))) {
      $data = json_decode(file_get_contents($testPath), true);
    }
    return $data;
  }

  /**
   * Get all route specific data from the API and optional `index` and `test`
   * JSONs. Custom data add through `addData` method will be merged on top of
   * this basic data, therefore allowing to overwrite it.
   *
   * We share `langs` data to all views, so we don't need to pass it to route
   * child components to build things like a language switcher. We still keep
   * this sharing here instead of inside the `AppComposer` because in such way
   * a route can specify it's langs with its custom controller that extends
   * this Base one. In fact, the AppComposer it's called later than controller
   * so if we would specify `langs` there it would not be overridable by a
   * specific route Controller.
   *
   * We also share `route` to all views which is used for assets compiling
   * through `@olmokit/cli` and maybe other stuff
   *
   * @return array
   */
  protected function getViewData(): array
  {
    $data = array_merge(
      $this->processApiData($this->cmsApiData ?: []),
      $this->getStaticData(),
      $this->addData()
    );
    $test = request('test') ? $this->getTestData() : [];
    $langs = $this->getLangsData($this->cmsApiData);

    View::share('route', $this->route);
    View::share('useBarba', $this->useBarba);
    View::share('langs', $langs);
    View::share('isErrorRoute', $this->statusCode !== 200);

    $cached = false;
    foreach ($this->middleware as $m) {
      if ($m['middleware'] === 'page-cache') {
        $cached = true;
      }
    }
    View::share('cached', $cached ? date('d F Y H:i:s') : false);

    return array_merge(
      [
        'data' => $data,
        'test' => $test,
      ],
      $this->_addVars(),
      $this->addVars()
    );
  }

  /**
   * Debug route controller
   *
   * @return void
   */
  protected function debug()
  {
    dd([
      // print the actual class name in use
      'This route is using the class "' . get_class($this) . '"',
    ]);
  }

  /**
   * Get langs data according to CMS API data
   *
   * Used to build a simple links based language switcher
   *
   * @param array|null $cmsApiData
   * @return void
   */
  protected function getLangsData($cmsApiData)
  {
    $data = [];

    if ($cmsApiData) {
      foreach ($cmsApiData['route']['slug'] as $locale => $slug) {
        $url = linkUrl($slug, $locale);
        $data[] = [
          'current' => App::getLocale() === $locale,
          'locale' => $locale,
          'url' => $url,
          'switchUrl' => I18n::getSwitchUrl($locale, $url),
        ];
      }
    } else {
      $routesMap = Helpers::getRoutesMap();
      $localisedData = $routesMap[$this->route]['slug'];

      foreach ($localisedData as $locale => $localeData) {
        $url = linkUrl($localeData['path']);
        $data[] = [
          'current' => App::getLocale() === $locale,
          'locale' => $locale,
          'url' => $url,
          'switchUrl' => I18n::getSwitchUrl($locale, $url),
        ];
      }
    }

    return $data;
  }

  /**
   * Process api data
   *
   * @param any $data Typically from the API arrives an array of data...but
   *                  let's not constrain here.
   * @return void
   */
  public function processApiData($data)
  {
    return $data;
  }

  /**
   * Get static data path
   *
   * @return string
   */
  protected function getStaticDataPath(): string
  {
    return 'routes/' . Helpers::routeFilename($this->route, 'index') . '.json';
  }

  /**
   * Get test data path
   *
   * @return string
   */
  protected function getTestDataPath()
  {
    return 'routes/' . Helpers::routeFilename($this->route, 'test') . '.json';
  }

  /**
   * Setter to define the controller's route unique name which will be used to
   * locate the view template to render with this controller
   *
   * @param string $value
   * @return void
   */
  protected function setRoute(string $value = '')
  {
    $this->route = $value;
  }

  /**
   * Get route type
   *
   * @return 'folder' | 'cms' | 0
   */
  protected function getRouteType()
  {
    $routeInfo = Helpers::getRoutesMap()[$this->route];
    if ($routeInfo && isset($routeInfo['type'])) {
      return $routeInfo['type'];
    }

    return ['type' => 0];
  }

  /**
   * Render view by given slug.
   *
   * The requested slug must match either a CMS api endpoint with the same
   * slug or a route folder name. Otherwise we redirect to 404 if both
   * following conditions are true:
   * 1) the API does not have any information about the given `slug`
   * 2) a route template for the given `slug` does not exists
   *
   * @return void
   */
  public function renderBySlug(string $slug = '')
  {
    // check that we actually have and want to use the CmsApi for this route
    if ($this->useCmsApi && config('env.CMS_API_URL', false)) {
      // call the method only if it has not been done already, hence we
      // check for the data being `null`, as the method itself will return
      // either data or a bool `false`. So `false` means "fetched and
      // nothing found in the api", while `null` means "not yet fetched"
      if (is_null($this->cmsApiData)) {
        $this->getApiData($slug);
      }
    }

    // by default use the route name registered by Helpers::registerRoutes
    $route = Route::currentRouteName();
    // ...cleaned of the `locale.{route}`
    $route = str_replace(App::getLocale() . '.', '', $route);

    // if we have data from the remote API use the route id from there
    if ($this->cmsApiData) {
      $route = $this->cmsApiData['route']['id'] ?? $route;
    }

    // now set the class property
    $this->setRoute($route);

    // set the route status code
    $this->statusCode = $this->getRouteStatusCode();

    // get this route type to determine if we need to strictly put
    // confidence into the cms api route data or not
    $routeType = $this->getRouteType();

    // if this route wants to use the CmsApi (by default all want it), and
    // if there is no data from the CmsApi and the route type is 'cms'
    // then we definitely want to return a 404
    if ($this->useCmsApi && !$this->cmsApiData && $routeType === 'cms') {
      abort(404);
    }

    // in all other situations just check that a template with this route
    // name exists and continue to render
    if (Helpers::routeExists($this->route)) {
      return response()
        ->view(Helpers::routeView($this->route), $this->getViewData())
        ->setStatusCode($this->statusCode);
    }

    // otherwise just go to 404
    abort(404);
  }

  /**
   * Get route status code
   *
   * We double check also for the current slug, in case that the data from
   * the cms is wrong, e.g. the `route['id']` of an error page is mistaken.
   *
   * @return integer
   */
  protected function getRouteStatusCode()
  {
    foreach (['400', '404', '419', '500', '503'] as $code) {
      if ($this->route === $code || $this->slugCleaned === $code) {
        return (int) $code;
      }
    }

    return 200;
  }

  /**
   * Render
   *
   * @return void
   */
  public function render()
  {
    $slug = Helpers::getCurrentRequestPath();

    $this->slugRequested = $slug;
    $this->slugCleaned = ltrim(str_replace(App::getLocale(), '', $slug), '/');

    return $this->renderBySlug($slug);
  }

  /**
   * Render home is just redirecting to the localised homepage URL
   *
   * @return void
   */
  public function home(Request $request)
  {
    if (config('laravel-frontend.i18n.enforce_localised_urls')) {
      $i18n = I18n::get();
      $locale = '';
      $session = $request->session()->get('locale');
      $browser = isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])
        ? substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2)
        : null;

      if (in_array($session, $i18n['locales'])) {
        $locale = $session;
      } elseif (in_array($browser, $i18n['locales'])) {
        $locale = $browser;
        $request->session()->put('locale', $locale);
      }
      $homeUrlPath = I18n::getUrlPrefix($locale);

      return Redirect::to(
        formatUrlPath($homeUrlPath),
        App::environment() === 'local' ? 307 : 301
      );
    }

    return $this->render();
  }
}
