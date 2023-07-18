---
title: Cms
---

This module manages the comunication with the CMS API which provides all the content and structural data for your project.

## **Basic API** _communication_

There are the four types of expected endpoints and data structure:

- [Content](#content)
- [Structure](#structure)
- [Sitemap](#sitemap)
- [Robots](#robots)

Data from CMS API is always cached until an [appropriate hook](./Hooks) is not invoked, either from a developer, an automated task or a CMS side operation. This cache can be turned on/off during development with the `.env` variable `CMS_API_CACHE`.

> Regarding authentication (which is usually provided by the same CMS) check the [`Auth` documentation](./Auth).

### Content

> [`{CMS_API_URL}/api/{locale}/page`](https://github.com/olmokit/olmokit/-/tree/main/packages/laravel-frontend/src/Cms/samples/page.json) > [`{CMS_API_URL}/api/{locale}/collection`](https://github.com/olmokit/olmokit/-/tree/main/packages/laravel-frontend/src/Cms/samples/collection.json) > [`{CMS_API_URL}/api/{locale}/collection/single`](https://github.com/olmokit/olmokit/-/tree/main/packages/laravel-frontend/src/Cms/samples/collectionsingle.json)

Samples of data to retrieve content for pages, collections and collections' items. Each of this JSON is equal in its structure, and they are here just to show different use cases. Each of them has in the root object three required keys:

- `"route"`: groups meta data regarding the requested route, key by key:
  - `"id"`: the route id should correspond to one of the `routes` defined in the [`{CMS_API_URL}/api/structure`](https://github.com/olmokit/olmokit/-/tree/main/packages/laravel-frontend/src/Cms/samples/page.json) endpoint
  - `"locale"`: the current locale with which the route is served
  - `"slug"`: a key value pair where the _key_ is the **locale** and the _value_ is the localised **slug**
- `"seo"`: groups route specific seo related data (check a [sample JSON](https://github.com/olmokit/olmokit/-/tree/main/packages/laravel-frontend/src/Cms/samples/page.json) for specific values)
- `"analytics"`: groups route specific analytics data (check a [sample JSON](https://github.com/olmokit/olmokit/-/tree/main/packages/laravel-frontend/src/Cms/samples/page.json) for specific values)

### Structure

> [`{CMS_API_URL}/api/structure`](https://github.com/olmokit/olmokit/-/tree/main/packages/laravel-frontend/src/Cms/samples/structure.json)

Sample of data to retrieve the current structural information of the website for now we have three main sections:

- `"i18n"`: groups data related to localisation:
  - `"locales"`: simple array of strings with the available language codes
  - `"default_locale"`: the default locale for the application
- `"assets"`: groups global configuration data related to assets
  - `"media"`: The absolute base media URL where the media files are stored from the CMS
- `"seo"`: groups global configuration data related to seo
  - `"index"`: either `true` or `false`, it indicates whether the project has a unique default `{APP_URL}/sitemap.xml` (if `false`) or multiple sitemaps based on the locale, see in details [here below](#sitemap)
- `"analytics"`: groups global configuration data related to analytics
  - `"gtm_header"`: GTM header code for environments `dev` and `staging`
  - `"gtm_header_prod"`: GTM header code for environment `production`
  - `"gtm_body"`: GTM body code for environments `dev` and `staging`
  - `"gtm_body_prod"`: GTM body code for environment `production`
- `"api"`: groups the currently used api information, useful to apply conditional global logic, _do not abuse this!_
  - `"name"`: the name of the api, e.g. `"olmo"`
  - `"version"`: the version of the api, e.g. `"1.0.0"`
    },
- `"routes"`: list of all available routes, each of which must contain:
  - `"id"`: a unique identifier that will determine the route template to use
  - `"slug"`: object that maps each locale to a specific url structure that can either be **static** (e.g. `/contacts`) or **dynamic** where dynamic parts are prepended with a colon `:` (e.g.: `/:collection-slug/:product-slug`)

### Sitemap

> The CMS API should expose each **localised sitemap** in the endpoint `{CMS_API_URL}/api/sitemap/{locale}` (despite option seo index is `true` or `false`)

The frontend automatically use those to create the following URLs:

- `{APP_URL}/sitemap.xml`: a default sitemap (exists only if `"sitemap": { "index": false }` in the [structure response](#structure))
- `{APP_URL}/sitemap-{locale}.xml`: one for each locale (exists only if `"sitemap": { "index": true }` in the [structure response](#structure))
- `{APP_URL}/sitemap-index.xml`: it maps the generated localised sitemaps to the right URLs (exists only if `"sitemap": { "index": true }` in the [structure response](#structure))

### Robots

> The CMS API should expose the content of the robots.txt file for production at `{CMS_API_URL}/api/robots.txt`

The frontend tunnels that on production to:

- `{APP_URL}/robots.txt`: Shows the content from the CMS

On all other environments an automatically generated `robots.txt` is served at the same URL with a _disallow all_ blocking spiders.

## **_CmsApi_** class

```php
use LaravelFrontend\Cms\CmsApi;
```

The CmsApi is used under the hood in various places of `laravel-frontend` for example to automatically retrieve each route specific data and some structural information about your project. It can also be used _manually_ to communicate with the CMS in custom ways your project might need.

### _Standard methods_

### `CmsApi::getData`

**Arguments**:

| name        | type     | required | default value | description                                                                                                                                 |
| ----------- | -------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `$endpoint` | string   | true     | ''            | A relative path, it dinamically interpolates `{locale}` to the current locale (with `App::getLocale()`)                                     |
| `$cache`    | boolean  | false    | true          | Set to `false` to explicitly skip response caching, otherwise the `endpoint` value will be used as the cache key ensuring data consistency. |
| `$adapter`  | callable | false    | null          | An adapter function to tweak the CMS response. The tweaked versoin is what is going to be cached if cache is enabled.                       |

Retrive data from CMS API through standard `GET` request, it returns the response from the CMS if successfull or `false` if the request failed.

:::note

Most of the time you call `CmsApi::getData()` you want to prepend the current locale to the endpoint, that will be interpolated automatically passing `{locale}` wherever in the endpoint first argument, for example:

```php
$myData = CmsApi::getData("{locale}/my-endpoint");
```

:::

:::note

You can add `[debug]` in the request path to quickly debug the request response

```php
$myData = CmsApi::getData("[debug]{locale}/my-endpoint");
```

:::

### `CmsApi::postData`

**Arguments**:

| name           | type     | required | default value | description                                                                                                                                 |
| -------------- | -------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `$endpoint`    | string   | true     | ''            | A relative path, it dinamically interpolates `{locale}` to the current locale (with `App::getLocale()`)                                     |
| `$requestBody` | array    | false    | []            | The request body (parseable as JSON) to send along the request                                                                              |
| `$cache`       | boolean  | false    | true          | Set to `false` to explicitly skip response caching, otherwise the `endpoint` value will be used as the cache key ensuring data consistency. |
| `$adapter`     | callable | false    | null          | An adapter function to tweak the CMS response. The tweaked versoin is what is going to be cached if cache is enabled.                       |

Send (or retrieve) data from CMS API through standard `POST` request, it returns the response from the CMS if successfull or `false` if the request failed.

:::note

Most of the time you call `CmsApi::postData()` you want to prepend the current locale to the endpoint, that will be interpolated automatically passing `{locale}` wherever in the endpoint first argument, for example:

:::

```php
$myData = CmsApi::postData("{locale}/my-endpoint", ["id" => "anId"]);
```

### `CmsApi::getAllModels`

**Arguments**:

| name           | type   | required | default value    | description                                                    |
| -------------- | ------ | -------- | ---------------- | -------------------------------------------------------------- |
| `$modelName`   | string | true     | ''               | The model name as in the database                              |
| `$requestBody` | array  | false    | []               | The request body (parseable as JSON) to send along the request |
| `$locale`      | string | false    | App::getLocale() | The locale to prepend to the endpoint URL                      |

Get all models with a certain model name. This is the conventional method to retrieve all models data from the CMS API according to the standardised endpoint `/{locale}/allmodel/{modelName}`. Usage:

```php
$myData = CmsApi::getAllModels("product", ["someFilterKey" => "filterValue"]);
```

### _Authorization based methods_

The following methods communicate with the CMS API through the appropriate `GET|POST|PATCH|PUT|DELETE` request method sending the currently logged in user token in the headers. They all return the response from the CMS as an instance of [`Illuminate\Http\Client\Response`](https://laravel.com/docs/8.x/http-client#making-requests) as they are all just shortcuts to [Laravel's `Http` client](https://laravel.com/docs/8.x/http-client#introduction), they also all share the same signature.

**Arguments**:

| name        | type   | required | default value | description                                                                                                                                                  |
| ----------- | ------ | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `$endpoint` | string | true     | ''            | A relative path, , it dinamically interpolates `{locale}` to the current locale (with `App::getLocale()`)                                                    |
| `$ajax`     | bool   | false    | false         | It tweaks the return data in the appropriate way for an ajax communication, pass `true` when using this method to serve data to a JavaScript based ajax call |
| `$data`     | array  | false    | []            | Some data to send in the request body                                                                                                                        |

:::note

You can add special keywords to the endpoint URL in the same as with [`CmsApi::getData`](#cmsapigetdata): `{locale}`, `[debug]`, `[guest]`

```php
$myData = CmsApi::getData("[debug]{locale}/my-endpoint");
```

:::

### `CmsApi::getWithAuth`

See [above for details](#authorization-based-methods).

### `CmsApi::postWithAuth`

See [above for details](#authorization-based-methods).

### `CmsApi::patchWithAuth`

See [above for details](#authorization-based-methods).

### `CmsApi::putWithAuth`

See [above for details](#authorization-based-methods).

### `CmsApi::deleteWithAuth`

See [above for details](#authorization-based-methods).

## **_CmsWishlist_** class

This class is a simple wrapper around the standard `CmsApi` class methods whose aim is to standardise the **wishlist** related interactions with the CMS.

```php
use LaravelFrontend\Cms\CmsWishlist;
```

### `CmsWishlist::list`

Retrieves the full data about the current user wislist including the full objects of each wislisted item, usually used in a specific account page.

```php
$wishlist = [];
$response = CmsWishlist::list();
if ($response->successful()) {
  $wishlist = $response->json();
}
```

**Arguments**:

none

### `CmsWishlist::get`

Retrieves the least data as possible about the current user wislist, it can be
used to _decorate_ a list of products that come from another response.

```php
$wishlist = [];
$response = CmsWishlist::get();
if ($response->successful()) {
  $wishlist = $response->json();
}
```

**Arguments**:

none

### `CmsWishlist::add`

Add an item to the current user wislist.

```php
$properties = [
  // some selected properties...
];
CmsWishlist::add($product["id"], $product["type"], $properties);
```

**Arguments**:

| name          | type   | required | default value | description                                                                           |
| ------------- | ------ | -------- | ------------- | ------------------------------------------------------------------------------------- | ----------- |
| `$id`         | string | number   | true          |                                                                                       | The item id |
| `$type`       | string | false    | 'product'     | The item type                                                                         |
| `$properties` | array  | false    | []            | Specific item's properties that the user has selected in the _add to wishlist_ action |

### `CmsWishlist::remove`

Remove an item to the current user wislist.

```php
CmsWishlist::remove($product["id"]);
```

**Arguments**:

| name  | type   | required | default value | description |
| ----- | ------ | -------- | ------------- | ----------- | ----------- |
| `$id` | string | number   | true          |             | The item id |

## **_CmsCart_** class

This class is a simple wrapper around the standard `CmsApi` class methods whose aim is to standardise the **cart** related interactions with the CMS.

```php
use LaravelFrontend\Cms\CmsCart;
```

### `CmsCart::get`

Retrieves the full data about the current user cart including the full objects of each cart's item, usually used in a specific account page.

```php
$cart = [];
$response = CmsCart::get();
if ($response->successful()) {
  $cart = $response->json();
}
```

**Arguments**:

none

### `CmsCart::get`

Retrieves the least data as possible about the current user cart, it can be
used to _decorate_ a list of items that come from another response.

```php
$cart = [];
$response = CmsCart::get();
if ($response->successful()) {
  $cart = $response->json();
}
```

**Arguments**:

none

### `CmsCart::add`

Add an item to the current user cart.

```php
$properties = [
  // some selected properties...
];
CmsCart::add($item["id"], $item["type"], $properties);
```

**Arguments**:

| name          | type   | required | default value | description                                                                           |
| ------------- | ------ | -------- | ------------- | ------------------------------------------------------------------------------------- | ----------- |
| `$id`         | string | number   | true          |                                                                                       | The item id |
| `$type`       | string | false    | 'product'     | The item type                                                                         |
| `$properties` | array  | false    | []            | Specific item's properties that the user has selected in the _add to wishlist_ action |

### `CmsCart::remove`

Remove an item to the current user cart.

```php
CmsCart::remove($item["cartitemid"]);
```

**Arguments**:

| name          | type   | required | default value | description                         |
| ------------- | ------ | -------- | ------------- | ----------------------------------- |
| `$cartitemid` | string | number   | true          | The item cart id (not the item id!) |

## **_CmsAddress_** class

un'unica chiave addresses così:

"addresses": [
{​​​​​​​​​​​​​
"id": 1,
"type": ["shipping", "billing"], // o solo uno dei due o niente
"default": ["shipping", "billing"], // o solo uno dei due o niente
"city": "...",
...etc.
}​​​​​​​​​​​​​
]

quando ti mando un form ti aggiungo due campi con prefix underscore per identificarli come "speciali":
"\_type": ["shipping", "billing"], // o solo uno dei due o niente (scegli tu un default se ti serve)
"\_default": ["shipping", "billing"], // o solo uno dei due o niente
