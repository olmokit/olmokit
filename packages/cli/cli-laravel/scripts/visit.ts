import { PlaywrightCrawler } from "crawlee";
import { TaskrLog } from "@olmokit/cli-utils/taskr";
import { normaliseUrl } from "../../helpers-getters.js";
import { Config } from "../../types.js";

const visitedUrls: string[] = [];

const createCrawler = (
  baseUrl: string,
  config: Config.Internal,
  log: TaskrLog,
) =>
  new PlaywrightCrawler({
    async requestHandler({ request, enqueueLinks }) {
      const url = normaliseHref(baseUrl, request.url);

      if (url && shouldVisitUrl(baseUrl, url) && !visitedUrls.includes(url)) {
        // overcome possible http basic authentication
        const httpAuth = config.httpAuth;
        if (httpAuth) {
          const { matchUrlPart, password, username } = httpAuth;
          if (matchUrlPart && request.url.indexOf(matchUrlPart) !== -1) {
            if (request.headers) {
              request.headers["Authorization"] =
                "Basic " +
                Buffer.from(username + ":" + password).toString("base64");
            }
          }
        }
        visitedUrls.push(url);
        log.info(url.replace(baseUrl, "") || "/");

        await enqueueLinks({
          // TODO: check whether we need to put some options here to
        });
      }
    },
  });

/**
 * Should visit URL
 */
function shouldVisitUrl(baseUrl: string, url: string) {
  if (url && url.indexOf(baseUrl) !== -1) {
    return true;
  }
  return false;
}

/**
 * Normalise link href attribute value
 */
function normaliseHref(baseUrl: string, href = "") {
  href = href.trim();

  if (
    href.startsWith("#") ||
    href.startsWith("mailto") ||
    href.startsWith("tel")
  ) {
    return "";
  }
  if (href.startsWith("http")) {
    return href;
  }
  return normaliseUrl(baseUrl + "/" + href);
}

/**
 * Visitor report stats
 */
function visitReport(baseUrl: string, log: TaskrLog) {
  // const urls = [];
  const summary = `Visited ${log.chalk.bold(visitedUrls.length)} urls`;

  log.success(`${summary}:`);

  for (let i = 0; i < visitedUrls.length; i++) {
    const url = visitedUrls[i].replace(baseUrl, "");
    // urls.push(url);

    log.info(url);
  }
  log(`${log.chalk.dim(summary)}.`);
}

/**
 * Visit script
 *
 * TODO: Verify that this all script works (http auth, reporting, etc.) we
 * have changed the crawling library but this is quite untested.
 * FIXME: grab env from ctx allowing a command option to override it
 */
export const visit = async (config: Config.Internal, log: TaskrLog) => {
  const baseUrl = process.env.APP_URL;

  log.success(`Start visiting all urls from ${log.chalk.bold(baseUrl)}`);

  const crawler = createCrawler(baseUrl, config, log);
  await crawler.run([baseUrl]);

  visitReport(baseUrl, log);
};
