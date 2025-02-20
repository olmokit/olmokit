<?php

namespace LaravelFrontend\Auth;

use Exception;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Redirect;
use LaravelFrontend\Helpers\Helpers;
use LaravelFrontend\Cms\CmsCart;
use LaravelFrontend\Forms\Form;

class AuthApi
{
    const SESSION_USER = 'user';

    const SESSION_GUEST_TOKEN = 'guestToken';

    /**
     * Auth API GET request
     *
     * @param string $url
     * @param string $cacheKey
     * @param Callable|null [$adapter=null]
     * @return array|bool
     */
    public static function get(
        string $url = '',
        string $cacheKey = '',
        callable $adapter = null
    ) {
        return Helpers::apiGet($url, $cacheKey, $adapter, 'env.AUTH_API_CACHE');
    }

    /**
     * Get Auth API endpoint URL
     *
     * @param string $endpoint The API endpoint path
     * @return string
     */
    public static function getEndpointUrl(string $endpoint = ''): string
    {
        return Helpers::getEndpointUrlApi($endpoint, 'env.AUTH_API_URL');
    }

    /**
     * Get action endpoint for the given type of auth feature
     *
     * @param "login"|"password-recovery"|"password-reset"|"profile"|"register" $type
     * @return string|bool
     */
    public static function getEndpoint(string $type)
    {
        $endpoint = config('laravel-frontend.auth.actionEndpoints')[$type];

        if ($endpoint) {
            return self::getEndpointUrl($endpoint);
        }

        return false;
    }

    /**
     * Get the "middleware" like local action url, forms will be posted there
     *
     * @param string $type
     * @return void
     */
    public static function getLocalActionUrl(string $type)
    {
        return rtrim(config('env.APP_URL'), '/') .
            formatUrlPath("/_/auth/$type");
    }

    /**
     * Form API GET request
     *
     * @param "login"|"password-recovery"|"password-reset"|"profile"|"register" $type
     * @return array|bool
     */
    public static function getForm(string $type)
    {
        $locale = App::getLocale();
        $endpoint = config('laravel-frontend.auth.formsEndpoints')[$type];
        $requestUrl = self::getEndpointUrl(
            'forms/' . $locale . '/' . $endpoint
        );
        $cacheKey = 'auth.forms.' . $locale . '.' . $endpoint;

        $formId = "auth.$type.form";
        $formData = [
            'action' => self::getLocalActionUrl($type),
        ];
        $remoteData = self::get($requestUrl, $cacheKey);
        if ($remoteData) {
            $formData = array_merge($remoteData, $formData, [
                'origin' => 'AUTH_API',
            ]);
        }

        $form = new Form($formId, $formData);

        if (!$remoteData) {
            // construct a basic form if not provided by the Auht API
            switch ($type) {
                case 'login':
                    $form
                        ->addInput('email', 'email', true)
                        ->addInput('password', 'password', true)
                        ->addSubmit();
                    break;
                case 'password-change':
                    $form
                        ->addInput('password', 'password', true)
                        ->addInput('newpassword', 'password', true)
                        ->addInput('newpassword_confirm', 'password', true)
                        ->addSubmit();
                    break;
                case 'password-recovery':
                    $form->addInput('email', 'email', true)->addSubmit();
                    break;
                case 'password-reset':
                    $form
                        ->addInput('password', 'password', true)
                        ->addInput('password_confirm', 'password', true)
                        ->addSubmit();
                    break;
                case 'profile':
                    $form->addInput('email', 'email', true)->addSubmit();
                    break;
                case 'register':
                    $form
                        ->addInput('email', 'email', true)
                        ->addInput('password', 'password', true)
                        ->addInput('newpassword_confirm', 'password', true)
                        ->addInput('privacy', 'checkbox', true)
                        ->addInput('terms', 'checkbox', true)
                        ->addSubmit();
                    break;
            }
        }

        return $form->json();
    }

    /**
     * Get logout url, to be used in your template with the AuthApi facade
     *
     * It does not need to be localised
     *
     * TODO: we might make a directive for this, or a global variable too
     *
     * @return string
     */
    public static function logoutUrl()
    {
        return self::getLocalActionUrl('logout');
    }

    /**
     * Get route localised url for the given type of auth feature
     *
     * @param "login"|"password-recovery"|"password-reset"|"profile"|"register" $type
     * @return void
     */
    public static function getRouteUrl(string $type)
    {
        $route = config('laravel-frontend.auth.routesMap')[$type];
        return to($route);
    }

    /**
     * Set after login redirect
     *
     * @param string $url
     * @return void
     */
    public static function setLoginRedirect(string $url)
    {
        Session::flash('auth_login_redirect', $url);
    }

