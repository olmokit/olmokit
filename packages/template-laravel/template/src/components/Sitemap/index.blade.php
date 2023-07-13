@php
  echo $file;
  echo $header;
  
  foreach ($sitemap as $item) {
      if ($item['type'] == 'page') {
          if ($item['slug'] == '') {
              echo '<url>';
              echo '<loc>' . $item['baseurl'] . '/' . $item['lang'] . '/' . '</loc>';
              echo '<changefreq>' . $item['changefreq'] . '</changefreq>';
              echo '<priority>' . $item['priority'] . '</priority>';
              echo '<lastmod>' . $item['lastmod'] . '</lastmod>';
              echo '</url>';
          } else {
              echo '<url>';
              echo '<loc>' . $item['baseurl'] . '/' . $item['lang'] . '/' . $item['slug'] . '/' . '</loc>';
              echo '<changefreq>' . $item['changefreq'] . '</changefreq>';
              echo '<priority>' . $item['priority'] . '</priority>';
              echo '<lastmod>' . $item['lastmod'] . '</lastmod>';
              echo '</url>';
          }
      } else {
          echo '<url>';
          echo '<loc>' . $item['baseurl'] . '/' . $item['lang'] . '/' . $item['slug'] . '/' . '</loc>';
          echo '<changefreq>' . $item['changefreq'] . '</changefreq>';
          echo '<priority>' . $item['priority'] . '</priority>';
          echo '<lastmod>' . $item['lastmod'] . '</lastmod>';
          echo '</url>';
      }
  }
  
  echo $footer;
@endphp
