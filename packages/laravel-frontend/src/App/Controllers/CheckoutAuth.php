<?php

namespace LaravelFrontend\App\Controllers;

use LaravelFrontend\App\Controllers\CheckoutBase;
use LaravelFrontend\Cms\CmsCheckout;

class CheckoutAuth extends CheckoutBase
{
  /**
   * Instantiate a new controller instance.
   *
   * @return void
   */
  public function __construct()
  {
    $this->middleware('auth.activate');
  }

  /**
   * Add cart data
   *
   * @return array
   */
  protected function _addVars(): array
  {
    return [
      'steps' => $this->getSteps(),
      'checkoutUrls' => [
        'details' => CmsCheckout::getRoute('details'),
        'payment' => CmsCheckout::getRoute('payment'),
        'summary' => CmsCheckout::getRoute('summary'),
      ],
    ];
  }
}
