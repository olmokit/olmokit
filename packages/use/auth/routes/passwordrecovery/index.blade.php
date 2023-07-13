{{-- Route: passwordrecovery --}}

@extends('layouts.main')

@section('bodyAbove')
  <x-Header />
@endsection

@section('body')
  <main class="route-passwordrecovery:">
    <section class="form:">
      <x-AuthPasswordRecovery />
    </section>
  </main>
@endsection

@section('bodyBelow')
  <x-Footer />
@endsection
