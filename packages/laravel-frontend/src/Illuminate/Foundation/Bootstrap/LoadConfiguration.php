<?php

namespace LaravelFrontend\Illuminate\Foundation\Bootstrap;

use Exception;
// use Illuminate\Config\Repository;
use Illuminate\Contracts\Config\Repository as RepositoryContract;
use Illuminate\Contracts\Foundation\Application;
// use SplFileInfo;
use Symfony\Component\Finder\Finder;
use Illuminate\Foundation\Bootstrap\LoadConfiguration as Base;
use Illuminate\Support\Arr;

class LoadConfiguration extends Base
{
    /**
     * Load the configuration items from all of the files.
     *
     * This is th esame as othe original source execpt it merges the default
     * config files from the lib with the one of the project
     *
     * @param  \Illuminate\Contracts\Foundation\Application  $app
     * @param  \Illuminate\Contracts\Config\Repository  $repository
     * @return void
     *
     * @throws \Exception
     */
    protected function loadConfigurationFiles(
        Application $app,
        RepositoryContract $repository
    ) {
        $libFiles = $this->getConfigurationFilesFrom($app->configLibPath());
        $files = $this->getConfigurationFilesFrom($app->configPath());

        if (!isset($libFiles['app']) && !isset($files['app'])) {
            throw new Exception('Unable to load the "app" configuration file.');
        }

        $defaults = [];

        foreach ($libFiles as $key => $path) {
            $defaults[$key] = require $path;
            $repository->set($key, $defaults[$key]);
        }
        foreach ($files as $key => $path) {
            $custom = require $path;

            if (isset($defaults[$key])) {
                $custom = $this->mergeConfigs($defaults[$key], $custom);
                // $custom = array_replace_recursive($defaults[$key], $custom);
            }
            $repository->set($key, $custom);
        }
    }

    /**
     * Get all of the configuration files for the application.
     *
     * This is the same as the original source execpt the argument it accept,
     * in the original is the $app instance, here is a string base path where
     * to start for searching configuration files
     *
     * @param  string  $basePath
     * @return array
     */
    protected function getConfigurationFilesFrom(string $basePath)
    {
        $files = [];
        $configPath = realpath($basePath);

        foreach (
            Finder::create()
                ->files()
                ->name('*.php')
                ->in($configPath)
            as $file
        ) {
            $directory = $this->getNestedDirectory($file, $configPath);

            $files[
                $directory . basename($file->getRealPath(), '.php')
            ] = $file->getRealPath();
        }

        ksort($files, SORT_NATURAL);

        return $files;
    }

    /**
     * Merges the configs together and takes multi-dimensional arrays into account.
     *
     * @source https://medium.com/@koenhoeijmakers/properly-merging-configs-in-laravel-packages-a4209701746d
     * @param  array  $original
     * @param  array  $merging
     * @return array
     */
    protected function mergeConfigs(array $original, array $merging)
    {
        $array = array_merge($original, $merging);
        // array_unique?

        foreach ($original as $key => $value) {
            if (!is_array($value)) {
                continue;
            }

            if (!Arr::exists($merging, $key)) {
                continue;
            }

            if (is_numeric($key)) {
                continue;
            }

            $array[$key] = $this->mergeConfigs($value, $merging[$key]);
        }

        return $array;
    }
}
