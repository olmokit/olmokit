@props([
    'form' => AuthApi::getForm('password-recovery'),
    'id' => 'password-recovery',
    'ajax' => false,
    'timezone' => true,
    'redirect' => '',
])
<form
  data-auth="password-recovery"
  data-ajax-submit="{{ $ajax }}"
  {{ $attributes->merge(['class' => 'authForm authFormPasswordRecovery']) }}
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