    /**
     * Get after login redirect
     *
     * @param string $url
     * @return void
     */
    public static function getAfterLoginRedirect()
    {
        return Session::get('auth_login_redirect');
    }

    /**
     * Check if user is currently logged in
     *
     * @return bool
     */
    public static function check()
    {
        return Session::has(self::SESSION_USER);
    }

    /**
     * Get currently logged in user data
     *
     * @return bool|array
     */
    public static function user()
    {
        return Session::get(self::SESSION_USER);
    }

    /**
     * Check if user is guest
     *
     * @return bool
     */
    public static function guest()
    {
        return Session::has(self::SESSION_GUEST_TOKEN);
    }

    /**
     * Update the user data in session
     *
     * @param array $newData
     * @return void
     */
    public static function updateUser(array $newData = [])
    {
        $user = self::user();
        $user = $user ? array_merge($user, $newData) : $newData;

        Session::put(self::SESSION_USER, $user);
        Session::save();
        Artisan::call('page-cache:clear');
    }

    /**
     * Get currently logged in user data without sensitive information, use this
     * when you want to expose the user data to JavaScript
     *
     * @return bool|array
     */
    public static function userJs()
    {
        $user = self::user();
        if ($user) {
            $blacklist = ['token', 'token_active'];
            return array_diff_key($user, array_flip($blacklist));
        }
        return $user;
    }

    /**
     * Activate
     *
     * @param string $token
     * @return bool|\Illuminate\Support\Facades\Http
     */
    public static function activate(string $token = '')
    {
        if ($token) {
            $endpoint = self::getEndpoint('activate');
            $postData = ['token' => $token];
            // self::debugRequest($endpoint, $postData);
            // $response = Http::post($endpoint, $postData);
            $response = Http::withHeaders([
                'front-token' => config('env.FRONT_TOKEN')
            ])->post($endpoint, $postData);

            return $response;
        }

        return false;
    }

    /**
     * Login
     *
     * We add the `guest` request header here but it is not mandatory, it is
     * just used for the cart migration from guest to logged in user in
     * e-commerce websites.
     *
     * @param array $postData
     * @return \Illuminate\Http\Client\Response
     */
    public static function login(array $postData = [])
    {
        if (self::check()) {
            Redirect::to(self::getRouteUrl('profile'), 302);
        }

        $endpoint = self::getEndpoint('login');
        $postData = self::transformPostData($postData);
        $headers = self::addGuestHeader();
        // self::debugRequest($endpoint, $postData, $headers);
        $response = Http::withHeaders($headers)->post($endpoint, $postData);

        if ($response->successful()) {
            $user = self::transformResponseInUser($response->json());
            $user['current_timezone'] = $postData['current_timezone'];
            self::updateUser($user);
            CmsCart::onLogin();
        }

        return $response;
    }

    /**
     * Logout
     *
     * Note that a logout endpoint is not always required, hence we check
     *
     * In a future we might send the tokens to the logout endpoint.
     *
     * @param string $token
     * @return \Illuminate\Http\Client\Response
     */
    public static function logout(string $token = '')
    {
        // ----> X

        $endpoint = self::getEndpoint('logout');

        if (!$endpoint) {
            return false;
        }

        $response = self::requestWithAuth('post', $endpoint);
        /**
         * This is a change
         * fabs changed this, it was on the top where the X is
         */
        Session::forget(self::SESSION_USER);
        CmsCart::onLogout();

        Artisan::call('page-cache:clear');

        return $response;
    }

    /**
     * This is a change
     *
     * Check the current user session, this is just for a duoble check
     * mainly used for website who change information in the $user variable often
     * to perform action or display information related to the user like
     * general (not coupon) discount or reservation
     *
     * @return BooleanResponse
     */
    public static function checksession()
    {
        $session = self::userSession();

        $status = $session->status();
        if ($status != 200) {
            self::logout();

            return false;
        }

        return true;
    }

    /**
     * This is a change
     *
     * Check the current user session if user session exist
     */
    public static function userSession()
    {
        if (self::check()) {
            $endpoint = self::getEndpointUrl('checksession');
            $response = self::requestWithAuth('post', $endpoint, []);

            return $response;
        }

        return response('No session', 400);
    }

    /**
     * Password change
     *
     * @param array $postData
     * @return \Illuminate\Http\Client\Response
     */
    public static function passwordChange(array $postData = [])
    {
        $endpoint = self::getEndpoint('password-change');
        $postData = self::transformPostData($postData, false);
        // self::debugRequest($endpoint, $postData);
        $response = self::requestWithAuth('post', $endpoint, $postData);

        return $response;
    }

