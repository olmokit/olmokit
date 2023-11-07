<?php

namespace resources\components;

use Illuminate\View\Component;
use LaravelFrontend\Cms\CmsWishlist;

class WishlistList extends Component
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
        $wishlist = [];
        $response = CmsWishlist::list();
        if ($response->successful()) {
            $wishlist = $response->json();
        }

        return view('components.WishlistList', ['wishlist' => $wishlist]);
    }
}
