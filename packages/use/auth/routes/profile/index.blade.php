{{-- Route: profile --}}

@extends('layouts.main')

@section('bodyAbove')
  <x-Header />
@endsection

@section('body')
  <main class="route-profile:">
    <section class="form:">
      <x-AuthProfile />
    </section>
  </main>
@endsection

@section('bodyBelow')
  <x-Footer />
@endsection
