{{-- Route: checkoutauth --}}

@extends('layouts.main')

@section('bodyAbove')
  <x-Header />
@endsection

@section('body')
  <main class="route-checkoutauth:">
    <x-CheckoutSteps :steps="$steps" />
    <div class="container-xl">
      <x-AuthLogin />
    </div>
  </main>
@endsection

@section('bodyBelow')
  <x-Footer />
@endsection
