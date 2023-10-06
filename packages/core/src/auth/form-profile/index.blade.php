@props([
    'form' => AuthApi::getForm('profile'),
    'id' => 'profile',
    'ajax' => false,
    'timezone' => true,
    'redirect' => '',
])
@php
  $userData = AuthApi::user() ?? [];
  $form = Olmoforms::prefill($form, $userData);
@endphp
<form
  data-auth="profile"
  data-ajax-submit="{{ $ajax }}"
  {{ $attributes->merge(['class' => 'authForm authFormProfile']) }}
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
