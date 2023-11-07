<?php

namespace LaravelFrontend\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Session;
use LaravelFrontend\Helpers\Helpers;
use LaravelFrontend\Helpers\EndpointController;

class AuthController extends EndpointController
{
    protected $namespace = 'auth';

    /**
     * Field names to don't retain across sessions
     *
     * @override
     * @var array
     */
    protected $temporaryFields = [
        'password',
        'passwordcheck', // olmoforms might use it
        'newpasswordcheck', // olmoforms might use it
        'password_confirmation', // AuthApi system forms use it
        'password_confirm', // AuthApi system forms use it
        'newpassword', // AuthApi system forms use it
        'newpassword_confirm', // AuthApi system forms use it
    ];

    /**
     * Login POST route handler
     *
     * Successful login requests can have an explicit redirect, but not
     * necessarily, for instance if you login from a "blank state" login page.
     * In this case we redirect by default to the profile route.
     * TODO: we might make this configurable.
     *
     * @param Request $request
     * @return Redirect|Response
     */
    public function login(Request $request, $ajax = false)
    {
        // AuthApi::getRouteUrl('profile')
        $redirect = $this->getRedirect($request);
        $code = 200;
        $data = [];
        $raw = '';
        $action = 'login';
        $status = 'ok';

        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            $code = 400;
            $status = 'required';
            $redirect = $this->getRedirect($request, false);
        } else {
            // return redirect($redirect)->withErrors($validator)->withInput();;

            $response = AuthApi::login($request->all());
            $data = $response->json();
            $code = $response->status();

            if ($response->failed()) {
                $redirect = $this->getRedirect($request, false);
                if ($code === 400) {
                    $status = 'wrongpassword';
                } elseif ($code === 404) {
                    $status = 'unexisting';
                } elseif ($code === 401) {
                    $status = 'inactive';
                } else {
                    $status = 'fail';
                }
            } else {
                // attach the user object on success
                if (!isset($data['user'])) {
                    $data['user'] = AuthApi::user();
                }
                $redirect = Helpers::stripParamsFromUrl($redirect, [
                    // TODO: this could be rethought as it ties the implementation
                    // to the abstraction here in the framework
                    'auth',
                    'auth-dialog',
                    'dialog-auth',
                    'dialog-auth-login',
                    'dialog-auth-register',
                    'dialog-auth-passwordforget',
                    'redirect',
                ]);
            }
        }

