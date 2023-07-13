<?php

namespace LaravelFrontend\Cms;

use LaravelFrontend\Cms\CmsOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CmsOrderController
{
  /**
   * List all orders
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function list(Request $request)
  {
    $response = CmsOrder::list();

    return response()->json($response->json(), $response->status());
  }

  /**
   * Get specific order detail by ID
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function get($id)
  {
    $response = CmsOrder::get($id);

    return response()->json($response->json(), $response->status());
  }

  /**
   * Get specific order detail by ID
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public static function getByCode($id)
  {
    $response = CmsOrder::getByCode($id);

    return $response->json();

    // return response()->json($response->json(), $response->status());
  }

  /**
   * Place order
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function place(Request $request)
  {
    $response = CmsOrder::place();

    return response()->json($response->json(), $response->status());
  }
}
