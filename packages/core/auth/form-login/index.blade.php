@props([
    'form' => AuthApi::getForm('login'),
    'id' => 'login',
    'ajax' => false,
    'timezone' => true,
    'redirect' => null,
    'defaultRedirect' => AuthApi::getAfterLoginRedirect(),
])
<form
  data-auth="login"
  data-ajax-submit="{{ $ajax }}"
  {{ $attributes->merge(['class' => 'authForm authFormLogin']) }}
  action="{{ $form['action'] }}"
  method="post"
>
  {{ $pre ?? '' }}
  @csrf
  @if ($timezone)
    <x-auth-timezone />
  @endif
  <x-auth-redirect url="{{ $redirect ?? ($defaultRedirect ?? '') }}" />
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
