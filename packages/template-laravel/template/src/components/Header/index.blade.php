@props([
    'variant' => 'light',
    'links' => ['contacts'],
])

<header
  class="Header:@isset($variant) is-{{ $variant }}@endisset"
  data-status="collapsed"
>
  <div class="Header:bgExpanded"></div>
  <nav class="Header:inner">
    <a
      class="Header:brand"
      href="{{ to('home') }}"
    >
      <x-logo />
    </a>
    <x-Hamburger class="Header:toggle" />
    <div
      class="Header:collapse"
      id="Header:collapse"
    >
      <ul class="Header:nav">
        <li class="Header:nav__item Header:locales">
          <x-i18n-links></x-i18n-links>
        </li>
        @foreach ($links as $linkRoute)
          <li
            class="Header:nav__item @if ($route == $linkRoute) is-active @endif"
            data-route="{{ $linkRoute }}"
          >
            <a
              class="Header:nav__link"
              href="{{ to($linkRoute) }}"
            >
              {{ $trans['Header.' . $linkRoute] }}
            </a>
          </li>
        @endforeach
      </ul>
    </div>
  </nav>
</header>
