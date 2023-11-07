<label class="file formRoot {{ $classRoot ?? '' }}{{ empty($error) ? '' : ' invalid' }}">
  <span class="formBox">
    <span class="formUnderline"></span>
    @isset($icon)
      <x-icon id="{{ $icon }}" />
    @endisset
    <span class="formTexts">
      <input
        class="formControl {{ $classElement ?? '' }}"
        id="{{ $id ?? 'input-' . $name }}"
        name="{{ $name }}"
        type="{{ $type ?? 'file' }}"
        @unless (empty($placeholder)) placeholder="{{ $placeholder }}"@endunless
        @if ($required == 'true') required="required" @endif
        {!! $attrs ?? '' !!}
      >
      @unless (empty($label))
        <span class="formLabel">
          {!! $label !!}
          {{ $append ?? '' }}
        </span>
      @endunless
      <span class="fileName"></span>
    </span>
  </span>
  @unless (empty($error))
    <div class="formFeedback">{{ $error }}</div>
  @endunless
  <div class="fileSizeLabel">
    @if ($filesize != '')
      @if (isset($trans['form.file.maxfilesize']))
        <label>{{ $trans['form.file.maxfilesize'] }} {{ (int) $filesize / 1000000 }}MB</label>
      @else
        <label>Max file size {{ (int) $filesize / 1000000 }}MB</label>
      @endif
      <input
        class="fileSize"
        type="hidden"
        value="{{ $filesize }}"
      />
    @endif
  </div>
</label>
