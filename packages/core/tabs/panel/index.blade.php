@props([
    'tabId' => '',
    'tabParam' => 'tab',
    'tag' => 'div',
])

@php
  $_isActive = request()->query($tabParam) === $tabId;
  $_classes = 'tabsPanel' . ($_isActive ? ' is-active' : '');
@endphp

<{{ $tag }}
  data-tabs-panel="{{ $tabId }}"
  data-tabs="{{ $tabParam }}"
  {{ $attributes->merge(['class' => $_classes]) }}
>
  {{ $slot }}
  </{{ $tag }}>
