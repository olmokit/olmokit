<?php

namespace LaravelFrontend\Cms;

use Illuminate\Support\Facades\Facade;

class CmsApiFacade extends Facade
{
  protected static function getFacadeAccessor()
  {
    return 'cmsapi';
  }
}
