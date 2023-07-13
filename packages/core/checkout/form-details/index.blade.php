@props([
    'ajax' => false,
])
<form
  {{ $attributes->merge(['class' => 'checkoutForm checkoutFormDetails']) }}
  action="{{ \LaravelFrontend\Cms\CmsCheckout::getLocalActionUrl('details') }}"
  method="post"
  data-checkout="details"
  data-ajax-submit="{{ $ajax }}"
>
  @csrf
  {{ $slot ?? '' }}
</form>
