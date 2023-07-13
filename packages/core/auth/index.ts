/**
 * @file
 *
 * Authentication helpers.
 */
import { Emitter } from "@olmokit/utils/Emitter";
import { isBoolean } from "@olmokit/utils/isBoolean";
import { isNull } from "@olmokit/utils/isNull";
import { type AjaxResponse } from "../ajax";
import {
  type AjaxLaravelResponseError,
  get as laravelGet,
} from "../ajax/laravel";
import { globalConf } from "../data";

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Auth {
  type $endpoints = {
    "/user": {
      GET: {
        response: $response_user;
      };
    };
    "/guest": {
      GET: {
        response: $response_guest;
      };
    };
    "/user-or-guest": {
      GET: {
        response: $response_user | $response_guest;
      };
    };
  };

  type $response_user = {
    id: number | string;
    current_locale?: string;
    current_timezone?: string;
    ga_id?: string;
    guest?: boolean;
    username?: string;
    datecreated?: string;
    addresses: [];
    email?: string;
    name?: string;
    surname?: string;
    company: null;
    customfields: "null" | object;
  };

  type $response_guest = boolean;

  type User = $response_user & {};

  type Events = {
    "guest:loading": undefined;
    "guest:ok": {
      data: $response_guest;
      response: AjaxResponse<$endpoints["/guest"]["GET"]["response"]>;
    };
    "guest:fail": { response: AjaxLaravelResponseError };
    "user:loading": undefined;
    "user:ok": {
      data: User;
      response: AjaxResponse<$endpoints["/user"]["GET"]["response"]>;
    };
    "user:fail": { response: AjaxLaravelResponseError };
    "userOrGuest:loading": undefined;
    "userOrGuest:ok": {
      guest: boolean;
      user?: User;
      response: AjaxResponse<$endpoints["/user-or-guest"]["GET"]["response"]>;
    };
    "userOrGuest:fail": { response: AjaxLaravelResponseError };
  };
}

const NAMESPACE = "auth";
const ENDPOINT = `/_/${NAMESPACE}/`; // FIXME: trailing slashes
const ENDPOINT_USER = `${ENDPOINT}user/`; // FIXME: trailing slashes
const ENDPOINT_GUEST = `${ENDPOINT}guest/`; // FIXME: trailing slashes
const ENDPOINT_USERORGUEST = `${ENDPOINT}user-or-guest/`; // FIXME: trailing slashes

export const { emit, on } = Emitter<Auth.Events>(NAMESPACE);

/**
 * Retrieve the current user's data
 *
 * @param {boolean} [forceRefetch] Pass `true` to get freshed data, otherwise the last result is returned to prevent duplication
 */
export function getUser(forceRefetch?: boolean) {
  const request = laravelGet<Auth.$endpoints["/user"]["GET"]["response"]>(
    ENDPOINT_USER,
    {
      cache: forceRefetch ? false : `${NAMESPACE}.getUser`,
    }
  );

  emit("user:loading");

  request
    .then((response) => {
      emit("user:ok", {
        data: response.data,
        response,
      });

      setAuthenticated(!!response.data);
    })
    .catch((response) => {
      emit("user:fail", response);
    });

  return request;
}

/**
 * Check if the user is guest
 *
 * @param {boolean} [forceRefetch] Pass `true` to get freshed data, otherwise the last result is returned to prevent duplication
 */
export function getGuest(forceRefetch?: boolean) {
  const request = laravelGet<Auth.$endpoints["/guest"]["GET"]["response"]>(
    ENDPOINT_GUEST,
    {
      cache: forceRefetch ? false : `${NAMESPACE}.getGuest`,
    }
  );

  emit("guest:loading");

  request
    .then((response) => {
      emit("guest:ok", {
        data: response.data,
        response,
      });

      setGuest(response.data);
    })
    .catch((response) => {
      emit("guest:fail", response);
    });

  return request;
}

/**
 * Check if we have either a logged in user or a guest session
 *
 * @param {boolean} [forceRefetch] Pass `true` to get freshed data, otherwise the last result is returned to prevent duplication
 */
