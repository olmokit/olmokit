<?php

namespace LaravelFrontend\Forms;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use LaravelFrontend\Cacher\CacherTags;
use LaravelFrontend\Helpers\Helpers;
use LaravelFrontend\I18n\I18n;
use LaravelFrontend\Forms\Olmoforms\Olmoforms;

class Form
{
  /**
   * The form id, a uniqid will be generated if not provided
   *
   * @var string
   */
  public $id;

  /**
   * The form fields array
   *
   * @var array
   */
  public $fields;

  /**
   * Custom data passed during intialisation, we store it here in order to
   * return it as it is in the `->json()` method
   */
  public $custom = [];

  /**
   * The localised string map derived from the translations.csv
   *
   * @var array
   */
  private $csv;

  /**
   * Flags a form as constructed without an explicit ID
   *
   * @var bool
   */
  public $isRandomlyGenerated = false;

  /**
   * Flags a form to signal that is coming straight from?
   *
   * @var 'LaravelFrontend'|'OLMOFORMS'|'CMS_API'|'AUTH_API'
   */
  public $origin = 'LaravelFrontend';

  /**
   * Flags a form to signal that is forwarded from olmoform
   *
   * @var bool
   */
  public $isForwardedFromOlmoforms = false;

  /**
   * Create a new Form instance
   *
   * @param string $id
   * @param string|array $data
   * @return LaravelFrontend\Forms\Form
   */
  public function __construct(string $id = '', $data = [])
  {
    // dynamically attach custom class properties
    $this->manageCustomData($data);

    $this->csv = I18n::getTranslations();

    // manage the form id
    if ($id) {
      $this->id = $id;
    } else {
      $this->id = uniqid();
      $this->isRandomlyGenerated = true;
    }

    // check and signal the form origin and its relation with form providers
    if (isset($this->custom['olmoforms'])) {
      if ($this->custom['olmoforms']['id'] === $id) {
        $this->origin = 'OLMOFORMS';
      } else {
        $this->isForwardedFromOlmoforms = true;
      }
    }
    if (isset($this->custom['origin'])) {
      $this->origin = $this->custom['origin'];
    }

    // process the form fields in a unified API
    $this->fields = $this->processFields($data['fields'] ?? []);

    // fluent interface
    return $this;
  }

  /**
   * Manage custom data given to constructor during form initialisation
   *
   * @return void
   */
  private function manageCustomData(array $data = [])
  {
    // exclude 'fields' as it treated seprately in the constrcutor,
    // also exclude meta olmoforms data as they are treated in a specific way
    // here below
    $blacklist = ['fields', 'olmoformsToken', 'olmoformsId', 'endpoint'];
    $keys = array_keys($data);

    // if there is this key it means that the form data is forwarded from
    // an API (either CMS or AUTH o whatever) to the frontend, hence we
    // generate the standard `olmoforms` object on this class instance.
    // In this way we will be able to debug the form also in its olmoforms
    // hidden/relayed origin.
    if (in_array('olmoformsId', $keys)) {
      if (isset($data['olmoformsId'])) {
        $this->custom['olmoforms'] = Olmoforms::getFormApiMeta(
          $data['olmoformsId']
        );
      }
    }

    foreach ($data as $key => $value) {
      if (!in_array($key, $blacklist)) {
        $this->custom[$key] = $value;
      }
    }
  }

  /**
   * JSON return method, it also put the data on cache for later static use
   * and debugging
   *
   * @return array
   */
  public function json()
  {
    $json = [];
    foreach ($this->custom as $key => $value) {
      $json[$key] = $value;
    }
    $json['id'] = $this->id;
    $json['fields'] = $this->fields;

    $cacheKey = Helpers::getCacheKey("forms.$this->id", true);

    if (!$this->isRandomlyGenerated && !Cache::has($cacheKey)) {
      Cache::tags([CacherTags::data, CacherTags::forms])->put($cacheKey, $json);
    }

    return $json;
  }

  /**
   * Get forms cached data, mostly useful for debugging purposes
   *
   * @param string $formId
   * @return array|false
   */
  public static function getCachedData(string $formId)
  {
    $cacheKey = Helpers::getCacheKey("forms.$formId", true);

    if (Cache::has($cacheKey)) {
      return Cache::get($cacheKey);
    }

    return false;
  }

  /**
   * Add input to form fields
   *
   * @param string $name
   * @param string $type
   * @param boolean $required
   * @return LaravelFrontend\Forms\Form
   */
  public function addInput(string $name, string $type, bool $required)
  {
    $field = $this->createFieldInput($name, $type, $required);
    $this->fields[] = $field;
    return $this;
  }
  /**
   * Add input to form fields
   *
   * @param string $name
   * @return LaravelFrontend\Forms\Form
   */

  public function addSubmit(string $name = 'submit')
  {
    $field = $this->createFieldInput($name, 'submit', false);
    $this->fields[] = $field;
    return $this;
  }

