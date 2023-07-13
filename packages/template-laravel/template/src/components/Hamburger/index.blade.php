<{{ $tag ?? 'label' }} {{ $attributes->merge(['class' => 'Hamburger:']) }}
  @isset($id) id="{{ $id }}"@endisset
  @isset($for)for="{{ $for }}"@endisset>
  <span class="Hamburger:inner">
    <span class="bar bar1"></span>
    <span class="bar bar2"></span>
    <span class="bar bar3"></span>
  </span>
  </{{ $tag ?? 'label' }}>
