<?php

use Illuminate\Support\Facades\Route;
use LaravelFrontend\Forms\FormsController;

Route::prefix('_/forms/debug')
  ->middleware('dev.only')
  ->group(function () {
    Route::get('/{id}', [FormsController::class, 'debug']);
  });
