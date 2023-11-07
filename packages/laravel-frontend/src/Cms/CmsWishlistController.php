<?php

namespace LaravelFrontend\Cms;

use LaravelFrontend\Cms\CmsWishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CmsWishlistController
{
    /**
     * Get wishlist items
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function get(Request $request)
    {
        $response = CmsWishlist::get();

        return response()->json($response->json(), $response->status());
    }

    /**
     * Add to wishlist
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $id = $request->input('id');
        $type = $request->input('type') ?? 'product';
        $properties = array_filter(
            explode(',', $request->input('properties', '')),
            'strlen'
        );

        $response = CmsWishlist::add($id, $type, $properties);

        return response()->json($response->json(), $response->status());
    }

    /**
     * Remove from wishlist
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function remove(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $id = $request->input('id');
        /**
         * This is a change
         */
        $type = $request->input('type') ?? 'product';
        /**
         * This is a change $type
         */
        $response = CmsWishlist::remove($id, $type);

        return response()->json($response->json(), $response->status());
    }
}
