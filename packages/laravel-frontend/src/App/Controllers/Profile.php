<?php

namespace LaravelFrontend\App\Controllers;

use LaravelFrontend\App\Controllers\Base;

class Profile extends Base
{
    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // optionally disable automatic route's data caching
        // $this->disableCache();

        // optionally enable super static page cache (cleared with hooks)
        // $this->middleware('page-cache');
    }
}
