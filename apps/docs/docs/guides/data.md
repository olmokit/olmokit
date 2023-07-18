---
title: Exchanging data between php and js
sidebar_label: Exchanging data
---

The purpose is to standardise the exchange of data between the `php` _server side_ and `js` _client side_ of your **frontend** application. There are two types of data exchange:

## Global configuration data

Usage, from any of your project JavaScript files:

```js
import { globalConf } from "@olmokit/core/data";

console.log(globalConf);
```

The object `globalConf` has following keys:

- `baseUrl`: your project's base URL (environment aware), e.g.: `http:/myproject.test`
- `cmsApiUrl`: the CMS API base URL, e.g. `https:/myproject.back.company.net/api`,
- `mediaUrl`: the Media remote base URL, e.g. `https:/myproject.back.company.net/storage/app/media`
- `locale`: the current locale (return value of `App::getLocale()`)
- `authenticated`: a boolean to indicate whether the user is authenticated or not (return value of `AuthApi::check()`)

This data is automatically injected from the core component `<x-assets-head />` that should be included in your `src/layout/main/index.blade.php`

## Global custom data

Usage, from any of your project JavaScript files:

```js
import { globalData } from "@olmokit/core/data";

console.log(globalData);
```

`globalData` is an object with the keys and data that you add from the core component `<x-data key="mykey" :data="$data" />` where `mykey` can be any string and `$data` can be any php value (is automatically encoded with `json_encode`).
You can use `<x-data />` component from any route, component or any blade template file. Note that if the same key is given from mulitple points the data will be overriden.

## Examples

### Using a custom `.env` variable

1. `olmo.ts`:

```js
// ...config
env: {
  extraVars: {
    MY_KEY: "myvalue";
  }
}
```

2. `config/env.php` and .`env` are automatically updated

3. `src/routes/myroute.blade.php`:

```html
<x-data key="myKey" :value="config('env.MY_KEY')" />
```

4. `src/routes/index.js` (or any other js file):

```js
import { globalData } from "@olmokit/core/data";

console.log(globalData.myKey);
```

_It should not happen but in case the env variable value is not updated on change run from the terminal_ `npm run clear`.

### Accessing the currently authenticated user

This will expose the user without its `token` or `token_active` on the client side to prevent security risks.

1. `src/layouts/main.blade.php`:

```html
<x-data key="user" :value="$userJs" />
```

2. `src/routes/index.js` (or any other js file):

```js
import { globalData } from "@olmokit/core/data";

console.log(globalData.user);
```
