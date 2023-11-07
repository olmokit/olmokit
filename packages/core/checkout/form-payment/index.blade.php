@props([
    'ajax' => false,
])
<form
  data-checkout="payment"
  data-ajax-submit="{{ $ajax }}"
  {{ $attributes->merge(['class' => 'checkoutForm checkoutFormPayment']) }}
  action="{{ \LaravelFrontend\Cms\CmsCheckout::getLocalActionUrl('payment') }}"
  method="post"
>
  @csrf
  {{ $slot ?? '' }}
</form>
