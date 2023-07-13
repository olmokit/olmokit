<?php

namespace LaravelFrontend\Cacher;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class CacherCommand extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'cacher:clear {tag}';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'It clears a specific tag from tagged cache.';

  /**
   * Execute the console command.
   *
   * @return void
   */
  public function handle()
  {
    $tag = $this->argument('tag');

    Cache::tags([$tag])->flush();

    $this->info("Cleared '{$tag}' tagged cache");
  }
}
