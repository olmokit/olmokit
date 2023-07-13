@props([
    'data' => [],
    'wishlist' => false,
    'cartAdd' => false,
    'cartRemove' => false,
    'link' => false,
    'properties' => true,
])
@php $item = item($data); @endphp

<div
  class="ItemCard:"
  {!! $item->attrs() !!}
  data-wishlist-item
  data-cart-item
>
  @if ($wishlist)
    <x-WishlistBtn></x-WishlistBtn>
  @endif
  @if ($cartAdd)
    <x-CartBtnAdd></x-CartBtnAdd>
  @endif
  @if ($cartRemove)
    <x-CartBtnRemove></x-CartBtnRemove>
  @endif
  @if ($properties)
    @foreach ($item['properties'] as $property)
      <x-forms-select
        :attrs="$property['attrs']"
        :label="$property['name']"
        :name="$property['name']"
        :required="$property['required']"
        :options="$property['options']"
        :value="$property['required'] ? $property['options'][0]['value'] : ''"
      />
    @endforeach
    @php $property = $item->createPropertyQuantity('quantity', ['max' => 5 ]); @endphp
    <x-forms-select
      :label="$trans['select.quantita']"
      :attrs="$property['attrs']"
      :name="$property['name']"
      :required="$property['required']"
      :options="$property['options']"
      :value="$item['quantity'] ?? 1"
    />
  @endif
  @if ($link)
    {{-- <a data-item-link href="{{ to('product', [ 'slug' => $item['slug'] ]) }}">
      View details
    </a> --}}
  @endif
</div>
