<?php

use Illuminate\Support\Facades\Route;
use LaravelFrontend\Meta\MetaController;
use LaravelFrontend\Meta\HooksController;
use LaravelFrontend\Meta\InfoController;
use LaravelFrontend\Meta\LogsController;

Route::get('_', [MetaController::class, 'home'])->middleware('meta');

Route::prefix('_/info')
    ->middleware('meta')
    ->group(function () {
        Route::get('php', [InfoController::class, 'infoPhp']);
    });

Route::prefix('_/logs')
    ->middleware('meta')
    ->group(function () {
        Route::get('laravel', [LogsController::class, 'logsLaravel']);
        Route::get('visit', [LogsController::class, 'logsVisit']);
    });

// @see https://olmokit.github.io/olmokit/laravel-frontend/Hooks#hooks-endpoints
Route::prefix('_/hooks')
    ->middleware('meta')
    ->group(function () {
        Route::get('visit', [HooksController::class, 'visit']);

        Route::get('deploy/end', [HooksController::class, 'deployEnd']);

        Route::get('cache/clear', [HooksController::class, 'clearAll']);

        Route::get('cache/clear-system', [
            HooksController::class,
            'clearSystem',
        ]);

        Route::get('cache/clear-data', [HooksController::class, 'clearData']);

        Route::get('cache/clear-structure', [
            HooksController::class,
            'clearStructure',
        ]);

        Route::get('cache/clear-custom', [
            HooksController::class,
            'clearCustom',
        ]);

        Route::get('cache/clear-models', [
            HooksController::class,
            'clearModels',
        ]);

        Route::get('cache/clear-models/{modelName}', [
            HooksController::class,
            'clearModel',
        ]);

        Route::get('cache/clear-routes', [
            HooksController::class,
            'clearRoutes',
        ]);

        Route::get('cache/clear-routes/{routeId}', [
            HooksController::class,
            'clearRoute',
        ]);

        Route::post('cache/clear-route', [
            HooksController::class,
            'clearSingleRoute',
        ]);

        Route::get('cache/clear-img', [HooksController::class, 'clearImg']);

        Route::get('cache/clear-forms', [HooksController::class, 'clearForms']);

        Route::get('cache/clear-forms/{formId}', [
            HooksController::class,
            'clearForm',
        ]);

        Route::get('cache/clear-translations', [
            HooksController::class,
            'clearTranslations',
        ]);

        Route::get('cache/clear-translations/{locale}', [
            HooksController::class,
            'clearTranslation',
        ]);
    });
