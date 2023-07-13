@props([
    'redirect' => '',
])

<div
  class="AuthLogin:"
  :redirect="$redirect"
>
  <x-auth-form-login>
    <x-helpers-sessionstatus
      namespace="auth"
      type="register"
    />
    <x-helpers-sessionstatus
      namespace="auth"
      type="login"
    />
    <x-helpers-sessionstatus
      namespace="auth"
      type="activate"
    />
    <x-helpers-sessionstatus
      namespace="auth"
      type="password-reset"
    />
    <div class="error"></div>
  </x-auth-form-login>
  {{--
  <div class="AuthLogin:prompt">
    <div class="AuthLogin:prompt__text">
      Not registered ?
    </div>
    <a class="btn" href="{{ to('register') }}">
      Sign up
    </a>
  </div>
  --}}
</div>
