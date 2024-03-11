<?php

namespace LaravelFrontend\Helpers;

use LaravelFrontend\Cms\CmsApi;

// use Illuminate\Support\Facades\App;

class Item implements \ArrayAccess
{
    private $_id;

    private $_cartitemid;

    private $_type;

    private $_quantity;

    private $_properties;

    private $_propertiesValues;

    private $_params;

    private $_readonlyProperties;

    private $container = [];

    /**
     * Create a new Item instance
     *
     * @param array $data
     * @param array $config
     * @property bool $config['readonlyProperties'] If true the `properties`
     * value will be  pre-populated, implying that the properties on the `$data`
     * passed to the item constructor were a list of *selected* properties and
     * not just of *available* properties.
     *
     * @return LaravelFrontend\Helpers\Item
     */
    public function __construct(array $data = [], array $config = [])
    {
        $this->_readonlyProperties = $config['readonlyProperties'] ?? false;

        $this->_data = $data;
        $this->_id = $data['id'] ?? null;
        $this->_cartitemid = $data['cartitemid'] ?? null;
        $this->_type = $data['type'] ?? 'product';
        $this->_quantity = $data['quantity'] ?? null;
        $this->deriveFromProperties(
            $data['properties'] ?? ($data['version']['property'] ?? [])
        );

        $data['id'] = $this->_id;
        $data['type'] = $this->_type;
        $data['quantity'] = $this->_quantity;
        $data['properties'] = $this->_properties;
        $data['params'] = $this->_params;

        if (is_null($this->_cartitemid)) {
            unset($data['cartitemid']);
        }

        $this->container = $data;
    }

    /**
     * Get item attributes to print on DOM element
     *
     * @return string
     */
    public function attrs()
    {
        $data = [
            'id' => $this->_id,
            'type' => $this->_type,
            'quantity' => $this->_quantity,
            'properties' => $this->_propertiesValues,
            'params' => $this->_params,
            'readonlyProperties' => $this->_readonlyProperties,
        ];

        if (!is_null($this->_cartitemid)) {
            $data['cartitemid'] = $this->_cartitemid;
        }

        return ' data-item-id="' .
            $this->_id .
            '"' .
            ' data-item="' .
            htmlspecialchars(json_encode($data)) .
            '"';
    }

    /**
     * Get the properties list name
     *
     * It throws an error for missing property name during development
     *
     * @return array
     */
    public function getPropertiesName()
    {
        $properties = $this->_properties;
        $array = [];
        foreach($properties as $prop){
            array_push($array, $prop['name']);
        }

        return $array;
    }

    /**
     * Get the properties list
     *
     *
     * @return array
     */
    public function getProperties()
    {
        $data = $this->_data;
        $array = [];        
        foreach($data['items'] as $prop){
            foreach($prop['property'] as $p){
                if(!in_array($p, $array)){
                    array_push($array, $p);
                }
            }
        }
        return $array;
    }

    /**
     * Get the properties id list
     *
     *
     * @return array
     */
    public function getPropertiesIdValue()
    {
        $array = [];
        foreach($this->_properties as $prop){
            foreach($prop['property'] as $p){
                array_push($array, $p['id']);
            }
        }
        return $array;
    }

    /**
     * Get the Items
     *
     *
     * @return array
     */
    public function getItems()
    {
        $data = $this->_data;
        $items = $data['items'];
        return $items;
    }

    /**
     * Get the properties list name
     *
     * It throws an error for missing property name during development
     *
     * @return string
     */
    public function getPivot()
    {
        $properties = $this->_properties;
        $pivot = '';
        foreach($properties as $prop){
            if($prop['pivot'] == 'true'){
                $pivot = $prop['name'];
            }
        }

        return $pivot;
    }

    /**
     * Get the properties list name
     *
     * It throws an error for missing property name during development
     *
     * @return string
     */    
    public function getImageChange()
    {
        $properties = $this->_properties;
        $changeimage = '';
        foreach($properties as $prop){
            if($prop['changeimage'] == 'true'){
                $changeimage = $prop['name'];
            }
        }

        return $changeimage;
    }

    /**
     * Get property by name
     *
     * It throws an error for missing property name during development
     *
     * @param string $name
     * @return array
     */
    public function getProperty(string $name)
    {
        $apiMeta = CmsApi::getMeta();

        if ($apiMeta['name'] !== 'olmo') {
            foreach ($this->_properties as $property) {
                if ($property['name'] === $name) {
                    return $property;
                }
            }
        } else {
            foreach ($this->_properties as $propertyIn) {
                if ($propertyIn['name'] === $name) {
                    return $propertyIn;
                }
            }
        }

        return [];
    }

