<?php

use Illuminate\Support\Facades\Route;
use LaravelFrontend\I18n\I18nController;

Route::prefix('_/i18n')->group(function () {
  Route::any('switch', [I18nController::class, 'switch']);
});