    /**
     * Password recovery
     *
     * @param array $postData
     * @return \Illuminate\Http\Client\Response
     */
    public static function passwordRecovery(array $postData = [])
    {
        $endpoint = self::getEndpoint('password-recovery');
        $postData = self::transformPostData($postData, false);
        $postData['reset_url'] =
            self::getRouteUrl('password-reset') . '?token=';
        // self::debugRequest($endpoint, $postData);        
        // $response = Http::post($endpoint, $postData);

        $response = Http::withHeaders([
            'front-token' => config('env.FRONT_TOKEN')
        ])->post($endpoint, $postData);        

        return $response;
    }

    /**
     * Password reset
     *
     * @param array $postData
     * @return \Illuminate\Http\Client\Response
     */
    public static function passwordReset(array $postData = [])
    {
        $endpoint = self::getEndpoint('password-reset');
        $postData = self::transformPostData($postData, false);
        // self::debugRequest($endpoint, $postData);
        // $response = Http::post($endpoint, $postData);

        $response = Http::withHeaders([
            'front-token' => config('env.FRONT_TOKEN')
        ])->post($endpoint, $postData);

        return $response;
    }

    /**
     * Profile retrieval
     *
     * @return \Illuminate\Http\Client\Response
     */
    public static function profile()
    {
        $endpoint = self::getEndpoint('profile');
        $response = self::requestWithAuth('get', $endpoint);

        return $response;
    }

    /**
     * Profile update
     *
     * @param array $postData
     * @return \Illuminate\Http\Client\Response
     */
    public static function profileUpdate(array $postData = [])
    {
        $endpoint = self::getEndpoint('profile');
        $postData = self::transformPostData($postData);
        // self::debugRequest($endpoint, $postData);
        $response = self::requestWithAuth('post', $endpoint, $postData);
        if ($response->successful()) {
            $user = self::transformResponseInUser($response->json());
            self::updateUser($user);
        }

        return $response;
    }

    /**
     * Register
     *
     * @param array $postData
     * @return \Illuminate\Http\Client\Response
     */
    public static function register(array $postData = [])
    {
        if (self::check()) {
            Redirect::to(self::getRouteUrl('profile'), 302);
        }

        $endpoint = self::getEndpoint('register');
        $postData = self::transformPostData($postData);

        // get default activate url route
        $activateUrl = self::getRouteUrl('activate') . '?';

        // add a redirect in the activation link if it is present
        // FIXME: this does not work because the Laravel Mailer class used in
        // the API escapes incorrectly the amper sand & char generating a broken
        // link, once that is fixed we could actually turn this on, it will work
        // $redirect = $postData['_redirect'] ?? '';
        // if ($redirect) {
        //     $activateUrl .= 'redirect=' .formatUrl($redirect).'';
        // }

        // add the token param, the token value will be add by the Auth API
        $activateUrl .= 'token=';

        $postData['activate_url'] = $activateUrl;

        $headers = self::addGuestHeader();
        // self::debugRequest($endpoint, $postData, $headers);
        $response = Http::withHeaders($headers)->post($endpoint, $postData);

        if (
            config('env.AUTH_REGISTER_LOGIN') == 'true' and
            $response->status() == 200
        ) {
            $user = self::transformResponseInUser($response->json());
            $user['current_timezone'] = $postData['current_timezone'];
            self::updateUser($user);
            CmsCart::onLogin();
        }

        return $response;
    }

    /**
     * Start guest session, it does not do anything if the session has already
     * started
     *
     * @return void
     */
    public static function startGuestSession()
    {
        $guestToken = Session::get(self::SESSION_GUEST_TOKEN);
        if (!$guestToken) {
            Session::put(
                self::SESSION_GUEST_TOKEN,
                md5(time() . rand(100, 999))
            );
            Session::save();
        }
    }

    /**
     * Clear guest session
     *
     * @return void
     */
    public static function clearGuestSession()
    {
        Session::forget(self::SESSION_GUEST_TOKEN);
        Session::save();
    }

    /**
     * Get auth header array to use with `Http::withHeader(...)`
     *
     * @param bool $allowGuest Whether to allow guest authentication through session
     * @return array|bool
     */
    public static function getHeaders(bool $allowGuest = false)
    {
        $headers = [];

        if ($user = self::user()) {
            $headers['X-Token'] = $user['token'];
        }

        if ($allowGuest) {
            $headers = self::addGuestHeader($headers);
        }

        $headers['front-token'] = config('env.FRONT_TOKEN');

        if (count($headers)) {
            return $headers;
        }

        return false;
    }

    /**
     * Add `guest` request header
     *
     * @param array $headers
     * @return array
     */
    public static function addGuestHeader(array $headers = [])
    {
        $guestToken = Session::get(self::SESSION_GUEST_TOKEN);
        if ($guestToken) {
            $headers['X-Guest'] = $guestToken;
        }

        $headers['front-token'] = config('env.FRONT_TOKEN');

        return $headers;
    }

