@props([
    'root' => '',
    'routes' => [],
])
<x-dropdown
  namespace="HS"
  class-toggle="Header:nav__link"
>
  <x-slot name="toggle">
    {{ $trans['Header.' . $root] }}
    </span>
  </x-slot>
  <x-slot name="flyout">
    <ul class="HS:list">
      <li
        class="HS:item @if ($route == $root) is-active @endif"
        data-route="{{ $root }}"
      >
        <a
          class="HS:link"
          href="{{ to($root) }}"
        >
          {{ $trans['Header.sub.' . $root] }}
        </a>
      </li>
      @foreach ($routes as $subRoute)
        <li
          class="HS:item @if ($subRoute['active']) is-active @endif"
          data-route="{{ $subRoute['id'] }}"
        >
          <a
            class="HS:link"
            href="{{ $subRoute['link'] }}"
          >
            {{ $subRoute['title'] }}
          </a>
        </li>
      @endforeach
    </ul>
  </x-slot>
</x-dropdown>
