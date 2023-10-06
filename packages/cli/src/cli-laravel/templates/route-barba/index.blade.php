{{-- Route: <%= route.slug %> --}}

@extends('layouts.main')

@section('bodyAbove')
  <x-Header />
@endsection

@section('body')
  <main class="route-<%= route.slug %>:">
    <section class="mysection:">
    </section>
  </main>
@endsection

@section('bodyBelow')
  <x-Footer />
@endsection
