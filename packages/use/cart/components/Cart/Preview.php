<?php

namespace resources\components;

use Illuminate\View\Component;
use LaravelFrontend\Cms\CmsCart;

class CartPreview extends Component
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
    $cart = CmsCart::get()->json();

    return view('components.CartPreview', ['cart' => $cart]);
  }
}
