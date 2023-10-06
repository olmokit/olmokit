<div class="textarea formRoot {{ $classRoot ?? '' }}{{ $errors->has($name) ? ' invalid' : '' }}">
  <div class="formBox">
    <textarea
      class="formControl {{ $classElement ?? '' }}"
      id="{{ $id ?? 'input-' . $name }}"
      name="{{ $name }}"
      rows="{{ $rows ?? 4 }}"
      @if ($required == 'true') required="required" @endif
      {!! $attrs ?? '' !!}
    >{{ old($name) ?? ($value ?? '') }}</textarea>
    <span class="formUnderline"></span>
    @unless (empty($label))
      <label
        class="formLabel"
        for="{{ $id ?? 'input-' . $name }}"
      >
        {!! $label !!}
        {{ $labelPost ?? '' }}
      </label>
    @endunless
  </div>
  {{ $slot ?? '' }}
  {{ $append ?? '' }}
  @if ($errors->has($name))
    <div class="formFeedback">{{ $errors->first($name) }}</div>
  @endif
</div>
