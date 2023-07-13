<?php

namespace LaravelFrontend\Img;

use Illuminate\Support\Facades\Facade;

class ImgFacade extends Facade
{
  protected static function getFacadeAccessor()
  {
    return 'img';
  }
}
