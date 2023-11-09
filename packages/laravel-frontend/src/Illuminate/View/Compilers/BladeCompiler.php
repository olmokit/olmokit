<?php

namespace LaravelFrontend\Illuminate\View\Compilers;

use Illuminate\View\Compilers\BladeCompiler as Base;
use LaravelFrontend\Illuminate\View\Compilers\ComponentTagCompiler;

class BladeCompiler extends Base
{
    /**
     * Compile the component tags.
     *
     * @param  string  $value
     * @return string
     */
    protected function compileComponentTags($value)
    {
        if (!$this->compilesComponentTags) {
            return $value;
        }
        if (isset($this->classComponentAliases['dynamic-component'])) {
            $this->classComponentAliases['dynamic-component'] =
                'Illuminate\View\DynamicComponent';
        }
        return (new ComponentTagCompiler(
            $this->classComponentAliases,
            $this->classComponentNamespaces,
            $this,
        ))->compile($value);
    }
}
