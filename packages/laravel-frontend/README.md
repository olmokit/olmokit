# Laravel Frontend

[![composer](https://img.shields.io/packagist/v/olmo/laravel-frontend?include_prereleases&label=composer%3A%20packagist.org)](https://packagist.org/packages/olmo/laravel-frontend)

> For all the documentation refer to the [Olmo docs](https://olmokit.github.io/olmokit).

This package is automatically mirrored as a standalone repository to [GitHub](https://github.com/olmokit/olmo-laravel-frontend) through [a script in olmokit](../../tools//dev-publish.ts). Composer installs `olmo/laravel-frontend` through the [packagist.org's package](https://packagist.org/packages/olmo/laravel-frontend) which points to the mirrored repository.

## How to

### Develop this package locally

Simply symlink your development version inside the project's `vendor` folder.

### Use a forked package

Add to your project's `composer.json`:

```json
  "repositories": [
      {
          "type": "vcs",
          "url": "git@git.acanto.net:acanto-forks/laravel-page-speed.git"
      }
  ],
  "require": {
      "renatomarinho/laravel-page-speed": "dev-master"
  }
```

### One liners

One liner to clear local cache:

```bash
php artisan config:clear && php artisan route:clear && php artisan view:clear && php artisan cache:clear && composer dump-autoload
```

One liner to optimize laravel:

```bash
php artisan config:cache && php artisan route:cache && php artisan view:cache && composer dump-autoload
```

## Development

### Notes

- to manage trailing slashes we might use [illuminatech/url-trailing-slash](https://github.com/illuminatech/url-trailing-slash)
- Take a deeper look at [package-skeleton-laravel](https://github.com/spatie/package-skeleton-laravel)
- [About protecting http request based image resizing with signed URL](https://glide.thephpleague.com/1.0/config/security/)
- [Laravel optimization](https://www.cloudways.com/blog/laravel-performance-optimization/)
- [Laravel optimization](https://geekflare.com/laravel-optimization/)
- [A way to handle authentication through just session and cookies and comunicate with API, for Laravel 6.0](https://gist.github.com/eusonlito/8b5389db1d390c17aba123645fd99ea1)
- [Laravel Resources to create intermediary between thirdy-part API and laravel application](https://medium.com/@jeffochoa/consuming-third-pary-apis-with-laravel-resources-c13a0c7dc945)
- [Laroute, package to pass laravel routes to js](https://github.com/aaronlord/laroute) (might be useful to implement barba.js)
- [Usecase about Laravel routes optimization](https://stackoverflow.com/q/37754795)
- [About creating a middleware to check incoming requests domain](https://medium.com/@mayasavir/laravel-check-request-origin-domain-d825fc05dc1c), this is useful to create protected hooks for the CMS to clear/manages the cache on specific actions, e.g. saving a new product during data entry
- [About not using env outside config files to get cache and speed](https://andy-carter.com/blog/env-gotcha-in-laravel-when-caching-configuration)
- About authentication with external API: [recent](https://laracasts.com/discuss/channels/laravel/passport-omit-standard-user-authentication-and-use-custom-logic?page=1), [1](https://stackoverflow.com/questions/61980446/how-do-we-implement-custom-api-only-authentication-in-laravel) [2](https://laracasts.com/discuss/channels/laravel/authenticating-with-eloquent-and-without-database-how-to-handle-user-roles-and-permissions), [3](https://stackoverflow.com/questions/41947149/how-to-fix-unauthorized-access-on-post-oauth-token)
- About [Laravel and OPcache](https://deliciousbrains.com/optimizing-laravel-performance-queues-front-end-opcache/)

### Flood prevention

- [Old and small antiflood system for Laravel](https://github.com/ircop/antiflood)
- [About Laravel's throttle middleware and load balancer HAProxy](https://medium.com/swlh/laravel-rate-limiting-in-production-926c4d581886)

### Caching

- Middleware `throttle` might cause high disk IO if we use it too much (e.g. for images) with a cache `file` driver ([source](https://medium.com/cafe24-ph-blog/understanding-the-usage-of-cache-in-laravel-f6cf30f4a9b5))
- [Performance comparison of cache drivers](https://www.georgebuckingham.com/laravel-cache-driver-performance/)
- Alternative cache system with tagging for file driver cache: [alternative-laravel-cache](https://github.com/swayok/alternative-laravel-cache), see [laravel 9 support issue](https://github.com/swayok/alternative-laravel-cache/issues/34) (we followed the suggested swap of cache adapter dependency and it works)
- Cache tagging library for file driver cache: [taggedFileCache](https://github.com/unikent/taggedFileCache)
- Cache library for Laravel [laravel-responsecache](https://github.com/spatie/laravel-responsecache)

### Sitemap

- [Can a sitemap not be at the root of the website?](https://support.google.com/webmasters/thread/23099756?hl=en)
- Images sitemap to boost SEO friendly images names despite hashed cached images filenames: we could generate [an image sitemap](https://support.google.com/webmasters/answer/178636?hl=en) that would read all the cache and map original filenames from the CMS (cleaned up of their timestamp) to each URL of its cropped/resized/transformed versions. Another way would be to perhaps use `iptc` images metadata, [Intervention supports it](http://image.intervention.io/api/iptc) with `gd` driver too.
