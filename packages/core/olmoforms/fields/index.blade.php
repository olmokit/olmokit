@props([
    'formId' => uniqid(), // just a fallback, you should pass it as prop
    'fields' => [],
    'textareaRows' => 8,
    'submitClassName' => '',
    'iconFile' => 'upload',
])
@foreach ($fields as $field)
  @php
    $fieldId = 'of-' . $formId . '-' . $field['name'];
    $prevField = $fields[$loop->index - 1] ?? ['typology' => null];
    $nextField = $fields[$loop->index + 1] ?? ['typology' => null];
    $elAttrs = '';
    if (isset($field['hidden']) && $field['hidden'] == 'true') {
        $elAttrs .= ' style="display:none"';
    }
    if (isset($field['dependenttrigger']) && $field['dependenttrigger']) {
        $elAttrs .= ' data-trigger="' . $field['dependenttrigger'] . '"';
    }
    if (isset($field['dependentaction']) && $field['dependentaction']) {
        $elAttrs .= ' data-action="' . $field['dependentaction'] . '"';
    }
    if (isset($field['dependentfield']) && $field['dependentfield']) {
        $elAttrs .= ' data-value="' . $field['dependentfield'] . '"';
    }
    
    $_value = null;
    if (isset($field['value'])) {
        $_value = $field['value'];
    } elseif (isset($field['default']) && $field['default'] !== '') {
        $_value = $field['default'];
    }
    
  @endphp

  @if ($field['element'] == 'input')
    @if ($field['typology'] == 'checkbox')
      @if ($nextField['typology'] == 'checkbox')
        <div class="of:group of:{{ $field['name'] }}-{{ $nextField['name'] }}">
      @endif
      <div
        class="of:el of:{{ $field['name'] }}"
        {!! $elAttrs !!}
        data-name="{{ $field['name'] }}"
      >
        <x-forms-checkbox
          :id="$fieldId"
          :checked="isset($_value) && $_value"
          :value-true="$_value ?? 1"
          :label="$field['label']"
          :name="$field['name']"
          :type="$field['typology']"
          :required="$field['required']"
          :attrs="$field['attribute']"
          :class-element="$field['class']"
        />
      </div>
      @if ($prevField['typology'] == 'checkbox')
        </div>
      @endif
    @elseif ($field['typology'] == 'submit')
      <div
        class="of:el of:{{ $field['name'] }}"
        {!! $elAttrs !!}
        data-name="{{ $field['name'] }}"
      >
        <x-forms-submit
          :id="$fieldId"
          :value="$field['value'] ?? null"
          :label="$field['label']"
          :attrs="$field['attribute']"
          :class-root="$submitClassName"
          :class-element="$field['class']"
        />
      </div>
    @elseif ($field['typology'] == 'file')
      <div
        class="of:el of:{{ $field['name'] }}"
        {!! $elAttrs !!}
        data-name="{{ $field['name'] }}"
      >
        <x-forms-file
          :id="$fieldId"
          :value="$field['value'] ?? null"
          :label="$field['label']"
          :placeholder="$field['placeholder'] ?? $field['placheholder']"
          :name="$field['name']"
          :type="$field['typology']"
          :filesize="$field['filesize']"
          :required="$field['required']"
          :attrs="$field['attribute']"
          :class-element="$field['class']"
          :icon="$iconFile"
        />
      </div>
    @elseif ($field['typology'] == 'hidden')
      <input
        type="hidden"
        name="{{ $field['name'] }}"
        value="{{ $_value ?? '' }}"
        data-name="{{ $field['name'] }}"
      />
    @else
      {{-- $field['typology'] == "text" | "email" | "url" --}}
      <div
        class="of:el of:{{ $field['name'] }}"
        {!! $elAttrs !!}
        data-name="{{ $field['name'] }}"
      >
        <x-forms-input
          :id="$fieldId"
          :value="$_value ?? null"
          :label="$field['label']"
          :placeholder="$field['placeholder'] ?? $field['placheholder']"
          :name="$field['name']"
          :type="$field['typology']"
          :required="$field['required']"
          :attrs="$field['attribute']"
          :class-element="$field['class']"
        />
      </div>
    @endif
  @elseif ($field['element'] == 'inputlist')
    @if ($field['typology'] == 'radio')
      <div
        class="of:el of:{{ $field['name'] }}"
        {!! $elAttrs !!}
        data-name="{{ $field['name'] }}"
      >
        <x-forms-radio
          :id="$fieldId"
          :value="$_value ?? null"
          :label="$field['label']"
          :name="$field['name']"
          :type="'radio'"
          :options="$field['option']"
          :required="$field['required']"
          :attrs="$field['attribute']"
          :class-element="$field['class']"
        />
      </div>
    @else
      <div
        class="of:el of:{{ $field['name'] }}"
        {!! $elAttrs !!}
        data-name="{{ $field['name'] }}"
      >
        <x-forms-select
          :id="$fieldId"
          :value="$_value ?? null"
          :label="$field['label']"
          :placeholder="$field['placeholder'] ?? $field['placheholder']"
          :name="$field['name']"
          :type="'select'"
          :options="$field['option']"
          :required="$field['required']"
          :attrs="$field['attribute']"
          :class-element="$field['class']"
        />
      </div>
    @endif
  @elseif ($field['element'] == 'textarea')
    <div
      class="of:el of:{{ $field['name'] }}"
      {!! $elAttrs !!}
      data-name="{{ $field['name'] }}"
    >
      <x-forms-textarea
        :id="$fieldId"
        :value="$_value ?? null"
        :label="$field['label']"
        :placeholder="$field['placeholder'] ?? $field['placheholder']"
        :name="$field['name']"
        :required="$field['required']"
        :attrs="$field['attribute']"
        :rows="$textareaRows"
        :class-element="$field['class']"
      />
    </div>
  @elseif ($field['element'] == 'text')
    @if ($field['typology'] == 'longtext')
      <div
        class="of:el of:{{ $field['name'] }} {{ $field['class'] }}"
        {!! $elAttrs !!}
        data-name="{{ $field['name'] }}"
      >
        <p class="textLabel">
          {!! $field['label'] !!}
        </p>
      </div>
    @elseif ($field['typology'] == 'sorttext')
      <div
        class="of:el of:{{ $field['name'] }} {{ $field['class'] }}"
        {!! $elAttrs !!}
        data-name="{{ $field['name'] }}"
      >
        <p class="textLabel">
          {!! $field['label'] !!}
        </p>
      </div>
    @else
      <div
        class="of:el of:{{ $field['name'] }} {{ $field['class'] }}"
        {!! $elAttrs !!}
        data-name="{{ $field['name'] }}"
      >
        <p class="textLabel">
          {!! $field['label'] !!}
        </p>
      </div>
    @endif
  @endif
@endforeach
