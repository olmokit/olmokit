<?php

namespace LaravelFrontend\Cms;

use LaravelFrontend\Cms\CmsApi;
use LaravelFrontend\Auth\AuthApi;
use LaravelFrontend\Forms\Form;
use LaravelFrontend\Cacher\CacherTags;
use LaravelFrontend\Helpers\Helpers;
use LaravelFrontend\Helpers\Address;

class CmsAddress
{
    const ADDRESS_TYPES = ['billing', 'shipping'];

    /**
     * Get form data from API
     *
     * @param 'billing'|'shipping' $type
     * @return array
     */
    public static function getForm(string $type)
    {
        if (!in_array($type, self::ADDRESS_TYPES)) {
            exit(
                "[CmsAddress]::getForm 'type' must be one of " .
                    implode(', ', self::ADDRESS_TYPES)
            );
        }

        $remoteData = CmsApi::getData(
            "forms/{locale}/address/$type",
            true,
            null,
            [CacherTags::data, CacherTags::forms]
        );
        $id = "address.$type.form";
        $data = [
            'action' => Helpers::getEndpointUrlInternal('/_/cms/address'),
            'type' => $type,
            'fields' => $remoteData['fields'] ?? [],
        ];
        $form = new Form($id, $data);

        $form->addSubmit();

        return $form->json();
    }

    /**
     * Get form billing data
     *
     * @return array
     */
    public static function getFormBilling()
    {
        return self::getForm(self::ADDRESS_TYPES[0]);
    }

    /**
     * Get form shipping data
     *
     * @return array
     */
    public static function getFormShipping()
    {
        return self::getForm(self::ADDRESS_TYPES[1]);
    }

    /**
     * List all current user addresses
     *
     * It checkes on the user session
     *
     * @param string $type
     * @param bool $async Force to skip user session and fetch the CmsApi
     * @return array
     */
    public static function list(string $type = '', bool $async = false)
    {
        if ($type && !in_array($type, self::ADDRESS_TYPES)) {
            exit(
                "[CmsAddress]::list 'type' must be one of " .
                    implode(', ', self::ADDRESS_TYPES)
            );
        }

        $output = [];
        $allAddresses = [];
        $user = AuthApi::user();

        if (!$async && isset($user['addresses'])) {
            $allAddresses = $user['addresses'];
        } else {
            $response = CmsApi::getWithAuth('address');
            if ($response->successful()) {
                $allAddresses = $response->json();
            }
        }

        // process addresses and maybe filter them out by type
        foreach ($allAddresses as $address) {
            // if (!$type || ($type && $address['type'] !== $type)) {
            if (!$type || ($type && in_array($type, $address['_type']))) {
                $output[] = new Address($address);
            }
        }

        return $output;
    }

    /**
     * List only 'billing' addresses
     *
     * By default it gets the addresses from the user session.
     *
     * @param bool $async Force to skip user session and fetch the CmsApi
     * @return array
     */
    public static function listBilling(bool $async = false)
    {
        return self::list(self::ADDRESS_TYPES[0], $async);
    }

    /**
     * List only 'shipping' addresses
     *
     * By default it gets the addresses from the user session.
     *
     * @param bool $async Force to skip user session and fetch the CmsApi
     * @return array
     */
    public static function listShipping(bool $async = false)
    {
        return self::list(self::ADDRESS_TYPES[1], $async);
    }

    /**
     * List addresses by "type"
     *
     * @param bool $async Force to skip user session and fetch the CmsApi
     * @return array
     */
    public static function listByType(bool $async = false)
    {
        return [
            self::ADDRESS_TYPES[0] => self::listBilling($async),
            self::ADDRESS_TYPES[1] => self::listShipping($async),
        ];
    }

    /**
     * Get address by id
     *
     * @param string|int $id The address `id`
     * @param bool $async Force to skip user session and fetch the CmsApi
     * @return LaravelFrontend\Helpers\Address|null
     */
    public static function getById($id, bool $async = false)
    {
        $addresses = self::list('', $async);
        foreach ($addresses as $address) {
            if ($address['id'] == $id) {
                return $address;
            }
        }

        return null;
    }

