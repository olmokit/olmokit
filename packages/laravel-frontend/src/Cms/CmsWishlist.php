<?php

namespace LaravelFrontend\Cms;

use LaravelFrontend\Cms\CmsApi;

class CmsWishlist
{
  /**
   * List complete wishlist items
   *
   * @return \Illuminate\Http\Client\Response
   */
  public static function list()
  {
    return CmsApi::getWithAuth('{locale}/wishlist');
  }

  /**
   * Get the wishlist items
   *
   * @return \Illuminate\Http\Client\Response
   */
  public static function get()
  {
    return CmsApi::getWithAuth('wishlist');
  }

  /**
   * Add to the wishlist
   *
   * @param string|number $id
   * @param string [$type='product']
   * @param array [$properties]
   * @return \Illuminate\Http\Client\Response
   */
  public static function add($id, $type = 'product', $properties = [])
  {
    if (!$id) {
      throw new Error("CmsWishlist::add called without argument 'id'");
    }
    return CmsApi::postWithAuth('wishlist', [
      'id' => $id,
      'type' => $type,
      'properties' => $properties,
    ]);
  }

  /**
   * Remove from the wishlist
   *
   * @return \Illuminate\Http\Client\Response
   */
  /**
   * This is a change: $type = 'product'
   */
  public static function remove($id, $type = 'product')
  {
    if (!$id) {
      throw new Error("CmsWishlist::delete called without argument 'id'");
    }
    return CmsApi::deleteWithAuth('wishlist', [
      'id' => $id,
      /**
       * This is a change
       */
      'type' => $type,
    ]);
  }
}
