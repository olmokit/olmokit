<?php

namespace LaravelFrontend\Meta;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Response;

class InfoController extends Controller
{
  /**
   * Page: info php page
   *
   * @return Response
   */
  public function infoPhp()
  {
    return phpinfo();
  }
}
