---
title: Authentication
sidebar_label: Authentication
---

This document describes how to implement an authentication system in your frontend application.

## Setup

:::note

First be sure to have setup correctly the following two variables in your `.env` file:

:::

```env
AUTH_API_URL=https://back.myproject.com/api/auth
AUTH_API_CACHE=true
```

## Comunication with the API

All the communication with the remote API is standardised inside [Laravel Frontend](../laravel-frontend/index.md), check the [Auth docs](../laravel-frontend/Auth.md) for all the specifications.

## Authenticated requests

The frontend use the `token` saved in session at login and always send it along every subsequent request in a standard request's `header`:

```yml
X-Token: tokenstringvalue
```

It does it without notion about the backend requires it or not, it is responsibility of the backend to check protected endpoints (usually `routes` endpoints) and in case of invalid token return to the frontend a `401` HTTP status code.

In case of a `401` the frontend will:

1. store the requested url
2. logout the user
3. redirect the user to the login route
4. Eventually track the 401 event
5. manage the redirection to the prior stored url after successful login

In your frontend application you should anyway protect your routes with the `auth` Middleware, be sure to check out its [docs here](../laravel-frontend/App.md#auth).

## Frontend configuration

You can tweak the authentication system configuration from your `/config/laravel-frontend.php`, under the `auth` key, you can see the updated list of defaults directly [from the source code here](https://github.com/olmokit/olmokit/-/blob/main/packages/laravel-frontend/config/laravel-frontend.php#L4).

### `routesMap`

Defines the route id (the `value`) to use for each authentication feature (the `key`).

### `actionEndpoints`

Defines the Auth API action endpoints (the `value`) to use for each authentication feature (the `key`), in other words where each frontend auth action should make a `POST` to the AUth API `{AUTH_API_URL}/{actionEndpoint}`.

### `formsEndpoints`

Defines the Auth API form construction endpoints (the `value`) to use for each authentication feature (the `key`), in other words where the frontend gathers the form data for each auth feature `{AUTH_API_URL}/forms/{locale}/{formEndpoint}`.

### Examples

A typical customisation might be for instance a project where the `register` route is actually called `signup`, in that case you might just want to override that in your config file with:

```php
    'auth' => [
        'routesMap' => [
            'register' => 'signup',
        ],
    ],
```

## Authentication components

All the authentication related forms are already provided by the `@olmokit/core/auth` components.

## Translations

Most of the translations happen on the CMS. Some default status messages and system forms fields are instead [defined as strings](translations.md). You can find in the [source code of the standard laravel template](https://github.com/olmokit/olmokit/-/blob/main/packages/template-laravel/template/src/assets/translations.csv#L8) the updated list of string required strings for a complete authentication flow, they are all prefixed with `auth.`.

## JavaScript authentication helpers

```js
import { getUser, isUserOrGuest, on as authOn } from "@olmokit/core/auth";
import { getUser, isUserOrGuest, on as authOn } from "@olmokit/core/auth";

getUser();

authOn("user:ok", ({ data }) => alert(data ? `Hi ${data.id}` : "Log in now"));

// getUser(true); // force async refetch

const canDoThat = isUserOrGuest(); // synchronous, won't work with `page-cache` middleware
isUserOrGuest(true).then((result) => {
  alert(result ? "do what they can" : "Wait ...");
});
```
