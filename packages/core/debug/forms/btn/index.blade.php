@props([
    'formId' => '',
])
@env('local')
<x-link-outbound
  class="debugFormsBtn"
  href="/_/forms/debug/{{ $formId }}"
  title="This appears only during development!"
>
  DEBUG FORM {{ $formId }}
</x-link-outbound>
@endenv
