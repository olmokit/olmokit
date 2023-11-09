@if ($profiler)
  <style>
    .debugProfiler {
      z-index: 99999;
      position: fixed;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, .9);
      color: white;
      padding: 2em 3em;
      font-size: 12px;
      font-family: monospace;
    }

    .debugProfiler ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .debugProfiler li {
      padding-left: 20px;
      padding: 0 0 .5em;
    }

    .debugProfiler details p {
      opacity: .7;
      padding-left: 1em;
    }
  </style>
  <div
    class="debugProfiler"
    draggable
  >
    {!! $profiler !!}
  </div>
@endif
