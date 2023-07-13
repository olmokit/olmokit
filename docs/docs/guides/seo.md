---
title: Seo customization
---

## How to

First consider that in all template (all `blade.php` files) you have access to some [global variables, see the list and explanation here](../laravel-frontend/App.md#app-composer). In routes specific templates (all `/src/routes/{myroute}/index.blade.php` files) you have also [these variables](../laravel-frontend/App.md#app-composer#routes-base-controller).

### Manage localised URLs

File: `/config/laravel-frontend.php`

```php
    'i18n' => [
        'default_locale' => 'en',
        'locales' => ['en'],
        'enforce_localised_urls' => true,
        'hide_default_locale_in_url' => false,
    ],
```

These are the defaults, you can override just one or each of them, consider that `default_locale` and `locales` are just used as fallbacks, if the [CMS API](../laravel-frontend/Cms.md) provides them those take priority.

### Add a `rel="canonical"` to a specific route

File: `/src/routes/myroute/index.blade.php`

```php
@push('head')
  <link rel="canonical" href="{{ to('myotherroute') }}" />
@endpush
```

### Customise the `<html lang="">`

File: `/src/layouts/main/index.blade.php`

```php
@php
  $lang = $locale === 'en' ? 'en-US' : $locale;
@endphp
<!DOCTYPE html>
  <html lang="{{ $lang }}" ...
```

### Create a common `dataLayer`

File: `/src/layouts/main/index.blade.php`

```php
@php
  $dataLayer = $user ? [[
    'userLogin' => true,
    'userId' => $user['id'],
    'userGaId' => $user['ga_id'],
  ]] : [];
@endphp

...and below pass it to the component:

<x-analytics-data-layer :route-data="$data" :data="$dataLayer" />
```

### Cookie Banner customization

File: `/src/layouts/main/index.blade.php`

Set an external link:

```html
<x-cookies-banner privacy-link="https://www.example.com/{{ $locale }}/privacy-policy/" />
```

Set an internal route link:

```html
<x-cookies-banner :privacy-link="to('privacypolicy')" />
```

_`privacypolicy` must be an existing route/pagename in your app_.
