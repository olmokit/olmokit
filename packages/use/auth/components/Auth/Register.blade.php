@props([
    'redirect' => '',
])

<div class="AuthRegister:">
  <x-auth-form-register
    ajax="true"
    :redirect="$redirect"
  >
    <x-helpers-sessionstatus
      namespace="auth"
      type="register"
    />
    <div class="error"></div>
  </x-auth-form-register>
</div>
