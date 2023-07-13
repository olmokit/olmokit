<?php

namespace LaravelFrontend\Cms;

use LaravelFrontend\Cms\CmsCart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CmsCartController
{
  /**
   * Get cart 'complete' or 'lean' response, 'lean' by default, as this endpoint
   * purpose is to provide data to javascript to decorate the current view
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function get(Request $request)
  {
    $fresh = (bool) $request->input('fresh');
    $response = $request->input('complete')
      ? CmsCart::get($fresh)
      : CmsCart::getLean($fresh);

    return response()->json($response->json(), $response->status());
  }

  /**
   * Add to cart
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function add(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'id' => 'required',
    ]);
    if ($validator->fails()) {
      return response()->json($validator->errors(), 400);
    }

    $id = $request->input('id');
    $type = $request->input('type') ?? 'product';
    $properties = array_filter(
      explode(',', $request->input('properties', '')),
      'strlen'
    );
    $quantity = $request->input('quantity');

    $response = CmsCart::add($id, $type, $properties, $quantity);

    return response()->json($response->json(), $response->status());
  }

  /**
   * Remove from cart
   *
   * `cartitemid` is required
   * `quantity` can be undefined or a number
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function remove(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'cartitemid' => 'required',
    ]);
    if ($validator->fails()) {
      return response()->json($validator->errors(), 400);
    }

    $cartitemid = $request->input('cartitemid');
    $quantity = $request->input('quantity');

    $response = CmsCart::remove($cartitemid, $quantity);

    return response()->json($response->json(), $response->status());
  }

  /**
   * Set quantity
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function setQuantity(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'cartitemid' => 'required',
      'quantity' => 'required|min:1',
    ]);
    if ($validator->fails()) {
      return response()->json($validator->errors(), 400);
    }

    $cartitemid = $request->input('cartitemid');
    $quantity = $request->input('quantity');
    $properties = $request->input('properties');

    $response = CmsCart::setQuantity($cartitemid, $quantity, $properties);

    return response()->json($response->json(), $response->status());
  }

  /**
   * Set addresses
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function setAddresses(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'billingId' => 'required',
      'shippingId' => 'required',
    ]);
    if ($validator->fails()) {
      return response()->json($validator->errors(), 400);
    }

    $billingId = $request->input('billingId');
    $shippingId = $request->input('shippingId');

    $response = CmsCart::setAddresses($billingId, $shippingId);

    return response()->json($response->json(), $response->status());
  }

  /**
   * Apply discount
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function applyDiscount(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'code' => 'required',
    ]);

    if ($validator->fails()) {
      return response()->json($validator->errors(), 400);
    }

    $code = $request->input('code');

    $response = CmsCart::applyDiscount($code);

    return response()->json($response->json(), $response->status());
  }

  /**
   * Remove discount
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function removeDiscount(Request $request)
  {
    $response = CmsCart::removeDiscount();

    return response()->json($response->json(), $response->status());
  }

  /**
   * Set shipping method
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function setShippingMethod(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'code' => 'required',
    ]);
    if ($validator->fails()) {
      return response()->json($validator->errors(), 400);
    }

    $code = $request->input('code');

    $response = CmsCart::setShippingMethod($code);

    return response()->json($response->json(), $response->status());
  }

  /**
   * Set shipping method
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function removeShippingMethod(Request $request)
  {
    $response = CmsCart::removeShippingMethod();

    return response()->json($response->json(), $response->status());
  }

  /**
   * Set payment method
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function setPaymentMethod(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'code' => 'required',
    ]);
    if ($validator->fails()) {
      return response()->json($validator->errors(), 400);
    }

    $code = $request->input('code');

    $response = CmsCart::setPaymentMethod($code);

    return response()->json($response->json(), $response->status());
  }
}
