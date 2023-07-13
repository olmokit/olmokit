@if ($user)
  <button
    class="WishlistBtn:"
    data-wishlist-btn
  >
    <span
      title="Remove from wishlist"
      data-wishlist-when="true"
    >
      ♥ remove
    </span>
    <span
      title="Add to wishlist"
      data-wishlist-when="false"
    >
      ♥ add
    </span>
    <span
      title="Processing..."
      data-wishlist-when="loading"
    >
      <x-progress-circular />
    </span>
  </button>
@else
  <button disabled>♥ Log in to wish</button>
@endif
