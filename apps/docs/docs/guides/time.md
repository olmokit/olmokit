---
title: Time and dates
---

In this document we address issues and use cases related to dealing with date and times.

## Date and times in javascript

To deal with date and times in JavaScript the suggested library (used also in `@olmokit/core`) is [`date-fns`](https://date-fns.org), it is functional and tree-shaking optimized.

## Convert datetimes to local

Often times you want displaying to the user a date or time of a certain event not exactly as it arrives from the server but translated to the user' local time. This can be achieved through a combination of server and client data as the latter is the only one reliably knowing the local time of the user.

### Example

Assuming you have a php valid `$date` variable in your `blade` template you first need to translate it milliseconds (to prevent invalid JavaScript `Date` objects e.g. in Safari), then in whatever HTML element use the attribute `data-datelocal` to define the desired datetime format and inside it (as its `textContent`) print the just transformed milliseconds date.

In your `blade.php` template:

```html
@php $_date = strtotime($date) * 1000; @endphp You can display the date in one element:

<b data-datelocal="MMMM d, y - hh:mm aaaa"> {{ $_date }} </b>

Or you can break up the date in multiple HTML elements:

<div>
  <span>mese e giorno </span>
  <b data-datelocal="MMMM d,"> {{ $_date }} </b>
</div>
<div>
  <span>anno </span>
  <b data-datelocal="y"> {{ $_date }} </b>
</div>
<div>
  <span>ora </span>
  <b data-datelocal="hh:mm aaaa"> {{ $_date }} </b>
</div>
```

Then in your `.js` file:

```js
import { autoConvertToLocalDates } from "@olmokit/core/helpers/date";
import { autoConvertToLocalDates } from "@olmokit/core/helpers/date";

autoConvertToLocalDates();
```

### Date formats

Available date formats follow [`date-fns` documentation](https://date-fns.org/docs/format).
