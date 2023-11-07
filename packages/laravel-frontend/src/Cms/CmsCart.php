<?php

namespace LaravelFrontend\Cms;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use LaravelFrontend\Cms\CmsApi;
use LaravelFrontend\Auth\AuthApi;
use LaravelFrontend\Helpers\HttpLike;

class CmsCart
{
    const SESSION_CART = 'cart';
    const SESSION_CART_LEAN = 'cart-lean';

    /**
     * Get "complete" cart data
     *
     * @param boolean $fresh Whether to skip data in session and refetch from API
     * @return \Illuminate\Http\Client\Response
     */
    public static function get(bool $fresh = false)
    {
        /**
         * This is a change
         */
        // if (!$fresh && Session::has(self::SESSION_CART)) {
        //     return new HttpLike(Session::get(self::SESSION_CART));
        // }

        $response = CmsApi::getWithAuth('[guest]{locale}/shoppingcart');
        return self::storeSession($response, 'complete');
    }

    /**
     * Get "lean" cart data
     *
     * @param boolean $fresh Whether to skip data in session and refetch from API
     * @return \Illuminate\Http\Client\Response
     */
    public static function getLean(bool $fresh = false)
    {
        // if (!$fresh && Session::has(self::SESSION_CART_LEAN)) {
        //     return new HttpLike(Session::get(self::SESSION_CART_LEAN));
        // }

        /**
         * This is a change
         */
        $apiMeta = CmsApi::getMeta();
        if ($apiMeta['name'] !== 'olmo') {
            $response = CmsApi::getWithAuth('[guest]/shoppingcart');
        } else {
            $response = CmsApi::getWithAuth('[guest]lean/shoppingcart');
        }
        return self::storeSession($response, 'lean');
    }
    /**
     * Add to cart
     *
     * @param string|number $id
     * @param string [$type='product]
     * @param array $properties It can be empty depending on the specific item
     * @return \Illuminate\Http\Client\Response
     */
    public static function add(
        $id,
        $type = 'product',
        array $properties = [],
        $quantity = 1
    ) {
        if (!$id) {
            throw new Error("CmsCart::add called without argument 'id'");
        }

        if (!AuthApi::check()) {
            AuthApi::startGuestSession();
        }

        $response = CmsApi::postWithAuth('[guest]{locale}/shoppingcart', [
            'id' => $id,
            'type' => $type,
            'properties' => $properties,
            'quantity' => (int) $quantity,
        ]);

        return self::storeSession($response, 'complete');
    }

    /**
     * Add to cart
     *
     * NB: the CMS API supports sending a quantity but we do not, as there is no
     * meaningful scenario where a user deletes just a partial quantity of the
     * same item, for that scenario there is instead the `quantity` endpoint
     *
     * @param string|number $cartitemid
     * @param number|null [$quantity] If null the API deletes the all cart item,
     *                                if a number it just subtracts the specified
     *                                quantity.
     * @param array $properties It can be empty depending on the specific item
     * @return \Illuminate\Http\Client\Response
     */
    public static function remove($cartitemid, $quantity)
    {
        if (!$cartitemid) {
            throw new Error(
                "CmsCart::delete called without argument 'cartitemid'"
            );
        }

        $data = ['cartitemid' => $cartitemid];

        $response = CmsApi::deleteWithAuth(
            '[guest]{locale}/shoppingcart',
            $data
        );

        return self::storeSession($response, 'complete');
    }

    /**
     * Set quantity
     *
     * Changes the quantity of an item already in the cart
     *
     * @param string|number $cartitemid
     * @param number $quantity
     * @return \Illuminate\Http\Client\Response
     */
    public static function setQuantity($cartitemid, $quantity, $properties)
    {
        if (!$cartitemid) {
            throw new Error(
                "CmsCart::delete called without argument 'cartitemid'"
            );
        }

        $data = [
            'cartitemid' => $cartitemid,
            'quantity' => (int) $quantity,
            'properties' => $properties,
        ];

        $response = CmsApi::postWithAuth(
            '[guest]{locale}/shoppingcart/quantity',
            $data
        );

        return self::storeSession($response, 'complete');
    }

    /**
     * Apply discount
     *
     * @return \Illuminate\Http\Client\Response
     */
    public static function applyDiscount(string $code = '')
    {
        $data = ['code' => $code];

        $response = CmsApi::postWithAuth(
            '[guest]{locale}/shoppingcart/discount',
            $data
        );

        return self::storeSession($response, 'complete');
    }

