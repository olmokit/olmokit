{{-- Route: login --}}

@extends('layouts.main')

@section('bodyAbove')
  <x-Header />
@endsection

@section('body')
  <main class="route-login:">
    <section class="form:">
      <x-AuthLogin />
    </section>
  </main>
@endsection

@section('bodyBelow')
  <x-Footer />
@endsection
