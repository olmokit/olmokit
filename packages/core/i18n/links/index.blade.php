@props([
    'tag' => 'span',
    'transPrefix' => 'locale',
    'includeCurrent' => true,
    'loaderSize' => 24,
])
<{{ $tag }} {{ $attributes->merge(['class' => 'i18nLinks']) }}>
  @foreach ($langs as $lang)
    @if ($lang['current'])
      @if ($includeCurrent)
        <span
          data-locale="{{ $lang['locale'] }}"
          {{ $attributes->merge(['class' => 'i18nLinksItem is-current']) }}
        >
          {{ $trans[$transPrefix . '.' . $lang['locale']] }}
        </span>
      @endif
    @else
      <a
        data-locale="{{ $lang['locale'] }}"
        {{ $attributes->merge(['class' => 'i18nLinksItem']) }}
        href="{{ $lang['switchUrl'] }}"
      >
        {{ $trans[$transPrefix . '.' . $lang['locale']] }}
      </a>
      @isset($loader)
        {{ $loader }}
      @else
        <span class="i18nLinksLoader">
          <x-progress-circular :size="$loaderSize" />
        </span>
      @endisset
    @endif
  @endforeach
  </{{ $tag }}>

  @if ($useBarba)
    @push('body')
      {{--
      Trick to fool barbajs who does not parse js/json, we parse this encoded
      data attribute so that we can have fresh links inside the locale switch
    --}}
      <form
        id="i18nLinks"
        data-langs="{{ json_encode($langs) }}"
      ></form>
    @endpush
  @endif
