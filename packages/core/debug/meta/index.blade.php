<style>
  body {
    font-family: monospace;
    line-height: 1.5;
    margin: 0 auto;
    padding: 2rem;
    max-width: 900px;
  }

  code {
    background: #eee;
    color: purple;
    padding: 2px 4px;
  }

  .group-title {
    font-weight: bold;
    padding: 10px 0;
  }

  a {
    color: brown;
    display: inline-block;
  }

  .url {
    color: red;
  }

  li {
    padding: 5px 0;
  }
</style>

<h1>Debug meta</h1>

<hr>

<p>Be sure access to this page is well protected.</p>

<h2>Hooks</h2>

<p>📖 See docs <a href="https://olmokit.github.io/olmokit/laravel-frontend/Hooks">laravel-frontend/Hooks</a>
  (<strong>click links with caution!</strong>)</p>

<ul>
  <li class="group-title">CI</h3>
  <li>
    🔥 <a
      class="url"
      href="/_/hooks/deploy/end{{ $param }}"
    >
      deploy/end
    </a><small>: 📖 <a href="https://olmokit.github.io/olmokit/laravel-frontend/Hooks#deployend">docs</a></small>
  </li>
  <li class="group-title">Cache</h3>
  <li>
    🔥 <a
      class="url"
      href="/_/hooks/cache/clear{{ $param }}"
    >
      cache/clear
    </a><small>: 📖 <a href="https://olmokit.github.io/olmokit/laravel-frontend/Hooks#cacheclear">docs</a></small>
  </li>
  <li>
    🔥 <a
      class="url"
      href="/_/hooks/cache/clear-system{{ $param }}"
    >
      cache/clear-system
    </a><small>: 📖 <a href="https://olmokit.github.io/olmokit/laravel-frontend/Hooks#cacheclearsystem">docs</a></small>
  </li>
  <li>
    🔥 <a
      class="url"
      href="/_/hooks/cache/clear-data{{ $param }}"
    >
      cache/clear-data
    </a><small>: 📖 <a href="https://olmokit.github.io/olmokit/laravel-frontend/Hooks#cachecleardata">docs</a></small>
  </li>
  <li>
    🔥 <a
      class="url"
      href="/_/hooks/cache/clear-structure{{ $param }}"
    >
      cache/clear-structure
    </a><small>: 📖 <a
        href="https://olmokit.github.io/olmokit/laravel-frontend/Hooks#cacheclearstructure">docs</a></small>
  </li>
  <li>
    🔥 <a
      class="url"
      href="/_/hooks/cache/clear-custom{{ $param }}"
    >
      cache/clear-custom
    </a><small>: 📖 <a href="https://olmokit.github.io/olmokit/laravel-frontend/Hooks#cacheclearcustom">docs</a></small>
  </li>
  <li>
    🔥 <a
      class="url"
      href="/_/hooks/cache/clear-models{{ $param }}"
    >
      cache/clear-models
    </a><small>: 📖 <a href="https://olmokit.github.io/olmokit/laravel-frontend/Hooks#cacheclearmodels">docs</a>, clear
      just one entry with <code>_/hooks/cache/clear-models/{name}{{ $param }}</code></small>
  </li>
  <li>
    🔥 <a
      class="url"
      href="/_/hooks/cache/clear-routes{{ $param }}"
    >
      cache/clear-routes
    </a><small>: 📖 <a href="https://olmokit.github.io/olmokit/laravel-frontend/Hooks#cacheclearroutes">docs</a>, clear
      just one entry with <code>_/hooks/cache/clear-routes/{id}{{ $param }}</code></small>
  </li>
  <li>
    🔥 <a
      class="url"
      href="/_/hooks/cache/clear-forms{{ $param }}"
    >
      cache/clear-forms
    </a><small>: 📖 <a href="https://olmokit.github.io/olmokit/laravel-frontend/Hooks#cacheclearforms">docs</a>, clear
      just one entry with <code>_/hooks/cache/clear-forms/{id}{{ $param }}</code></small>
  </li>
  <li>
    🔥 <a
      class="url"
      href="/_/hooks/cache/clear-img{{ $param }}"
    >
      cache/clear-img
    </a><small>: 📖 <a href="https://olmokit.github.io/olmokit/laravel-frontend/Hooks#cacheclearimg">docs</a></small>
  </li>
  <li class="group-title">Visit</h3>
  <li>
    🔥 <a
      class="url"
      href="/_/hooks/visit{{ $param }}"
    >
      visit
    </a><small>: 📖 <a href="https://olmokit.github.io/olmokit/laravel-frontend/Hooks#visit">docs</a></small>
  </li>
</ul>

<hr>

<h2>Info</h2>

<ul>
  <li>
    ℹ️ <a
      class="url"
      href="/_/info/php{{ $param }}"
    >Info php</a>: <small>displays
      <code>phpinfo()</code></small>
  </li>
</ul>

<hr>

<h2>Logs</h2>

<ul>
  <li>
    📃 <a
      class="url"
      href="/_/logs/laravel{{ $param }}"
    >Logs laravel</a>: <small>it displays standard
      "laravel" logs</small>
  </li>
  <li>
    📃 <a
      class="url"
      href="/_/logs/visit{{ $param }}"
    >Logs visit</a>: <small>it displays "visit" process
      logs</small>
  </li>
</ul>