    /**
     * Remove discount
     *
     * Whatever discount was last applied
     *
     * @return \Illuminate\Http\Client\Response
     */
    public static function removeDiscount()
    {
        $response = CmsApi::deleteWithAuth(
            '[guest]{locale}/shoppingcart/discount'
        );

        return self::storeSession($response, 'complete');
    }

    /**
     * Set shipping method
     *
     * @return \Illuminate\Http\Client\Response
     */
    public static function setShippingMethod(string $code = '')
    {
        $data = ['code' => $code];

        $response = CmsApi::postWithAuth(
            '[guest]{locale}/shoppingcart/shippingmethod',
            $data
        );

        return self::storeSession($response, 'complete');
    }

    /**
     * Remove shipping method
     *
     * @return \Illuminate\Http\Client\Response
     */
    public static function removeShippingMethod()
    {
        $response = CmsApi::deleteWithAuth(
            '[guest]{locale}/shoppingcart/shippingmethod'
        );

        return self::storeSession($response, 'complete');
    }

    /**
     * Set addresses
     *
     * @param string|number $billingId
     * @param string|number $shippingId
     * @return \Illuminate\Http\Client\Response
     */
    public static function setAddresses($billingId, $shippingId)
    {
        $data = ['billing' => $billingId, 'shipping' => $shippingId];

        $response = CmsApi::postWithAuth(
            '[guest]{locale}/shoppingcart/addresses',
            $data
        );

        return self::storeSession($response, 'complete');
    }

    /**
     * Set payment method
     *
     * @return \Illuminate\Http\Client\Response
     */
    public static function setPaymentMethod(array $form = [])
    {
        /**
         * This is a change
         * The key 'meta' will contain extra information abount the payment method
         */

        $meta = [];
        foreach ($form as $key => $value) {
            if (strpos($key, 'meta-') !== false) {
                $meta[$key] = $value;
            }
        }

        $data = ['code' => $form['paymentmethod']];

        if (!empty($meta)) {
            $data['meta'] = $meta;
        }

        $response = CmsApi::postWithAuth(
            '[guest]{locale}/shoppingcart/paymentmethod',
            $data
        );

        return self::storeSession($response, 'complete');
    }

    /**
     * On login
     *
     * First check that we have a cart session, this is needed as a website
     * might not have a cart feature at all.
     * Then we call `get` as that (or `getLean`) call the API endpoints where
     * the backend operates the migration from the "cart as a guest" to the "cart
     * as a user".
     *
     * @return void
     */
    public static function onLogin()
    {
        if (
            Session::has(self::SESSION_CART) ||
            Session::has(self::SESSION_CART_LEAN)
        ) {
            self::clearSession();
            self::get(true);
            AuthApi::clearGuestSession();
        }
    }

    /**
     * On logout
     *
     * @return void
     */
    public static function onLogout()
    {
        AuthApi::clearGuestSession();
    }

    /**
     * Clear cart session data
     *
     * @return void
     */
    public static function clearSession()
    {
        Session::forget(self::SESSION_CART);
        Session::forget(self::SESSION_CART_LEAN);
    }

    /**
     * Store cart session data and return the given `$response`
     *
     * @param \Illuminate\Http\Client\Response $response
     * @param 'complete'|'lean' $type
     * @return \Illuminate\Http\Client\Response
     */
    public static function storeSession($response, string $type = 'complete')
    {
        if ($response->successful()) {
            if ($type === 'complete') {
                $data = $response->json();
                Session::put(self::SESSION_CART, $data);
                Session::put(
                    self::SESSION_CART_LEAN,
                    self::transformCompleteIntoLean($data)
                );
                Session::save();
            } elseif ($type === 'lean') {
                Session::put(self::SESSION_CART_LEAN, $response->json());
                Session::save();
            }
        }
        return $response;
    }

    /**
     * Transform get 'complete' response data into the same shape of `lean`
     * response.
     *
     * Refer here to typescript types in `@olmokit/core/cart/index.ts`
     *
     * @param array $data
     * @return $data
     */
    private static function transformCompleteIntoLean(array $data)
    {
        $items = [];

        foreach ($data['items'] ?? [] as $item) {
            $leanItem = [
                'id' => $item['id'],
                'cartitemid' => $item['cartitemid'],
                'type' => $item['type'],
                'properties' => [],
                'version' => $item['version'],
                'quantity' => $item['quantity'],
            ];

            foreach ($item['properties'] ?? [] as $property) {
                foreach ($property['items'] ?? [] as $propertyItem) {
                    $leanItem['properties'][] = $propertyItem['id'];
                }
            }
        }

        return [
            'items' => $items,
            'items_quantity' => $data['items_quantity'] ?? null,
        ];
    }
}
