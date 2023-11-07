<?php

namespace LaravelFrontend\Cms;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use LaravelFrontend\Cms\CmsAddress;
use LaravelFrontend\Helpers\EndpointController;
use LaravelFrontend\Helpers\Helpers;

class CmsAddressController extends EndpointController
{
    protected $namespace = 'address';

    /**
     * Field names to don't retain across sessions
     *
     * @override
     * @var array
     */
    protected $temporaryFields = [];

    /**
     * List all user addresses
     */
    public function list(Request $request)
    {
        $response = CmsAddress::list();

        if (is_array($response)) {
            return response()->json($response, 200);
        }
        return response()->json($response->json(), $response->status());
    }

    /**
     * Add new address or edit existing one
     */
    public function addOrEdit(Request $request, $ajax = false)
    {
        $redirect = $this->getRedirect($request);
        $code = 200;
        $data = [];
        $raw = '';
        $action = 'add';
        $status = 'ok';

        $id = $request->input('id');
        $data = $request->all();

        if ($id) {
            $action = 'edit';
            $response = CmsAddress::edit($data);
        } else {
            if (isset($data['id'])) {
                unset($data['id']);
            }
            $response = CmsAddress::add($data);
        }

        $data = $response->json();
        $code = $response->status();

        if ($response->failed()) {
            $redirect = $this->getRedirect($request, false);
            $status = 'fail';
            $raw = $response->body();
        } else {
            $redirect = Helpers::stripParamsFromUrl($redirect, [
                // TODO: this could be rethought as it ties the implementation
                // to the abstraction here in the framework
                'dialog-address-edit',
                'dialog-address-billing-edit',
                'dialog-address-shipping-edit',
                'dialog-address-add',
                'dialog-address-billing-add',
                'dialog-address-shipping-add',
                'address',
                'redirect',
            ]);
        }

        return $this->res(
            $request,
            $redirect,
            $code,
            $data,
            $raw,
            $action,
            $status,
            $ajax
        );
    }

    /**
     * Remove address
     */
    public function remove(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(false, 400);
        }

        $id = $request->input('id');

        $response = CmsAddress::remove($id);

        return response()->json($response->json(), $response->status());
    }

    /**
     * Set address as default
     *
     * This is a JSON only endpoint, is not meant to be used with a <form>
     */
    public function setAsDefault(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            '_default' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(false, 400);
        }

        $id = $request->input('id');
        $_default = $request->input('_default');
        $response = CmsAddress::setAsDefault($id, $_default);

        return response()->json($response->json(), $response->status());
    }
}
