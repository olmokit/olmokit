<?php

namespace LaravelFrontend\Meta;

use Spatie\Crawler\CrawlObservers\CrawlObserver;
use GuzzleHttp\Exception\RequestException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\UriInterface;

class Visitor extends CrawlObserver
{
  /**
   * Keeps the count of visited URLS
   *
   * @var integer
   */
  private $quantity = 0;

  /**
   * The log file path
   *
   * @var string
   */
  private $logsPath = '';

  /**
   * The log content
   *
   * @var string
   */
  private $logs = '';

  /**
   * Start microtime
   */
  private $start = 0;

  /**
   * Create a new component instance.
   *
   * @return void
   */
  public function __construct(string $logsPath = '')
  {
    date_default_timezone_set('Europe/Rome');

    $this->logsPath = $logsPath;
    $this->start = microtime(true);
  }

  /**
   * Log string to log file
   *
   * @param string $text
   * @return void
   */
  private function log(string $text = ''): void
  {
    $line = $text . PHP_EOL;
    $this->logs = $this->logs . $line;

    $elapsed = round(microtime(true) - $this->start, 2);
    $templFlag = '__TEMPORARY__';
    $line1 = 'Running: Visiting ' . $this->quantity . ' urls';
    $line2 = 'Until now it took ' . $elapsed . ' seconds';
    $cnt = $line1 . PHP_EOL . $line2 . PHP_EOL . PHP_EOL . $this->logs;

    file_put_contents($this->logsPath, $templFlag . $cnt);
  }

  /**
   * Log URL nicely formatted into log file
   *
   * @param integer $status
   * @param string $url
   * @return void
   */
  private function logUrl(int $status = 0, string $url = ''): void
  {
    $this->log('[' . $status . '] ' . $this->getLoggedUrl($url));
  }

  /**
   * Get logged url formatted as a relative path
   *
   * @param string $url
   * @return string
   */
  private function getLoggedUrl(string $url = ''): string
  {
    return str_replace(config('env.APP_URL'), '', $url);
  }

  /**
   * Called when the crawler will crawl the url.
   *
   * @param \Psr\Http\Message\UriInterface $url
   */
  // public function willCrawl(UriInterface $url)
  // {
  //     $this->logUrl(1, $url);
  // }

  /**
   * Called when the crawler has crawled the given url successfully.
   *
   * @param \Psr\Http\Message\UriInterface $url
   * @param \Psr\Http\Message\ResponseInterface $response
   * @param \Psr\Http\Message\UriInterface|null $foundOnUrl
   */
  public function crawled(
    UriInterface $url,
    ResponseInterface $response,
    ?UriInterface $foundOnUrl = null
  ) {
    $statusCode = $response->getStatusCode();

    if ($statusCode !== 301 && $statusCode !== 302) {
      $this->quantity = $this->quantity + 1;
      $this->logUrl($statusCode, $url);
    }
    return $statusCode;
  }

  /**
   * Called when the crawler had a problem crawling the given url.
   *
   * @param \Psr\Http\Message\UriInterface $url
   * @param \GuzzleHttp\Exception\RequestException $requestException
   * @param \Psr\Http\Message\UriInterface|null $foundOnUrl
   */
  public function crawlFailed(
    UriInterface $url,
    RequestException $requestException,
    ?UriInterface $foundOnUrl = null
  ) {
    $statusCode = $requestException->getCode();
    $this->logUrl($statusCode, $url);
    return $statusCode;
  }

  /**
   * Called when the crawl has ended.
   *
   * Regarding the check to see if the request comes from a browser
   * @see https://stackoverflow.com/a/1042533/1938970
   */
  public function finishedCrawling()
  {
    $elapsed = round(microtime(true) - $this->start, 2);
    $line1 = 'Visited ' . $this->quantity . ' urls';
    $line2 = 'It took ' . $elapsed . ' seconds';
    $line3 = 'On ' . date('d F Y H:i:s');

    $cnt =
      $line1 .
      PHP_EOL .
      $line2 .
      PHP_EOL .
      $line3 .
      PHP_EOL .
      PHP_EOL .
      $this->logs;

    file_put_contents($this->logsPath, $cnt);

    // print as html only if there are some query params, a quick way to
    // differentiate a request from a browser from one made by a CI runner
    // or a CLI in general
    if (count($_GET)) {
      echo "<h2>$line1</h2>" .
        PHP_EOL .
        "<h3>$line2</h3>" .
        PHP_EOL .
        "<h3>$line3</h3>" .
        PHP_EOL .
        '<pre>' .
        PHP_EOL .
        $this->logs .
        '</pre>';
    } else {
      echo $cnt;
    }
  }
}
