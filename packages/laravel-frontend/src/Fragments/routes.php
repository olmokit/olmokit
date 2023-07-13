<?php

use Illuminate\Support\Facades\Route;
use LaravelFrontend\Helpers\Helpers;
use LaravelFrontend\App\Controllers\Fragment;

Route::prefix('_/fragments')->group(function () {
  $web = Helpers::getWebMiddleware();

  Route::match(['get', 'post'], 'replace', [
    Fragment::class,
    '_replace',
  ])->middleware($web);

  Route::post('replace_many', [Fragment::class, '_replaceMany'])->middleware(
    $web
  );
});
