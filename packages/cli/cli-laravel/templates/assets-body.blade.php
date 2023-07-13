@php
  <% if (isProduction) { %>
  $manifest = json_decode(file_get_contents(public_path('<%= manifestPath %>')), true);
  $routeJs = isset($manifest["$route.js"]) ? $manifest["$route.js"] : '';
  <% } else { %>
  $routeJs = "<%= entriesFolder %>/$route.js";
  <% } %>

  $routeJsPath = public_path($routeJs);
  $routeJsFilesize = file_exists($routeJsPath) ? filesize($routeJsPath) / 1024 : 0;

  $routeJsUrl = "<%= assetsUrl %>$routeJs";
  $routeJsPath = $routeJsPath;
  $routeJsFilesize = $routeJsFilesize;
@endphp

<% if (isProduction) { %>
  @if($routeJsFilesize < 2)
    <!-- inline route specific js from path: {{ $routeJsPath }} -->
    <script>
    {!! @file_get_contents($routeJsPath) !!}
    </script>
  @endif
<% } %>

@stack('scripts')
