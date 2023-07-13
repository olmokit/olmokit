<?php

namespace LaravelFrontend\App\Controllers;

use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use LaravelFrontend\App\Controllers\Base;
use LaravelFrontend\Auth\AuthApi;
use LaravelFrontend\Cms\CmsAddress;
use LaravelFrontend\Cms\CmsCart;
use LaravelFrontend\Cms\CmsCheckout;
use LaravelFrontend\Helpers\Helpers;

class CheckoutBase extends Base
{
  protected $currentSelection;

  /**
   * Instantiate a new controller instance.
   *
   * @return void
   */
  public function __construct()
  {
    $this->middleware('checkout');
  }

  /**
   * Are current details valid?
   *
   * @param array $data
   * @return bool
   */
  protected function areDetailsValid(array $data = [])
  {
    if (!AuthApi::check()) {
      return false;
    }

    $method = $data['selectedShippingMethod'];
    $shipping = $data['selectedShippingAddress'];
    $billing = $data['selectedBillingAddress'];

    if (!empty($method['requiredShippingAddress']) && !$shipping) {
      return false;
    }

    if (!empty($method['requiredBillingAddress']) && !$billing) {
      return false;
    }

    return true;
  }

  /**
   * Get checkout steps data
   *
   * @return array
   */
  protected function getSteps(array $data = []): array
  {
    $currentRoute = Helpers::getCurrentRouteName();

    $doneDetails = $this->areDetailsValid($data);
    $donePayment = $doneDetails && $data['selectedPaymentMethod'];

    $routeDetails = CmsCheckout::getRoute('details', true);
    $routePayment = CmsCheckout::getRoute('payment', true);
    $routeSummary = CmsCheckout::getRoute('summary', true);

    $steps = [
      // [
      //     'name' => $routeAuth['name'],
      //     'url' => $routeAuth['url'],
      //     'done' => AuthApi::check(),
      // ],
      [
        'name' => $routeDetails['name'],
        'url' => $routeDetails['url'],
        'done' => $doneDetails,
      ],
      [
        'name' => $routePayment['name'],
        'url' => $routePayment['url'],
        'done' => $donePayment,
      ],
      [
        'name' => $routeSummary['name'],
        'url' => $routeSummary['url'],
        'done' => false,
      ],
    ];

    $_currentIdx = array_search($currentRoute, array_column($steps, 'name'));

    $i = 0;
    foreach ($steps as $step) {
      $name = str_contains($step['name'], '.')
        ? substr($step['name'], 3)
        : $step['name'];
      $steps[$i]['isCurrent'] = $name === $currentRoute;
      $steps[$i]['isFuture'] = $_currentIdx === false || $i > $_currentIdx;
      $steps[$i]['isPast'] = $_currentIdx !== false && $i < $_currentIdx;
      $i++;
    }

    return $steps;
  }

  /**
   * Add cart data
   *
   * @return array
   */
  protected function _addVars(): array
  {
    $cart = [];
    $shippingMethods = [];
    $paymentMethods = [];
    $addresses = CmsAddress::listByType();
    $selectedShippingMethod = false;
    $selectedShippingAddress = false;
    $selectedBillingAddress = false;
    $selectedPaymentMethod = false;
    $currentSelection = [];
    $steps = [];

    $response = CmsCart::get();

    if ($response->successful()) {
      $cart = $response->json();
      $shippingMethods = $cart['shippingmethods'] ?? [];
      $paymentMethods = $cart['paymentmethods'] ?? [];
      $billingId =
        $cart['addresses']['billing'] ?? CmsAddress::getDefaultBillingId();
      $shippingId =
        $cart['addresses']['shipping'] ?? CmsAddress::getDefaultShippingId();
      $selectedShippingMethod = $cart['selectedshippingmethod'];
      $selectedPaymentMethod = $cart['selectedpaymentmethod'];

      if (!is_null($shippingId)) {
        $selectedShippingAddress = CmsAddress::getById($shippingId);
      }
      if (!is_null($billingId)) {
        $selectedBillingAddress = CmsAddress::getById($billingId);
      }

      $currentSelection = array_merge(
        [
          'shippingmethod' => $selectedShippingMethod['code'] ?? '',
          'addresses_billing' => $billingId,
          'addresses_shipping' => $shippingId,
          'paymentmethod' => $selectedPaymentMethod['code'] ?? '',
        ],
        session()->get('_old_input') ?? []
      );

      $steps = $this->getSteps(
        compact(
          'selectedShippingMethod',
          'selectedShippingAddress',
          'selectedBillingAddress',
          'selectedPaymentMethod'
        )
      );
    }

    return compact(
      'cart',
      'shippingMethods',
      'paymentMethods',
      'selectedShippingMethod',
      'selectedPaymentMethod',
      'addresses',
      'selectedShippingAddress',
      'selectedBillingAddress',
      'currentSelection',
      'steps'
    );
  }
}
