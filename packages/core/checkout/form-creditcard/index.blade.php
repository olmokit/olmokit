@props([
    'ajax' => false,
])
<form
  data-checkout="credit-card"
  data-ajax-submit="{{ $ajax }}"
  {{ $attributes->merge(['class' => 'checkoutForm checkoutFormCreditcard']) }}
  action="{{ \LaravelFrontend\Cms\CmsCheckout::getLocalActionUrl('credit-card') }}"
  method="post"
>
  @csrf
  {{ $slot ?? '' }}
</form>
