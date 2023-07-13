{{-- Route: register --}}

@extends('layouts.main')

@section('bodyAbove')
  <x-Header />
@endsection

@section('body')
  <main class="route-register:">
    <section class="form:">
      <x-AuthRegister />
    </section>
  </main>
@endsection

@section('bodyBelow')
  <x-Footer />
@endsection
