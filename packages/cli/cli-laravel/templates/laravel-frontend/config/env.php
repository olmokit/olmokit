<?php
/**
 * All .env variables. This way they can be cached for speed
 */
return [<% for (var name in vars) { %>
  '<%= name %>' => env('<%= name %>'),<% } %>
];
