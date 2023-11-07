<?php

namespace resources\components;

use Illuminate\View\Component;
use LaravelFrontend\Forms\Olmoforms\Olmoforms;

class OlmoformsBase extends Component
{
    public $form;
    public $extra;
    public $textareaRows;
    public $domId;
    public $submitClassName;
    public $iconFile;

    /**
     * Create a new component instance.
     *
     * Usage:
     * ```
     * <x-olmoforms-base
     *   :forms="[ 'it' => '134', 'en' => '134' ]"
     *   :extra="[ 'subject' => 'contactform.email.subject' ]"
     *   dom-id="myForm"
     *   submit-class-name="btnCustom"
     *   textarea-rows="4"
     *   icon-file="upload"
     * />
     * ```
     *
     * @param string $token
     * @param array $forms Optional, an object like `forms: { it: '114', en: '114' }`
     * @param array $extra Optional, key/value pairs to add to the output object, it allows for instance to add a custom email subject
     * @return void
     */
    public function __construct(
        $form = [],
        $forms = [],
        $extra = [],
        $textareaRows = 8,
        $domId = 'myForm',
        $submitClassName = '',
        $iconFile = 'upload'
    ) {
        $this->form = array_merge(
            empty($form) ? Olmoforms::get($forms) : $form,
            $extra
        );
        $this->textareaRows = $textareaRows;
        $this->domId = $domId;
        $this->submitClassName = $submitClassName;
        $this->iconFile = $iconFile;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\View\View|string
     */
    public function render()
    {
        return view('components.olmoforms-base');
    }
}
