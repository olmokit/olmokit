@props([
    'src' => '',
    'width' => 0,
    'height' => 0,
    'progress' => 42,
])
<div class="media media--iframe">
  <span
    class="mediaProportion"
    style="padding-top: {{ ($height * 100) / $width }}%"
  ></span>
  <iframe
    class="mediaElement iframe lazy"
    src="{{ $src }}"
    style="border:0"
    width="{{ $width }}"
    height="{{ $height }}"
    frameborder="0"
    allowfullscreen
  ></iframe>
  @progressCircular(['size' => $progress, 'center' => true])
</div>
