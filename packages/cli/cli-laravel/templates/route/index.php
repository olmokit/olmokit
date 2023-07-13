<?php

namespace resources\routes;

use LaravelFrontend\App\Controllers\Base;

/**
 * <%= route.className %> route controller
 * 
 * You can put some custom logic and behaviour for the route <%= route.slug %>.
 * This file is optional, it can even be deleted if desired.
 */
class Route<%= route.className %> extends Base
{

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // optionally disable automatic route's data caching
        // $this->disableCache();<% if (!isExceptionRoute) { %>

        // optionally enable super static page cache
        // $this->middleware('page-cache');<% } %>
    }

    /**
     * Add custom variables at the root scope of a route template
     * 
     * e.g. returning `['me' => [ 'name' => 'Myname' ] ]` you will have in your
     * blade template the variable accessible as such `{{ $me['name'] }}`
     *
     * @return array
     */
    protected function addVars(): array
    {
        return [];
    }

    /**
     * Process API data before they are cached and exposed to the route template
     *
     * @param array $data
     * @return array Transformed API data
     */
    public function processApiData($data): array
    {
        return $data;
    }
}
