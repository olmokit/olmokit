{{-- Route: checkoutsummary --}}

@extends('layouts.main')

@section('bodyAbove')
  <x-Header />
@endsection

@section('body')
  <x-checkout-form-summary>
    <main class="route-checkoutsummary:">
      <x-CheckoutSteps :steps="$steps" />
      <x-helpers-sessionstatus namespace="checkout" />
      <div class="container-xl">
        <div class="page:">
          <div class="page:title">
            Summary
          </div>
          <section class="section: details:">
            <div class="details:card">
              <p class="section:title">
                {{ $trans['checkoutsummary.typeshipment'] }}
              </p>
              <p class="section:strong">
                {{ $selectedShippingMethod['name'] }}
              </p>
              <p class="section:muted">
                {{ $selectedShippingMethod['description'] }}
              </p>
            </div>
            @if ($selectedShippingAddress)
              <div class="details:card">
                <p class="section:title">{{ $trans['checkoutsummary.shipment'] }}</p>
                <x-AddressDetails
                  type="shipping"
                  :address="$selectedShippingAddress"
                />
              </div>
            @endif
            @if ($selectedBillingAddress)
              <div class="details:card">
                <p class="section:title">{{ $trans['checkoutsummary.billing'] }}</p>
                <x-AddressDetails
                  type="billing"
                  :address="$selectedBillingAddress"
                />
              </div>
            @endif
          </section>
          <section class="section: payment:">
            <p class="section:title">{{ $trans['checkoutsummary.payment'] }}</p>
            <p class="section:strong">
              {{ $selectedPaymentMethod['name'] }}
            </p>
            <p class="section:muted">
              {{ $selectedPaymentMethod['description'] }}
            </p>
          </section>
          <section class="section: items:">
            @foreach ($cart['items'] as $product)
              <x-ProductCard
                layout="list"
                :data="$product"
                :link="true"
                :wishlist="false"
                :cart-remove="false"
                :readonly="true"
              />
            @endforeach
          </section>
          <section class="section: cost:">
            <div class="cost:line cost:line--subtotal">
              <div class="cost:key">Subtotale</div>
              <div class="cost:val">
                {{ $cart['subtotal'] }} {{ $cart['currency']['symbol'] }}
              </div>
            </div>
            @if ($cart['discount']['value'])
              <div class="cost:line cost:line--discount">
                <div class="cost:key">
                  @php $percentage = $cart['discount']['percentage']; @endphp
                  Discount {{ $percentage ? $percentage . '%' : '' }}
                </div>
                <div class="cost:val">
                  - {{ $cart['discount']['value'] }} {{ $cart['currency']['symbol'] }}
                </div>
              </div>
            @endif
            <div class="cost:line cost:line--shipping">
              <div class="cost:key">Spedizione</div>
              <div class="cost:val {{ $selectedShippingMethod['cost'] == 0 ? 'is-gratis' : '' }}">
                {{ $selectedShippingMethod['cost'] == 0 ? 'gratis' : $selectedShippingMethod['cost'] }}
              </div>
            </div>
            <div class="cost:total">
              <div class="cost:line cost:line--total">
                <div class="cost:key">Totale</div>
                <div class="cost:val">
                  {{ $cart['total'] }} {{ $cart['currency']['symbol'] }}
                </div>
              </div>
              <div class="cost:line  cost:line--total-vat">
                <div class="cost:key">Totale con IVA</div>
                <div class="cost:val">
                  {{ $cart['total_vat'] }} {{ $cart['currency']['symbol'] }}
                </div>
              </div>
            </div>
          </section>
          <div class="submit:">
            <x-btn
              text="Continue"
              size="big"
              style="outline"
              type="submit"
            />
          </div>
        </div>
      </div>
    </main>
  </x-checkout-form-summary>
  {{-- <x-data key="checkout" :value="$currentSelection" /> --}}
@endsection

@section('bodyBelow')
  <x-Footer />
@endsection
