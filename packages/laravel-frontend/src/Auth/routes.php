<?php

use Illuminate\Support\Facades\Route;
use LaravelFrontend\Auth\AuthTestController;
use LaravelFrontend\Auth\AuthController;

Route::prefix('_/auth')
    ->middleware('web')
    ->group(function () {
        Route::post('profile/{ajax?}', [
            AuthController::class,
            'profileUpdate',
        ]);
        Route::post('login/{ajax?}', [AuthController::class, 'login']);
        Route::any('logout/{ajax?}', [AuthController::class, 'logout']);
        Route::post('password-change/{ajax?}', [
            AuthController::class,
            'passwordChange',
        ]);
        Route::post('password-recovery/{ajax?}', [
            AuthController::class,
            'passwordRecovery',
        ]);
        Route::post('password-reset/{ajax?}', [
            AuthController::class,
            'passwordReset',
        ]);
        Route::post('register/{ajax?}', [AuthController::class, 'register']);
        Route::get('user', [AuthController::class, 'user']);
        Route::get('guest', [AuthController::class, 'guest']);
        Route::get('user-or-guest', [AuthController::class, 'userOrGuest']);
        Route::get('unauthorized/{ajax?}', [
            AuthController::class,
            'unauthorized',
        ]);
    });
