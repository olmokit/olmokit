<div class="WishlistList:">
  @foreach ($wishlist as $item)
    <x-ItemCard
      :data="$item"
      :link="true"
      :wishlist="true"
      {{-- TODO: it needs the properties :cart-add="true" --}}
    ></x-ItemCard>
  @endforeach
  @if (empty($wishlist))
    It is empty
  @endif
</div>
