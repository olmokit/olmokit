<?php

namespace LaravelFrontend\I18n;

use Illuminate\Support\Facades\App;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use LaravelFrontend\I18n\I18n;

class I18nController extends Controller
{
    public function switch(Request $request)
    {
        $url = $request->input('url');
        $locale = $request->input('locale');

        if (!$locale) {
            $locale = I18n::extractLocaleFromUrl($url);
        }

        if (I18n::isValidLocale($locale)) {
            App::setLocale($locale);
            $request->session()->put('locale', $locale);
            return Redirect::to($url, 302);
        }

        return Redirect::to(url()->previous());
    }
}

?>