    /**
     * Get property by name for the current product
     *
     * @param number $id
     * @param string $name
     * @return array
     */
    public function getPropertyCurrentProd($id, $name, $pivot = false)
    {
        $data = $this->_data;
        $propertiesItemIds = [];
        $propertiesitem = [];
        $property = [];

        if ($pivot) {
            /**
             * Get the pivot value
             */
            $pivotValues = '';
            foreach ($data['items'] as $item) {
                if ($item['id'] == $id) {
                    foreach ($item['property'] as $property) {
                        if ($property['parent']['name'] == $pivot) {
                            $pivotValues = $property['name'];
                        }
                    }
                }
            }

            /**
             * Get property value that cointains pivot
             */
            $propertyValueCurrent = [];
            foreach ($data['items'] as $item) {
                foreach ($item['property'] as $property) {
                    if ($pivotValues == $property['name']) {
                        foreach ($item['property'] as $property) {
                            array_push($propertyValueCurrent, $property);
                        }
                    }
                }
            }

            /**
             * Remove property not equal to name
             */
            foreach ($propertyValueCurrent as $key => $value) {
                if ($value['parent']['name'] == $name) {
                    array_push($propertiesItemIds, $value['id']);
                }
            }
            // dd($propertiesItemIds);
        } else {
            /**
             * Get every property with parent name as $name in the current product version
             */
            foreach ($data['items'] as $item) {
                if ($item['id'] == $id) {
                    foreach ($item['property'] as $property) {
                        if ($property['parent']['name'] == $name) {
                            array_push($propertiesItemIds, $property['id']);
                        }
                    }
                }
            }
        }

        foreach ($this->_properties as $propertyIn) {
            if ($propertyIn['name'] == $name) {
                // $propertyIn['property'] = [];
                $property = $propertyIn;
                foreach ($propertyIn['property'] as $prop) {
                    if (in_array($prop['id'], $propertiesItemIds)) {
                        array_push($propertiesitem, $prop);
                    }
                }
            }
        }

        $property['property'] = $propertiesitem;

        // dd($property);

        return $property;
    }

    /**
     * Programmatically create quantity item property
     *
     * @param string $name
     * @param array $config
     * @param integer $max
     * @return array
     */
    public function createPropertyQuantity(
        string $name = 'quantity',
        array $config = []
    ) {
        $id = $config['id'] ?? uniqid();
        $required = $config['required'] ?? true;
        $options = [];
        $min = $config['min'] ?? 1;
        $max = $config['max'] ?? 5;

        for ($i = $min; $i <= $max; $i++) {
            $options[] = [
                'label' => $i,
                'value' => $i,
                'attrs' => 'data-' . $name . '="' . $i . '"',
            ];
        }

        return [
            'id' => $id,
            'name' => $name,
            'required' => $required,
            'options' => $options,
            'attrs' => 'data-item-quantity',
        ];
    }

