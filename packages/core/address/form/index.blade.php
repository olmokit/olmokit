@props([
    'type' => 'shipping',
    'form' => null,
    'id' => 'shipping',
    'ajax' => false,
    'timezone' => true,
    'redirect' => null,
    // 'defaultRedirect' => AuthApi::getAfterLoginRedirect()
])
@php $form = $form ?? \LaravelFrontend\Cms\CmsAddress::getForm($type); @endphp
<form
  {{ $attributes->merge(['class' => 'addressForm addressForm' . ucfirst($form['type'])]) }}
  action="{{ $form['action'] }}"
  method="post"
  data-type="{{ $form['type'] }}"
  data-ajax-submit="{{ $ajax }}"
>
  @csrf
  {{-- <x-auth-redirect url="{{ $redirect ?? $defaultRedirect ?? '' }}" /> --}}
  <input
    type="hidden"
    name="_type"
    value="{{ $type }}"
  />
  @isset($form['fields'])
    <x-olmoforms-fields
      :form-id="$id"
      :fields="$form['fields']"
    />
  @endisset
  {{ $slot ?? '' }}
  {{ $success ?? '' }}
  {{ $error ?? '' }}
  <x-debug-forms-btn :form-id="$form['id']" />
</form>
