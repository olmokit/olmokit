# Olmo

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/1dfb471aa62649a29ffd71d1f386e7fe)](https://www.codacy.com/gl/olmokit/olmokit/dashboard?utm_source=gitlab.com&utm_medium=referral&utm_content=olmokit/olmokit&utm_campaign=Badge_Grade) [![pipelines](https://gitlab.com/olmokit/olmokit/badges/main/pipeline.svg)](https://gitlab.com/olmokit/olmokit/-/pipelines)

Monorepo for the whole Olmo Kit, offical documentation at [olmokit.gitlab.io/olmokit](https://olmokit.gitlab.io/olmokit)

## Contribute

Clone this repo locally and install dependencies running

```bash
pnpm i
```

Build and globally link all packages with:

```bash
pnpm dev
```

Now in your test project bootstrapped with `@olmokit/create-laravel-app` you can run `npx olmo link` to use the globally symlinked packages from your machine.

### Publish packages

First commit and push your local work. Then, never manually bump package versions, just run form the terminal:

```bash
pnpm dev publish
```

NB: The only file you might need to manually bump is [`./packages/template-laravel/template/composer.json`](/-/tree/main/packages/template-laravel/template/composer.json) with the latest `olmo/laravel-frontend` version. This is probably required only for **major** semver version changes and it is likely better to keep a non-strict version here as its only purpose it is to bootstrap the project with the latest available major release.

### Dev notes

- Switch between php versions on linux `sudo update-alternatives --set php /usr/bin/php` (then press tab for autocomlete options).

#### TODO:

- **preview**: via URL param only applied to the base controller of each Laravel Route

#### FIXME: Migration notes

- Use `parcel-watch` instead of chokidar
- Use [`lighting-css` as CSS minifier](https://lightningcss.dev/docs.html#with-webpack)
- To analyse current package managers see [nx source](https://github.com/nrwl/nx/blob/master/packages/nx/src/utils/package-manager.ts)
- Build libraries with nx and scss:
  - https://stackoverflow.com/a/75068601/1938970
  - https://github.com/nrwl/nx/issues/1542#issuecomment-508806609
- Maybe fork [nx-composer](https://github.com/automattic/nx-composer)
- I've manually added "videojs-font" to [core's deps](./packages/core/package.json), that is not right, but I am afraid otherwise that dep willb e taken out from production/publishable build
- Look at [`addDependenciesToPackageJson`](https://github.com/nrwl/nx/blob/master/packages/devkit/src/utils/package-json.ts#L134) and [`installPackagesTask`](https://github.com/nrwl/nx/blob/master/packages/devkit/src/tasks/install-packages-task.ts#L17) to dynamically add and install dependencies
- To use `vite` as an alternative to webppack see official laravel [vite-plugin source](https://github.com/laravel/vite-plugin/blob/main/src/index.ts)
- Using `"@swc/core": "^1.3.68"` was causing exported strings from ts files to be inlined in the file resulting in missing exports from files that were importing from there, reverting to `"@swc/core": "1.3.64"` fixed the issue. But we should align to the latest version.

##### Projects migration guide

- Fillform deprecation:
  - in .scss files find and replace "FF-" with "OF-"

##### Import paths from libs

```js
// from
import { getQueryParams } from "@acanto/core/helpers";
// to
import { getUrlQueryParams } from "@olmokit/utils";

import { changeUrlParams } from "@acanto/core/helpers";
import { navigateToMergedParams } from "@olmokit/browser";

import { removeUrlParam } from "@acanto/core/helpers";
import { navigateWithoutUrlParam } from "@olmokit/browser";

import { removeDuplicatesByKey } from "@acanto/core/helpers";
import { removeDuplicatesByKey } from "@olmokit/utils";

import { debounce } from "@acanto/core/helpers";
import { debounce } from "@olmokit/utils";

import { transitionBarbaCurtain } from "@acanto/core/transitions";
import { transitionsBarbaCurtain } from "@acanto/core/transitions";

import { initSwiper } from "@acanto/core/swiper";
import { swiperInit } from "@olmokit/core/swiper";

import { navigation } from "@acanto/core/swiper";
import { swiperNavigationOptions } from "@olmokit/core/swiper";

import { IMG_EMPTY_PLACEHOLDER } from "@acanto/core/img";
import { imgEmptyPixel } from "@olmokit/utils";

import { getCookie } from "@acanto/core/cookies";
import { readCookie } from "@olmokit/utils";

import { setCookie } from "@acanto/core/cookies";
import { setCookie } from "@olmokit/utils";

import { deleteCookie } from "@acanto/core/cookies";
import { removeCookie } from "@olmokit/utils";

```

##### GSAP custom version

That seem not needed anymore, it is better to install it specifically in the project that needs it, before we had for `npm` in the project's `package.json` the [`resolutions` data](https://www.npmjs.com/package/npm-force-resolutions), added now is what would need `pnpm` instead:

```json
  resolutions": {
    "gsap": "file:src/vendor/gsap-bonus.tgz"
  },
  "pnpm": {
    "overrides": {
      "gsap": "file:src/vendor/gsap-bonus.tgz"
    }
  },
```

Note that today you can also use the natively supported [`overrides` in the package.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides) file.
It is better to deprecate all this, also update the [related doc file](./docs/docs/folder-structure.md#srcvendor) and probably remove the `vendor` folder from the laravel template, or just keep it empty?.

### Manteinance

#### Outdated packages

```bash
$ pnpm i
 WARN  deprecated rollup-plugin-terser@7.0.2: This package has been deprecated and is no longer maintained. Please use @rollup/plugin-terser
 WARN  deprecated sourcemap-codec@1.4.8: Please use @jridgewell/sourcemap-codec instead

$ pnpm why stable@0.1.8
dependencies:
svg-sprite 2.0.2
└─┬ svgo 2.8.0
└── stable 0.1.8

$ pnpm why rollup-plugin-terser@7.0.2
dependencies:
workbox-webpack-plugin 7.0.0
└─┬ workbox-build 7.0.0
└── rollup-plugin-terser 7.0.2

$ pnpm why sourcemap-codec@1.4.8
dependencies:
workbox-webpack-plugin 7.0.0
└─┬ workbox-build 7.0.0
├─┬ @rollup/plugin-replace 2.4.2
│ └─┬ magic-string 0.25.9
│ └── sourcemap-codec 1.4.8
└─┬ @surma/rollup-plugin-off-main-thread 2.2.3
└─┬ magic-string 0.25.9
└── sourcemap-codec 1.4.8

```

Using in `package.json`:

```json
  "pnpm": {
    "overrides": {
      "rollup-plugin-terser": "@rollup/plugin-terser@0.4.3",
    }
  }
```

does not work, `workbox-webpack-plugin` complains, follow the [related issue](https://github.com/GoogleChrome/workbox/issues/3200)
