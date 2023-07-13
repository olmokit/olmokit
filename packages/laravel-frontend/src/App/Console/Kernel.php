<?php

namespace LaravelFrontend\App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use LaravelFrontend\Cacher\CacherCommand;
use LaravelFrontend\Meta\CommandComposerDumpAutoload;

class Kernel extends ConsoleKernel
{
  /**
   * The bootstrap classes for the application.
   *
   * @var string[]
   */
  protected $bootstrappers = [
    \Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables::class,
    \LaravelFrontend\Illuminate\Foundation\Bootstrap\LoadConfiguration::class,
    \Illuminate\Foundation\Bootstrap\HandleExceptions::class,
    \Illuminate\Foundation\Bootstrap\RegisterFacades::class,
    \Illuminate\Foundation\Bootstrap\SetRequestForConsole::class,
    \Illuminate\Foundation\Bootstrap\RegisterProviders::class,
    \Illuminate\Foundation\Bootstrap\BootProviders::class,
  ];

  /**
   * The Artisan commands provided by your application.
   *
   * @var array
   */
  protected $commands = [
    CacherCommand::class,
    CommandComposerDumpAutoload::class,
  ];
}
