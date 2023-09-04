---
title: Cache
---

Frontend cache is tagged with [swayok/alternative-laravel-cache](https://github.com/swayok/alternative-laravel-cache) according to the following tree structure:

```yaml
├── data
│   ├── structure
│   ├── custom
│   ├── models
|   |   └── {modelName}
│   ├── routes
|   |   └── {routeId}
│   └── forms
|       └── {formId}
│   └── translations
|       └── {locale}
└── img
```

:::note

When a _parent_ tag is **deleted** all its _children_ are **deleted too**.

:::

Here is a breakdown of the various cache tags. For testing or other purposes you can manage these tags from the CLI, for instance to clear a particular tags' cache with `php artisan cacher:clear {tag}` e.g.:

```bash
php artisan cacher:clear models.product
```

### `data`

Applied to all the caches that contain data from standardised external sources, for instance the CMS api that feeds the routes and custom endpoints, the form manager, etc.

### `structure`

It tags the data related to the structure of the frontend, for instance the routes mapping and resolutions in their relation to frontend templates.

### `custom`

All data retrieved "manually" in the frontend application, for instance the data retrieved with explicit calls of the [`CmsApi::getData`](./Cms.md#cms-api-get-data) and [`CmsApi::postData`](./Cms.md#cms-api-post-data) methods.

### `models`

It tags all the caches produced by calls of the method [`CmsApi::getAllModels`](./Cms.md#cms-api-get-all-models).

### `models.{modelName}`

It tags all the cache produced by calls of the method [`CmsApi::getAllModels`](./Cms.md#cms-api-get-all-models) that matches a specific `modelName`.

### `routes`

It tags all the route specific caches created automatically by the [route's Base controller](./Cms.md#route-s-base-controller) associated to each route.

### `routes.{routeId}`

It tags the route cache created automatically by the [route's Base controller](./Cms.md#route-s-base-controller) that matches a specific `routeId` (or template name or route's template, they are all the same frontend side).

### `forms`

It tags all the forms specific caches created either by the internal Form manager or an external one (like Olmoforms).

### `forms.{formId}`

It tags the forms specific caches created either by the internal Form manager or an external one (like Olmoforms) that matches a specific `formId`.

### `img`

Tag that identifies all images and their associated metadata produced by the frontend [Image](./Img.md) processor.

### `translations`

It tags all the string translations caches for all locales.

### `translations.{locale}`

It tags the stirng translations caches that match a specific `locale`.
