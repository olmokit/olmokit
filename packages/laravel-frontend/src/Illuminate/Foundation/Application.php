<?php

namespace LaravelFrontend\Illuminate\Foundation;

use Illuminate\Foundation\Application as Base;

class Application extends Base
{
  protected $libPath = '';

  /**
   * Set the base path for the application.
   *
   * @param  string  $basePath
   * @return $this
   */
  public function setBasePath($basePath)
  {
    $this->basePath = rtrim($basePath, '\/');
    $this->libPath =
      $this->basePath .
      DIRECTORY_SEPARATOR .
      'vendor' .
      DIRECTORY_SEPARATOR .
      'olmo' .
      DIRECTORY_SEPARATOR .
      'laravel-frontend';

    $this->bindPathsInContainer();

    return $this;
  }

  /**
   * Get the path to the @laravel-frontend library.
   *
   * @param  string  $path Optionally, a path to append to the base path
   * @return string
   */
  public function libPath($path = '')
  {
    return $this->libPath . ($path ? DIRECTORY_SEPARATOR . $path : $path);
  }

  /**
   * Get the path to the application "fragments" directory.
   *
   * @laravel-frontend this override is needed to allow components to have
   * classes in our custom folder structure
   *
   * @param  string  $path
   * @return string
   */
  public function fragmentsPath($path = '')
  {
    return $this->resourcePath(
      'fragments' . ($path ? DIRECTORY_SEPARATOR . $path : $path)
    );
  }

  /**
   * Get the path to the application "app" directory.
   *
   * @laravel-frontend this override is needed to allow components to have
   * classes in our custom folder structure
   *
   * @param  string  $path
   * @return string
   */
  public function path($path = '')
  {
    // $appPath = $this->appPath ?: $this->libPath . DIRECTORY_SEPARATOR . 'app';
    // return $appPath . ($path ? DIRECTORY_SEPARATOR . $path : $path);
    return $this->resourcePath($path);
  }

  /**
   * Get the path to the defaults @laravel-frontend configuration files.
   *
   * @param  string  $path Optionally, a path to append to the config path
   * @return string
   */
  public function configLibPath($path = '')
  {
    return $this->libPath .
      DIRECTORY_SEPARATOR .
      'config' .
      ($path ? DIRECTORY_SEPARATOR . $path : $path);
  }
}
