@props([])
<div class="AuthPasswordReset:">
  <x-auth-form-password-reset>
    <x-helpers-sessionstatus namespace="auth" />
    {{--
    <a href="{{ to('contacts') }}">
      Troubles logging in?
    </a>
    --}}
  </x-auth-form-password-reset>
</div>