    /**
     * Request URL with authentication
     *
     * Iif the url contains this flag, we guest authentication through session
     *
     * @param 'get'|'post'|'patch'|'put'|'delete' $method The request method
     * @param string $url
     * @param null|array [$requestBody]
     * @param bool $allowGuest Whether to allow guest authentication through session
     * @return \Illuminate\Http\Client\Response
     */
    public static function requestWithAuth(
        $method = 'get',
        $url,
        $requestBody = []
    ) {
        if ($debug = Str::contains($url, '[debug]')) {
            $url = str_replace('[debug]', '', $url);
        }

        if ($allowGuest = Str::contains($url, '[guest]')) {
            $url = str_replace('[guest]', '', $url);
        }

        if ($headers = self::getHeaders($allowGuest)) {
            if ($method === 'get') {
                $response = Http::withHeaders($headers)->get(
                    $url,
                    $requestBody
                );
            }
            if ($method === 'post') {
                $response = Http::withHeaders($headers)->post(
                    $url,
                    $requestBody
                );
            }
            if ($method === 'patch') {
                $response = Http::withHeaders($headers)->patch(
                    $url,
                    $requestBody
                );
            }
            if ($method === 'put') {
                $response = Http::withHeaders($headers)->put(
                    $url,
                    $requestBody
                );
            }
            if ($method === 'delete') {
                $response = Http::withHeaders($headers)->delete(
                    $url,
                    $requestBody
                );
            }

            if ($response) {
                if ($debug) {
                    dd([
                        'requestMethod' => $method,
                        'requestUrl' => $url,
                        'requestBody' => $requestBody,
                        'requestHeaders' => $headers,
                        'responseStatus' => $response->status(),
                        'responseJson' => $response->json(),
                    ]);
                }

                return $response;
            }

            throw new Exception(
                'LaravelFrontend AuthApi:requestWithAuth invalid "method".'
            );
        }

        if ($debug) {
            dd($method, $url, $requestBody, 'unauthorized');
        }

        return Http::get(self::getLocalActionUrl('unauthorized'));
    }

    /**
     * Transform post data
     *
     * Operates some standard transformations on the data posted by the frontend
     * to the backend API.
     *
     * @param array $data
     * @param bool $sendCurrent Whether to add current data about locale and timezone to the server
     * @return array
     */
    private static function transformPostData(
        array $data = [],
        bool $sendCurrent = true
    ) {
        // remove the laravel token, it does not need to be sent further
        unset($data['_token']);

        foreach ($data as $key => $value) {
            // hash all fields that contain the word `password`
            if (strpos($key, 'password') !== false) {
                $data[$key] = md5($value);
            }

            // remove password check fields
            if (strpos($key, 'password_check') !== false) {
                unset($data[$key]);
            }
        }

        if ($sendCurrent) {
            // always add the current locale information
            $data['current_locale'] = App::getLocale();

            // always add the current timezone information
            $data['current_timezone'] = self::getTimezoneFromPostData($data);
        }

        // unset from post data the offset used for calculation
        unset($data['_timezone_offset']);

        // unset from post data the redirect
        unset($data['_redirect']);

        return $data;
    }

    /**
     * Get current user timezone from post data
     *
     * @param array $data
     * @return string|null Timezone in standard format, e.g. "Europe/Paris", it returns null if unavailable
     */
    public static function getTimezoneFromPostData(array $data = [])
    {
        $timezoneOffset = $data['_timezone_offset'] ?? null;

        if ($timezoneOffset) {
            // convert minutes to seconds
            $timezoneOffset = (int) $timezoneOffset;
            $timezone = timezone_name_from_abbr(
                '',
                $timezoneOffset * 60,
                false
            );

            return $timezone;
        }

        return null;
    }

    /**
     * Transform the raw Auth endpoint response into the user object to store
     * in session
     *
     * @param array $json The Http::response()->json() value
     */
    public static function transformResponseInUser(array $json = [])
    {
        $data = $json['user'];

        if (isset($data['id'])) {
            $data['ga_id'] = md5($data['id'] . 'ga_id');
        }

        if (isset($data['password'])) {
            unset($data['password']);
        }
        if (isset($data['token_active'])) {
            unset($data['token_active']);
        }

        return $data;
    }

    /**
     * Debug POST request helper
     *
     * @param string $endpoint
     * @param array $postData
     * @param array $headers
     * @return void
     */
    private static function debugRequest(
        string $endpoint = '',
        array $postData = [],
        array $headers = []
    ) {
        dd([
            'endpoint' => $endpoint,
            'postData' => $postData,
            'headers' => $headers,
        ]);
    }
}
