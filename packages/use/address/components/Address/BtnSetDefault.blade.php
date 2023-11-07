@props([
    'address' => [],
])
@if (!$address['isDefaultShipping'])
  <button
    class="AddressBtnSetDefault:"
    data-address-setdefault="shipping"
  >
    <span>
      Set as default shipping address
    </span>
    <span
      data-address-when="loading"
      title="Processing..."
    >
      <x-progress-circular />
    </span>
  </button>
@endif
@if (!$address['isDefaultBilling'])
  <button
    class="AddressBtnSetDefault:"
    data-address-setdefault="billing"
  >
    <span>
      Set as default billing address
    </span>
    <span
      data-address-when="loading"
      title="Processing..."
    >
      <x-progress-circular />
    </span>
  </button>
@endif
