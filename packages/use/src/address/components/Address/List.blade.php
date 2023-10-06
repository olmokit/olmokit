<div class="AddressList:">
  @foreach ($addresses as $address)
    <div {!! $address->attrs() !!}>
      <h4>{{ $address['label'] }}</h4>
      <x-AddressBtnSetDefault :address="$address" />
      <x-AddressBtnRemove />
      <ul>
        @foreach ($address as $key => $value)
          @if (is_array($value))
            <li>{{ $key }}: {{ implode(', ', $value) }}</li>
          @else
            <li>{{ $key }}: {{ $value }}</li>
          @endif
        @endforeach
      </ul>
    </div>
  @endforeach
</div>
