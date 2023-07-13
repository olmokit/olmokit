@props([
    'ajax' => false,
])
<form
  {{ $attributes->merge(['class' => 'checkoutForm checkoutFormPayment']) }}
  action="{{ \LaravelFrontend\Cms\CmsCheckout::getLocalActionUrl('payment') }}"
  method="post"
  data-checkout="payment"
  data-ajax-submit="{{ $ajax }}"
>
  @csrf
  {{ $slot ?? '' }}
</form>
