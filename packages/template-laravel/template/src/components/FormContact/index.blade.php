@props(['anchor', 'title'])

<div class="FormContact:"@isset($anchor) id="{{ $anchor }}"@endisset>
  <div class="container-xl">
    @isset($title)
      <p class="FormContact:title">{{ $title }}</p>
    @endisset
    <x-olmoforms-feedback
      success="contactform.success"
      failure="contactform.fail"
    />
    <x-olmoforms-base
      :forms="['en' => '195', 'it' => '196']"
      dom-id="contact"
    />
  </div>
</div>