  /**
   * Create olmoforms like field: Input
   *
   * @param string $name
   * @param string $typology
   * @param boolean $required
   * @return array
   */
  protected function createFieldInput(
    string $name,
    $typology,
    $required = false
  ) {
    return $this->processField([
      'name' => $name,
      'element' => 'Input',
      'typology' => $typology,
      'required' => $required,
      'attribute' => '',
      'class' => '',
    ]);
  }

  /**
   * Process form fields
   *
   * @param array $fields
   * @return array
   */
  protected function processFields(array $fields = []): array
  {
    $processed = [];
    foreach ($fields as $field) {
      $processed[] = $this->processField($field);
    }

    return $processed;
  }

  /**
   * Process a single form field
   *
   * For now we just do some localisation, we can do all sort of things though
   *
   * @param array $field
   * @return array
   */
  protected function processField(array $field): array
  {
    // localise field's label
    $field['label'] = $this->getLocalisedProp($field, 'label');
    // localise field's placeholder
    $field['placeholder'] = $this->getLocalisedProp($field, 'placeholder');

    // localise field's option keys/labels
    if (!empty($field['option'])) {
      $i = 0;
      foreach ($field['option'] as $option) {
        $option['key'] = $this->getLocalisedOptionKey($field, $option);
        $field['option'][$i] = $option;
        $i++;
      }
    }

    // ensure the existence of some required field properties:
    $field['class'] = $field['class'] ?? '';
    $field['attribute'] = $field['attribute'] ?? '';

    return $field;
  }

  /**
   * Get possible csv keys for given field, sorted by priority
   *
   * @param array $field
   * @param string $property
   * @param bool $excludeLabelCase This is true during debugging to discourage its usage
   * @return array An array of possibly existing keys to override localisation through static translation files
   */
  private function getPossibleCsvKeys(
    array $field,
    string $property,
    bool $excludeLabelCase = false
  ) {
    $name = $field['name'];

    $output = [
      $this->id . '.' . $name . '.' . $property,
      'form.' . $this->id . '.' . $name . '.' . $property,
      'form.globals.' . $name . '.' . $property,
      'form.' . $name . '.' . $property,
    ];

    // this is a special condition for Inside2021, we should just rely on
    // the field['name']
    if (!$excludeLabelCase) {
      if ($property === 'label' && isset($field['label'])) {
        array_unshift($output, 'form.' . $field['label'] . '.label');
      }
    }

    return $output;
  }

  /**
   * Get localised field property
   *
   * @param array $field
   * @param string $property
   * @return string
   */
  private function getLocalisedProp(array $field, string $property)
  {
    $possibleCsvKeys = $this->getPossibleCsvKeys($field, $property);

    // first check in the static translations
    foreach ($possibleCsvKeys as $key) {
      if (isset($this->csv[$key])) {
        return $this->csv[$key];
      }
    }

    // otherwise check the field property
    if (isset($field[$property])) {
      return $field[$property];
    }

    return '';
  }

  /**
   * Get localised option key/lavel
   *
   * @param array $field
   * @param array $option
   * @return string
   */
  private function getLocalisedOptionKey(array $field, array $option)
  {
    $value = Str::snake($option['key']);
    $possibleCsvKeys = $this->getPossibleCsvKeys($field, 'option.' . $value);

    // first check in the static translations
    foreach ($possibleCsvKeys as $key) {
      if (isset($this->csv[$key])) {
        return $this->csv[$key];
      }
    }

    // otherwise check the field properties
    if (isset($option['key'])) {
      return $option['key'];
    }
    if (isset($option['label'])) {
      return $option['label'];
    }

    return '';
  }

  /**
   * Get eligible strings that can be used in the csv to translate the fields
   * localisable properties, used for form debugging
   *
   * @return array
   */
  public function getStringsCandidates()
  {
    $output = [];
    foreach ($this->fields as $field) {
      $output[$field['name']] = [
        'label' => $this->getPossibleCsvKeys($field, 'label', true),
        'placeholder' => $this->getPossibleCsvKeys($field, 'placeholder'),
      ];

      if (!empty($field['option'])) {
        $output[$field['name']]['option'] = [];
        foreach ($field['option'] as $option) {
          $value = $option['value'];
          $output[$field['name']]['option'][$value] = $this->getPossibleCsvKeys(
            $field,
            'option.' . $value
          );
        }
      }
    }

    return $output;
  }

  /**
   * Prefill form data with given array
   *
   * @param array $form
   * @param array $values
   * @return array
   */
  public static function prefill(array $form = [], array $values = [])
  {
    $i = 0;
    foreach ($form['fields'] as $field) {
      $key = $field['name'];

      if (isset($values[$key])) {
        $form['fields'][$i]['value'] = $values[$key];
      }
      $i++;
    }

    return $form;
  }
}
