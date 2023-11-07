<button
  class="btn {{ $classRoot ?? '' }} {{ $classElement ?? '' }}"
  type="submit"
  {!! $attrs ?? '' !!}
>
  {{ $label }}
  <span class="on-loading:show">
    <x-progress-circular :size="24" />
  </span>
</button>
