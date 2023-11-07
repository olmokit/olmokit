<?php

namespace LaravelFrontend\Meta;

use Illuminate\Http\Middleware\TrustHosts;

/**
 * Meta Middleware
 *
 * This middleware aims to protect against unproper use of the web hooks
 * endpoint exposed by the frontend application. Their use is to perform tasks
 * related to its comunication with external services in regards to caching,
 * translations etc. To test these hooks you might want to open your terminal
 * and use curl to perform request with different domains origins, for instance:
 *
 * curl framework-test.test/_/hooks/cache/clear -H "Origin: http://example.com"
 *
 * While the first should succeed, the other should return an error message.
 */
class MetaMiddleware extends TrustHosts
{
    /**
     * Get the host patterns that should be trusted.
     *
     * use of `array_filter` to automatically remove empty strings
     * @see https://stackoverflow.com/a/3654309/1938970
     *
     * @return array
     */
    public function hosts()
    {
        return array_filter(
            array_merge(
                [
                    $this->allSubdomainsOfApplicationUrl(),
                    parse_url(config('env.CMS_API_URL'), PHP_URL_HOST),
                    parse_url(config('env.AUTH_API_URL'), PHP_URL_HOST),
                ],
                explode(',', config('env.HOOKS_ALLOWED_DOMAINS'))
            )
        );
    }

    /**
     * Get the ip address that should be trusted.
     *
     * use of `array_filter` to automatically remove empty strings
     * @see https://stackoverflow.com/a/3654309/1938970
     *
     * @return array
     */
    public function ips()
    {
        $defaults = [];
        $urls = [
            config('env.APP_URL'),
            config('env.CMS_API_URL'),
            config('env.AUTH_API_URL'),
        ];
        $ips = [];

        foreach ($urls as $url) {
            if ($url) {
                $hostname = parse_url($url, PHP_URL_HOST);
                $defaults[] = gethostbyname($hostname);
            }
        }

        $defaults = array_unique($defaults);

        return array_merge(
            $defaults,
            array_filter(explode(',', config('env.HOOKS_ALLOWED_IPS')))
        );
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  callable  $next
     * @return \Illuminate\Http\Response
     */
    public function handle($request, $next)
    {
        // the query parameter allows the hooks to be run directly from the
        // browser and takes priority
        $allowedParam = config('env.HOOKS_ALLOWED_PARAM');
        if ($allowedParam && $request->query->has($allowedParam)) {
            return $next($request);
        }

        $allowedHosts = $this->hosts();
        $allowedIps = $this->ips();
        $requestHost = parse_url(
            $request->headers->get('origin'),
            PHP_URL_HOST
        );
        $requestIp = $request->getClientIp();

        if (
            !in_array($requestHost, $allowedHosts, false) &&
            !in_array($requestIp, $allowedIps, false)
        ) {
            exit(
                'Unauthorized hook invocation attempt from ' .
                    ($requestHost ?? ($requestIp ?? 'unknown'))
            );
        }

        return $next($request);
    }
}
