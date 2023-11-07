<?php

namespace resources\components;

use Illuminate\View\Component;
use LaravelFrontend\Cms\CmsApi;

class Player extends Component
{
    public $componentName = 'player';

    public $video = [];

    public $fullwidth = true;

    public $fixed = false;

    public $width = 0;

    public $height = 0;

    public $alt = '';

    public $attrs = '';

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(
        string $src = '',
        string $poster = '',
        bool $local = false,
        bool $fullwidth = true,
        bool $fixed = false,
        int $width = 0,
        int $height = 0,
        string $alt = '',
        string $attrs = ''
    ) {
        $src = ltrim($src, '/');
        $poster = ltrim($poster, '/');

        if ($local) {
            $src = assets('media/' . $src);
            $poster = assets('images/' . $poster);
        } else {
            $src = CmsApi::getMediaUrl($src);
            $poster = $poster ? CmsApi::getMediaUrl($poster) : false;
        }

        $this->video = [
            'src' => $src,
            'poster' => $poster,
        ];

        $this->fullwidth = $fullwidth;
        $this->fixed = $fixed;
        $this->width = $width;
        $this->height = $height;
        $this->alt = $alt;
        $this->attrs = $attrs;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\View\View|string
     */
    public function render()
    {
        return view('components.player');
    }
}
