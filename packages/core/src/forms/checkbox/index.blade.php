@props([
    'id' => null,
    'name' => '',
    'label' => '',
    'type' => 'checkbox',
    'checked' => false,
    'value' => null,
    'valueTrue' => null,
    'valueFalse' => null,
    'required' => false,
    'classRoot' => '',
    'attrs' => '',
])
@php
  $_checked = old($name) ?? $checked;
@endphp
<div class="checkbox formRoot {{ $classRoot }}{{ $errors->has($name) ? ' invalid' : '' }}">
  <div class="formToggle">
    <input
      name="{{ $name }}"
      type="hidden"
      value="0"
    />
    <input
      class="formControl"
      id="{{ $id ?? 'input-' . $name }}"
      name="{{ $name }}"
      type="{{ $type }}"
      value="1"
      @if ($_checked) checked @endif
      @isset($valueTrue) data-value-true="{{ $valueTrue }}"@endisset
      @isset($valueFalse) data-value-false="{{ $valueFalse }}"@endisset
      @if ($required) required="required" @endif
      {!! $attrs !!}
    >
    <label
      class="label"
      for="{{ $id ?? 'input-' . $name }}"
    >
      <dfn class="dfn"></dfn>
      <span class="formToggleLabel checkboxLabel">
        {!! $label !!}
        {{ $append ?? '' }}
      </span>
    </label>
  </div>
  @if ($errors->has($name))
    <div class="formFeedback">{{ $errors->first($name) }}</div>
  @endif
</div>
