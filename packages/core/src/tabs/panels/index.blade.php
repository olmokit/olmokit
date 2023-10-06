@props([
    'tabParam' => 'tab',
    'tag' => 'div',
])

@php
  $_classes = 'tabsPanels' . (request()->query($tabParam) ? ' has-active' : '');
@endphp

<{{ $tag }}
  data-tabs-panels="{{ $tabParam }}"
  {{ $attributes->merge(['class' => $_classes]) }}
>
  {{ $slot ?? '' }}
  </{{ $tag }}>
