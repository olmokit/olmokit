@props([
    'namespace' => 'D',
    'classRoot' => '',
    'classToggle' => '',
    'classFlyout' => '',
])
@php
  $_idPrefix = ($namespace ?? 'dpdwn') . '-' . rand();
  $_idInput = $_idPrefix . '-input';
  $_idLabel = $_idPrefix . '-toggle';
  $_classPrefix = $namespace . ':';
  $_classDropdown = $_classPrefix . 'dropdown';
  $_classInput = $_classPrefix . 'input';
  $_classLabel = $_classPrefix . 'toggle';
  $_classFlyout = $_classPrefix . 'flyout';
@endphp
<div class="dropdown {{ $_classPrefix }} {{ $_classDropdown }} {{ $classRoot ?? '' }}">
  <input
    class="dropdownInput {{ $_classInput }}"
    id="{{ $_idInput }}"
    type="checkbox"
    value="open"
  >
  <label
    class="dropdownToggle {{ $_classLabel }} {{ $classToggle ?? '' }}"
    id="{{ $_idLabel }}"
    for="{{ $_idInput }}"
  >
    {{ $toggle ?? '' }}
  </label>
  {{ $slot ?? '' }}
  @isset($flyout)
    <div class="dropdownFlyout {{ $classFlyout }} {{ $_classFlyout }}">
      {{ $flyout ?? '' }}
    </div>
  @endisset
</div>
