<?php

namespace LaravelFrontend\App\Controllers;

use Illuminate\Http\Request;

class Download
{
  const PATH = '/_/download/{path}';

  const PATH_AUTH = '/_/download_auth/{path}';

  /**
   * Get download file response
   *
   * It allows to have static files in `src/assets/media` to download or view
   * as files
   *
   * @param string $path
   * @return Response
   */
  public function get(Request $request, string $path)
  {
    $viewIt = $request->query('view');

    $fullpath = public_path('assets/media/' . $path);

    if (file_exists($fullpath)) {
      if ($viewIt) {
        // display the file in the browser (whether that is possible)
        return response()->file($fullpath);
      }

      // force the download of the file
      return response()->download($fullpath);
    }

    abort(404);
  }

  /**
   * Get download file url
   *
   * @param string $path
   * @param boolean $withAuth
   * @return string
   */
  public static function getUrl(
    string $path = '',
    bool $viewIt = false,
    bool $withAuth = false
  ) {
    $query = $viewIt ? '?view=true' : '';

    if ($withAuth) {
      return str_replace('{path}', $path, self::PATH_AUTH) . $query;
    }

    return str_replace('{path}', $path, self::PATH) . $query;
  }
}
