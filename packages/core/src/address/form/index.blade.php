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
  data-type="{{ $form['type'] }}"
  data-ajax-submit="{{ $ajax }}"
  {{ $attributes->merge(['class' => 'addressForm addressForm' . ucfirst($form['type'])]) }}
  action="{{ $form['action'] }}"
  method="post"
>
  @csrf
  {{-- <x-auth-redirect url="{{ $redirect ?? $defaultRedirect ?? '' }}" /> --}}
  <input
    name="_type"
    type="hidden"
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
