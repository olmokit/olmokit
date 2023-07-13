@props([
    'steps' => [],
])

<nav class="CheckoutSteps:">
  <div class="container-xxl">
    <div class="CheckoutSteps:borders row">
      <div class="CheckoutSteps:list container-xl">
        @foreach ($steps as $step)
          @php
            $_classes = 'CheckoutSteps:item';
            $_classes .= $step['isCurrent'] ? ' is-current' : '';
            $_classes .= $step['isFuture'] ? ' is-future' : '';
            $_classes .= $step['isPast'] ? ' is-past' : '';
          @endphp
          @if ($step['isPast'])
            <a
              class="{{ $_classes }}"
              href="{{ $step['url'] }}"
            >
              {{ $loop->iteration . '. ' . $trans['CheckoutSteps.' . $step['name']] }}
            </a>
          @else
            <div class="{{ $_classes }}">
              {{ $loop->iteration . '. ' . $trans['CheckoutSteps.' . $step['name']] }}
            </div>
          @endif
        @endforeach
      </div>
    </div>
  </div>
</nav>
