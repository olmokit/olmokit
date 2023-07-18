---
title: Working without api
---

If the API of your CMS is not yet ready or you just don't plan to use it everything in Laravel Frontend should still work, you need to be sure to go edit your `.env` file (and the ones specific to your targeted environments) commenting out the variable `CMS_API_URL`

You can then creating routes from the CLI with the command `olmo routes`, for instance with:

```console
olmo routes home,contacts,privacypolicy,cookiepolicy,400,500
```

No other specific action is expected on your side. All links will be automatically created using a default locale (`en`) and the slug will be the same as the folder name (althoug each route controller can even override its slug by setting a `public $slug` property).

## Providing data

One quick way to mock data until an API is not ready is to use the optional `index.json` file in the route folder, e.g. in `src/routes/myroute/index.json`, whose content is automatically exposed in the `$data` variable in your route template `src/routes/myroute/index.blade.php`.

:::note

You can use `index.json` regardless you have a working API or not. You can use it to augment the dynamic data with some static data or to develop a completely static website, in case you use both static and dynamic data the json content is merged with the dynamic data **overriding** it.

:::

## Linking to routes

Links will behave the same regardless a CMS API is used or not, you will always use the globally exposed `to('myroute')` helper, where `myroute` always matches the route folder name:

```html
<a href="{{ to('myroute') }}">My route</a>
```

When the API will be ready you will just have to put the url in the `.env` and links will continue to work in the same way.
