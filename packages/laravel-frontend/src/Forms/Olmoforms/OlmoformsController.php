<?php

namespace LaravelFrontend\Forms\Olmoforms;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class OlmoformsController
{
    public function send(Request $request)
    {
        $token = csrf_token();
        $user_token = $request->header('X-CSRF-TOKEN');

        if ($token == $user_token) {
            $apiurl = config('env.CMS_API_URL_FORM') ? config('env.CMS_API_URL_FORM') : config('env.CMS_API_URL');
            $token = config('env.OLMOFORMS_TOKEN');
            $id = $request->id;

            $url = $apiurl . '/_/form/send/' . $token . '/' . $id;

            $data = $request->all();
            $data['locale'] = App::getLocale();

            $response = Http::post($url, $data);

            return response($response, $response->getStatusCode());
        }

        return response(
            ['Error! You are no allowed to use this endpoint'],
            403
        );
    }

    public function uploadChunks(Request $request)
    {
        $apiurl = config('env.CMS_API_URL_FORM') ? config('env.CMS_API_URL_FORM') : config('env.CMS_API_URL');
        // $token = config('env.OLMOFORMS_TOKEN');

        $filename = $request->fileName;
        $data = [
            'file' => file_get_contents('php://input'),
            'fileName' => $filename,
        ];

        $url = $apiurl . '/_/form/uploadchunks';
        $response = Http::post($url, $data);

        return response($response, $response->getStatusCode());
    }

    public function uploadComplete(Request $request)
    {
        $apiurl = config('env.CMS_API_URL_FORM') ? config('env.CMS_API_URL_FORM') : config('env.CMS_API_URL');
        $token = config('env.OLMOFORMS_TOKEN');

        $data = [
            'public' => $request->public,
            'fileName' => $request->fileName,
            'trueName' => $request->trueName,
            'foldersName' => $request->foldersName,
        ];

        $url = $apiurl . '/_/form/uploadcomplete';
        $response = Http::post($url, $data);

        return response($response, $response->getStatusCode());
    }
}
