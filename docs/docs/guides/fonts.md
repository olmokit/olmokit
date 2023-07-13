---
title: Using custom fonts
---

## With `fountsource`

To use a custom a font the best option is to use [fountsource](https://github.com/fontsource/fontsource), so first check that the desired font is available browsing [their docs page](https://fontsource.org/fonts). If it is, including it in your project is a three step process:

1. Run `npm i @fontsource/montserrat`
2. Open your `src/layouts/main/index.ts` (if you want to import the fonts on all your project's routes) and import the font and its desired variations, e.g.:

```ts
import "@fontsource/montserrat/latin-400.css";
import "@fontsource/montserrat/latin-500.css";
import "@fontsource/montserrat/latin-700.css";
```

3. Open your `src/config/variables.scss` and assign the fonts:

```scss
$Typography-font-sans-custom: "Montserrat";
```

## With custom font files

These are the 4 steps to use custom fonts in your project:

1. First put your font files (even just `.ttf` format) in `src/assets/fonts`
2. In file `src/utils/fonts.scss` import your fonts with the [`Font-face` sass mixin](https://gitlab.com/olmokit/olmokit/-/tree/main/core/scss/mixins/_fonts.scss), e.g.:

```scss
@include Font-face(Barlow, "Barlow-Regular", normal, normal, ttf);
@include Font-face(Barlow, "Barlow-Italic", normal, italic, ttf);
@include Font-face(Barlow, "Barlow-SemiBold", 500, normal, ttf);
@include Font-face(Barlow, "Barlow-Bold", bold, normal, ttf);
@include Font-face(SourceCodePro, "SourceCodePro-ExtraLight", 100, normal, ttf);
@include Font-face(SourceCodePro, "SourceCodePro-Regular", normal, normal, ttf);
@include Font-face(SourceCodePro, "SourceCodePro-Bold", bold, normal, ttf);
```

3. Open your `src/layouts/main/index.js` (if you want to import the fonts on all your project's routes) and import that file:

```js
import "utils/fonts.scss";
```

4. Open your `src/config/variables.scss` and assign the fonts:

```scss
$Typography-font-sans-custom: "Barlow";
$Typography-font-serif-custom: "SourceCodePro";
```
