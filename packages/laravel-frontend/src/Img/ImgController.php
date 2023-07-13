<?php

namespace LaravelFrontend\Img;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Response;
use Intervention\Image\Facades\Image;
use LaravelFrontend\Img\Img;
use DateTime;

class ImgController extends Controller
{
  private function getImage($key, $ext)
  {
    $image = Cache::get($key . '-' . $ext, false);

    if (!$image) {
      // return abort(404);
      return Response::make(Img::getPlaceholder(), 200, [
        'Content-Type' => 'image/jpeg',
      ]);
    }

    // by default, the most supported
    $mime = 'image/jpeg';

    // first, the most used
    if ($ext == 'webp') {
      $mime = 'image/webp';
    } elseif ($ext == 'png') {
      $mime = 'image/png';
      // last, the less common
    } elseif ($ext == 'gif') {
      $mime = 'image/gif';
    }

    $date = new DateTime();
    $date->modify('+365 day');

    // sets etag to ensure browsers can cache the image
    return Response::make($image, 200, [
      'Content-Type' => $mime,
      'Etag' => $key, // md5(request()->url()),
    ])
      ->setMaxAge(604800)
      ->setPublic()
      // TODO: should be not done here perhaps? Image names are unique
      // but maybe the expiration date should be calculated upon creation
      // rather than here
      ->setExpires($date);
  }

  public function getCachedByPath($path)
  {
    $dirname = pathinfo($path, PATHINFO_DIRNAME);
    $filename = pathinfo($path, PATHINFO_FILENAME);
    $key = $dirname . '/' . $filename;
    $ext = pathinfo($path, PATHINFO_EXTENSION);

    return $this->getImage($key, $ext);
  }

  /**
   * Get cached image endpoint
   *
   * It Get the image from cache and returns a response with the right
   * encoding. If the image is not there it goes in 404. Images creation is in
   * fact limited to the interaction with the \Img class through code.
   *
   * @param string $key
   * @return Response
   */
  public function getCachedByKey($key, $name)
  {
    $ext = pathinfo($name, PATHINFO_EXTENSION);

    return $this->getImage($key, $ext);
  }

  /**
   * Try endpoint, used during local development only (protected by a
   * middleware) allow developers to test the image resizer functionality
   * through query URL parameters.
   *
   * @devtool
   * @return Response
   */
  public function try(string $src = '')
  {
    $img = new Img($src, Request::query());
    $image = Image::make($img->source);

    Img::doTransform($image, $img->params);

    return Response::make($image->encode()->encoded, 200, [
      'Content-Type' => 'image/jpeg',
    ]);
  }
}
