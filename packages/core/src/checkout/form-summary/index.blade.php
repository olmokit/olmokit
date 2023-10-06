@props([
    'ajax' => false,
])
<form
  data-checkout="summary"
  data-ajax-submit="{{ $ajax }}"
  {{ $attributes->merge(['class' => 'checkoutForm checkoutFormSummary']) }}
  action="{{ \LaravelFrontend\Cms\CmsCheckout::getLocalActionUrl('summary') }}"
  method="post"
>
  @csrf
  {{ $slot ?? '' }}
</form>
