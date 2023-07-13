@if (!isset($_SERVER['HTTP_X_BARBA']))

  <!DOCTYPE html>
  <html lang="{{ $locale }}" class="no-js" data-route="{{ $route }}">

  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="format-detection" content="telephone=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <x-analytics-data-layer :route-data="$data" :data="[]" />
    <x-analytics-gtm :analytics="$analytics" type="header" />
    <x-seo-meta :data="$data" />
    @stack('head')
    <x-favicons />
    <x-assets-head />
  </head>
  <x-seo-body :data="$data">
    <x-analytics-gtm :analytics="$analytics" type="body" />
    <x-svgicons />
    @if ($useBarba)
      <x-barba>
        <x-slot name="above">
          @yield('bodyAbove')
        </x-slot>
        @yield('body')
        @stack('body')
        <x-slot name="below">
          @yield('bodyBelow')
        </x-slot>
      </x-barba>
    @else
      @yield('bodyAbove')
      @yield('body')
      @yield('bodyBelow')
    @endif
    {{-- <x-debug-api :data="$data"/> --}}
    {{-- <x-cookies-banner/> --}}
    <x-assets-body />
  </x-seo-body>

  </html>
@else

  <head>
    <x-seo-meta :data="$data" />
  </head>
  <x-barba>
    <x-assets-head />
    @yield('body')
    @stack('body')
  </x-barba>

@endif
