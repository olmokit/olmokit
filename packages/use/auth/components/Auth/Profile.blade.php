@props([])
<div class="AuthProfile:">
  <x-auth-form-profile>
    <x-helpers-sessionstatus
      namespace="auth"
      type="profile"
    />
  </x-auth-form-profile>
  <x-auth-form-password-change>
    <x-helpers-sessionstatus
      namespace="auth"
      type="password-change"
    />
  </x-auth-form-password-change>
</div>
