<style>
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  th {
    padding: 20px;
    text-align: left;
  }

  td {
    padding: 5px 10px;
    border: 1px solid #999;
  }

  code {
    background: #eee;
  }

  tr>*:first-child {
    width: 100px;
    text-align: right;
  }
</style>

<h2>Form debug</h2>

<h3>Generic information</h3>
<ul>
  <li>ID: <code>{{ $form['id'] }}</code></li>
  <li>Action URL: <code>{{ $form['action'] }}</code></li>
  <li>This form data <b>is built by {{ $origin }}</b></li>
  @if ($isForwardedFromOlmoforms)
    <li>The form construction <b>is forwarded from Olmoforms</b></li>
  @endif
  @if ($isForwardedFromOlmoforms)
    <li>The form construction <b>is forwarded from Olmoforms</b></li>
  @endif
</ul>

@isset($form['olmoforms'])
  <h3>Olmoforms information</h3>
  <ul>
    <li>Form ID: <code>{{ $form['olmoforms']['id'] }}</code></li>
    <li>Form definition JSON endpoint: <a href="{{ $form['olmoforms']['url'] }}">{{ $form['olmoforms']['url'] }}</a></li>
    <li>Submit action url: <a href="{{ $form['olmoforms']['url'] }}">{{ $form['olmoforms']['action'] }}</a></li>
  </ul>
@endisset

<h3>Form fields</h3>
<p>Data here is processed by <code>\LaravelFrontend\Forms\Form</code> class</p>
<details>
  <summary>Click to expand the JSON fields data</summary>
  <pre>{{ json_encode($form['fields'], JSON_PRETTY_PRINT) }}</pre>
</details>

<h3>Static translations</h3>
<p>
  In this table are listed for each field all the strings you can use in your
  translations CSV file in order to to provide static translations.
</p>
<table>
  <tr>
    @foreach ($stringsTable['columns'] as $column)
      <th>
        {{ $column['label'] }}
      </th>
    @endforeach
  </tr>
  @foreach ($stringsTable['rows'] as $row)
    <tr>
      @foreach ($row as $cell)
        <td>
          @isset($cell['value'])
            <code>{{ $cell['value'] }}</code>
          @endisset
          @isset($cell['values'])
            <ol>
              @foreach ($cell['values'] as $value)
                <li>
                  <code>{{ $value }}</code>
                </li>
              @endforeach
            </ol>
          @endisset
          @isset($cell['option'])
            <ol>
              @foreach ($cell['option'] as $optKey => $optValues)
                <details>
                  <summary>{{ $optKey }}</summary>
                  <ol>
                    @foreach ($optValues as $optValue)
                      <li>
                        <code>{{ $optValue }}</code>
                      </li>
                    @endforeach
                  </ol>
                </details>
              @endforeach
            </ol>
          @endisset
        </td>
      @endforeach
    </tr>
  @endforeach
</table>
