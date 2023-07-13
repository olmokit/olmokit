@props([
    'label' => 'i18n.select.label',
    'transPrefix' => 'locale',
    'includeCurrent' => true,
])
@php
  $value = '';
  $options = [];
  foreach ($langs as $lang) {
      if ($lang['current']) {
          $value = $lang['url'];
      }
  
      if (!$lang['current'] || ($lang['current'] && $includeCurrent)) {
          $options[] = [
              'value' => $lang['url'],
              'label' => $trans[$transPrefix . '.' . $lang['locale']],
              'attrs' => 'data-locale="' . $lang['locale'] . '"',
          ];
      }
  }
@endphp

<form
  class="i18nSelect"
  action="/_/i18n/switch/"
  method="post"
>
  @csrf
  <x-forms-select
    :value="$value"
    :options="$options"
    :no-empty="true"
    name="url"
    label="{{ $trans[$label] ?? '' }}"
  ></x-forms-select>
  <button
    type="submit"
    class="hidden"
  ></button>
</form>
