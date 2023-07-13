@props([
    'title' => '',
    'subtitle' => '',
])
<section class="Page:">
  <article class="Page:wrap">
    <div class="Page:wrap__inner">
      @if ($title)
        <h1 class="Page:title">
          {!! $title !!}
        </h1>
      @endif
      @if ($subtitle)
        <h2 class="Page:subtitle">
          {!! $subtitle !!}
        </h2>
      @endif
      @if (!$slot->isEmpty())
        <div class="Page:content">
          {!! $slot !!}
        </div>
      @endif
    </div>
  </article>
</section>
