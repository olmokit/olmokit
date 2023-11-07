<?php

namespace LaravelFrontend\Helpers;

class Address implements \ArrayAccess
{
    private $_id;
    private $_type;
    private $_isDefaultShipping;
    private $_isDefaultBilling;

    private $container = [];

    const ADDRESS_TYPES = ['billing', 'shipping'];

    /**
     * Create a new Address instance
     *
     * @param array $data
     *
     * @return LaravelFrontend\Helpers\Address
     */
    public function __construct(array $data = [], array $config = [])
    {
        $this->_id = $data['id'] ?? null;
        $this->_type = $data['_type'][0] ?? self::ADDRESS_TYPES[1];
        $this->_isDefaultShipping = in_array(
            self::ADDRESS_TYPES[0],
            $data['_default']
        );
        $this->_isDefaultBilling = in_array(
            self::ADDRESS_TYPES[1],
            $data['_default']
        );

        foreach ($data as $key => $value) {
            $this->container[$key] = $value;
        }

        $this->container['id'] = $this->_id;
        $this->container['type'] = $this->_type;
        $this->container['isDefaultShipping'] = $this->_isDefaultShipping;
        $this->container['isDefaultBilling'] = $this->_isDefaultBilling;
    }

    /**
     * Return all address data from container
     *
     * This is needed because `json_encode` does not work despite the `ArrayAccess`
     * interface
     *
     * @return void
     */
    public function json()
    {
        $json = [];
        foreach ($this->container as $key => $value) {
            $json[$key] = $value;
        }
        return $json;
    }

    /**
     * Is default address of given type?
     *
     * @param string $type
     * @return bool
     */
    public function isDefault(string $type = '')
    {
        if ($type == self::ADDRESS_TYPES[0]) {
            return $this->_isDefaultShipping;
        }
        if ($type == self::ADDRESS_TYPES[1]) {
            return $this->_isDefaultBilling;
        }
        return false;
    }

    /**
     * Get address attributes to print on DOM element
     *
     * @return string
     */
    public function attrs()
    {
        $data = [
            'id' => $this->_id,
            'type' => $this->_type,
        ];

        return ' data-address-id="' .
            $this->_id .
            '"' .
            ' data-address="' .
            htmlspecialchars(json_encode($data)) .
            '"';
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
