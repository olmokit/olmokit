@props([
    'name' => '_timezone_offset',
    'value' => null,
])
@php
  $_value = $value ?? ($user[$name] ?? '');
@endphp
<input
  name="{{ $name }}"
  data-auth-timezone-offset
  type="hidden"
  value="{{ $_value }}"
>
