@php
<% if (isProduction) { %>
  $manifest = json_decode(file_get_contents(public_path('<%= manifestPath %>')), true);
  $routeCss = isset($manifest["$route.css"]) ? $manifest["$route.css"] : '';
  $routeJs = isset($manifest["$route.js"]) ? $manifest["$route.js"] : '';
  $routeCssPath = public_path("<%= assetsPath %>/$routeCss");
  $routeCssFilesize = file_exists($routeCssPath) ? filesize($routeCssPath) / 1024 : 0;
  $routeJsPath = public_path("<%= assetsPath %>/$routeJs");
  $routeJsFilesize = file_exists($routeJsPath) ? filesize($routeJsPath) / 1024 : 0;

  $routeCssUrl = "<%= assetsUrl %>$routeCss";
  $routeCssPath = $routeCssPath;
  $routeCssFilesize = $routeCssFilesize;
  $routeJsFilesize = $routeJsFilesize;
<% } else { %>
  $routeJs = "<%= entriesFolder %>/$route.js";
<% } %>
  $routeJsUrl = "<%= assetsUrl %>$routeJs";
  // TODO: generate this config dynamically in one place only?
  $jsConfig = [
    'baseUrl' => url('/'),
    'cmsApiUrl' => \LaravelFrontend\Cms\CmsApi::getEndpointUrl(),
    'mediaUrl' => \LaravelFrontend\Cms\CmsApi::getMediaUrl(),
    'assetsUrl' => assets(),
    'locale' => App::getLocale(),
    'cached' => $cached,
    'authenticated' => $cached ? null : AuthApi::check(),
    'guest' => $cached ? null : AuthApi::guest(),
    'api' => CmsApi::getMeta(),
  ];

  $jsConfig = json_encode($jsConfig, JSON_PRETTY_PRINT);
@endphp

<% if (isProduction) { %>
  <% if (useCDN) { %>
    <link href="{{ $routeCssUrl }}" rel="stylesheet" />
  <% } else { %>
    <!-- inline route specific css ({{ $routeCssFilesize }}kb) from path: {{ $routeCssPath }} -->
    <style id="__route-style-{{ $route }}" data-route-style="{{ $route }}">
      {!! @file_get_contents($routeCssPath) !!}
    </style>
  <% } %>
<% } else { %>
    <!-- During development all styles are injected and hot reloaded via the route js bundle through webpack style-loader -->
<% } %>
@stack('styles')

<script>window.__CONFIG = {!! $jsConfig !!};</script>
<script>document.querySelector("html").className=document.querySelector("html").className.replace(/\bno-js\b/,"") + " js";</script>
<% if (isProduction) { %>
  <% if (hasServiceWorker) { %>
    <script>
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", function() {
          navigator.serviceWorker.register("<%= serviceWorkerUrl %>");
        });
      }
    </script>
  <% } %>
    @if($routeJsFilesize < 2)
    @else
      <script defer src="{{ $routeJsUrl }}"></script>
    @endif
<% } else { %>
  <script defer src="{{ $routeJsUrl }}"></script>
<% } %>
