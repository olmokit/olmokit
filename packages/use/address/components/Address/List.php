<?php

namespace resources\components;

use Illuminate\View\Component;
use LaravelFrontend\Cms\CmsAddress;

class AddressList extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\View\View|string
     */
    public function render()
    {
        $addresses = CmsAddress::list();

        return view('components.AddressList', ['addresses' => $addresses]);
    }
}
