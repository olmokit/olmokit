@props([
    'ajax' => false,
])
<form
  data-checkout="auth"
  data-ajax-submit="{{ $ajax }}"
  {{ $attributes->merge(['class' => 'checkoutForm checkoutFormAuth']) }}
  action="{{ \LaravelFrontend\Cms\CmsCheckout::getLocalActionUrl('auth') }}"
  method="post"
>
  @csrf
  {{ $slot ?? '' }}
</form>
