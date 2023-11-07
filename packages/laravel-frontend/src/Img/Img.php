<?php

namespace LaravelFrontend\Img;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Intervention\Image\Facades\Image;
use LaravelFrontend\Cacher\CacherTags;
use LaravelFrontend\Cms\CmsApi;
use Intervention\Image\Exception\NotReadableException;

/**
 * Img service
 *
 * Notes, to store the file in storage we can use:
 * Storage::put($path, $image->stream());
 */
class Img
{
    /**
     * Route path to test image handler on the fly during development
     *
     * TODO: use config('env.URL_TRAILING_SLASH')
     */
    const ROUTE_TRY_PATH = '/media/try/';

    /**
     * Src is the requested resource path, it can be either a relative URL
     * for remote images or a file path relative to the public assets images
     * folder (this should much @olmokit/cli setup).
     *
     * @var string
     */
    public $src = '';

    /**
     * Source is the full image source to feed the Intervention\Image make
     * method
     *
     * @see http://image.intervention.io/api/make
     * @var string
     */
    public $source = '';

    /**
     * The clean original filename (no extension and no timestamps), important
     * for SEO purposes
     *
     * @var string
     */
    public $name = '';

    /**
     * The clean original file relative path (no extension and no timestamps)
     *
     * @var string
     */
    public $path = '';

    /**
     * Params are the image transformations options
     *
     * See the [core.img](docs/docs/core/img.md) documentation for the params
     *
     * @var array
     */
    public $params = [];

    /**
     * The cache key prefix to store the image whose cached keys will be
     * suffixed wth `.{extension]` and its metadata, whose suffix is `.meta`
     *
     * @var string
     */
    protected $cacheKey = '';

    /**
     * Create a new Img instance and returns img metadata either from cache or
     * creating a new one
     *
     * @param string $src Image original relative src path
     * @param array $params Image parameters/options
     * @return LaravelFrontend\Img\Img
     */
    public function __construct(string $src, array $params)
    {
        $this->src = ltrim($src, '/');
        $this->params = self::getParamsWithDefaults($params);
        $this->name = self::getFilename($this->src);
        $this->path = self::getFilepath($this->src, $this->name);

        if ($this->params['local']) {
            $this->source = public_path('assets/images/' . $this->src);
        } else {
            $relativeUrl = implode(
                '/',
                array_map('rawurlencode', explode('/', $this->src))
            );
            $this->source = self::getBaseRemoteUrl() . '/' . $relativeUrl;
        }

        $this->cacheKey = $this->getCacheKey();

        return $this;
    }

    /**
     * Conditionally use pretty URLs  to ensure compatibility of older version
     * of the api and to allow global override at the `.env` level.
     *
     * @return boolean
     */
    private static function shouldUsePrettyUrls()
    {
        $envDefined = config('env.IMG_PRETTY_URLS');
        $apiMeta = CmsApi::getMeta();

        if ($envDefined === true || $apiMeta['name'] === 'olmo') {
            return true;
        }

        return $envDefined || false;
    }

    /**
     * Return the route prefix for img processing related endpoints
     */
    private static function getRoutePrefix()
    {
        if (self::shouldUsePrettyUrls()) {
            return 'media';
        }

        return '_/img';
    }

    /**
     * Get base remote URL, basically it just alias the CMS api method
     *
     * @return string
     */
    public static function getBaseRemoteUrl(): string
    {
        return CmsApi::getMediaUrl();
    }

    /**
     * Get image original URL from given relative source path
     *
     * @return string
     */
    public static function getOriginalUrl(string $src = ''): string
    {
        return self::getBaseRemoteUrl() . '/' . ltrim($src, '/');
    }

    /**
     * Get image original local URL from given relative source path
     *
     * @return string
     */
    public static function getOriginalLocalUrl(string $src = ''): string
    {
        return url('assets/images/' . ltrim($src, '/'));
    }

    /**
     * Get meta, public method to retrieve all image metadata, including its
     * URLs, name, etc.
     *
     * @return array Image metadata
     */
    public function getMeta()
    {
        if (Cache::has($this->cacheKey . '.meta')) {
            // dd(Cache::get($this->cacheKey . '.meta'));
            return Cache::get($this->cacheKey . '.meta');
        } else {
            return $this->createImage();
        }
    }

    /**
     * Get default params values
     *
     * @return array Image parameters/options
     */
    public static function getDefaultParams()
    {
        // compressions fallback logic
        $compression = config('env.IMG_COMPRESSION_QUALITY') ?? 75;
        $compressionWebp =
            config('env.IMG_COMPRESSION_QUALITY_WEBP') ?? $compression;

        return [
            'local' => 0,
            'original' => 0,
            'compression' => (int) $compression,
            'compressionWebp' => (int) $compressionWebp,
            'w' => 0,
            'h' => 0,
            'fit' => 'clip',
            'position' => 'center',
            'greyscale' => 0,
            'colorize' => 0,
        ];
    }

