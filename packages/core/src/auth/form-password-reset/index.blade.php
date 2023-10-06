@props([
    'form' => AuthApi::getForm('password-reset'),
    'id' => 'password-reset',
    'ajax' => false,
    'timezone' => true,
    'redirect' => '',
])
<form
  data-auth="password-reset"
  data-ajax-submit="{{ $ajax }}"
  {{ $attributes->merge(['class' => 'authForm authFormPasswordReset']) }}
  action="{{ $form['action'] }}"
  method="post"
>
  {{ $pre ?? '' }}
  @csrf
  @if ($timezone)
    <x-auth-timezone />
  @endif
  <x-auth-redirect url="{{ $redirect }}" />
  <input
    name="token"
    type="hidden"
    value="{{ request()->query('token') }}"
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
