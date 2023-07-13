@props([
    'success' => 'Done',
    'failure' => 'Failed',
])
<div class="of:feedback">
  <div class="of:feedback__msg of:feedback__success">
    {!! $success !!}
  </div>
  <div class="of:feedback__msg of:feedback__failure">
    {!! $failure !!}
  </div>
</div>
