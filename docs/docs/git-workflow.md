---
title: Git workflow
---

## Branches

Development happens initially on `master` and then, when more developers come in, specific work is done on specific branches branched from `master`. It is important to often pull from there with `git pull origin master` to avoid problematic merge conflicts.

### `master`

> Use files: `.env.dev` and `/public/.htaccess.dev`.

Here resides the stable `dev`elopment code, it is usually protected by http authentication and by default non indexable by search engines (a `robots.txt` is automatically generated). This environment is meant for internal previews.

### `staging`

> Use files: `.env.staging` and `/public/.htaccess.staging`.

Here resides the code deployed on the `staging` enviroment e.g. `myproject.mycompany.com`, it is publicly available and by default non indexable by search engines (a `robots.txt` is automatically generated). The staging environment is shared with clients for previewing the website before going to production.

### `production`

> Use files: `.env.production` and `/public/.htaccess.production`.

It hosts the production code publicly available at e.g. `myproject.com`.
