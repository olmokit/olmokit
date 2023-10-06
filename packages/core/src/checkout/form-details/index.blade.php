@props([
    'ajax' => false,
])
<form
  data-checkout="details"
  data-ajax-submit="{{ $ajax }}"
  {{ $attributes->merge(['class' => 'checkoutForm checkoutFormDetails']) }}
  action="{{ \LaravelFrontend\Cms\CmsCheckout::getLocalActionUrl('details') }}"
  method="post"
>
  @csrf
  {{ $slot ?? '' }}
</form>
