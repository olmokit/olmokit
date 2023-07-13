<?php

namespace LaravelFrontend\App\Controllers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Response;
use LaravelFrontend\Cms\CmsApi;

/**
 * Robots route controller
 *
 * @see http://www.robotstxt.org/robotstxt.html
 */
class Robots
{
  /**
   * Handler for `robots.txt` route, block everything except for production
   * environment, where the robots content is provided by the CMS
   *
   * The Content-Length is used to force search engines to recognise the file
   * @see https://stackoverflow.com/a/36197235/1938970
   *
   * @return Response
   */
  public function render()
  {
    $env = App::environment();
    if ($env === 'production' || $env === 'prod') {
      $txt = CmsApi::getRobotsData();

      return Response::make($txt, 200, [
        'Content-Type' => 'text/plain; charset=UTF-8',
      ]);
    }

    $txt = ['User-agent: *', 'Disallow: /'];
    $txt = implode(PHP_EOL, $txt);

    return Response::make($txt, 200, [
      'Content-Type' => 'text/plain; charset=UTF-8',
      'Content-Length' => strlen($txt),
    ]);
  }
}
