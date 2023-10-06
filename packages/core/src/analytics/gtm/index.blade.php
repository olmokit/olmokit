@props([
    'type' => 'header', // or 'body'
    'analytics' => [
        'gtmHeader' => '',
        'gtmBody' => '',
    ],
])

@if ($type == 'header')
  @if ($analytics['gtmHeader'])
    @push('styles')
      <link
        href="https://www.google-analytics.com"
        rel="dns-preconnect"
      >
      <link
        href="https://www.google-analytics.com"
        rel="dns-prefetch"
      >
    @endpush
    {!! $analytics['gtmHeader'] !!}
  @endif
@endif

@if ($type == 'body')
  @if ($analytics['gtmBody'])
    @push('styles')
      <link
        href="https://www.google-analytics.com"
        rel="dns-preconnect"
      >
      <link
        href="https://www.google-analytics.com"
        rel="dns-prefetch"
      >
    @endpush
    {!! $analytics['gtmBody'] !!}
  @endif
@endif
