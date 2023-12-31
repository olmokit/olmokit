---
id: folder-structure
title: Folder structure
---

Frontend code resides by default in the `src` folder placed in the root of the project. Everything gets compiled and assembled in the standard Laravel folders `/resources` and `/public`, whose content is gitignored.
Each path used in the build scripts can be overridden in the specific project `package.json` file, but the ideal and default folder configuration assumed is the following:

## Overview

- All files marked with `**` are autogenerated by `@olmokit/cli` initially, and can be customised afterward.
- All files marked `autogenerated` are autogenerated by `@olmokit/cli` on each run, they cannot be customised (TODO: maybe allow it).

_Everything greyed out is gitignored._

```yaml
├── .vscode # autogenerated, customizable
├── .husky # autogenerated, customizable
#── bootstrap/ # standard laravel folder (.gitignored)
#   ├── cache.php # standard laravel
#   └── app.php # standard laravel
├── config/ # standard laravel folder
#   ├── env.php # autogenerated (.gitignored)
│   └── laravel-frontend.php # custom configuration merged to the default
#── node_modules # .gitignored
├── public/ # standard laravel folder
#   ├── assets/ # compiled static assets (.gitignored)
#   ├── index.php # .gitignored
│   ├── .htaccess # **
│   ├── .htaccess.dev # **
│   ├── .htaccess.staging # **
│   ├── .htaccess.production # **
#   └── favicon.ico # autogenerated (.gitignored)
#── resources/ # standard laravel folder (.gitignored)
#   └── components/ # compiled components, including core components and utils to use across pages. Only files from `src/components` will follow PascalCase <x-MyComponent /> syntax, the others will use kebab-case syntax <x-my-util />
#   │   ├── MyComponent.blade.php # component template
#   │   ├── MyComponent.php # component "controller" (optional)
#   │   ├── assets-body.php # automated views get copied here too
#   │   └── seo-meta.php # core views get copied here too
#   ├── fragments/ # compiled fragments
#   │   └── MyFragment.php # custom fragment controller
#   │   └── routes.php # custom fragment's routes
#   ├── layouts/ # compiled layout
#   │   └── main.blade.php # compiled layout templates
#   ├── middlewares/ # compiled middlewares
#   │   ├── Middlewares.php # automated middlewares registration file
#   │   └── MyMiddleware.php # compiled middleware classes
#   ├── routes/ # compiled routes
#   │   ├── RouteHome.blade.php # route compiled template
#   │   └── RouteHome.php # route compiled controller
#   │   └── routes.php # optional custom routes file
#   ├── services/ # compiled services
#   │   ├── MyService.php # compiled service class
#   |   └── MyServiceProvider.php # compiled service provider class
#   └── translations.csv # translated strings .csv files
├── src/ # source of all the frontend (it will not be deployed)
│   ├── assets
│   │   ├── images/ # all static images
│   │   |   └── placeholder.png # required placeholder for broken images sources
│   │   ├── media/ # all static video and audio files
│   │   ├── svgicons/ # svg images that will be turned automatically in an icon system
│   │   ├── fonts/ # custom fonts
│   │   └── favicon.png # required image to automatically generate all favicons
│   │   └── translations.csv # required translation strings file
│   ├── config/ # configuration files
│   │   ├── placeholders.scss # scss config (always included in any other file)
│   │   ├── mixins.scss # scss config (always included in any other file)
│   │   ├── variables.scss # scss config (always included in any other file)
│   │   └── index.js # js config (globals, settings, ecc.)
│   ├── components/ # decoupled components to use across routes
│   │   └── Mycomponent/ # component folder uses component name
│   │       ├── index.js # component script
│   │       ├── index.scss # component style
│   │       ├── index.php # component controller
│   │       └── index.blade.php # component template
│   ├── fragments/ # custom routes and async behaviours
│   │   ├── routes.php # custom routes definitions
│   │   └── MyController.php # custom route handlers
│   ├── layouts # usually just one for project, but more layouts can be created and used independently within the same project
│   │   └── main # usually the standard layout to use in all templates
│   │       ├── index.js # common js/scss imports for this layout
│   │       ├── index.scss # common scss for this layout
│   │       └── index.blade.php # base template for this layout
│   ├── middlewares # custom laravel middlewares (optional)
│   │   ├── MyMiddleware.php # custom middleware
│   ├── routes # routes entrypoints
│   │   ├── home
│   │   │   ├── index.js # route specific and scoped scripts
│   │   │   ├── index.php # route specific controller
│   │   │   ├── index.blade.php # route specific template
│   │   │   ├── index.scss # route specific and scoped styles
│   │   │   └── index.json # route specific static json data (optional)
│   │   └── routes.php # file with custom routes (optional)
│   ├── services # custom laravel services (optional)
│   │   ├── MyService.php # custom service
│   │   ├── MyServiceProvider.php # custom service provider
│   ├── utils # folder to drop-in js/scss files, event templates can be here, these are copied automatically to the /resources/components folder allowing usage with e.g. <x-utils-some-utility />
│   │   ├── some-utility.blade.php # will be copied to /resources/components
│   │   ├── animations.scss # utils like styles
│   │   └── animations.js # utils simple script
│   └── vendor # custom vendor imports
#       ├── routesBarba.ts # automatic imports for barba (.gitignored)
│       ├── package-name.js # customised vendor script
│       └── package-name.scss # customised vendor styles
#── storage/ # standard laravel folder .gitignored
#   ├── app
#   ├── debugbar
#   ├── framework
#   └── logs
#── vendor # .gitignored
#── artisan # standard laravel php bin (.gitignored)
#── tsconfig.json # autogenerated
#── README.md # autogenerated
#── .env # autogenerated
├── olmo.ts # public configuration of the project
├── .olmo.ts # custom local configuration of the project (.gitignored)
├── composer.json # composer dependencies
├── package.json # project's configuration and npm dependencies
│── .gitignore # **
└── .gitlab-ci.yml # (optional)
```

