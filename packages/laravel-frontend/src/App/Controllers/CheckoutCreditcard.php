<?php

namespace LaravelFrontend\App\Controllers;

use LaravelFrontend\App\Controllers\CheckoutBase;
use LaravelFrontend\Cms\CmsOrder;

class CheckoutCreditcard extends CheckoutBase
{
  /**
   * Add order data
   *
   * @return array
   */
  protected function _addVars(): array
  {
    $ordercodes = CmsOrder::clientToken();
    $ordercodes = $ordercodes->json();

    return compact('ordercodes');
  }
}
