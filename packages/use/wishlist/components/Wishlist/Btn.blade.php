@if ($user)
  <button
    class="WishlistBtn:"
    data-wishlist-btn
  >
    <span
      data-wishlist-when="true"
      title="Remove from wishlist"
    >
      ♥ remove
    </span>
    <span
      data-wishlist-when="false"
      title="Add to wishlist"
    >
      ♥ add
    </span>
    <span
      data-wishlist-when="loading"
      title="Processing..."
    >
      <x-progress-circular />
    </span>
  </button>
@else
  <button disabled>♥ Log in to wish</button>
@endif
