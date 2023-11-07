@props([
    'form' => AuthApi::getForm('password-change'),
    'id' => 'password-change',
    'ajax' => false,
    'timezone' => true,
    'redirect' => '',
])
<form
  data-auth="password-change"
  data-ajax-submit="{{ $ajax }}"
  {{ $attributes->merge(['class' => 'authForm authFormPasswordChange']) }}
  action="{{ $form['action'] }}"
  method="post"
>
  {{ $pre ?? '' }}
  @csrf
  @if ($timezone)
    <x-auth-timezone />
  @endif
  <x-auth-redirect url="{{ $redirect }}" />
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