Here in details:

## bootstrap

Refer to [Laravel documentation](https://laravel.com/docs/8.x/structure#the-bootstrap-directory). This folder is gitignored here.

## config

The config directory contains all of your application's configuration files, see [Laravel documentation](https://laravel.com/docs/8.x/structure#the-config-directory). Unlike standard laravel you usually do not have many files here, but actually just one `config/laravel-frontend.php` as [Laravel Frontend](laravel-frontend/index.md) will already includes all the typical config files you need. If something outside `laravel-frontend` need to be overriden in your project, for instance to add some custom cached `env` variables, you can create the same config file (with the same name, e.g. `config/env.php`) and override or add just the keys you want, without redeclaring the ones already present. Your file will be merged on top of the default one provided by [Laravel Frontend](laravel-frontend/index.md). See [all configuration files in the source code](https://github.com/olmokit/olmokit/-/tree/main/packages/laravel-frontend/config).

## public

Refer to [Laravel documentation](https://laravel.com/docs/8.x/structure#the-public-directory). Typically you should only have here your environment sensible `.htaccess` files, these files are automatically generated if missing each time you run a workflow command from the [Olmokit CLI](usage.md). All the rest here is processed, compiled and gitignored.

## resources

Refer to [Laravel documentation](https://laravel.com/docs/8.x/structure#the-resources-directory). It contains all processed blade templates and php files. This folder is `gitignored` as all its typical files are put in `src/` and processed before getting here.

## src

All the actual code of your project resides here.

### src/assets

This folders contains all static assets that gets manipulated, optimized and copied over the October's default `public/assets` folder, they are divided as such:

#### src/assets/fonts

All fonts files, they will get automatically optimized, content hashed. An `.htaccess` with long term expiration headers will be placed in this folder on build.

#### src/assets/images

All static theme images, they will get automatically optimized and copied with the same file name in the `public/assets/images` folder. A content hashed version is also create when the image is used through webpack processing. An `.htaccess` with long term expiration headers will be placed in this folder on build.

#### src/assets/images/placeholder.png

Required image used as fallback for broken images.

#### src/assets/media

All static theme video, audio and other files, their filenames will **not** be hashed. No `.htaccess` will be placed here.

#### src/assets/svgicons

All svg icons that will be optimized and inlined in an automated component `<x-svgicons/>` to be usually included in `src/layouts/main/index.blade.php`. They will be later used in the templates by using the core component `<x-icon id="arrow_left"/>`

#### src/assets/favicon.png

Required png image (**1024x1024** is the optimal resolution) used to automatically generate all needed favicons. The script builds an automated `<x-favicons/>` component to be usually included in `src/layouts/main/index.blade.php`

### src/components

This folder contain **components** that are quite specific pieces of UI usually reused within the same project and that can, but not necessarily need, to be reused accross different projects. They should be responsible of specific functionalities and should be configurable from outside enought to allow their reuse in the same project. Usual use cases for components are pieces of UI like the `Header`, the `Footer`, `Card`s, `Slider`s, ecc.

Each component resides in its folder with a `js/scss` index file, a `blade` template and an optional `php` class. For an in-depth documentation on how to component works in Blade refer to [Laravel documentation](https://laravel.com/docs/8.x/blade#components).

Components folders by convention are named **PascalCase**, e.g. `ProductDetail` following a React like syntax and differentiating from the [core components](./code-conventions.md#core) that follow a **kebab-case** syntax. This means that you _use components_ defined in this folder with `<x-ProductDetail />` in your templates.

```bash
# create a component by running
olmo component MyComponent
# or multiple components with comma separated values
olmo component MyComponent,AnotherComponent
```

### src/config

The `scss` files here (`functions.scss`, `mixins.scss`, `variables.scss`, `placeholders.scss`) are always made automatically available to the whole project files. This is also the place where to put JavaScript global **configurations** such as breakpoints, various forms of data, URLs etc.

### src/fragments

In the `routes.php` you can define your custom routes and async endpoints (with the same degree of freedom you would have in the standard `routes/web.php` and `routes/api.php` of a [typical Laravel installation](https://laravel.com/docs/8.x/structure#the-routes-directory)). You are free to implement custom controllers and services here, all `php` files will be copied as they are, without renaming, to the `resources/fragments` folder. so the php namespace for each file here will be [`resources\fragments`](https://github.com/olmokit/olmokit/-/blob/main/packages/template-laravel/template/src/fragments/routes.php#L4).

### src/middlwares

Optional folder containing your project's custom middlewares, see [specific docs on how to create custom middlewares](./laravel-frontend/App.md#creating-custom-middlewares).

### src/routes

This folder contains **Routes** code, each folder represent a route endpoint and is usually but not necessarily tight to a CMS API endpoint. If a route defined in the [`/api/structure` endpoint](laravel-frontend/Cms.md#structure) is missing in your codebase the [start CLI command](usage.md) will auto-generate it, likewise it will warn when a route is defined in the codebase and missing in the CMS (although this can be completely fine it is better to know it). Each route folder here must contain an `index.js` file that is used as [an entrypoint for webpack](https://webpack.js.org/concepts/entry-points/) to generate the static assets. This way route's code is always scoped and outputted only to its specific template. So by default JS and SCSS code written here cannot interfere with other routes.

Route folders are by convention all **lowercase alphanumeric strings**, e.g. `singleproduct`, to allow having route error folders named as numbers only (`src/routes/404/index.php`) their names are translated to `Route404.php` once processed and put in the `resources` folder, otherwise their controllers would result in invalid php class names.

```bash
# create a route by running
olmo route myroute
# or multiple routes with comma separated values
olmo route myroute,anotherroute
```

### src/services

Optional folder containing your project's custom services, composers and providers, see [specific docs on services](./laravel-frontend/App.md#services-).

### src/utils

Here we can put `js` and `scss` **utilities** to use and import where needed from either `layouts`, `components` or `routes`. This is also a good place for tiny utils templates `.blade.php` if needed, they will be watched and copied over to the `/resources` directory and therefore become available in templates to use with `<x-utils-my-util />`

### src/vendor

This is the folder where to put **custom vendor** files that cannot for various reasons be added and managed by `npm`. A common use case is the presence of the premium `gsap` package that cannot be installed from the public `npm` repository. In order to force using the local version of `gsap` add the following below your dependencies in the `package.json`:

```json
"overrides": {
  "gsap": "file:src/vendor/gsap-bonus.tgz"
},
```
