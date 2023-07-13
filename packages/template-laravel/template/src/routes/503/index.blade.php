{{-- Route: 503 --}}

@extends('layouts.main')

@section('body')
  <main class="route-503:">
    <div class="wrap:">
      <x-logo />
      <div class="info:">
        <h3 class="info:title">
          {{ $trans['503.title'] ?? 'Down for maintenance' }}
        </h3>
        <p class="info:text">
          {!! $trans['503.text'] ?? 'We are updating our systems' !!}
        </p>
        @isset($trans['503.cta'])
          <p class="info:cta">
            {!! $trans['503.cta'] !!}
          </p>
        @endisset
      </div>
    </div>
  </main>
@endsection