export function getUserOrGuest(forceRefetch?: boolean) {
  const request = laravelGet<
    Auth.$endpoints["/user-or-guest"]["GET"]["response"]
  >(ENDPOINT_USERORGUEST, {
    cache: forceRefetch ? false : `${NAMESPACE}.getUserOrGuest`,
  });

  emit("userOrGuest:loading");

  request
    .then((response) => {
      const { data } = response;
      let guest = false;
      let user;

      // if the value is just a boolean it means we have not a user for sure
      if (isBoolean(data)) {
        guest = data;
      } else {
        user = data;
      }

      emit("userOrGuest:ok", {
        guest,
        user,
        response,
      });

      setGuest(guest);
      setAuthenticated(!!user);
    })
    .catch((response) => {
      emit("userOrGuest:fail", response);
    });

  return request;
}

/**
 * Check if the user is authenticated.
 *
 * By default it just reads the data from global configuration printed on page,
 * unless on of the two following conditions are met:
 *
 * 1 - GlobalData 'authenticated' is null, meaning the page is cached by
 *  page-cache and no other auth async checks have been performed yet
 * 2 - You have passed the first argument `true` to perform async check.
 *
 * @param {boolean} [async] Pass `true` to get the information asynchronously from the internal Laravel endpoint
 * @param {boolean} [forceRefetch] Pass `true` to get freshed data, otherwise the last result is returned to prevent duplication
 */
export function isAuthenticated(async?: boolean, forceRefetch?: boolean) {
  if (async || isNull(globalConf.authenticated)) {
    return new Promise<boolean>((resolve, reject) => {
      getUser(forceRefetch)
        .then((response) => {
          resolve(!!response.data);
        })
        .catch(reject);
    });
  }

  return globalConf.authenticated;
}

/**
 * Check if the user is guest.
 *
 * By default it just reads the data from global configuration printed on page,
 * unless on of the two following conditions are met:
 *
 * 1 - GlobalData 'guest' is null, meaning the page is cached by
 *  page-cache and no other auth async checks have been performed yet
 * 2 - You have passed the first argument `true` to perform async check.
 *
 * @param {boolean} [async] Pass `true` to get the information asynchronously from the internal Laravel endpoint
 * @param {boolean} [forceRefetch] Pass `true` to get freshed data, otherwise the last result is returned to prevent duplication
 */
export function isGuest(async?: boolean, forceRefetch?: boolean) {
  if (async || isNull(globalConf.guest)) {
    return new Promise<boolean>((resolve, reject) => {
      getGuest(forceRefetch)
        .then((response) => {
          resolve(response.data);
        })
        .catch(reject);
    });
  }

  return globalConf.guest;
}

/**
 * Check if we have either an authenticated user or an in-session guest
 *
 * By default it just reads the data from global configuration printed on page,
 * unless on of the two following conditions are met:
 *
 * 1 - GlobalData 'guest' and 'auth' are null, meaning the page is cached by
 *  page-cache and no other auth async checks have been performed yet
 * 2 - You have passed the first argument `true` to perform async check.
 *
 * @param {boolean} [async] Pass `true` to get the information asynchronously from the internal Laravel endpoint
 * @param {boolean} [forceRefetch] Pass `true` to get freshed data, otherwise the last result is returned to prevent duplication
 */
// function isUserOrGuest (async?: false, forceRefetch?: boolean) => true;
// function isUserOrGuest (async: true, forceRefetch?: boolean) => Promise<boolean>;
export function isUserOrGuest<B extends boolean>(
  async?: B,
  forceRefetch?: boolean
): B extends true ? Promise<boolean> : boolean {
  if (async || isNull(globalConf.authenticated) || isNull(globalConf.guest)) {
    return new Promise<boolean>((resolve, reject) => {
      getUserOrGuest(forceRefetch)
        .then((response) => {
          resolve(!!response.data);
        })
        .catch(reject);
    }) as B extends true ? Promise<boolean> : boolean;
  }

  return (globalConf.authenticated || globalConf.guest) as B extends true
    ? Promise<boolean>
    : boolean;
}

/**
 * It sets data on the global configuration object, that on load is
 * printed on page. Updating this allows to read the data synchronously after
 * the first fetch.
 */
export function setAuthenticated(status: boolean) {
  window["__CONFIG"]["authenticated"] = status;

  return status;
}

/**
 * It sets data on the global configuration object, that on load is
 * printed on page. Updating this allows to read the data synchronously after
 * the first fetch.
 */
export function setGuest(status: boolean) {
  window["__CONFIG"]["guest"] = status;

  return status;
}

/**
 * Default Auth export to use as an object with methods
 */
export default {
  getUser,
  getGuest,
  getUserOrGuest,
  isAuthenticated,
  isGuest,
  isUserOrGuest,
  emit,
  on,
};
