<div class="input formRoot {{ $classRoot ?? '' }}{{ $errors->has($name) ? ' invalid' : '' }}">
  {{ $prepend ?? '' }}
  <div class="formBox">
    @unless (empty($iconPre) && empty($iconPost))
      <div class="formIconHolder{{ empty($iconPre) ? '' : ' has-pre' }}{{ empty($iconPost) ? '' : ' has-post' }}">
      @endunless
      @unless (empty($iconPre))
        <span class="formIcon formIconPre">@icon(['id' => $iconPre])</span>
      @endunless
      <input
        class="formControl"
        id="{{ $id ?? 'input-' . $name }}"
        name="{{ $name }}"
        type="{{ $type ?? 'text' }}"
        value="{{ old($name) ?? ($value ?? '') }}"
        @isset($autocomplete) autocomplete="{{ $autocomplete }}"@endisset
        @unless (empty($placeholder)) placeholder="{{ $placeholder }}"@endunless
        @if ($required == 'true') required="required" @endif
        {!! $attrs ?? '' !!}
      >
      @unless (empty($iconPost))
        <span class="formIcon formIconPost">@icon(['id' => $iconPost])</span>
      @endunless
      @unless (empty($iconPre) && empty($iconPost))
      </div>
    @endunless
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
