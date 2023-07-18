---
title: App
---

## Composers

### App Composer

This composer provider _always_ exposes to **all views** the following data:

- `$trans`: all translated strings for the current locale, keys can be interpolated dynamically in the template with dynamic variables, for instance one could do in a blade file: `{{ $trans['myStaticPrefix'.$data['myDynamicSuffix']] }}`
- `$locale`: the current locale code, same as doing `App::getLocale()`
- `$i18n`: internationalization related part of the response from the [`CMS API structure endpoint`](./Cms.md#structure)
- `$analytics`: analytics related part of the response from the [`CMS API structure endpoint`](./Cms.md#structure)
- `$user`: currently logged in user data from session, same as doing `AuthApi::user()`
- `$userJs`: currently logged in user data from session without sensitive data like tokens, use this to [expose the user to JavaScript](../guides/data.md#accessing-the-currently-authenticated-user), same as doing `AuthApi::userJs()`

## Controllers

### Route's Base controller

Each of your project route's controllers should extend `LaravelFrontend\App\Controllers\Base`. It always exposes:

- to its **route view** (you need to manually forward it to sub components in case you need):

  - `$data`: all the data coming from the CMS API for the given route, merged with those defined in the `routes/{myroute}/index.json` file and those add by the route's controller `addVars` method.
  - `$test`: data defined in the `routes/{myroute}/test.json` file when the URL is requested with a `?test=true` query parameter.

- to **all views** (including routes' sub components):
  - `$route`: the route name/id, which matches both the CMS API `/structure -> routes` endpoint and the route folder name in the structure of your project
  - `$useBarba`: whether the current route uses [barba.js](https://barba.js.org/)
  - `$cached`: whether this route is potentially being served by `page-cache` middleware, in that case stuff like authentication will need to be all asynchronously implemented in JavaScript.
  - `$langs`: an array of data regarding the localisation for the current route, this data can be used in child components without being passed down manually and is meant to build components like language switchers. Each array element contains:
    - `current`: boolean value that states if this locale is the current one
    - `locale`: the locale code, e.g. `en` or `it`
    - `url`: the current route's url localised for this locale
    - `switchUrl`: the internal laravel endpoint used to switch language for the current route with this locale, this is used in the core component `<x-i18n-links />`
  - `$isErrorRoute`: `boolean` value to flag the error pages (`400`, `404`, `419`, `500`, `503`)

:::note

Each route can define a `test.json` file in its test folder, when this route is visited with query param `?test=true` you will have in your route blade template the `$test` variable accessible that you might print for instance with the helper function `json`, sample:

```html
<p>My test data is:</p>

@json($test)
```

:::

### Route's options

Route controllers that extends `LaravelFrontend\App\Controllers\Base` can be tweaked in their behaviour thrugh some public class properties:

- `$cmsApiSlug` _null|string_: `null` by default, if set the API call to the Cms will use this slug to fetch the route data, the final request URL will be prefixed by the current `locale` therefore looking as such: `$CMS_API_URL/$locale/$cmsApiSlug`
- `$useBarba` _bool_: `false` by default, set this to `true` if your route i managed through the [barba.js](https://barba.js.org/) lifecycles.

## Middleware

Middlewares can be used in a fragment route defintion, for instance in `/src/fragments/routes.php`:

```php
Route::get("userdialog", [AuthDialog::class, "render"])->middleware("auth");
```

or in a route's Controller, for instance in `/src/routes/wishlist/index.php`:

```php
class RouteWishlist extends Base
{
    public function __construct()
    {
        $this->middleware('auth');
    }
```

:::note

You can [create your custom middlewares](#creating-custom-middlewares) if needed.

:::

Custom available middlewares are:

### `auth`

Allows a request only to be reached by authenticated users, otherwise they will be redirected to the `login` route ([the route name is configurable](../guides/authentication.md#frontend-configuration)).

### `auth.activate`

Verifies a recently registered user's email. It must be put in the `activate` route (by the default the same as the login route, [the route name is configurable](../guides/authentication.md#frontend-configuration)).

### `guest`

Allows a request only to be reached by non-authenticated users, otherwise they will be redirected to the `profile` route ([the route name is configurable](../guides/authentication.md#frontend-configuration)).

### `page-cache`

Determines if a request should be cached by [silber/page-cache](https://github.com/JosephSilber/page-cache), it only does if there are no query parameters and we are not in the `local` environment.

### `dev.only`

Allows a request only to be reached during `local` development, otherwise it redirects to 404.

### Creating custom middlewares

In your `src/middlewares` folder (create it if you don't have it) you can create your custom middlewares classes. Each class should defined a property `$name` that can be:

- `public $name = 'global'`: for middlewares run by default to every request to your application.
- `public $name = 'web'`: for middlewares run in the 'web' middleware group (basically all public routes)
- `public $name = 'custom-name'`: for middleware that are used individually, for instance inside a route's Controller constructor ([see example](#middleware)) or in a custom route definition ([see example](#custom-routes).

A simple example could be:

in `src/middlewares/TestWebMiddleware.php`

```php
<?php

namespace resources\middlewares;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Closure;

class TestWebMiddleware
{
  /**
   * @var {'global' | 'web' | string}
   */
  public $name = "web";

  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @return mixed
   */
  public function handle(Request $request, Closure $next)
  {
    Session::put("testWebMiddleware", "web middleware works");

    return $next($request);
  }
}
```

:::note

Remember that the _file name_ and the php _class name_ must match as per the autoloading standards.

:::

Under the hood a dynamic file is automatically generated at `/resources/middlewares/Middlewares.php` containing the custom middlewares subdivided by types, deriving it from the property `$name`. In `laravel-frontend`'s `App/Http/Kernel.php` we then **merge** these project specific middlewares with those provided by default by the library (which cannot be removed).

## Routes

Routes are automatically derived from the folder structure of your `src/routes/` folder and usually [but not necessarily](../guides/working-without-api.md) work in tandem with the response of the CMS API. Routes are defined merging those declared by the [`CMS_API_URL/structure` endpoint](Cms.md#structure) (_dynamic routes_) with those determined by your folder structure (_static routes_).

### Routes organization

Route files are organised by folder, each route has its own folder and all its related `php`/`json`/`js`/`scss` files is placed there. Every php/json file inside these folders is flattened to the `resources/` folder and its name is modified through `@olmokit/cli`. See [more info here](../folder-structure.md#srcroutes).

### Custom routes

Although it is not recommended you can add other custom routes by adding a file `src/routes/routes.php` and use the standard Laravel way of registering routes, e.g.:

```php
<?php

use Illuminate\Support\Facades\Route;
use resources\routes\Hello;

Route::get("hello", [Hello::class, "get"]);
Route::get("weird-page", [Hello::class, "get"])->middleware("custom-middleware");
Route::redirect("/an-old-url", "/", 302);
```

You can then create your custom controllers or PHP classes directly in the routes folder in order to preserve the file naming, skipping the [aforementioned transformations](#routes-organization), e.g. in `src/routes/Hello.php`:

```php
<?php

namespace resources\routes;

class Hello
{
  /**
   * @return string
   */
  protected function get(): string
  {
    return "hello";
  }
}
```

## Services

In general it's quite unlikely that you might need a cusotm service provider as it is better to encapsulate functionalities within components or fragments. Anyway you can still create them almost exactly as in the normal Laravel way by adding your files into `src/services` (create it if you don't have it) and registering the providers in `config/app.php`.

### Creating custom service providers

Here is a simple example:

in `config/app.php`:

```php
<?php

return [
  "providers" => [resources\services\TestServiceProvider::class],
];
```

in `src/services/TestComposer.php`:

```php
<?php

namespace resources\services;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Blade;
use Illuminate\View\View;

class TestComposer
{
  /**
   * Bind data to the view.
   *
   * @param  View  $view
   * @return void
   */
  public function compose(View $view)
  {
    $data = ["sample" => "custom directive works"];

    $view->with("testComposer", "service composer works");

    /**
     * Test composer custom directive
     *
     * @param string $key
     * @return void
     */
    Blade::directive("test", function (string $key = "") use ($data) {
      return $data[$key] ?? $key . " (missing key)";
    });
  }
}
```

in `src/services/TestServiceProvider.php`:

```php
<?php

namespace resources\services;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;

class TestServiceProvider extends ServiceProvider
{
  /**
   * Bootstrap any application services.
   *
   * @return void
   */
  public function boot()
  {
    View::composer("*", '\resources\services\TestComposer');
  }
}
```
