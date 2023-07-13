<?php

namespace LaravelFrontend\Helpers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Redirect;

class EndpointController
{
  protected $namespace = '';
  protected $temporaryFields = ['_redirect'];

  /**
   * Flash to session, each subclass should implement it
   *
   * @param string $type
   * @param string $msg
   * @return void
   */
  protected function flash(
    string $msgRaw = '',
    string $msgAction = '',
    string $msgStatus = ''
  ) {
    // dd($this->namespace, $msgRaw, $msgAction, $msgStatus);
    if ($msgRaw || $msgAction || $msgStatus) {
      $msgKey = implode('.', [$msgAction, $msgStatus]);
      Helpers::flashStatus($this->namespace, $msgRaw, $msgKey);
    }
  }

  /**
   * Response to return, coeherently manages response in their double shape,
   * either an ajax ready response or a normal redirect response
   *
   * @param Request $request
   * @param string $type
   * @param string $redirect
   * @param array|null $data
   * @param integer $code
   * @param string $msgAction
   * @param string $msgStatus
   * @param string $msgRaw
   * @param boolean $ajax
   * @return Redirect|JsonResponse
   */
  protected function res(
    Request $request,
    string $redirect = '',
    int $code = 500,
    $data = [],
    string $msgRaw = '',
    string $msgAction = '',
    string $msgStatus = '',
    bool $ajax = false
  ) {
    $msg = '';
    if ($msgRaw) {
      $msg = $msgRaw;
    } elseif ($msgAction && $msgStatus) {
      $msg = t($this->namespace . '.' . $msgAction . '.' . $msgStatus);
    } elseif ($msgAction || $msgStatus) {
      $msg = t($this->namespace . '.' . $msgAction || $msgStatus);
    }

    if ($ajax) {
      /**
       * This is a change
       */
      if ($code >= 200 && $code < 300) {
        $data['redirect'] = formatUrl($redirect);
      }
      $data['msg'] = $msg;
      return response()->json($data, $code);
    }

    $this->flash($msgRaw, $msgAction, $msgStatus);

    return redirect(formatUrl($redirect), 302)->withInput(
      request()->except($this->temporaryFields)
    );
  }

  /**
   * Get redirect url
   *
   * @param Request $request
   * @return string
   */
  protected function getRedirect(
    Request $request,
    bool $success = true,
    string $fallbackUrl = ''
  ) {
    // in case of bad response we always return where we were
    if (!$success) {
      $redirect = url()->previous();
      $redirect = $this->addRedirectParam($request, $redirect);
      return $redirect;
    }

    // in case of successful response:
    // first grab redirect from URL
    $redirect = $request->query('redirect');

    // otherwise look for it in the request data
    if (!$redirect) {
      $redirect = $request->input('_redirect');
    }

    // if no explicit redirect is set try to use the fallback url
    if (!$redirect && $fallbackUrl) {
      $redirect = $fallbackUrl;
    }

    // or just grab the last url from where the form has submitted
    if (!$redirect) {
      $redirect = url()->previous();
    }

    return $redirect;
  }

  /**
   * Check if the current request has an explicitly defined redirect URL,
   * either from query params or from form input
   *
   * @param Request $request
   * @return boolean
   */
  protected function hasExplicitRedirect(Request $request): bool
  {
    if ($request->query('redirect') || $request->input('_redirect')) {
      return true;
    }
    return false;
  }

  /**
   * Add redirect param
   *
   * @param Request $request
   * @param string $redirect
   * @return void
   */
  protected function addRedirectParam(
    Request $request,
    string $redirect
  ): string {
    $redirectAfter = $request->input('_redirect');
    if ($redirectAfter) {
      $redirect .= parse_url($redirect, PHP_URL_QUERY) ? '&' : '?';
      $redirect .= 'redirect=' . $redirectAfter;
    }
    return $redirect;
  }
}

?>
