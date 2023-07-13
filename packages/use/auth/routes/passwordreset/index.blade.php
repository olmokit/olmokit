{{-- Route: passwordreset --}}

@extends('layouts.main')

@section('bodyAbove')
  <x-Header />
@endsection

@section('body')
  <main class="route-passwordreset:">
    <section class="form:">
      <x-AuthPasswordReset></x-AuthPasswordReset>
    </section>
  </main>
@endsection

@section('bodyBelow')
  <x-Footer />
@endsection
