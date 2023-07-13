@props([
    'data' => [],
])
@if (App::environment() === 'local' && !empty($data))
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