    /**
     * Get image parameters/options safely, with default values
     *
     * @param array $params Image parameters/options
     * @return array Image parameters/options
     */
    public static function getParamsWithDefaults(array $params = [])
    {
        $defaults = self::getDefaultParams();
        $mergedParams = [];

        foreach ($defaults as $key => $value) {
            if (!empty($params[$key])) {
                $mergedParams[$key] =
                    $params[$key] === true
                        ? 1
                        : ($params[$key] === false
                            ? 0
                            : $params[$key]);
            } else {
                $mergedParams[$key] = $defaults[$key];
            }
        }

        return $mergedParams;
    }

    /**
     * Turn the image parameters/options into a URL query string
     *
     * @param array $params Image parameters/options
     * @return string
     */
    private static function getQueryParamsString(array $params = [])
    {
        return '?' . http_build_query($params);
    }

    /**
     * Turn the image parameters/options into a SEO friendly image filename suffix,
     * All these numbered parts will be written to the filename if their values
     * is different than the default so that we get the cleanest filename possible.
     *
     * 1) local:
     *   - `local` only if the image comes from local assets folder
     * 2) original:
     *   - `original` only if the image is requested as it is from the CMS
     * 3) width and height:
     *   - `250x412` both width and height
     *   - `250x` width only
     *   - `x412` height only
     * 4) fit and position (note `position` is unused for now):
     *   - `crop|clamp|crop` only fit
     *   - `clamp_left` fit and position
     *   - `_left` only position
     * 5) greyscale:
     *   - `bw` if greyscale is truthy
     * 6) colorize:
     *    - `col_{value}` if colorize is defined (commas are replaced with underscores to get a valid URL)
     * 7) compression:
     *    - `@85` only default compression
     *    - `@85_56` both default compression and webp specific compression
     *    - `@_56` only webp specific compression
     *
     * @param array $params Image parameters/options
     * @return array
     */
    private static function getParamsAsUrlSegments(array $params = [])
    {
        $defaults = self::getDefaultParams();
        $segments = [];

        foreach ($params as $key => $value) {
            if (!isset($defaults[$key]) || $value == $defaults[$key]) {
                unset($params[$key]);
            }
        }
        $local = isset($params['local']) && $params['local'] ? 1 : 0;
        $original = isset($params['original']) && $params['original'] ? 1 : 0;
        $w = isset($params['w']) ? $params['w'] : '';
        $h = isset($params['h']) ? $params['h'] : '';
        $fit = isset($params['fit']) ? $params['fit'] : '';
        $position = isset($params['position']) ? $params['position'] : '';
        $greyscale = isset($params['greyscale']) ? $params['greyscale'] : '';
        $colorize = isset($params['colorize']) ? $params['colorize'] : '';
        $compression = isset($params['compression'])
            ? $params['compression']
            : '';
        $compressionWebp = isset($params['compressionWebp'])
            ? $params['compressionWebp']
            : '';

        // 1) local
        if ($local) {
            $segments[] = 'local';
        }

        // 2) original
        if ($original) {
            $segments[] = 'original';
        }

        // 3) width and height
        $widthHeight = '';
        if ($w) {
            $widthHeight = $w;
        }
        if ($w || $h) {
            $widthHeight .= 'x';
        }
        if ($h) {
            $widthHeight .= $h;
        }
        if ($w || $h) {
            $segments[] = $widthHeight;
        }

        // 4) fit and position
        $fitPosition = '';
        if ($fit) {
            $fitPosition = $fit;
        }
        if ($position) {
            $fitPosition .= '_' . $position;
        }
        if ($fit || $position) {
            $segments[] = $fitPosition;
        }

        // 5) greyscale
        if ($greyscale) {
            $segments[] = 'bw';
        }

        // 6) colorize
        if ($colorize) {
            $segments[] = 'col_' . str_replace(',', '_', $colorize);
        }

        // 7) compression
        if ($compression || $compressionWebp) {
            $suffixCompression = '@';
            if ($compression) {
                $suffixCompression .= $compression;
            }
            if ($compressionWebp) {
                $suffixCompression .= '_' . $compressionWebp;
            }
            $segments[] = $suffixCompression;
        }

        return $segments;
    }

    /**
     * Transform URL segments as filepath
     *
     * @param array $params Image parameters/options
     * @return string
     */
    private static function getUrlSegmentsAsPath(array $params = [])
    {
        $segments = self::getParamsAsUrlSegments($params);
        $path = implode('/', $segments);
        return count($segments) ? $path . '/' : '';
    }

