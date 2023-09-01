@props([
    'formId' => '',
])
@if (config('env.DEVELOPMENT'))
<x-link-outbound
  class="debugFormsBtn"
  href="/_/forms/debug/{{ $formId }}"
  title="This appears only during development!"
>
  DEBUG FORM {{ $formId }}
</x-link-outbound>
@endif
