<div class="range formRoot {{ $classRoot ?? '' }}{{ isset($error) ? ' invalid' : '' }}">
  <input
    class="rangeInput {{ $classElement ?? '' }}"
    id="{{ $id ?? 'input-' . $name }}"
    name="{{ $name }}"
    type="range"
    @isset($value)value="{{ $value }}"@endisset
    {!! $attrs ?? '' !!}
  >
</div>
