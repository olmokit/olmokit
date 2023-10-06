<{{ $tag }}@if ($href) href="{{ $href }}" @endif
  style="
    @if ($bgColor) background:{{ $bgColor }}; @endif
    @if (!$cage && $fixed) width:{{ $img['width'] }}px @elseif($fixed)max-width:{{ $img['width'] }}px;@else width:100%; @endif
    {!! $styles ?? '' !!}"
  {{ $attributes->merge(['class' => 'media media--img']) }}
  {!! $attrsRoot ?? '' !!}
>
  <noscript>
    <img
      class="mediaElement img fit-{{ $cssFit }}"
      src="{{ $img['url'] }}"
      alt="{{ $alt ?? ($img['name'] ?? '') }}"
      draggable="false"
      width="{{ $img['width'] }}"
      height="{{ $img['height'] }}"
      {!! $attrs ?? '' !!}
    >
  </noscript>
  @if ($cage)
    <span
      class="mediaProportion"
      style="padding-top:{{ $img['ratio'] }}%"
    ></span>
  @endif
  <picture @if ($cage) class="mediaCenterer" @endif>
    @if ($img['urlWebp'])
      <source
        srcset="{{ $immediate ? $img['urlWebp'] : $thumb }}"
        type="image/webp"
        @if (!$immediate) data-srcset="{{ $img['urlWebp'] }}" @endif
      >
    @endif
    <img
      class="mediaElement img fit-{{ $cssFit }}@unless ($immediate) lazy @endunless"
      src="{{ $immediate ? $img['url'] : $thumb }}"
      alt="{{ $alt ?? ($img['name'] ?? '') }}"
      draggable="false"
      @unless ($immediate) data-src="{{ $img['url'] }}" @endunless
      width="{{ $img['width'] }}"
      height="{{ $img['height'] }}"
      {!! $attrs ?? '' !!}
    >
  </picture>
  @if (isset($progress) && $progress)
    )
    <x-progress-circular
      :size="$progress"
      center="true"
    />
  @endif
  @isset($mask)
    <canvas
      class="mediaMask"
      {!! $attrsMask ?? '' !!}
    ></canvas>
  @endisset
  {{ $append ?? '' }}
  </{{ $tag }}>
