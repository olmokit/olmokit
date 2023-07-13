<?php

if (!function_exists('lib_path')) {
  /**
   * Get the path to the custom base laravel library.
   *
   * @param  string  $path
   * @return string
   */
  function lib_path($path = '')
  {
    return app()->libPath($path);
  }
}

if (!function_exists('fragments_path')) {
  /**
   * Get the path to the custom fragments directory.
   *
   * @param  string  $path
   * @return string
   */
  function fragments_path($path = '')
  {
    return app()->fragmentsPath($path);
  }
}
