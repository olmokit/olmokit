---
title: ajax
---

There are few types of ajax behaviours that are streamlined and eased by `@olmokit/core/ajax`.

## Load external resources

Use this when you want to load **thirdy party** _CSS_ or _JS_ libraries from publicly available CDN. This is just an alias for the library [`loadjs`](https://github.com/muicss/loadjs) you can follow its documentation

```js
import loadResource from "@olmokit/core/ajax/loadResource";
import loadResource from "@olmokit/core/ajax/loadResource";

loadResource(["https://addevent.com/libs/atc/1.6.1/atc.min.js"]);
```

## Default ajax client

A simple wrapper around [**atomic** a tiny promise based Ajax/HTTP library](https://github.com/cferdinandi/atomic). By defalt it uses the `GET` method. It adds caching by passing a `cacheKey` to the options second argument, an `ajaxClearCache` is also exposed in order to control the cache clearing.

:::warning

Caching is opt-in, use it only if you have performance problems and use it with _awareness_ or it might lead to data inconsistencies.

:::

```js
import ajax, { ajaxClearCache } from "@olmokit/core/ajax";
import ajax, { ajaxClearCache } from "@olmokit/core/ajax";

async function MyComponent() {
  const response = await ajax("/some/endpoint", {
    // cacheKey: true // if true a cache key based on the URL is created
    cacheKey: "myKey",
  });
  console.log(response.data);

  // at some point...
  ajaxClearCache("myKey");
}

MyComponent();
```

## Comnunication with the frontend

Compared to the default ajax client these helpers simply automatically add the `X-CSRF` token needed by Laravel to secure requests.

```js
import { get } from "@olmokit/core/ajax/laravel";
import { get } from "@olmokit/core/ajax/laravel";

async function MyComponent() {
  const response = await get("/some/endpoint");
  console.log(response.data);
}

MyComponent();
```

## Comnunication with the backend

Most of the time it is better to relay the ajax calls to the CMS through your Laravel frontend by exposing an internal [fragment route endpoint](../guides/async-behaviours.md) but if you really need to communicate directly with the backend API you might use these helpers. It allows to automatically interpolate the _current locale_ and it even adds the right _authentication headers_ if the `$user` object is exposed to Javascript in your template with `<x-data key="user" :value="$user">` although that is not encouraged due to security reasons.

```js
import { get, post } from "@olmokit/core/ajax/cms";

async function MyComponent() {
  const response = await get("{locale}/some/endpoint");
  console.log(response.data);

  const response = await post("another/endpoint", {
    data: {
      key1: response.data.someValue,
      key2: "some other data",
    },
  });
}

MyComponent();
```
