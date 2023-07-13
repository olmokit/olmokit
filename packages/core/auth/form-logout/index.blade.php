@props([
    'id' => 'logout',
    'ajax' => false,
    'timezone' => true,
    'logoutUrl' => AuthApi::logoutUrl(),
    'redirect' => null,
    'defaultRedirect' => request()->url(),
])
<form
  {{ $attributes->merge(['class' => 'authForm authFormLogout']) }}
  action="{{ $logoutUrl }}"
  method="post"
  data-auth="logout"
  data-ajax-submit="{{ $ajax }}"
>
  @csrf
  @if ($timezone)
    <x-auth-timezone />
  @endif
  <x-auth-redirect url="{{ $redirect ?? ($defaultRedirect ?? '') }}" />
  {{ $slot ?? '' }}
</form>
