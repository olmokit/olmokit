@props([
    'id' => 'zacc-' . rand(),
    'expanded' => false,
    'order' => 'default',
    'icon' => '',
    'more' => '',
    'less' => '',
])
<input
  class="hidden"
  id="{{ $id }}"
  data-zacc-input
  type="checkbox"
  aria-hidden="true"
  @if ($expanded) checked @endif
>
@if ($order == 'reverse')
  <div data-zacc-wrap>
    <div data-zacc-body>
      {{ $slot }}
    </div>
  </div>
@endif
<label
  class="zacc-head"
  data-zacc-head
  for="{{ $id }}"
  role="tab"
  aria-expanded="{{ $expanded ? 'true' : 'false' }}"
>
  @isset($head)
    {{ $head }}
  @else
    @if ($more)
      <span data-zacc-more>{{ $more }}</span>
    @endif
    @if ($less)
      <span data-zacc-less>{{ $less }}</span>
    @endif
    @if ($icon)
      <x-icon id="{{ $icon }}"></x-icon>
    @endif
  @endisset
</label>
@if ($order != 'reverse')
  <div data-zacc-wrap>
    <div data-zacc-body>
      {{ $slot }}
    </div>
  </div>
@endif
