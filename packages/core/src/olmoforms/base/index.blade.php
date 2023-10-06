<form
  class="of:"
  id="{{ $domId ? $domId : $form['id'] }}"
  @isset($form['olmoforms']) data-action="{{ $form['action'] }}" data-id="{{ $form['id'] }}"@endisset
>
  <x-olmoforms-fields
    :form-id="$form['id']"
    :fields="$form['fields']"
    :submit-class-name="$submitClassName"
    :icon-file="$iconFile"
    :textarea-rows="$textareaRows"
  />
  <x-debug-forms-btn :form-id="$form['id']" />
</form>
