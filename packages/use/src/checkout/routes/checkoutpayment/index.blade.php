{{-- Route: checkoutpayment --}}

@extends('layouts.main')

@section('bodyAbove')
  <x-Header />
@endsection

@section('body')
  <x-checkout-form-payment>
    <main class="route-checkoutpayment:">
      <x-CheckoutSteps :steps="$steps" />
      <x-helpers-sessionstatus namespace="checkout" />
      <div class="container-xl">
        <div class="page:">
          <div class="page:title">
            Payment method
          </div>
          <section class="section:">
            <x-CheckoutPaymentMethods>
              @foreach ($paymentMethods as $paymentMethod)
                @if ($paymentMethod['code'] === 'paypal')
                  <x-CheckoutPaypal
                    :code="'paypal'"
                    :name="'PayPal'"
                    :description="'Lorem ipsum dolor sit amet consectetur adipisicing'"
                    :current-selection="$currentSelection"
                  />
                @else
                  <x-CheckoutPaymentMethod
                    :code="$paymentMethod['code']"
                    :name="$paymentMethod['name']"
                    :description="$paymentMethod['description']"
                    :current-selection="$currentSelection"
                  >
                  </x-CheckoutPaymentMethod>
                @endif
              @endforeach
            </x-CheckoutPaymentMethods>
          </section>
          <x-btn type="submit">
            Continue
          </x-btn>
        </div>
      </div>
    </main>
  </x-checkout-form-payment>
  {{-- <x-data key="checkout" :value="$currentSelection" /> --}}
@endsection

@section('bodyBelow')
  <x-Footer />
@endsection
