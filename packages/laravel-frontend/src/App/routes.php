<?php

use Illuminate\Support\Facades\Route;
use LaravelFrontend\App\Controllers\Download;
use LaravelFrontend\App\Controllers\Robots;
use LaravelFrontend\App\Controllers\Sitemap;

// standard robots route
Route::get('/robots.txt', [Robots::class, 'render']);

// standard sitemap routes
Route::get('/sitemap.xml', [Sitemap::class, 'default']);
Route::get('/sitemap-index.xml', [Sitemap::class, 'index']);
Route::get('/images-sitemap.xml', [Sitemap::class, 'defaultImage']);
Route::get('/{locale}-images-sitemap.xml', [Sitemap::class, 'localisedimage'])->where(
    'locale',
    '([A-Za-z0-9\-\/]+)'
);
Route::get('/{locale}-sitemap.xml', [Sitemap::class, 'localised'])->where(
    'locale',
    '([A-Za-z0-9\-\/]+)'
);

// standard download routes
Route::get(Download::PATH, [Download::class, 'get'])->where('path', '.+');
Route::get(Download::PATH_AUTH, [Download::class, 'get'])
    ->where('path', '.+')
    ->middleware('auth');

// fallback route, not needed
// Route::fallback('\resources\routes\Route404@render');

// catch all route
// Route::get('/{lang?}/{slug?}{test?}/', [Catchall::class, 'render'])->where(
//     'slug',
//     '([A-Za-z0-9\-\/]+)'
// );

// specific routes overwrite
// Route::group(['namespace' => 'resources\routes'], function() {
//   // Route::get('/en/contacts', 'Contacts@render');
// });
