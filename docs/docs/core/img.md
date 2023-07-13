---
title: img
---

Images starting with version `laravel-frontend@0.3.7` use [pretty urls, see issue](https://gitlab.com/olmokit/olmokit/-/issues/23). This is not a breaking change, pretty urls are enabled by default when using the `olmo` CmsApi. This default enabling can be overridden only at a global level for all images in your project through the env variable `IMG_PRETTY_URLS=true` or `IMG_PRETTY_URLS=false`. Leave that undefined (commented) is recommended.

## Usage

```php
<x-img src="myfolder/myimage.jpg"/>

or

<x-img src="{{ $mydata['image'] }}"/>
```

## Props

Props related to image processing with their defualt values.

### src

> `string` ("")

A relative path to your image. By default the base URL is what set by the [CMS Api in the `/api/structure`](../laravel-frontend/Cms) -> `assets` -> `media`. When `local` is set to `true` the base URL will be your public path `/images` folder where images will be placed automatically during build/dev.

### local

> `boolean` (false)

Whether an image comes from your local `/src/assets/images` folder or from the remote `assets.mediaUrl` retrieved with the [`/structure` CMS API endpoint](../laravel-frontend/Cms).

### original

> `boolean` (false)

Set it to `original="true"` when you want an image to bypass the resizer altoghether. This prevents any transformation operation (cropping, resizing, colorize, greyscale) but still allows to have a blurred thubmnail and predictable width and height.

### compression

> `string | int` (90)

Override the `jpg` compression quality for this specific image, to change the default value for all images in your project set in your env `IMG_COMPRESSION_QUALITY=75`.

### compression-webp

> `string | int` (90)

Override the `webp` compression quality for this specific image, to change the default value for all images in your project set in your env `IMG_COMPRESSION_QUALITY_WEBP=75`. It defaults to the `compression` prop if given and to the `IMG_COMPRESSION_QUALITY` env variable if set.

### width

> `number` (automatically set)

Self explanatory. If not given the image resizer will grab the original image size.

### height

> `number` (automatically set)

Self explanatory. If not given the image resizer will grab the original image size.

### fit

> `"clip" | "clamp" | "crop"` ("clip")

Follows [same documentation](https://docs.imgix.com/apis/url/size/fit) as imgix's `fit`. Valid values here are only `clip` (default), `clamp` and `crop`.

### position

> `"top-left" | "top" | "top-right" | "left" | "center" | "right" | "bottom-left" | "bottom" | "bottom-right"` ("center")

Only applied when using `fit=crop`, about the possible values [see InterventionImage docs](https://image.intervention.io/v2/api/fit).

### greyscale

> `boolean` (false)

Note that everything passed will be coerced to a `boolean`.

### colorize

> `string` ("")

In this form `colorize="r,g,b"` where `r`, `g`, `b` are numbers, they will be converted to integers. Use values between `-100` and `+100`, [see InterventionImage docs](https://image.intervention.io/v2/api/colorize).

## Other props

Props not related to image processing with their defualt values.

### tag

> `string` ("span")

When passing an `href="mylink"` attribute it is automatically set to `a` link HTML tag, it defaults to `span`.

### href

> `string` ("")

When passing a url to `href` a link `<a>` HTML tag is used on the wrapper HTML element instead of the default `<span>`, overriding what given to `tag` prop.

### alt

> `string` ("")

For accessibility and SEO this should always be used.

### immediate

> `boolean` (false)

Skips lazy loading and load image immediately, useful for "above-the-fold" images.

### thumb

> `boolean` (true)

Shows a base64 inline small version of the image before the actual one get lazy loaded.

### fixed

> `boolean` (false)

By default image's wrapper frame are stretched to fit its parent container, with `fixed="true"` it will have a `max-width: {width}px` equal to the given [`width`](#width) prop.

### bg-color

> `string` ("")

You can define a background for the wrapper frame that holds the image, if used you probably want to also set `:thumb="false"`

### cage

> `boolean` (true)

The cage uses a "proportioner" HTML `<span>` element that keeps the img container with the same proportions as the image with the `padding-top: {proportion-percentage}%` technique. The image is placed above it with a `position: absolute` and centered within the created _cage_. This structure gives a lot of flexibility and contribute preventing CLS (Cumulative Layout Shifts). As we always know the image and width of the image it is actually not really necessary, therefore you can set it to `false`, especially when you are within _free-width_ flex containers and you stumble upon the _0 height resulting elements_.

### css-fit

> `"cover" | "contain"` ("cover")

By default `<img />` inner tag uses `object-fit: cover`, that can be changed to `contain` (a polyfill ensure browser's compatibility out of the box).

### progress

> `boolean | number` (false)

Shows a centered spinner for lazy loaded imaged, the given `number` will set the diameter of the circular progress spinner (uses `<x-progress-circular />`)

### attrs-root

> `attrs-root` ("")

Attributes on the wrapper `<span />` HTML element.

### attrs

> `attrs` ("")

Attributes on the inner `<img />` HTML element.

## Caveats

### Svg handling

Svg images are not supported by this component at the moment, firstly because `Image\Intervention` does not support it, secondly because we cannot do much on svgs, neither retrieve width and height, nor crop or process them. If you still want to use an `svg` image from the remote source provided by the CMS Api you might want to use the [facade `Img`](../laravel-frontend/Img) to construct the absolute remote URL of the svg:

```html
<img src="{{ Img::getOriginalUrl('FOLDER/imagename.svg') }}" />

or, if the image come from your local src/assets/images folder:

<img src="{{ Img::getOriginalLocalUrl('imagename.svg') }}" />
```

<!--
## Resizer

### Option `factor`

Opzione per generare facilmente delle immagini delle stesse proporzioni ma un po' più grandi (o più piccole) rispetto alle dimensioni che leggiamo nei layout su zeplin. La si usa così:

```twig
{% partial "media/img"
  img=my.img | img('media',270,187,{mode: 'crop',factor: 1.5})
  alt='my-alt'
  width=270
  height=187
  fullwidth=true
%}
```

In questo modo le misure 270 e 187 le possiamo prendere/copiare dal layout su zeplin e poi dire al resizer, senza fare calcoli a mente, di tagliarmela di quella dimensione con un `factor` di moltiplicazione, quindi in questo caso il resizer genererà un immagine di 405x280 (fa l'arrotondamento a un numero intero in automatico).
Poi invece i due parametri sotto all'`alt` (`width` e `height`) rimangono, come era prima, a dettare ciò che che viene gestito nel partial. Da notare è che se non si mette `fullwidth=true` tutto questo non ha senso perchè nel partial altrimenti viene applicato lo stile `max-width: 270px​​​​​​​`.

## Interesting plugins

- Zoom effect like medium [lightense-images](https://sparanoid.com/work/lightense-images/)
 -->
