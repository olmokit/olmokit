<?php

namespace resources\middlewares;

/**
 * Register custom middlewares
 */
class Middlewares
{

    /**
     * These middleware are run by default to every request to your application.
     */
    public static $global = [<% for (var i = 0; i < global.length; i++) { %>
        <%= global[i].classPath %>,<% } %>
    ];

    /**
     * These middleware are run in the 'web' middleware group.
     */
    public static $web = [<% for (var i = 0; i < web.length; i++) { %>
        <%= web[i].classPath %>,<% } %>
    ];

    /**
     * These middleware may be assigned to groups or used individually.
     */
    public static $named = [<% for (var i = 0; i < named.length; i++) { %>
        '<%= named[i].name %>' => <%= named[i].classPath %>,<% } %>
    ];
}
