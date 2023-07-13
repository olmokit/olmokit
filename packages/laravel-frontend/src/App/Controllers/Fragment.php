<?php

namespace LaravelFrontend\App\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use stdClass;

class Fragment extends Controller
{
  /**
   * Dynamically create view file wrapping a component in a "fragmented"
   * component, that allows to use the usual component Controller to kick in,
   * otherwise the view returned here would be an anonymous component that
   * would skip the Controller instantiation, therefore not allowing the
   * component to retrieve the data it might needs.
   *
   * @param string $view
   * @param array $data
   * @return string
   */
  protected function getWrappedView(string $view = '', array $data = [])
  {
    // TODO: check that it works and consider other solutions
    if (str_starts_with($view, 'components.')) {
      $name = str_replace('components.', '', $view);
      $content = '<x-' . $name . ' />';
      $viewName = 'fragment-' . $name;
      $viewPath = resource_path('components/' . $viewName . '.blade.php');

      // write the wrapping view file if it does not exists yet
      if (!file_exists($viewPath)) {
        file_put_contents($viewPath, $content);
      }

      if (count($data) > 1) {
        return view($view, $data)->render();
      }
      return view('components.' . $viewName)->render();
    }

    return view($view, $data)->render();
  }

  /**
   * Replace a single fragment with the desired view
   *
   * @return void
   */
  public function _replace(Request $request)
  {
    $id = $request->query('id');
    $view = $request->query('view');
    $responseData = $request->except(['id', 'view']);
    $responseData['fragmentId'] = $id;

    return $this->getWrappedView($view, $responseData);
  }

  /**
   * Replace many fragments with the desired view for each fragment id
   *
   * @return void
   */
  public function _replaceMany(Request $request)
  {
    $all = $request->all();
    $responseData = new stdClass();

    foreach ($all as $id => $view) {
      $responseData->{$id} = $this->getWrappedView($view);
    }

    return response()->json($responseData);
  }
}
