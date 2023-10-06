@props([
    'tabParam' => 'tab',
    'tag' => 'div',
])

@php
  $_classes = 'tabs' . (request()->query($tabParam) ? ' has-active' : '');
@endphp

<{{ $tag }}
  data-tabs="{{ $tabParam }}"
  {{ $attributes->merge(['class' => $_classes]) }}
>
  {{ $slot ?? '' }}
  </{{ $tag }}>
