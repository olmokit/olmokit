<?php

namespace LaravelFrontend\Helpers;

class HttpLike
{
    private $_json;

    /**
     * Create a new Address instance
     *
     * @param array $data
     *
     * @return LaravelFrontend\Helpers\Address
     */
    public function __construct($json)
    {
        $this->_json = $json;
    }

    /**
     * Return status code
     *
     * @return int
     */
    public function status()
    {
        return 200;
    }

    /**
     * Return json data
     *
     * @return int
     */
    public function json()
    {
        return $this->_json;
    }

    /**
     * Return successful code
     *
     * @return int
     */
    public function successful()
    {
        return true;
    }
}
