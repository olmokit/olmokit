@props([
    'ajax' => false,
])
<form
  {{ $attributes->merge(['class' => 'checkoutForm checkoutFormCreditcard']) }}
  action="{{ \LaravelFrontend\Cms\CmsCheckout::getLocalActionUrl('credit-card') }}"
  method="post"
  data-checkout="credit-card"
  data-ajax-submit="{{ $ajax }}"
>
  @csrf
  {{ $slot ?? '' }}
</form>
