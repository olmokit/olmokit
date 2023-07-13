@props([
    'code' => '',
    'name' => '',
    'description' => '',
    'required' => true,
    'currentSelection' => [],
])

@php
  $_value = @$currentSelection['paymentmethod'] == $code; // old($input_name);
@endphp

<div
  class="CheckoutPaymentMethod: radio formRoot"
  data-checkout-paymentmethod-code="{{ $code }}"
>
  <div class="formToggle">
    <input
      class="CheckoutPaymentMethod:input"
      id="paymentmethod_{{ $code }}"
      type="radio"
      name="paymentmethod"
      value="{{ $code }}"
      data-checkout-paymentmethod-input
      @if ($required) required @endif
      @if ($_value == $code) checked @endif
    >
    <label
      class="label"
      for="paymentmethod_{{ $code }}"
    >
      <dfn class="dfn"></dfn>
      <div class="CheckoutPaymentMethod:head">
        <div class="CheckoutPaymentMethod:head__text">
          <div class="CheckoutPaymentMethod:head__textName">
            {!! $name !!}
          </div>
          <div class="CheckoutPaymentMethod:head__textDesc">
            {!! $description !!}
          </div>
        </div>
      </div>
    </label>
    @isset($slot)
      <div
        class="CheckoutPaymentMethod:body"
        data-checkout-paymentmethod-body
      >
        {{ $slot ?? '' }}
      </div>
    @endisset
  </div>
</div>