    /**
     * Transform URL segments as filename suffix
     *
     * We have opted for cache key as subfolder path instead of filename suffix
     *
     * @deprecated
     * @param array $params Image parameters/options
     * @return string
     */
    private static function getUrlSegmentsAsSuffix(array $params = [])
    {
        $segments = self::getParamsAsUrlSegments($params);
        $suffix = implode('-', $segments);
        return $suffix;
    }

    /**
     * Get cache key for given image `src` and given parameters/options
     *
     * @return string
     */
    private function getCacheKey()
    {
        if (self::shouldUsePrettyUrls()) {
            return self::getUrlSegmentsAsPath($this->params) . $this->path;
            // this is a different way to transform the images URLs
            // return $this->path . self::getUrlSegmentsAsSuffix($this->params);
        }

        return md5($this->src . self::getQueryParamsString($this->params));
    }

    /**
     * Get original image file path
     *
     * If the filepath starts with same route prefix do not prepend it, so
     * we avoid doubled path segments like `/media/media/my-image.jpg`.
     *
     * When the filepath is from a local image it will be simply a dot,
     * we remove that as it would construct a wrong URL like
     * `/media/100x100/./my-image.jpg`
     *
     * @param string $src Image original relative src path
     * @param string $filename The processed image filename without extension
     * @return string
     */
    private static function getFilepath($src, $filename)
    {
        $routePrefix = self::getRoutePrefix();
        $filepath = pathinfo($src, PATHINFO_DIRNAME);

        if (Str::startsWith($filepath, $routePrefix . '/')) {
            $filepath = str_replace($routePrefix . '/', '', $filepath);
        }

        if (!$filepath || $filepath === '.') {
            return $filename;
        }

        return $filepath . '/' . $filename;
    }

    /**
     * Get a original image file name without extension
     *
     * It removes timestamp and ensure valid URLs and SEO friendly casing
     * convention (just hyphens, no underscores)
     *
     * Timestamps are assumed to be in this format in the full src:
     * `/my/folder/filename_12313123123.jpeg`
     * Note that here we work with the regex already on a subset of the string
     * with `PATHINFO_FILENAME` which corresponds to `filename_12313123123`
     *
     * @see https://www.natalleblas.com/optimise-images-for-seo/
     *
     * @param string $src Image original relative src path
     * @return string
     */
    private static function getFilename($src)
    {
        $filename = pathinfo($src, PATHINFO_FILENAME);
        return Str::slug(
            preg_replace('/(.+)(\_[0-9]+)\.*$/i', '$1', $filename)
        );
    }

    /**
     * Get image public URL relative path
     *
     * @param string $ext
     * @return string
     */
    public function constructPublicUrl(string $ext = ''): string
    {
        $baseUrl = config('env.APP_URL');
        $routePrefix = self::getRoutePrefix();

        if (self::shouldUsePrettyUrls()) {
            return rtrim($baseUrl, '/') .
                '/' .
                $routePrefix .
                '/' .
                $this->cacheKey .
                '.' .
                $ext;
        }

        return '/' .
            $routePrefix .
            '/cache/' .
            $this->cacheKey .
            '/' .
            $this->name .
            '.' .
            $ext;
    }

