<?php

namespace LaravelFrontend\App;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Blade;
use Illuminate\View\View;
use LaravelFrontend\I18n\I18n;
use LaravelFrontend\Cms\CmsApi;
use LaravelFrontend\Auth\AuthApi;

class AppComposer
{
    static $translations = [];

    /**
     * Bind data to the view.
     *
     * @param  View  $view
     * @return void
     */
    public function compose(View $view)
    {
        $translations = I18n::getTranslations();

        $view->with('trans', $translations);
        $view->with('locale', App::getLocale());
        $view->with('i18n', I18n::get());
        $view->with('analytics', CmsApi::getAnalytics());
        $view->with('user', AuthApi::user());
        $view->with('userJs', AuthApi::userJs());

        /**
         * Helper directive to use static translated strings from .csv files
         *
         * @param string $key
         * @return void
         */
        Blade::directive('trans', function (string $key = '') use (
            $translations
        ) {
            return $translations[$key] ?? $key . ' (missing translation key)';
            // TODO: maybe do a more sophisticated custom directive with
            // dynamic arguments handling:

            /* $parts = explode(',', $key);
            $key = $parts[0];
            $args = isset($parts[1]) ? $parts[1] : 'null';

            return implode('', [
                "<?php if ({$args}) { ?>",
                    "<?php foreach ({$args} as \$param => \$value) { ?>",
                        "<?php \$key = str_replace(':'.\$param, \$value, \$key); ?>",
                    '<?php } ?>',
                '<?php } ?>',
                "<?php echo {$translations[$key]} ?? \$key . 'missing.translation.key'; ?>",
            ]); */
        });
    }
}
