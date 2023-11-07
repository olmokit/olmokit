<?php

namespace LaravelFrontend\Meta;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Response;

class LogsController extends Controller
{
    const VISITOR_LOGS_PATH = 'logs/visit.log';

    /**
     * Page: info php page
     *
     * @return Response
     */
    public function infoPhp()
    {
        return phpinfo();
    }

    /**
     * Page: laravel logs
     *
     * @return Response
     */
    public function logsLaravel()
    {
        $path = storage_path('logs/laravel.log');
        $txt = file_exists($path) ? file_get_contents($path) : 'No logs!';

        return Response::make($txt, 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
            'Content-Length' => strlen($txt),
        ]);
    }

    /**
     * Page: visit logs
     *
     * @return Response
     */
    public function logsVisit()
    {
        $path = storage_path(self::VISITOR_LOGS_PATH);
        $txt = file_exists($path) ? file_get_contents($path) : 'No logs!';
        $txt = str_replace(
            '__TEMPORARY__',
            '<script>setTimeout(function (){location.reload()}, 600);</script>',
            $txt
        );

        return Response::make($this->format($txt), 200, [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Content-Length' => strlen($txt),
        ]);
    }

    /**
     * Get output formatted
     *
     * @return void
     */
    private function format(string $txt = '')
    {
        return '<code>' . nl2br($txt) . '</code>';
    }
}
