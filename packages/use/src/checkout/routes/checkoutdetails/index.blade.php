{{-- Route: checkoutdetails --}}

@extends('layouts.main')

@section('bodyAbove')
  <x-Header />
@endsection

@section('body')
  <x-checkout-form-details>
    <main class="route-checkoutdetails:">
      <x-CheckoutSteps :steps="$steps" />
      <x-helpers-sessionstatus namespace="checkout" />
      <div class="container-xl">
        <section class="page: page:shipping">
          <div class="page:title">
            Shipping method
          </div>
          <div class="page:body">
            @foreach ($shippingMethods as $shippingMethod)
              <div class="method: radio">
                @if ($shippingMethod['code'] === 'standardcourier')
                  {{-- reuse the x-forms-radio styling wrapping everything in a label --}}
                  <label class="method:head formToggle">
                    <input
                      class="formControl"
                      name="shippingmethod"
                      type="radio"
                      value="{{ $shippingMethod['code'] }}"
                      @if ($currentSelection['shippingmethod'] == $shippingMethod['code']) checked @endif
                    >
                    <span class="label">
                      <dfn class="dfn"></dfn>
                    </span>
                    <div class="method:head__text">
                      <strong class="method:head__name">{{ $shippingMethod['name'] }}</strong>
                      <span class="method:head__desc">{{ $shippingMethod['description'] }}</span>
                    </div>
                  </label>
                  <div class="method:body">
                    <div class="method:body__data">
                      @foreach ($addresses['shipping'] as $address)
                        <x-AddressDetails
                          type="shipping"
                          :address="$address"
                          :can-select="true"
                          :is-selected="$currentSelection['addresses_shipping'] == $address['id']"
                        />
                      @endforeach
                    </div>
                    <div class="method:body__actions">
                      <a
                        class="method:body__actionsBtn"
                        data-dialog-address-add
                        data-address-add="shipping"
                        href="?dialog-address-add"
                      >
                        + Add shipping address
                      </a>
                    </div>
                  </div>
                @endif
                @if ($shippingMethod['code'] === 'retire')
                  {{-- reuse the x-forms-radio styling wrapping everything in a label --}}
                  <label class="method:head formToggle">
                    <input
                      class="formControl"
                      name="shippingmethod"
                      type="radio"
                      value="{{ $shippingMethod['code'] }}"
                      @if ($currentSelection['shippingmethod'] == $shippingMethod['code']) checked @endif
                    >
                    <span class="label">
                      <dfn class="dfn"></dfn>
                    </span>
                    <div class="method:head__text">
                      <strong class="method:head__name">{{ $shippingMethod['name'] }}</strong>
                      <span class="method:head__desc">{{ $shippingMethod['description'] }}</span>
                    </div>
                  </label>
                  <div class="method:body">
                    <div class="method:body__data">
                      <div class="method:staticaddress">
                        Some address
                      </div>
                    </div>
                  </div>
                @endif
              </div>
            @endforeach
          </div>
        </section>
        <section class="page: page:billing">
          <div class="page:title">
            Billing
          </div>
          <div class="page:body">
            <div class="method:body">
              <div class="method:body__data">
                @foreach ($addresses['billing'] as $address)
                  <x-AddressDetails
                    type="billing"
                    :address="$address"
                    :can-select="true"
                    :is-selected="$currentSelection['addresses_billing'] == $address['id']"
                  />
                @endforeach
              </div>
              <div class="method:body__actions">
                <a
                  class="method:body__actionsBtn"
                  data-dialog-address-add
                  data-address-add="billing"
                  href="?dialog-address-add"
                >
                  + Add billing address
                </a>
              </div>
            </div>
          </div>
          <x-btn type="submit">Continue</x-btn>
        </section>
      </div>
    </main>
  </x-checkout-form-details>
  {{-- <x-data key="checkout" :value="$currentSelection" /> --}}
@endsection

@section('bodyBelow')
  <x-Footer />
  {{-- <x-DialogAddressAdd />
  <x-DialogAddressEdit /> --}}
@endsection
