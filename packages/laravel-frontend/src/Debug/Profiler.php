<?php

namespace LaravelFrontend\Debug;

class Profiler
{
    public static $logs = [];

    /**
     * @return void
     */
    public function add(string $summary = '', string $description = '')
    {
        if (!empty($description)) {
            self::$logs[] = "<li><details><summary>$summary</summary><p>$description</p></details></li>";
        } else {
            self::$logs[] = "<li>$summary</li>";
        }
    }

    /**
     * Regarding the memory usage tracking see:
     * - https://alexwebdevelop.com/monitor-script-memory-usage/
     */
    public function start(string $description = '', bool $printAndExit = false)
    {
        if (!config('env.DEBUG_PROFILER')) {
            return function () {};
        }

        $class = debug_backtrace()[1]['class'];
        $function = debug_backtrace()[1]['function'];
        $line = debug_backtrace()[1]['line'];

        $summary = '';
        if ($class) {
            $summary .= $class;
        }
        if ($function) {
            $summary .= ':' . $function;
        }
        if ($line) {
            $summary .= '#' . $line;
        }

        $t0 = microtime(true);
        $memUsage = memory_get_usage();

        return function () use (
            $printAndExit,
            $t0,
            $summary,
            $description,
            $memUsage,
        ) {
            $memPeak = memory_get_peak_usage();
            $seconds = microtime(true) - $t0;
            $minutes = $seconds / 60;
            $ms = $seconds * 1000;

            if ($minutes >= 1) {
                $time = $minutes . ' m';
            } elseif ($seconds >= 1) {
                $time = round($seconds, 4) . ' s';
            } else {
                $time = round($ms, 4) . ' ms';
            }

            $bytes = $memPeak - $memUsage;

            // @see https://stackoverflow.com/a/23888858/1938970
            $dec = 2;
            $size = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            $factor = floor((strlen($bytes) - 1) / 3);
            if ($factor == 0) {
                $dec = 0;
            }

            $memory = sprintf(
                "%.{$dec}f %s",
                $bytes / 1024 ** $factor,
                $size[$factor],
            );

            $summary .= ' | Time ' . $time;
            $summary .= ' | Memory ' . $memory;

            if ($printAndExit) {
                dd($summary . ($description ? ' -- ' . $description : ''));
            }

            self::add($summary, $description);
        };
    }

    public static function html()
    {
        if (!config('env.DEBUG_PROFILER')) {
            return '';
        }
        $html = '<ul>';
        foreach (self::$logs as $log) {
            $html .= $log;
        }
        $html .= '</ul>';

        return $html;
    }
}
