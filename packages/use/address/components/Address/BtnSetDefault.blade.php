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
      title="Processing..."
      data-address-when="loading"
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
      title="Processing..."
      data-address-when="loading"
    >
      <x-progress-circular />
    </span>
  </button>
@endif
