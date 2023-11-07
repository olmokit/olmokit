<?php

use Illuminate\Support\Facades\Route;
use LaravelFrontend\Helpers\Helpers;
use LaravelFrontend\App\Controllers\Fragment;

Route::prefix('_/fragments')->group(function () {
    $middlewares = Helpers::getWebMiddlewares();
    array_push($middlewares, 'seo.noindex');

    Route::match(['get', 'post'], 'replace', [
        Fragment::class,
        '_replace',
    ])->middleware($middlewares);

    Route::post('replace_many', [Fragment::class, '_replaceMany'])->middleware(
        $middlewares
    );
});
