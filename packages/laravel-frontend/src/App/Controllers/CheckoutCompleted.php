<?php

namespace LaravelFrontend\App\Controllers;

use LaravelFrontend\App\Controllers\CheckoutBase;
use LaravelFrontend\Cms\CmsOrderController;
use LaravelFrontend\Cms\CmsOrder;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\App;

class CheckoutCompleted extends CheckoutBase
{
  /**
   * Add order data
   *
   * @return array
   */
  protected function _addVars(): array
  {
    $url = URL::full();
    $parse = parse_url($url);
    $token = null;
    $ordercompleted = null;
    $order = null;
    $items = null;
    $lang = App::getLocale();

    if (isset($parse['query'])) {
      parse_str($parse['query'], $output);
    }

    if (isset($output['order'])) {
      $code = $output['order'];
      $order = CmsOrderController::getByCode($code);
      $items = [];
      if (isset($order['orderitems'])) {
        $items = json_decode($order['orderitems'], true);
      }

      if ($order['paymentmethod'] == 'paypal') {
        if (isset($output['token'])) {
          $token = $output['token'];
          $ordercompleted = CmsOrder::completed($code, $token);
        }
      } elseif ($order['paymentmethod'] == 'creditcard') {
        if (isset($output['token'])) {
          $token = $output['token'];
          $ordercompleted = CmsOrder::completed($code, $token);
        }
      } elseif ($order['paymentmethod'] == 'email') {
        if (isset($output['order'])) {
          $ordercompleted = CmsOrder::completed($code);
        }
      } elseif ($order['paymentmethod'] == 'banktransfer') {
        if (isset($output['order'])) {
          $ordercompleted = CmsOrder::completed($code);
        }
      }

      if (isset($output['payerid'])) {
        $payerid = $output['payerid'];
      }
    }

    return compact('order', 'items', 'token', 'ordercompleted');
  }
}
