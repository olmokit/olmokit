<?php

namespace LaravelFrontend\I18n;

use Illuminate\Support\Facades\App;
use Illuminate\Http\Request;
use LaravelFrontend\I18n\I18n;
use Closure;

class Middleware
{
  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @return mixed
   */
  public function handle(Request $request, Closure $next)
  {
    $i18n = I18n::get();
    $url = I18n::extractLocaleFromPath($request->path());
    $session = $request->session()->get('locale');
    $browser = isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])
      ? substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2)
      : null;

    // exit("I18nMiddleware: session $session, url $url browser:" . $browser);
    // echo "I18nMiddleware: session $session, url $url browser:" . $browser;

    // 1: higher priority to locale read from the URL path
    if (in_array($url, $i18n['locales'])) {
      $locale = $url;
      $request->session()->put('locale', $locale);
      // 2: then we check if we have already store a locale in the session
    } elseif (in_array($session, $i18n['locales'])) {
      $locale = $session;
      // 3: if session is empty we use the browser's preference
    } elseif (in_array($browser, $i18n['locales'])) {
      $locale = $browser;
      $request->session()->put('locale', $locale);
      // 4: otherwise we fallback to the default locale
    } else {
      $locale = $i18n['default_locale'];
    }

    App::setLocale($locale);
    // echo "I18nMiddleware: after set app locale is " . App::getLocale();

    return $next($request);
  }
}
