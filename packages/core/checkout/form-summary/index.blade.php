@props([
    'ajax' => false,
])
<form
  {{ $attributes->merge(['class' => 'checkoutForm checkoutFormSummary']) }}
  action="{{ \LaravelFrontend\Cms\CmsCheckout::getLocalActionUrl('summary') }}"
  method="post"
  data-checkout="summary"
  data-ajax-submit="{{ $ajax }}"
>
  @csrf
  {{ $slot ?? '' }}
</form>
