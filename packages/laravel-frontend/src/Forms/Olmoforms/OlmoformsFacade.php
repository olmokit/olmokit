<?php

namespace LaravelFrontend\Forms\Olmoforms;

use Illuminate\Support\Facades\Facade;

class OlmoformsFacade extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'olmoforms';
    }
}
