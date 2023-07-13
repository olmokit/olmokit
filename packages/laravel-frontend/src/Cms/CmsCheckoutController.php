<?php

namespace LaravelFrontend\Cms;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use LaravelFrontend\Cms\CmsCart;
use LaravelFrontend\Cms\CmsCheckout;
use LaravelFrontend\Cms\CmsOrder;
use LaravelFrontend\Helpers\Helpers;
use LaravelFrontend\Helpers\EndpointController;

class CmsCheckoutController extends EndpointController
{
  protected $namespace = 'checkout';

  /**
   * Field names to don't retain across sessions
   *
   * @override
   * @var array
   */
  protected $temporaryFields = [];

  private function getDetailsValidator(Request $request)
  {
    $rules = [
      'shippingmethod' => 'required',
    ];
    $selectedShippingMethodCode = $request->input('shippingmethod');

    $cartResponse = CmsCart::get();

    if ($cartResponse->successful()) {
      $cart = $cartResponse->json();

      foreach ($cart['shippingmethods'] as $method) {
        if ($method['code'] === $selectedShippingMethodCode) {
          if ($method['requiredShippingAddress'] == 'true') {
            $rules['addresses_shipping'] = 'required';
          }
          if ($method['requiredBillingAddress'] == 'true') {
            $rules['addresses_billing'] = 'required';
          }
        }
      }
    }

    return Validator::make($request->all(), $rules);
  }

  /**
   * POST endpoint for the checkout `details` step
   */
  public function details(Request $request, $ajax = false)
  {
    $redirect = $this->getRedirect(
      $request,
      true,
      CmsCheckout::getRoute('payment')
    );
    $code = 200;
    $data = [];
    $raw = '';
    $action = 'details';
    $status = 'ok';

    $validator = $this->getDetailsValidator($request);

    if ($validator->fails()) {
      $status = 'shippingmethod.required';
      // if (!empty($validator->errors()->get('shippingmethod'))) {
      // }
      if (!empty($validator->errors()->get('addresses_shipping'))) {
        $status = 'addresses.shipping.required';
      } elseif (!empty($validator->errors()->get('addresses_billing'))) {
        $status = 'addresses.billing.required';
      }

      $code = 400;
      $redirect = $this->getRedirect($request, false);
    } else {
      $responseShipping = CmsCart::setShippingMethod(
        $request->input('shippingmethod')
      );
      $responseAddresses = CmsCart::setAddresses(
        $request->input('addresses_billing'),
        $request->input('addresses_shipping')
      );
      // just use the last call results, it is fine

      if ($responseShipping->failed()) {
        $redirect = $this->getRedirect($request, false);
        $code = $responseShipping->status();
        $raw = $responseShipping->body();
        $status = 'shippingmethod.fail';
      } elseif ($responseAddresses->failed()) {
        $redirect = $this->getRedirect($request, false);
        $code = $responseAddresses->status();
        $raw = $responseAddresses->body();
        $status = 'addresses.fail';
      }
    }

    return $this->res(
      $request,
      $redirect,
      $code,
      $data,
      $raw,
      $action,
      $status,
      $ajax
    );
  }

  /**
   * POST endpoint for the checkout `payment` step
   */
  public function payment(Request $request, $ajax = false)
  {
    $redirect = $this->getRedirect(
      $request,
      true,
      CmsCheckout::getRoute('summary')
    );
    $code = 200;
    $data = [];
    $raw = '';
    $action = 'payment';
    $status = 'ok';

    $validator = Validator::make($request->all(), [
      'paymentmethod' => 'required',
    ]);

    if ($validator->fails()) {
      $code = 400;
      $status = 'required';
      $redirect = $this->getRedirect($request, false);
    } else {
      // return redirect($redirect)->withErrors($validator)->withInput();;

      /**
       * This is a change
       * It gives all the form values to the method
       */
      $response = CmsCart::setPaymentMethod(
        $request->all()
        // $request->input('paymentmethod'),
      );

      $data = $response->json();
      $code = $response->status();

      if ($response->failed()) {
        $raw = $response->body();
        $redirect = $this->getRedirect($request, false);
        $status = 'fail';
      }
    }

    return $this->res(
      $request,
      $redirect,
      $code,
      $data,
      $raw,
      $action,
      $status,
      $ajax
    );
  }

  /**
   * POST endpoint for the checkout `summary` step
   */
  public function summary(Request $request, $ajax = false)
  {
    $code = 200;
    $data = [];
    $raw = '';
    $action = 'summary';
    $status = 'ok';

    $response = CmsOrder::place();
    $data = $response->json();
    $code = $response->status();

    $redirectRoute =
      $data['paymentmethod'] == 'creditcard'
        ? CmsCheckout::getRoute('credit-card')
        : CmsCheckout::getRoute('completed');
    $redirect = $this->getRedirect($request, true, $redirectRoute);

    if ($response->failed()) {
      $redirect = $this->getRedirect($request, false);
      $status = 'fail';
      $raw = $response->body();
    }

    return $this->res(
      $request,
      $redirect,
      $code,
      $data,
      $raw,
      $action,
      $status,
      $ajax
    );
  }

  /**
   * POST endpoint for the checkout `creditcard` step
   */
  public function creditcard(Request $request, $ajax = false)
  {
    $code = 200;
    $data = $request->all();
    $raw = '';
    $action = 'creditcard';
    $status = 'ok';

    $response = CmsOrder::creditCard($data);
    $data = $response->json();
    $code = $response->status();

    $redirect = $this->getRedirect(
      $request,
      true,
      CmsCheckout::getRoute('completed')
    );

    if ($response->failed()) {
      $redirect = $this->getRedirect($request, false);
      $status = 'fail';
      $raw = $response->body();
    }

    return $this->res(
      $request,
      $redirect,
      $code,
      $data,
      $raw,
      $action,
      $status,
      $ajax
    );
  }

  /**
   * POST endpoint for the checkout `completed` step
   */
  public function completed(Request $request, $ajax = false)
  {
    $redirect = $this->getRedirect(
      $request,
      true,
      CmsCheckout::getRoute('completed')
    );
    $code = 200;
    $data = [];
    $raw = '';
    $action = 'completed';
    $status = 'ok';
    $order = $request->all();

    $response = CmsOrder::completed($order);
    $data = $response->json();
    $code = $response->status();

    if ($response->failed()) {
      $redirect = $this->getRedirect($request, false);
      $status = 'fail';
      $raw = $response->body();
    }

    return $this->res(
      $request,
      $redirect,
      $code,
      $data,
      $raw,
      $action,
      $status,
      $ajax
    );
  }
}
