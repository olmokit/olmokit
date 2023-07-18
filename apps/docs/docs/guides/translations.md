---
title: Translations
---

## File

The translation file is in `.csv` format and it needs to be placed in `src/assets/translations.csv`.

This file must have the following structure:

```csv
code,en,it
myroute.mykey, English text, Italian text
```

Where the first line has the local codes (that match the project's localised URLs slugs), the first column has all the keys in **alphanumeric symbols**, only **dots**, **dashes** and **underscores** punctuation are allowed. The `.` dot is used to specify the string's location within the website and/or its specific route or component.

:::note

During development you don't need to fill all translations for each locale, the first is enough and it is used as a fallback if a string in a specific locale is not filled in.

:::

## Usage

### `$trans` variable

A variable `$trans` is always exposed to **all** views (`components`, `routes`, `utils`, ecc.) and you use it as such:

```php
<h2>{{ $trans['MyComponent.plaintext'] }}</h2>

<div>{!! $trans['MyComponent.htmltext'] !!}</div>
```

### `t` function

To interpolate variables into your strings you can use the global helper function `t`, available in all views and php files.

In your `src/assets/translations.csv`:

```csv
Header.profile, "Welcome :name"
```

in your blade template file:

```html
<span> {!! t('Header.profile', [ 'name' => '<b>'.$user['name'].'</b>' ]) !!} </span>
```

## CSV Formatting

The translation file can be edited with any `csv` ready software like `LbreOffice Calc`, `Excel` or `Google Sheets` and the formatting is handled automatically. If you need to edit this file manually from a text editor consider the necessarye escaping:

1. If your string contains commas wrap it in double quotes:

```csv
MyComponent.plaintext, "My string, with commas"`
```

2. If your string contains html escape the html quotes:

```csv
MyComponent.htmltext, "<a href=""https://www.example.com"" target=""_blank"" rel=""noopener"">Example.com</a>"`
```

## Conventions

All string keys are lowercase and their parts, used to target specific section of your template, are divided by a `dot`. By convention (not mandatory) strings are named following simple rules such as:

1. If a key is specific of a `route` it has the route _unique name_ as prefix in `lowercase`.
2. If a key is specific of a `component` it has the component _unique name_ as prefix in `PascalCase`.
3. If a key is specific of a `core` element it has the component _unique name_ as prefix in `kebab-case`.

Some examples:

```csv
contacts.intro.title
contacts.intro.desc
FormContact.title
FormContact.feedback.success
FormContact.feedback.fail
auth.password-recovery.ok
```
