---
title: Img
---

Images arriving from CMS api are managed through [Image/Intervention](http://image.intervention.io/) then saved in Laravel storage cache (with `file` driver and `Cache` facade) and exposed publicly to this route:

```yaml
{APP_URL}/_/img/cache/{imgHash}/{imgName}.{imgExtension}
```

According to SEO best practices images name (`imgName` above) are conserved from the original source, cleaned from the timestamp (e.g. `{imgName}_2323424323`) and forced to a clean hypened lowercase string.

During local development an endpoint is automatically exposed with the only purpose to test the resizer functionality, query parameters can be changed and the image will be resized on the fly (without being cached anywhere):

```yaml
{APP_URL}/_/img/try/{imgPath}?locale=0w=0&h=0&fit=clip&position=center
```

> **Note**: the CMS or the remote image manager should add a timestamp to the image filename just before it gets uploaded/saved/upated, so that each image filename would always contain a timestamp and there would not be problems of caching and Etags with long expiration.

### Image processing options/parameters

Refer to the [props section Props of the `<x-img/>` core component](/core/img#props).

### Facades

The facade `Img` with its public methods is made available, you might need it in your templates.
