<?php

namespace LaravelFrontend\Cms;

use LaravelFrontend\Cms\CmsApi;
use LaravelFrontend\Cms\CmsCart;
use Illuminate\Support\Facades\Http;

class CmsOrder
{
  /**
   * List all orders
   *
   * @return \Illuminate\Http\Client\Response
   */
  public static function list()
  {
    return CmsApi::getWithAuth('{locale}/order');
  }

  /**
   * Get specific order detail by ID
   *
   * @return \Illuminate\Http\Client\Response
   */
  public static function get($id)
  {
    return CmsApi::getWithAuth('{locale}/order/' . $id);
  }

  /**
   * Get specific order detail by CODE
   *
   * @return \Illuminate\Http\Client\Response
   */
  public static function getByCode($code)
  {
    return CmsApi::getWithAuth('{locale}/orderbycode/' . $code);
  }

  /**
   * Place order
   *
   * Everyhting when calling this is already setup in the shoppingcart
   *
   * @return \Illuminate\Http\Client\Response
   */
  public static function place()
  {
    $response = CmsApi::postWithAuth('{locale}/order');

    return $response;
  }

  /**
   * Client Token
   *
   * Everyhting when calling this is already setup in the shoppingcart
   *
   * @return \Illuminate\Http\Client\Response
   */
  public static function clientToken()
  {
    $response = CmsApi::postWithAuth(
      '{locale}/payment/credit-card/client-token'
    );

    return $response;
  }

  /**
   * Client Token
   *
   * Everyhting when calling this is already setup in the shoppingcart
   *
   * @return \Illuminate\Http\Client\Response
   */
  public static function creditCard($data)
  {
    $response = CmsApi::postWithAuth(
      '{locale}/payment/credit-card/checkout',
      $data
    );

    return $response;
  }

  /**
   * Completed order
   *
   * The order has been completed, data is sending to close the orede
   *
   * @return \Illuminate\Http\Client\Response
   */
  public static function completed($order, $token = null)
  {
    $data = [
      'orderid' => $order,
      'token' => $token,
    ];

    $response = CmsApi::postWithAuth('{locale}/order/completed', $data);

    return $response;

    if ($response->successful()) {
      CmsCart::clearSession();
    }

    return $response;
  }
}
