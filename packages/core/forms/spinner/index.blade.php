<div class="spinner">
  @isset($label)
    <label
      class="buttonsetBtn btn"
      for="{{ $id ?? 'spinner-' . $name }}"
    >
      {!! $label !!}
    </label>
  @endisset
  <div class="spinnerWrap">
    <span class="spinnerDec spinnerBtn">
      {{ $dec ?? '-' }}
    </span>
    <input
      class="spinnerControl"
      id="{{ $id ?? 'spinner-' . $name }}"
      name="{{ $name }}"
      type="{{ $type ?? 'number' }}"
      value="{{ $value ?? '' }}"
      @isset($min)min="{{ $min }}"@endisset
      @isset($max)max="{{ $max }}"@endisset
      @isset($step)step="{{ $step }}"@endisset
      @if (isset($disabled) && $disabled) disabled @endif
      @if (isset($readonly) && $readonly) readonly @endif
      {!! $attrs ?? '' !!}
    >
    <span class="spinnerInc spinnerBtn">
      {{ $inc ?? '+' }}
    </span>
  </div>
</div>
