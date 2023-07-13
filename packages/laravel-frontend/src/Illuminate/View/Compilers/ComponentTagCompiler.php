<?php

namespace LaravelFrontend\Illuminate\View\Compilers;

use Illuminate\Container\Container;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\View\Compilers\ComponentTagCompiler as Base;

class ComponentTagCompiler extends Base
{
  /**
   * Guess the class name for the given component.
   *
   * @param  string  $component
   * @return string
   */
  public function guessClassName(string $component)
  {
    $namespace = Container::getInstance()
      ->make(Application::class)
      ->getNamespace();

    $class = $this->formatClassName($component);

    // return $namespace.'View\\Components\\'.$class;
    return $namespace . 'components\\' . $class;
  }
}
