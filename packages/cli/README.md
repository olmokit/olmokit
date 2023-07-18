# cli

![npm (scoped)](https://img.shields.io/npm/v/@olmokit/cli?style=flat-square&color=FF52DE)

> For all the documentation refer to the [Olmo docs](https://olmokit.github.io/olmokit)

## Development

- [x] Run `php artisan view:clear && composer dump` after generate component and after `core` (not needed with `ps-4` autoloading mechanism)
- [] autogenerate dummy `translations.csv` files based on cms api response in case they miss
- [] `check` should check that there is a `/vendor` folder, otherwise run `composer install`
- [] Add this command somewhere to the end of your deploy script (I put it just after artisan up) `php artisan opcache:clear` [source](https://medium.com/appstract/make-your-laravel-app-fly-with-php-opcache-9948db2a5f93)
- [] Implement `preload`/`prefetch`, see [article from webpack author](https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c) and probably use [preload-webpack-plugin](https://www.npmjs.com/package/preload-webpack-plugin).
- [x] CSS is inlined if the file size is minor than 50kb, as the AMP specification suggest. JS inline threshold is set to just 2kb instead, see [this article](https://v8.dev/blog/cost-of-javascript-2019#guidance).
- [] evaluate the use of [compression-webpack-plugin](https://github.com/webpack-contrib/compression-webpack-plugin)
- see [How to force https, www and a trailing slash with one redirect](https://www.danielmorell.com/guides/htaccess-seo/redirects/https-www-and-trailing-slash) for a good explanation on how to manage SEO friendly redirects through `.htaccess`
