<?php

use Illuminate\Support\Facades\Route;
use LaravelFrontend\Cms\CmsWishlistController;
use LaravelFrontend\Cms\CmsCartController;
use LaravelFrontend\Cms\CmsCheckoutController;
use LaravelFrontend\Cms\CmsAddressController;

Route::prefix('_/cms/')
    // ->middleware('api')
    ->group(function () {
        Route::get('/wishlist', [CmsWishlistController::class, 'get']);
        Route::post('/wishlist', [CmsWishlistController::class, 'add']);
        Route::delete('/wishlist', [CmsWishlistController::class, 'remove']);
    });

Route::prefix('_/cms/')
    // ->middleware('api')
    ->group(function () {
        Route::get('/cart', [CmsCartController::class, 'get']);
        Route::post('/cart', [CmsCartController::class, 'add']);
        Route::delete('/cart', [CmsCartController::class, 'remove']);
        Route::post('/cart/quantity', [
            CmsCartController::class,
            'setQuantity',
        ]);
        Route::post('/cart/addresses', [
            CmsCartController::class,
            'setAddresses',
        ]);
        Route::post('/cart/discount', [
            CmsCartController::class,
            'applyDiscount',
        ]);
        Route::delete('/cart/discount', [
            CmsCartController::class,
            'removeDiscount',
        ]);
        Route::post('/cart/shippingmethod', [
            CmsCartController::class,
            'setShippingMethod',
        ]);
        Route::delete('/cart/shippingmethod', [
            CmsCartController::class,
            'removeShippingMethod',
        ]);
        Route::post('/cart/paymentmethod', [
            CmsCartController::class,
            'setPaymentMethod',
        ]);
    });

Route::prefix('_/cms/')
    // ->middleware('web')
    // ->middleware('api')
    ->group(function () {
        Route::post('/checkout/details/{ajax?}', [
            CmsCheckoutController::class,
            'details',
        ]);
        Route::post('/checkout/payment/{ajax?}', [
            CmsCheckoutController::class,
            'payment',
        ]);
        Route::post('/checkout/summary/{ajax?}', [
            CmsCheckoutController::class,
            'summary',
        ]);
        Route::post('/checkout/credit-card/{ajax?}', [
            CmsCheckoutController::class,
            'creditcard',
        ]);
        Route::post('/checkout/completed/{ajax?}', [
            CmsCheckoutController::class,
            'completed',
        ]);
    });

Route::prefix('_/cms/')
    // ->middleware('api')
    ->group(function () {
        Route::get('/address', [CmsAddressController::class, 'list']);
        Route::post('/address/setdefault', [
            CmsAddressController::class,
            'setAsDefault',
        ]);
        Route::match(['post', 'delete'], '/address/remove', [
            CmsAddressController::class,
            'remove',
        ]);
        Route::match(['post', 'patch'], '/address/{ajax?}', [
            CmsAddressController::class,
            'addOrEdit',
        ]);
    });

Route::prefix('_/cms/')
    // ->middleware('api')
    ->group(function () {
        Route::get('/order', [CmsWishlistController::class, 'list']);
        Route::get('/order/{id}', [CmsWishlistController::class, 'get']);
        Route::post('/order', [CmsWishlistController::class, 'place']);
    });
