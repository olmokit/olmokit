<div class="CartPreview:">
  <p>Cart preview</p>
  @if ($user)
    @foreach ($cart['items'] as $item)
      <x-ItemCard
        :data="$item"
        :properties="false"
        :link="true"
        :wishlist="true"
        :cart-remove="true"
      />
    @endforeach
    <a href="{{-- to('cart') --}}">
      Go to cart
    </a>
  @else
    <a href="{{-- to('login') --}}">
      Log in to view your cart
    </a>
  @endif
</div>