        return $this->res(
            $request,
            $redirect,
            $code,
            $data,
            $raw,
            $action,
            $status,
            $ajax
        );
    }

    /**
     * Logout route ANY handler
     *
     * If the user log out from a `auth` only page we still redirect there and
     * let the middleware `auth` handle further redirection.
     *
     * @param Request $request
     * @return Redirect|Response
     */
    public function logout(Request $request, $ajax = false)
    {
        $redirect = $this->getRedirect($request);
        $code = 200;
        $data = [];
        $raw = '';
        $action = '';
        $status = '';

        /**
         * This is a change
         */
        Session::forget('cart');
        Session::forget('cart-lean');

        $response = AuthApi::logout();

        return $this->res(
            $request,
            $redirect,
            $code,
            $data,
            $raw,
            $action,
            $status,
            $ajax
        );
    }

    /**
     * Password change POST route handler
     *
     * @param Request $request
     * @return Redirect|Response
     */
    public function passwordChange(Request $request, $ajax = false)
    {
        // AuthApi::getRouteUrl('password-change');
        $redirect = $this->getRedirect($request);
        $code = 200;
        $data = [];
        $raw = '';
        $action = 'password-change';
        $status = 'ok';

        $password = $request->input('password');
        $newpassword = $request->input('newpassword');
        $newpassword_confirm = $request->input('newpassword_confirm');

        if (!$password || !$newpassword || !$newpassword_confirm) {
            $code = 400;
            $status = 'required';
            $redirect = $this->getRedirect($request, false);
        } elseif ($newpassword !== $newpassword_confirm) {
            $code = 400;
            $status = 'nomatch';
            $redirect = $this->getRedirect($request, false);
        } else {
            $response = AuthApi::passwordChange([
                'password' => $password,
                'newpassword' => $newpassword,
            ]);
            $data = $response->json();
            $code = $response->status();

            if ($response->failed()) {
                $redirect = $this->getRedirect($request, false);
                if ($code === 403) {
                    $status = 'wrongpassword';
                } else {
                    $status = 'unauthorised';
                }
            }
        }

        return $this->res(
            $request,
            $redirect,
            $code,
            $data,
            $raw,
            $action,
            $status,
            $ajax
        );
    }

    /**
     * Password recovery POST route handler
     *
     * Maybe a successfull request should not redirect to the last page but
     * always to the login route
     *
     * @param Request $request
     * @return Redirect|Response
     */
    public function passwordRecovery(Request $request, $ajax = false)
    {
        // AuthApi::getRouteUrl('login');
        $redirect = $this->getRedirect($request);
        $code = 200;
        $data = [];
        $raw = '';
        $action = 'password-recovery';
        $status = 'ok';

        $email = $request->input('email');

        if (!$email) {
            $code = 400;
            $status = 'required';
            $redirect = $this->getRedirect($request, false);
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $code = 400;
            $status = 'invalid';
            $redirect = $this->getRedirect($request, false);
        } else {
            $response = AuthApi::passwordRecovery($request->all());
            $data = $response->json();
            $code = $response->status();

            if ($response->failed()) {
                $redirect = $this->getRedirect($request, false);
                if ($code === 403) {
                    $status = 'unexisting';
                } else {
                    $status = 'fail';
                }
            }
        }

        return $this->res(
            $request,
            $redirect,
            $code,
            $data,
            $raw,
            $action,
            $status,
            $ajax
        );
    }

    /**
     * Password reset POST route handler
     *
     * @param Request $request
     * @return Redirect|Response
     */
    public function passwordReset(Request $request, $ajax = false)
    {
        // AuthApi::getRouteUrl('password-reset');
        $redirect = $this->getRedirect($request);
        $code = 200;
        $data = [];
        $raw = '';
        $action = 'password-reset';
        $status = 'ok';

        $token = $request->input('token');
        $password = $request->input('password');
        $password_confirm = $request->input('password_confirm');

        if (!$password || !$password_confirm) {
            $code = 400;
            $status = 'required';
            $redirect = $this->getRedirect($request, false);
        } elseif ($password !== $password_confirm) {
            $code = 400;
            $status = 'nomatch';
            $redirect = $this->getRedirect($request, false);
        } else {
            $response = AuthApi::passwordReset([
                'password' => $password,
                'token' => $token,
            ]);
            $data = $response->json();
            $code = $response->status();

            if ($response->failed()) {
                $redirect = $this->getRedirect($request, false);
                if ($code === 401) {
                    $status = 'unauthorised';
                } else {
                    $status = 'fail';
                }
            } else {
                $redirect = AuthApi::getRouteUrl('login');
            }
        }

        return $this->res(
            $request,
            $redirect,
            $code,
            $data,
            $raw,
            $action,
            $status,
            $ajax
        );
    }

    /**
     * Profile GET route handler
     *
     * @param Request $request
     * @return Redirect|Response
     */
    public function profile(Request $request, $ajax = false)
    {
        $redirect = $this->getRedirect($request);
        $code = 200;
        $data = [];
        $raw = '';
        $action = '';
        $status = '';

        $response = AuthApi::profile();
        $data = $response->json();
        $code = $response->status();

        return $this->res(
            $request,
            $redirect,
            $code,
            $data,
            $raw,
            $action,
            $status,
            $ajax
        );
    }

    /**
     * Profile update POST route handler
     *
     * @param Request $request
     * @return Redirect|Response
     */
    public function profileUpdate(Request $request, $ajax = false)
    {
        // AuthApi::getRouteUrl('profile');
        $redirect = $this->getRedirect($request);
        $code = 200;
        $data = [];
        $raw = '';
        $action = 'profile';
        $status = 'ok';

        $response = AuthApi::profileUpdate($request->all());
        $data = $response->json();
        $code = $response->status();

        if ($response->failed()) {
            $redirect = $this->getRedirect($request, false);
            if ($code === 401) {
                $status = 'unauthorised';
            } else {
                $status = 'fail';
            }
        }

        return $this->res(
            $request,
            $redirect,
            $code,
            $data,
            $raw,
            $action,
            $status,
            $ajax
        );
    }

    /**
     * Register POST route handler
     *
     * Succesful requests don't redirect you to the last URL but always to the
     * login page with a redirect query param, the login form will read it and
     * put in its `<input>`s.
     * TODO: we might make this configurable
     *
     * @param Request $request
     * @param string $ajax
     * @return Redirect|Response
     */
    public function register(Request $request, $ajax = false)
    {
        // AuthApi::getRouteUrl('login')
        $redirect = $this->getRedirect($request);
        $code = 200;
        $data = [];
        $raw = '';
        $action = 'register';
        $status = 'ok';

        $response = AuthApi::register($request->all());
        $code = $response->status();
        $data = $response->json();

        if ($response->failed()) {
            $redirect = $this->getRedirect($request, false);

            if ($code === 400) {
                $status = 'invalid';
            } elseif ($code === 403) {
                $status = 'blacklisted';
            } elseif ($code === 409) {
                $status = 'existing';
            } else {
                $status = 'fail';
            }
        }

        return $this->res(
            $request,
            $redirect,
            $code,
            $data,
            $raw,
            $action,
            $status,
            $ajax
        );
    }

    /**
     * Get user from session, this is just an ajax endpoint that allows to fetch
     * asynchronously the current user in JavaScript. A use case is for example
     * having a completely statically cached page (enabled by `page-cache`
     * middleware) and where you want to have some dynamic user data.
     *
     * @return JsonResponse
     */
    public function user(Request $request)
    {
        $user = AuthApi::userJs();
        if (empty($user)) {
            $user = false;
        }

        return response()->json($user);
    }

    /**
     * Get guest from session, this is just an ajax endpoint that allows to check
     * asynchronously whether we have a guest user from JavaScript. A use case
     * is for example having a completely statically cached page (enabled by
     * `page-cache` middleware) and where you want to have some dynamic user
     * data.
     *
     * @return JsonResponse
     */
    public function guest(Request $request)
    {
        $isGuest = AuthApi::guest();

        return response()->json($isGuest);
    }

    /**
     * Get a boolean indicating whether we have either a user logged in or a
     * guest
     *
     * @return JsonResponse
     */
    public function userOrGuest(Request $request)
    {
        $user = AuthApi::userJs();
        if ($user) {
            return response()->json($user);
        }

        $isGuest = AuthApi::guest();

        return response()->json($isGuest);
    }

    /**
     * Dummy endpoint/controller to quickly return a 403 with the Http client
     *
     * @return Response
     */
    public function unauthorized(Request $request, $ajax = true)
    {
        if ($ajax) {
            return response()->json(['msg' => 'Not logged in.'], 403);
        }
        abort(403);
    }
}

?>
