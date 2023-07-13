<?php

use Illuminate\Support\Facades\Route;
use LaravelFrontend\Img\ImgController;

Route::get('media/{path}', [ImgController::class, 'getCachedByPath'])->where(
  'path',
  '.*'
);
Route::get('_/img/cache/{key}/{name}', [
  ImgController::class,
  'getCachedByKey',
]);

// @devtool
// this route dynamic `src` parameter should accept slashes and dots because
// we get here with a full  imag path (with extension), hence the regex
Route::get('_/img/try/{src}/', [ImgController::class, 'try'])
  ->middleware('dev.only')
  ->where('src', '([A-Za-z0-9\-\_\/\.]+)');
