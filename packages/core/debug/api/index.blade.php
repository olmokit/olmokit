@props([
    'data' => [],
])
@if (config('env.DEVELOPMENT') && !empty($data))
  {{-- <style>
    .debugApi {
      z-index: 9999;
      position: fixed;
      top: 0;
      right: 0;
      width: 300px;
      bottom: 0;
      overflow: auto;
      white-space: pre;
      margin: 0;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      padding: 15px;
      font-size: 11px;
      // overflow-x: hidden;
      background: #eee;
      color: mediumvioletred;
      transition: transform 0.2s ease-in-out;
    }
    
    .debugApi button {
      transition: margin 0.2s ease-in-out;
    }

    .debugApi.is-collapsed {
      transform: translateX(100%);
      overflow: visible;
    }

    .debugApi.is-collapsed button {
      margin-left: -68px;
    }
  </style> --}}
  <script>
    window.__COREDEBUG = {!! json_encode($data, JSON_PRETTY_PRINT) !!}
  </script>
  <div class="debugApi">
    <h4>API RESPONSE</h4>
    <button>toggle</button>
    <pre></pre>
  </div>
  <script>
    var sidebar = document.getElementsByClassName("debugApi")[0];
    var isOpen = true;
    document.querySelector(".debugApi pre").textContent = JSON.stringify(window.__COREDEBUG, null, 2);
    document.querySelector(".debugApi button").onclick = function() {
      if (isOpen) {
        sidebar.classList.add("is-collapsed");
        isOpen = false;
      } else {
        sidebar.classList.remove("is-collapsed");
        isOpen = true;
      }
    }
  </script>
@endif
