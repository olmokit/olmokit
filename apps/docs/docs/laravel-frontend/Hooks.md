---
title: Hooks
---

LaravelFrontend exposes automatically a series of `hooks` whose access is guarded through middlewares for security. These `hooks` endpoints allow the remote execution of commands for systemic operations like deployment, cache management, composer packaging and maybe others. These endpoints should be called upon data changes from the CMS or the thirdy part services on saving or updating actions.

## Usage and security

For security purposes these endpoints can only be called from a series of whitelisted domains. By default the already defined and mandatory `APP_URL` and `CMS_API_URL` found in the `.env` are automatically whitelisted and so it is the IP of the CI runner that operates the deployment. Additional **domains**, **ip** addresses and **queryparam** can be defined in the `.env` with:

```env
HOOKS_ALLOWED_DOMAINS=adomain.com,another-domain.com
HOOKS_ALLOWED_IPS=111.11.11.11
HOOKS_ALLOWED_PARAM=somesecretparam
```

## Hooks **endpoints**

Here a summary of all hooks, all prefixed with `_/hooks/`.

### `/visit`

> URL: `{APP_URL}/_/hooks/visit`

This hook visit all the URLs of the website by crawling the `APP_URL` and following all the found links recursively. It is automatically used by the [`/deploy/end` one](#deploy-end). It can also be manually called from a browser with the [above security limitations](#usage-and-security), add a whatever query parameter to get a nicely formatted html response, e.g. go in your browser to `https://myproject.com/_/hooks/visit?a`.

### _Deploy hooks_

### `/deploy/end`

> URL: `{APP_URL}/_/hooks/deploy/end`

This hook must be called at the end of the CI process, it clears all caches, dumps the composer autoloading mechanism and optimize laravel through `artisan` commands. At the end of its process it calls the [`/visit` hook](#visit).

### _Cache control hooks_

Data from the remote `api` (the CMS usually) are cached by default to optimise speed. This cache can be cleared programmatically by doing a simple `GET` request without any particular parameter to these automatically exposed endpoints or **hooks**:

### `/cache/clear`

> URL: `{APP_URL}/_/hooks/cache/clear`

Clear all frontend caches (system and [`data` cache](./Cache.md#data)) except [`img` cache](./Cache.md#img).

### `/cache/clear-system`

> URL: `{APP_URL}/_/hooks/cache/clear-system`

Manages op cache, laravel's view/config/routes and compiled caches. It first clears and then re-generate and re-cache them.

### `/cache/clear-data`

> URL: `{APP_URL}/_/hooks/cache/clear-data`

Clear all the [`data` cache](./Cache.md#data).

### `/cache/clear-structure`

> URL: `{APP_URL}/_/hooks/cache/clear-structure`

Clear all the [`structure` cache](./Cache.md#structure).

### `/cache/clear-custom`

> URL: `{APP_URL}/_/hooks/cache/clear-custom`

Clear all the [`custom` cache](./Cache.md#custom).

### `/cache/clear-models`

> URL: `{APP_URL}/_/hooks/cache/clear-models`

Clear all the [`models` cache](./Cache.md#models).

### `/cache/clear-models/{modelName}`

> URL: `{APP_URL}/_/hooks/cache/clear-models/{modelName}`

Clear a single [`model` cache](./Cache.md#modelsmodelname).

### `/cache/clear-routes`

> URL: `{APP_URL}/_/hooks/cache/clear-routes`

Clear all the [`routes` cache](./Cache.md#routes).

### `/cache/clear-routes/{routeId}`

> URL: `{APP_URL}/_/hooks/cache/clear-routes/{routeId}`

Clear a single [`route` cache](./Cache.md#routesrouteid).

### `/cache/clear-forms`

> URL: `{APP_URL}/_/hooks/cache/clear-forms`

Clear all the [`forms` cache](./Cache.md#forms).

### `/cache/clear-forms/{formId}`

> URL: `{APP_URL}/_/hooks/cache/clear-forms/{formId}`

Clear a single [`form` cache](./Cache.md#formsformid).

### `/cache/clear-translations`

> URL: `{APP_URL}/_/hooks/cache/clear-translations`

Clear all the [`translations` cache](./Cache.md#translations).

### `/cache/clear-translations/{locale}`

> URL: `{APP_URL}/_/hooks/cache/clear-translations/{locale}`

Clear a single [`locale`'s `translations` cache](./Cache.md#translationslocale).

### `/cache/clear-img`

> URL: `{APP_URL}/_/hooks/cache/clear-img`

Clear all the [`img` cache](./Cache.md#img).

:::warning

Depending on the amount of images used and theier variants the regeneration of this cache is probably quite heavy on the server.

:::
