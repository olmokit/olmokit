<?php

namespace LaravelFrontend\Auth;

use Closure;
use Illuminate\Http\Request;
use LaravelFrontend\Auth\AuthApi;
use LaravelFrontend\Helpers\Helpers;

class MiddlewareActivate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->query('token');

        if ($token && !AuthApi::check()) {
            $response = AuthApi::activate($token);

            if ($response) {
                // FIXME: the first check is just an error in the backend API,
                // that should be fixed there and then removed here
                if ($response == '200' || $response->successful()) {
                    // status 200
                    Helpers::flashStatus('auth', '', 'activate.verified');

                    // if the token worked remove it from url
                    $request->query->remove('token');

                    return redirect()->to($request->url());
                } else {
                    // status 409
                    Helpers::flashStatus('auth', '', 'activate.invalid');
                }
            } else {
                $request->session()->forget('auth_status');
            }
        }

        return $next($request);
    }
}
