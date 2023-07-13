@props([
    'current' => '',
    'steps' => [
        'details' => \LaravelFrontend\Cms\CmsCheckout::getRoute('details'),
        'payment' => to('checkoutpayment'),
        'summary' => to('checkoutsummary'),
    ],
])

@php $_currentIdx = array_search($current, array_keys($steps)); @endphp

<nav class="CheckoutSteps:">
  <div class="container-xxl">
    <div class="CheckoutSteps:borders row">
      <div class="CheckoutSteps:list container-xl">
        @foreach ($steps as $name => $link)
          @php
            $_classes = 'CheckoutSteps:item';
            $_classes .= $current === $name ? ' is-current' : '';
            $_classes .= $current === 'auth' || $loop->index > $_currentIdx ? ' is-future' : '';
            $_classes .= $loop->index < $_currentIdx ? ' is-past' : '';
          @endphp
          @if ($loop->index < $_currentIdx)
            {{-- <a class="{{ $_classes }}" href="{{ $link }}">
              {{ $loop->iteration.'. '.$trans['CheckoutSteps.'.$name] }}
            </a> --}}
            <button
              class="{{ $_classes }}"
              type="submit"
              name="_redirect"
              value="{{ \LaravelFrontend\Cms\CmsCheckout::getRoute($name) }}
            "
            >
              {{ $loop->iteration . '. ' . $trans['CheckoutSteps.' . $name] }}
            </button>
          @else
            <div class="{{ $_classes }}">
              {{ $loop->iteration . '. ' . $trans['CheckoutSteps.' . $name] }}
            </div>
          @endif
        @endforeach
      </div>
    </div>
  </div>
</nav>
