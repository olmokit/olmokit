# cli

![npm (scoped)](https://img.shields.io/npm/v/@olmokit/cli?style=flat-square&color=EA2C65)

> For all the documentation refer to the [Olmokit Docs](https://olmokit.gitlab.io/olmokit/)

## Installation

It is recomended to start a project by running:

```console
npx @olmokit/create-app myproject
cd myproject
npm start
```

## Laravel

## Available commands

From your root folder run `olmo help` to view the available commands and their description.

## Development

### TODO

- [] Environments might be made configurable through a custom `config.environments` value in the package.json, where each key is the environment `name` and the value is its `branch`, the default values would be:

```json
  "config": {
    "environments": {
      "dev": "master",
      "staging": "staging",
      "production": "production"
    },
```

- [x] Run `php artisan view:clear && composer dump` after generate component and after `core` (not needed with `ps-4` autoloading mechanism)
- [] autogenerate dummy `translations.csv` files based on cms api response in case they miss
- [] `check` should check that there is a `/vendor` folder, otherwise run `composer install`
- [] Add this command somewhere to the end of your deploy script (I put it just after artisan up) `php artisan opcache:clear` [source](https://medium.com/appstract/make-your-laravel-app-fly-with-php-opcache-9948db2a5f93)
- [] Implement `preload`/`prefetch`, see [article from webpack author](https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c) and probably use [preload-webpack-plugin](https://www.npmjs.com/package/preload-webpack-plugin).

### Notes

About _assets inlining_, CSS is inlined if the file size is minor than 50kb, as the AMP specification suggest. JS inline threshold is set to just 2kb instead, see [this article](https://v8.dev/blog/cost-of-javascript-2019#guidance).

About _optimization_ evaluate the use of [compression-webpack-plugin](https://github.com/webpack-contrib/compression-webpack-plugin)

About _gzip compression_ see October's not-including-it-by-default reasons here https://github.com/octobercms/october/pull/1896, https://github.com/octobercms/october/pull/1885, https://github.com/octobercms/library/pull/201/commits/db2dec55ed7d42201f92b59e1de74b5c3196841c, https://github.com/octobercms/october/pull/1885/commits/86ca0c7e8d79a4a8f0662203b0b04cf549b6fc63, https://github.com/octobercms/october/issues/1847, https://octobercms.com/forum/post/assets-gzip-compression

### .htaccess

For a good explanation on how to manage redirects SEO friendly see [How to force https, www and a trailing slash with one redirect](https://www.danielmorell.com/guides/htaccess-seo/redirects/https-www-and-trailing-slash).
