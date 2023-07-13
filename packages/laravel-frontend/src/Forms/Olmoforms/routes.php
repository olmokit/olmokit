<?php

use Illuminate\Support\Facades\Route;
use LaravelFrontend\Forms\Olmoforms\OlmoformsController;

Route::prefix('_/forms/olmoforms')->group(function () {
  Route::post('/send/{id}', [OlmoformsController::class, 'send']);

  Route::post('/uploadchunks', [OlmoformsController::class, 'uploadChunks']);

  Route::post('/uploadcomplete', [
    OlmoformsController::class,
    'uploadcomplete',
  ]);
});
