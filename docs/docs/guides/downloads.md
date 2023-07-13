---
title: Download files
---

Usually static files and downloads should be performed through an interaction with the [CMS API](../laravel-frontend/Cms.md), the files are stored there and the API expose the endpoints for downloading them.
Nonetheless there are still times where you want to make some static frontend files downloadable. To achieve that you can place them in `src/assets/media` and quickly use the helper functions [`download`](../laravel-frontend/Helpers.md#download) or [`downloadWithAuth`](../laravel-frontend/Helpers.md#downloadwithauth) to output their links.

In your template, e.g. `src/routes/home`

```php
<a href="{{ download('example.pdf') }}">Download file</a>
```

See more about [these helpers in their docs](../laravel-frontend/Helpers.md#download).

## Custom implementations

Despite the helpers you might still want to create your own download implementation, here is an example:

### Download route through [`fragments`](../laravel-frontend/Fragments.md)

In `src/fragments/routes.php` add

```php
<?php

use Illuminate\Support\Facades\Route;
use resources\fragments\Download;

Route::get("download/{path}", [Download::class, "get"]);
```

Now create a file `src/fragments/Download.php` along the lines of:

```php
<?php

namespace resources\fragments;

class Download
{
  public function get(string $path)
  {
    $fullpath = public_path("assets/media/" . $name . "." . $extension);

    // maybe you can have here some custom logic

    if (file_exists($fullpath)) {
      // to force the download of the file:
      // return response()->download($fullpath);

      // to display the file in the browser (whether that is possible):
      return response()->file($fullpath);
    }

    abort(404);
  }
}
```

In your template, e.g. `src/routes/home`

```php
<a href="/_/fragments/download/myfile.xls">Download file</a>
```
