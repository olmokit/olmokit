import ajax from "../ajax";
import { getMetaCsrfToken } from "../helpers";

// import { getPostData } from "./helpers";
// import { $ } from "@olmokit/dom/$";

/**
 * Submit contact form
 */
export function submitContact(formData: object, action: string) {
  return ajax(action, {
    headers: {
      "X-CSRF-TOKEN": getMetaCsrfToken(),
    },
    method: "POST",
    data: formData,
  });
}