    /**
     * Create image using `\Intervention\Image`, it does:
     *
     * 1) Applies image transformations
     * 2) Save the transformed image into cache with original encoding
     * 3) Save the transformed image into cache with webp encoding
     * 4) Get the transformed image width and height
     * 5) Create a small thumbnail placeholder encoded as base64
     * 6) Create the img metadata object and put into cache
     *
     * @return array Image metadata
     */
    public function createImage()
    {
        $cacheKey = $this->cacheKey;
        $params = $this->params;
        $ext = pathinfo($this->src, PATHINFO_EXTENSION);
        $meta = [];
        $isPlaceholder = false;

        if ($ext == 'svg') {
            exit('svg images are not yet supported.');
            // $xml = simplexml_load_file($this->source);
            // $xmlAttributes = $xml->attributes();
            // $width = $xmlAttributes['width'] ?? 0;
            // $height = $xmlAttributes['height'] ?? 0;
            // $thumb = '';
            // Cache::tags([CacherTags::img])->put($cacheKey.'.'.$ext, (string) $xml->asXML());
        }

        // create image
        try {
            $image = Image::make($this->source);
        } catch (NotReadableException $e) {
            $isPlaceholder = true;
            $image = self::getPlaceholder();
        }

        // placeholders do not need to transform
        if ($isPlaceholder) {
            $width = $params['w'] ? $params['w'] : 512;
            $height = $params['h'] ? $params['h'] : 512;
        } else {
            // apply transformations
            self::doTransform($image, $params);
            // store transformed image's width and height
            $width = $image->width();
            $height = $image->height();
        }

        // gifs don't animate anymore once passed through Intervention, so we
        // just use it to extract the width and height information, we also do
        // not convert them to webp as we would not use them anyhow (they would
        // not animate in .webp as well)
        if ($ext === 'gif' || $params['original']) {
            if ($params['local']) {
                $url = self::getOriginalLocalUrl($this->src);
            } else {
                $url = self::getOriginalUrl($this->src);
            }

            // here can come in only png/jpegs:
        } else {
            $url = $this->constructPublicUrl($ext);

            // cache the encoded image to serve with /_/img/cache/{key} route
            // where the key contains the image extension, just for nicety
            if (!$isPlaceholder) {
                Cache::tags([CacherTags::img])->put(
                    $cacheKey . '-' . $ext,
                    $image->encode($ext, $params['compression'])->encoded
                );

                // backup transformed full size image with original encoding
                $image->backup();

                // limit color `null` convert to truecolor, this avoid
                // breaking with gif images or png with palette colors,
                // @see http://image.intervention.io/api/limitColors
                Cache::tags([CacherTags::img])->put(
                    $cacheKey . '-webp',
                    $image
                        ->limitColors(null)
                        ->encode('webp', $params['compressionWebp'])->encoded
                );

                $urlWebp = $this->constructPublicUrl('webp');

                // return to original encoding
                $image->reset();
            }

            // create base 64 thumbnail
            $thumb = $image
                ->resize(max([30, round($params['w'] / 20)]), null, function (
                    $constraint
                ) {
                    $constraint->aspectRatio();
                })
                // ->blur(5)
                ->encode('data-url')->encoded;
        }

        $meta = [
            'name' => $this->name,
            'local' => $params['local'],
            'source' => $this->source,
            'src' => $this->src,
            'url' => $url,
            'urlWebp' => $urlWebp ?? '',
            'thumb' => $thumb ?? '',
            'width' => $width,
            'height' => $height,
            'ratio' => ($height * 100) / $width,
        ];

        if (!$isPlaceholder) {
            // cache the image metadata
            Cache::tags([CacherTags::img])->put($cacheKey . '.meta', $meta);
        }

        return $meta;
    }

    /**
     * Do image transformation, following [imgix](https://www.imgix.com/)
     * behaviour
     *
     * @param \Intervention\Image $image
     * @param array $params Image parameters/options
     * @return void
     */
    public static function doTransform($image, array $params = [])
    {
        // params/options
        $width = $params['w'];
        $height = $params['h'];
        $fit = $params['fit'];
        $position = $params['position']; // FIXME: use it!
        $greyscale = $params['greyscale'];
        $colorize = $params['colorize'];

        if ($greyscale) {
            $image->greyscale();
        }
        if ($colorize) {
            $colorizeValues = explode(',', $colorize);
            $r = isset($colorizeValues[0]) ? (int) $colorizeValues[0] : 0;
            $g = isset($colorizeValues[1]) ? (int) $colorizeValues[1] : 0;
            $b = isset($colorizeValues[2]) ? (int) $colorizeValues[2] : 0;
            $image->colorize($r, $g, $b);
        }

        // $originalWidth = $image->width();
        // $originalHeight = $image->height();

        if ($width && $height) {
            if ($fit === 'clip') {
                $image->resize($width, $height, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
            } elseif ($fit === 'clamp') {
                $image->fit($width, $height);
            } elseif ($fit === 'crop') {
                // if ($position) {
                //     $image->fit($width, $height, function ($constraint) {}, $position);
                // }
                $image->crop($width, $height);
            } else {
                $image->resize($width, $height, function ($constraint) {
                    // if ($ratio) $constraint->aspectRatio();
                    // if ($upsize) $constraint->upsize();
                });
            }
        } elseif ($width) {
            $image->widen($width);
        } elseif ($height) {
            $image->heighten($height);
        }
    }

    /**
     * Get try url to play wit the image resizer during development
     *
     * @devtool
     * @param array $meta Img metadata
     * @return string
     */
    public static function getTryUrl($meta)
    {
        $url = self::ROUTE_TRY_PATH . ltrim($meta['src'], '/') . '/';
        $url .= self::getQueryParamsString(self::getParamsWithDefaults($meta));
        return $url;
    }

    /**
     * Get missing image placeholder
     *
     * It looks by default in assets/images and provide a fallback image internal
     * to this library if the custom one is not found.
     *
     * @return \Intervention\Image\Facades\Image
     */
    public static function getPlaceholder()
    {
        $image = Image::canvas(512, 512, '#fafafa');

        try {
            $placeholder = Image::make(
                public_path('assets/images/placeholder.png')
            );
        } catch (NotReadableException $e) {
            $placeholder = Image::make(dirname(__FILE__) . '/placeholder.png');
        }

        $image->insert($placeholder, 'center');

        return $image->encode();
    }
}
