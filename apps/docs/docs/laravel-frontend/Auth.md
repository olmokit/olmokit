---
title: Auth
---

This document aims to standardise the comunication between backend and frontend in regards to authentication.

## Forms construction

**Backend Auth service `GET` endpoints**

The backend Auth service expose some **localised** `GET` endpoints that the frontend use to construct the forms, the ones related to "system" forms are optional (`login`, `password-change`, `password-recovery`, `password-reset`).
The frontend use these endpoints to construct the forms, the response of the Backend Auth service share the same structure for all these endpoints:

```json
{
  "olmoformsToken": "xyzsadasda", // optional
  "olmoformsId": 102, // optional
  "fields": [
    // ...fields from a olmoforms form
    // additional fields hardcoded in the backend (if necessary)
    "blocked": {
      "required": false,
      // same structure that olmoforms uses for a field
    },
  ]
}
```

### Login form

> `{AUTH_API_URL}/forms/{LOCALE}/login`

This is **optional**, by default a form in the frontend is autogenerated and sends the following body:

```json
{
  "email": "somevalid@email.com",
  "password": "an md5 encrypted non-empty password"
}
```

### Profile form

> `{AUTH_API_URL}/forms/{LOCALE}/profile`

This is required.

### Registration form

> `{AUTH_API_URL}/forms/{LOCALE}/register`

This is required.

## Sending data

**Backend Auth service `POST` endpoints**

The frontend send each form data as `JSON` with a `POST` request to the endpoint defined the the above response. A sample `request body` sent by the frontend look like a simple dictionary where the keys always match the ones dictated by the backend in the Form construction `GET` endpoint (see above):

```json
{
  "first_name": "My name",
  "last_name": "My surname",
  // ...etc.
  "current_locale": "en",
  "current_timezone": "Europe/Paris" // or null
}
```

:::note

The frontend always add to the data sent to the `login`, `register` and `profile` endpoints these values:

- `"current_locale"`: the backend can decide whether to use it, store it or ignore it
- `"current_timezone"`: grabbed from the user browser in JavaScript, it can be `null` if we could not determine it client side (this is done through the timezone core component `import { ... } from "@olmokit/core/auth/timezone"`).

:::

Here the list of the standard authentication endpoints the Auth API should provide.

### Activation

> `{AUTH_API_URL}/activate`

#### Flow (activation)

After registration a standard auth flow requries a user to be activated, confirming its email address by clicking a link with a generated token. The click brings on a frontend route, once there the frontend sends a token and the backend simply check its validity.

#### Frontend request (activation)

```json
{
  "token": "a-long-token-from-the-query-param-token="
}
```

#### Backend response (activation)

```json
{}
```

- `201` successful activation
- `401` invalid token
- `500` generic error

### Login

> `{AUTH_API_URL}/login`

#### Flow (login)

The frontend `POST` this endpoint encrypting the password with `md5` along the other fields.
The backend, on successful request return the whole user with a token that the frontend put into the current `session` until a **logout** action.

#### Frontend request (login)

```json
{
  ...form fields (usually email and password)
}
```

#### Frontend middleware response (login)

- `400` invalid post data (missing required fields)

#### Backend response (login)

```json
{
  "user": {
    "token": "some-generated-token"
    // ...all other custom user fields
  }
}
```

- `200` successful login
- `400` wrong password _(this might be not implemented based on the project security's concerns)_
- `401` user inactive, the email has not been verified
- `404` user with this username/email does not exists
- `500` generic error

### Password change

> `{AUTH_API_URL}/password-change`

#### Flow (password change)

The frontend send the old and the new password in `md5`, the backend check that the old password is correct and thn update it.

#### Frontend request (password change)

```json
// X-Token: <token> (user token in the header)
{
  "password": "string-md5",
  "newpassword": "string-md5"
}
```

#### Backend response (password change)

```json
{}
```

- `200` successful password change
- `400` invalid post data
- `401` invalid X-Token
- `500` generic error

### Password recovery

> `{AUTH_API_URL}/password-recovery`

#### Flow (password recovery)

The frontend send an email and a reset URL, if the backend finds the email in the database it sends an email with that URL.

:::note

Frontend: the `reset_url` must be an absolute URL including a query parameter for the token to read, e.g. `https://myproject.com/password-reset/?token=`. The backend will just add the `token` value so the URL must have the query parameter set up. The `reset_url` defaults to the same route used for `password-reset` but it [can be customised](#frontend-configuration).

:::

#### Frontend request (password recovery)

```json
{
  "email": "some@email.com",
  "reset_url": "https://myproject.com/?token="
}
```

#### Backend response (password recovery)

```json
{}
```

- `200` successful password reset
- `400` invalid post data
- `403` user with email does not exist
- `500` generic error

### Password reset

> `{AUTH_API_URL}/password-reset`

#### Flow (password reset)

After the user has requested a password reset through the password receovery and clicked the link recevied by email it lands on a password reset page url with a token in the query param, that will be sent alongside the new password to the backend. The backend check the token validity and save the new password.

#### Frontend request (password reset)

```json
{
  "token": "the-token-sent-by-email",
  "password": "new-md5-password"
}
```

#### Backend response (password reset)

```json
{}
```

- `200` successful password reset
- `400` invalid post data
- `401` invalid token
- `500` generic error

### Profile update

> `{AUTH_API_URL}/profile`

#### Flow (profile update)

The frontend `POST` this endpoint with all the users editable fields (regardless they have been modified or not) and the `X-Token` in the header.
The backend should return the whole updated user object and the frontend update its `session`.

#### Frontend request (profile update)

```json
// X-Token: <token> (user token in the header)
{
  // all form fields
}
```

#### Backend response (profile update)

```json
{
  "user": {
    "token": "some-generated-token"
    // ...all other custom user fields
  }
}
```

- `200` successful profile update
- `400` invalid post data
- `401` invalid X-Token
- `500` generic error

### Registration

> `{AUTH_API_URL}/register`

#### Flow (registration)

If the athentication flow does not allow a user to be logged in before email verification the backend response can be empty, otherwise, on successful request it returns the whole `user` object with the `verified` flag set to `false`, plus the `token`, the frontend put everything into the current `session` until a **logout** action. The backend use the `activate_url` in the email it send to the user to activate its account adding a `token` query parameter.

:::note

The `activate_url` must be an absolute URL including a query parameter for the token to read, e.g. `https://myproject.com/login/?token=`. The backend just adds the `token` value so the URL must have the query parameter set up. The `activate_url` defaults to the same route used for `login` but it [can be customised](#frontend-configuration).

:::

#### Frontend request (registration)

```json
{
  ...form fields
  "activate_url": "https://some-absolute.url/?token="
}
```

#### Backend response (registration)

```json
{}
```

- `200` successful registration
- `400` invalid post data
- `403` user is blacklisted
- `409` user with this email is already registered
- `500` generic error