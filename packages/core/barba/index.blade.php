@props([
    'namespace' => $route,
])

<div
  data-barba="wrapper"
  {{ $attributes->merge(['class' => 'barba:wrapper']) }}
>
  {{ $above ?? '' }}
  <div
    class="barba:container"
    data-barba="container"
    data-barba-namespace="{{ $namespace }}"
  >
    {{ $slot }}
  </div>
  {{ $below ?? '' }}
</div>
