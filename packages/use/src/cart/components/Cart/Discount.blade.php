<div
  class="CartDiscount:"
  data-cart-discount
>
  <div class="CartDiscount:group">
    <div class="CartDiscount:label">
      Hai un codice sconto?
    </div>
    <div class="CartDiscount:input">
      <x-forms-input
        name="discount"
        :value="$cart['discount']['code'] ?? ''"
        attrs="data-cart-discount-input"
      >
      </x-forms-input>
      <button
        class="CartDiscount:add btn"
        data-cart-discount-add
      >
        Applica
      </button>
    </div>
  </div>
  <div
    class="CartDiscount:remove"
    data-cart-discount-remove
  >
    Rimuovi
  </div>
  <div
    class="CartDiscount:feedback"
    data-cart-discount-feedback
  >
  </div>
</div>
