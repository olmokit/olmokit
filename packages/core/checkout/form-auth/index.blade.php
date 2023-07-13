@props([
    'ajax' => false,
])
<form
  {{ $attributes->merge(['class' => 'checkoutForm checkoutFormAuth']) }}
  action="{{ \LaravelFrontend\Cms\CmsCheckout::getLocalActionUrl('auth') }}"
  method="post"
  data-checkout="auth"
  data-ajax-submit="{{ $ajax }}"
>
  @csrf
  {{ $slot ?? '' }}
</form>
