<?php

return [
    'auth' => [
        'routesMap' => [
            'activate' => 'login',
            'login' => 'login',
            'password-change' => 'profile',
            'password-recovery' => 'passwordrecovery',
            'password-reset' => 'passwordreset',
            'profile' => 'profile',
            'register' => 'register',
        ],
        'actionEndpoints' => [
            'activate' => 'activate',
            'login' => 'login',
            'logout' => 'logout',
            'password-change' => 'password-change',
            'password-recovery' => 'password-recovery',
            'password-reset' => 'password-reset',
            'profile' => 'profile',
            'register' => 'register',
        ],
        'formsEndpoints' => [
            'login' => 'login',
            'password-change' => 'password-change',
            'password-recovery' => 'password-recovery',
            'password-reset' => 'password-reset',
            'profile' => 'profile',
            'register' => 'register',
        ],
    ],
    'checkout' => [
        'routesMap' => [
            'auth' => 'checkoutauth',
            'details' => 'checkoutdetails',
            'payment' => 'checkoutpayment',
            'summary' => 'checkoutsummary',
            'credit-card' => 'checkoutcreditcardpayment',
            'completed' => 'checkoutcompleted',
        ],
    ],
    'i18n' => [
        'default_locale' => 'en',
        'locales' => [],
        'enforce_localised_urls' => true,
        'hide_default_locale_in_url' => false,
    ],
];
