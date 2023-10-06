@props([
    'id' => 'logout',
    'ajax' => false,
    'timezone' => true,
    'logoutUrl' => AuthApi::logoutUrl(),
    'redirect' => null,
    'defaultRedirect' => request()->url(),
])
<form
  data-auth="logout"
  data-ajax-submit="{{ $ajax }}"
  {{ $attributes->merge(['class' => 'authForm authFormLogout']) }}
  action="{{ $logoutUrl }}"
  method="post"
>
  @csrf
  @if ($timezone)
    <x-auth-timezone />
  @endif
  <x-auth-redirect url="{{ $redirect ?? ($defaultRedirect ?? '') }}" />
  {{ $slot ?? '' }}
</form>