    /**
     * Process item properties adding data to use in templates and that will
     * be exploited by JavaScript `Item` abstraction
     *
     * Regarding `$properties`:
     *
     * We transforms an item properties into a select ready options array
     *
     * Regarding `$propertiesValues`:
     *
     * Get properties selected values as a JSON flat array, this is meant to use
     * to get a sort of readonly value from an item that has already been
     * either wishlisted or in-cart and whose data come from their "complete"
     * `/get` (or list) endpoints
     * We just set an empty array here as the API does not consistently
     * provide on an item['properties'] data a flag for each property whether it
     * has been selected or not. That is because we wrap with this class data
     * that comes from different kind of endpoints, for instance both on the
     * wishlist and cart list endpoints where this info would actually be
     * available. On the contrary that is not available on a product page or on
     * a product list page where the item['properties'] are just a list of the
     * available properties not of the selected ones. Anyway, this value set
     * on the DOM element will always be hydrated from JavaScript.
     *
     * @param array $rawProperties Properties data from server
     * @return array
     */
    private function deriveFromProperties(array $rawProperties)
    {
        $properties = [];
        $propertiesValues = [];
        $params = [];

        $apiMeta = CmsApi::getMeta();

        if ($apiMeta['name'] !== 'olmo') {
            foreach ($rawProperties as $property) {
                // in 'editable' mode we need more data to build the interface
                if (!$this->_readonlyProperties) {
                    $property['attrs'] =
                        'data-item-property="' . $property['id'] . '"';
                    $property['options'] = [];
                }

                foreach ($property['items'] ?? [] as $item) {
                    // in 'readonly' mode create a simple array to use in templates
                    if ($this->_readonlyProperties) {
                        $property = [
                            'name' => $property['name'],
                            'value' => $item['code'],
                        ];

                        if (isset($item['id'])) {
                            $propertiesValues[] = $item['id'];
                        }

                        // in 'editable' mode add data for input elements
                    } else {
                        $item['label'] = $item['name'];
                        $item['value'] = $item['id'];
                        $item['attrs'] = 'data-code="' . $item['code'] . '"';
                        $property['options'][] = $item;
                    }

                    // always populate the params
                    $params[$property['name']] = $item['id'];
                }

                $properties[] = $property;
            }

            $this->_params = $params;
            $this->_properties = $properties;
            $this->_propertiesValues = $propertiesValues;
        } else {
            $prop = null;
            $options = [];
            $propertiesIds = [];
            $propertiesValuesCurrentIds = [];
            // $property = [];
            // dd($rawProperties);

            foreach ($rawProperties as $property) {
                array_push($propertiesValuesCurrentIds, $property['id']);

                if (!in_array($property['parent']['id'], $propertiesIds)) {
                    array_push($propertiesIds, $property['parent']['id']);
                    array_push($properties, $property['parent']);
                }

                // in 'editable' mode we need more data to build the interface
                if (!$this->_readonlyProperties) {
                    $property['attrs'] =
                        'data-item-property="' .
                        $property['parent']['id'] .
                        '"';
                    $property['options'] = [];
                }

                // in 'readonly' mode create a simple array to use in templates
                if ($this->_readonlyProperties) {
                    $prop = [
                        'name' => $property['parent']['name'],
                        'value' => $property['id'],
                    ];

                    $propertiesValues[] = $property['id'];

                    // in 'editable' mode add data for input elements
                } else {
                    // $item = [];
                    // $item['label'] = $property['parent']['name'];
                    // $item['value'] = $property['id'];
                    // $item['color'] = isset($property['color']) ? $property['color'] : '';
                    // $item['attrs'] = 'data-code="' . $property['id'] . '"';
                    // array_push($options, $item);
                }

                // $property['options'] = $options;
                // always populate the params
                $params[$property['parent']['name']] = $property['id'];
                // if($prop){
                //     $properties[] = $prop;
                // }
            }

            foreach ($properties as $key => $singleProp) {
                $ids = explode(',', $singleProp['property']);
                $properties[$key]['property'] = [];
                $properties[$key]['optional'] =
                    $singleProp['optional'] == 'false' ? 'true' : 'false';
                $properties[$key]['attrs'] =
                    'data-item-property="' . $singleProp['id'] . '"';
                foreach ($rawProperties as $property) {
                    if (in_array($property['id'], $ids)) {
                        unset($property['parent']);
                        $property['value'] = $property['id'];
                        $property['key'] = $property['code'];
                        $property['attrs'] =
                            'data-code="' . $property['id'] . '"';
                        array_push($properties[$key]['property'], $property);
                    }
                }
            }
            // "attrs" => "data-item-property="1""
            // if(!$prop){
            //     $properties = $property;
            // }

            // dd($properties);

            $this->_params = $params;
            $this->_properties = $properties;
            $this->_propertiesValues = $propertiesValues;
        }
    }

    /**
     * Array access implementation
     *
     * @param string|number $offset
     * @param mixed $value
     */
    public function offsetSet($offset, $value): void
    {
        if (is_null($offset)) {
            $this->container[] = $value;
        } else {
            $this->container[$offset] = $value;
        }
    }

    /**
     * Array access implementation
     *
     * @param string|number $offset
     */
    public function offsetExists($offset): bool
    {
        return isset($this->container[$offset]);
    }

    /**
     * Array access implementation
     *
     * @param string|number $offset
     */
    public function offsetUnset($offset): void
    {
        unset($this->container[$offset]);
    }

    /**
     * Array access implementation
     *
     * @param string|number $offset
     */
    public function offsetGet($offset): mixed
    {
        return isset($this->container[$offset])
            ? $this->container[$offset]
            : null;
    }
}
