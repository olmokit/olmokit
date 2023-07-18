---
title: Async behaviours
# import ReactPlayer from "react-player";
# import fragmentsReplaceSrc from '@site/static/screencasts/fragments-replace.webm';
---

This document aims to explain various techniques and implementations of async behaviours in your frontend application.

## Basic async fragment replace

<!-- <ReactPlayer url={fragmentsReplaceSrc} loop autoPlay playsInline mute="true" controls /> -->

Let's say you have a component in `src/components/ProductDetail/` that you want to inject asynchronously into a route.

In your route template, e.g. in `/src/routes/myroute/index.blade.php` write:

```html
<x-fragments-replace id="product">
  <p>Loading product...</p>
</x-fragments-replace>
```

In your route js, e.g. in `/src/routes/myroute/index.js`:

```js
import ProductDetail from "components/ProductDetail";
import { replaceFragment } from "@olmokit/core/fragments";

// basic usage
replaceFragment("product", "components.ProductDetail");

// or pass custom data to the component with:
replaceFragment("product", "components.ProductDetail", { myData: "this is async" });

// or initialise the component once rendered
replaceFragment("product", "components.ProductDetail").then(() => ProductDetail());
```

Done, the component is automatically fetched and placed inside your template.

:::note

You need to import the js/scss of your component either in the route from where you requested it or asynchronously with [dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports).

:::

### Altering a component when used as a fragment

You might find useful to use the same route or component both in a _fragment way_ (asynchronous) and in _standard way_ (synchronous). A common use case is a product page whose inner content is also used inside a product dialog component reused across various routes. In this scenario you can differentiate the template and selectively exclude or include parts of it based on whether the template is used in a fragment or not. For this purpose a custom blade directive is made available by the [FragmentsServiceProvider](../laravel-frontend/Fragments).

Continuing from the above example your template in `src/components/ProductDetail/index.blade.php` could look like:

```html
<div class="ProductDetail:">
  @fragment('product') I will appear only when this component is used as a 'product' fragment @elsefragment I will appear only when this component is <b>not</b> used as a 'product' fragment @endfragment
  <p>I will appear in both cases</p>
</div>
```

### Customize fragment loading state

Using a [progress](../core/progress) core component:

```html
<x-fragments-replace id="product">
  <x-progress-circular />
</x-fragments-replace>
```

Using a [skeleton](../core/skeleton) core component:

```html
<x-fragments-replace id="product">
  <p>Loading product...</p>
  <x-skeleton-list width="400"></x-skeleton-list>
</x-fragments-replace>
```

## Comunicate with your internal frontend endpoints

Three steps to expose an ajax endpoint

1. Create a route controller in `/src/fragments/MyController.php` and define all the methods you need:

```php
<?php

namespace resources\fragments;

use Illuminate\Http\Request;
use LaravelFrontend\App\Controllers\Fragment;

class MyController extends Fragment
{
  public function get(Request $request)
  {
    $data = ["some", "data", "from", "anywhere"];

    return response()->json($data);
  }

  public function post(Request $request)
  {
    $data = $request->all();
    // do something with that...

    return response()->json();
  }
}
```

1. In `/src/fragments/routes.php` define routes endpoint and assign the controller you just wrote.

```php
<?php

use Illuminate\Support\Facades\Route;
use resources\fragments\MyController;

Route::get("myendpoint", [MyController::class, "get"]);
Route::post("myendpoint", [MyController::class, "post"]);
```

3. Consume the endpoints in your JavaScripts using the ajax utilities:

```js
import { get, post } from "@olmokit/core/fragments/ajax";

get("myendpoint").then(({ data }) => {
  console.log(data);
});

post("myendpoint", {
  data: {
    someKey: "some value",
  },
}).then(({ data }) => {
  console.log(data);
});
```

The laravel related ajax calls always sends along the `X-CSRF-TOKEN` in the request header for security reasons.