    /**
     * Get default shipping address
     *
     * @param bool $async Force to skip user session and fetch the CmsApi
     * @return LaravelFrontend\Helpers\Address|null
     */
    public static function getDefaultShipping($async = false)
    {
        $addresses = self::list('', $async);
        foreach ($addresses as $address) {
            if ($address['isDefaultShipping']) {
                return $address;
            }
        }

        return null;
    }

    /**
     * Get default shipping address id
     *
     * @param bool $async Force to skip user session and fetch the CmsApi
     * @return string|number|null
     */
    public static function getDefaultShippingId($async = false)
    {
        $address = self::getDefaultShipping();
        if ($address) {
            return $address['id'];
        }
        return null;
    }

    /**
     * Get default billing address
     *
     * @param bool $async Force to skip user session and fetch the CmsApi
     * @return LaravelFrontend\Helpers\Address|null
     */
    public static function getDefaultBilling($async = false)
    {
        $addresses = self::list('', $async);
        foreach ($addresses as $address) {
            if ($address['isDefaultBilling']) {
                return $address;
            }
        }

        return null;
    }

    /**
     * Get default billing address id
     *
     * @param bool $async Force to skip user session and fetch the CmsApi
     * @return string|number|null
     */
    public static function getDefaultBillingId($async = false)
    {
        $address = self::getDefaultBilling();
        if ($address) {
            return $address['id'];
        }
        return null;
    }

    /**
     * Add address
     *
     * @param array [$data]
     * @return \Illuminate\Http\Client\Response|void
     */
    public static function add(array $data = [])
    {
        $data = self::transformPostData($data);

        $response = CmsApi::postWithAuth('address', $data);

        return self::processResponse($response);
    }

    /**
     * Edit address
     *
     * @param array [$data]
     * @return \Illuminate\Http\Client\Response|array
     */
    public static function edit(array $data = [])
    {
        if (empty($data['id'])) {
            throw new \Error("[CmsAddress]::add called without argument 'id'");
        }
        $data = self::transformPostData($data);

        $response = CmsApi::patchWithAuth('address', $data);

        return self::processResponse($response);
    }

    /**
     * Remove address
     *
     * @param string $id
     * @return \Illuminate\Http\Client\Response|void
     */
    public static function remove($id)
    {
        if (!$id) {
            throw new \Error(
                "[CmsAddress]::delete called without argument 'id'"
            );
        }
        $response = CmsApi::deleteWithAuth('address', [
            'id' => $id,
        ]);

        return self::processResponse($response);
    }

    /**
     * Set address as default
     *
     * @param string $id
     * @param string $default
     * @return \Illuminate\Http\Client\Response|array
     */
    public static function setAsDefault($id, $default)
    {
        if (!$id) {
            throw new \Error(
                "[CmsAddress]::setAsDefault called without argument 'id'"
            );
        }
        if (!$default) {
            throw new \Error(
                "[CmsAddress]::setAsDefault called without argument 'default'"
            );
        }

        if (is_string($default)) {
            $_default = explode(',', $default);
        }

        foreach ($_default as $type) {
            if (!in_array($type, self::ADDRESS_TYPES)) {
                exit(
                    "[CmsAddress]::setAsDefault '_default' must be one or more of " .
                        implode(', ', self::ADDRESS_TYPES)
                );
            }
        }

        $response = CmsApi::postWithAuth('address/setdefault', [
            'id' => $id,
            '_default' => $_default,
        ]);

        return self::processResponse($response);
    }

    /**
     * All address methods return the update user object, we store that into
     * session
     *
     * @param [type] $response
     * @return void
     */
    private static function processResponse($response)
    {
        $data = $response->json();

        if (!empty($data) && isset($data['user'])) {
            AuthApi::updateUser($data['user']);
        }

        return $response;
    }

    /**
     * Transform post data
     *
     * Operates some standard transformations on the data posted by the frontend
     * to the backend API.
     *
     * @param array $data
     * @return array
     */
    private static function transformPostData(array $data = [])
    {
        // remove the laravel token, it does not need to be sent further
        unset($data['_token']);

        if (isset($data['_type'])) {
            if (is_string($data['_type'])) {
                $data['_type'] = explode(',', $data['_type']);
            }
        } else {
            // set a default in the remote case we somehow do not have it at
            // this point
            $data['_type'] = [self::ADDRESS_TYPES[1]];
        }

        // unset from post data the redirect
        unset($data['_redirect']);

        return $data;
    }
}
