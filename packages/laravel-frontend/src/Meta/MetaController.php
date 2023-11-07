<?php

namespace LaravelFrontend\Meta;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Response;

class MetaController extends Controller
{
    /**
     * Page: hooks homepage
     *
     * @return Response
     */
    public function home()
    {
        return view('components.debug-meta', [
            'param' => '?' . config('env.HOOKS_ALLOWED_PARAM'),
        ]);
    }
}
