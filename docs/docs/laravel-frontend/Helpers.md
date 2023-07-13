---
title: Helpers
---

Source code should be self explanatory, keep in mind that these functions are always available from anywhere (both `php` and `blade` files) in the global scope and that are loaded by the `composer` autoloader mechanism.
We should not put too many functions here, just those related to systemic handling like construction of URLs, links and translations.

## Global helpers

The following functions are always autoloaded and made available eveywhere in your app, both in `php` files and in `blade.php` template files.

### `formatUrl`

With this function we can set a standard for trailing/untrailing slash and, eventually, make it optional. Now we enforce a trailing slash on all URLs.

```php
formatUrl(string $url = ''): string
```

> @returns `string`, @params

| name   | type   | required | default value | description     |
| ------ | ------ | -------- | ------------- | --------------- |
| `$url` | string | false    | ''            | An absolute URL |

### `formatUrlPath`

With this function we can set a standard for trailing/untrailing slash and, eventually, make it optional. Now we enforce a trailing slash on all URLs.

:::note

Don't pass here an absolute URL!

:::

```php
formatUrlPath(string $path = ''): string
```

> @returns `string`, @params

| name    | type   | required | default value | description    |
| ------- | ------ | -------- | ------------- | -------------- |
| `$path` | string | false    | ''            | A relative URL |

### `linkUrl`

Construct a localised URL according to the standard URL formatting conventions.

```php
linkUrl(string $slug = '', $locale = ''): string
```

> @returns `string`, @params

| name      | type   | required | default value | description               |
| --------- | ------ | -------- | ------------- | ------------------------- |
| `$slug`   | string | false    | ''            | A relative URL            |
| `$locale` | string | false    | ''            | A valid locale, e.g. `en` |

### `media`

Output a an absolute URL to a remote media file. It uses as base URL the `assets->media` value from the [`{CMS_API_URL}/structure` endpoint](./Cms.md#structure).

:::note

Don't pass here an absolute URL!

:::

```php
media(string $path = ''): string
```

> @returns `string`, @params

| name    | type   | required | default value | description    |
| ------- | ------ | -------- | ------------- | -------------- |
| `$path` | string | false    | ''            | A relative URL |

### `to`

Dynamically generate a URL to the given `route`.

```php
function to($route, $args = []): string
```

> @returns `string`, @params

| name     | type   | required | default value | description                              |
| -------- | ------ | -------- | ------------- | ---------------------------------------- |
| `$route` | string | false    | ''            | The unique route name                    |
| `$args`  | array  | false    | []            | The dynamic slug portions to interpolate |

#### Examples (`to`)

Given routes defined in [`{CMS_API_URL}/structure -> "routes"`](./Cms.md#structure) as:

```json
{
  "routes": [
    {
      "id": "myroutename",
      "slug": {
        "en": "/myroutename/"
      }
    },
    {
      "id": "mydynamicroutename",
      "slug": {
        "en": "/mydynamicroutename/:my-slug/"
      }
    }
  ]
}
```

Here is how to create the links in your templates:

```php
<a href="{{ to('myroutename') }}">My route</a>

<a href="{{ to('mydynamicroutename', [ 'my-slug' => 'a-value' ]) }}">My dynamic route</a>

```

### `t`

Dynamically translate a localised string optionally interpolating variables. Strings are defined in `src/assets/translations.csv`, see [I18n docs](./I18n.md)).

```php
function t(string $key = '', $args = null): string
```

> @returns `string`, @params

| name    | type   | required | default value | description                          |
| ------- | ------ | -------- | ------------- | ------------------------------------ |
| `$key`  | string | false    | ''            | The unique string name               |
| `$args` | array  | false    | null          | The dynamic variables to interpolate |

See [example usage in the `translations` guide](../guides/translations.md#t-function).

### `download`

Dynamically generate a URL to a downladable file placed in `src/assets/media`.

```php
function download($path, $viewIt = false): string
```

> @returns `string`, @params

| name      | type    | required | default value | description                                                                  |
| --------- | ------- | -------- | ------------- | ---------------------------------------------------------------------------- |
| `$path`   | string  | true     | ''            | The full path of the file relative to `src/assets/media`                     |
| `$viewIt` | boolean | false    | false         | Wether you want to open the file instead of triggering an immediate download |

#### Examples (`download`)

Given a file `example.pdf` placed in `/src/assets/media/example.pdf` and a file `example-nested.pdf` placed in `/src/assets/media/some-folder/example-nested.pdf` here is how to create links in your templates:

```php
<a href="{{ download('example.pdf') }}">Download file</a>
<x-link-outbound href="{{ download('example.pdf', true) }}">View file</x-link-outbound>

<a href="{{ download('some-folder/example-nested.pdf') }}">Download nested file</a>
<x-link-outbound href="{{ download('some-folder/example-nested.pdf', true) }}">View nested file</x-link-outbound>
```

### `downloadWithAuth`

Dynamically generate a URL to a downladable file placed in `src/assets/media` protecting the download with the [`auth` middleware](./App.md#auth).

```php
function downloadWithAuth($path, $viewIt = false): string
```

This work exactly the same as the [`download` helper](#download).
