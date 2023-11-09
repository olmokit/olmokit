---
id: configuration
title: Configuration
---

All configuration is hidden in the package `@olmokit/cli` published on npm, your project just uses its `package.json` file to apply some necessary configurations and run the scripts. In this way a project have fewer`dependencies` and the scripts can be updated separately from each project, so that every project can benefit from the updates.

### `olmo.config.ts`

Each project can override some configurations. TODO: docs.

### `.env`

Some useful variables dependent on the environment are automatically made **always available to all** js and scss files.

Inside all SCSS files you have for instance:

```scss
$DEV: true; // or false
$ENV: "dev" | "staging" | "production";
$SRC_ASSETS: "../assets";
$URL_ASSETS: "https://myproject.com/assets";
$SRC_FONTS: "../assets/fonts";
$URL_FONTS: "https://myproject.com/assets/fonts";
$SRC_IMAGES: "../assets/images";
$URL_IMAGES: "https://myproject.com/assets/images";
$SRC_SVGICONS: "../assets/svgicons";
```

Inside all JS files you have for instance:

```js
const __DEV__ = true; // or false
const __ENV__ = "local" | "dev" | "staging" | "production";
const __URL__ = "https://myproject.com";
const __API__ = "https://myproject.com/api";
const __ASSETS__ = "https://myproject.com/assets";
const __FONTS__ = "https://myproject.com/assets/fonts";
const __IMAGES__ = "https://myproject.com/assets/images";
```

All `.js` files of your project will get automatically IDE support for these variables.
