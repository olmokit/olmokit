@props([
    'code' => '',
    'name' => '',
    'description' => '',
    'currentSelection' => [],
])

<x-CheckoutPaymentMethod
  :code="$code"
  :name="$name"
  :description="$description"
  :current-selection="$currentSelection"
>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, rerum amet
  eaque, aliquam laborum ex ea perferendis eos odio odit quasi architecto
  ducimus quod nam laudantium deleniti iusto dicta. Facere.
</x-CheckoutPaymentMethod>
