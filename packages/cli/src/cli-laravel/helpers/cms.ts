import { Agent, get } from "node:https";
import type { TaskrLog } from "@olmokit/cli-utils";
// taskr
import { removeTrailingSlashes } from "../../helpers-getters.js";

type CmsApiRequestOpts = {
  /** @default "data" */
  subject: string;
  /** @default false */
  useCache?: boolean;
};

const cache: Record<string, Promise<any>> = {};

/**
 * The CMS data returned for the routes API
 */
export type CmsResponseDataStructure = {
  i18n: {
    /** Locales currently active in the project */
    locales: string[];
    /** Default locale for the project  */
    default_locale: string;
  };
  routes: {
    /** Route/Page ID, same as its `name` */
    id: string;
    /** Route/Page slug map by locale, the key is the locale the value is the localised slug */
    slug: Record<string, string>;
  }[];
};

function apiGet<T>(endpoint: string) {
  return new Promise<T>((resolve, reject) => {
    get(
      endpoint,
      {
        agent: new Agent({
          rejectUnauthorized: false,
        }),
      },
      (res) => {
        if (res.statusCode === 200) {
          let body = "";
          res.on("data", (data) => (body += data));
          res.on("end", () => {
            resolve(JSON.parse(body));
          });
        } else {
          reject();
        }
      },
    ).on("error", () => {
      reject();
    });
  });
}

/**
 * Get API data (from CMS)
 */
function cmsApiGet<TData extends object>(
  endpoint: string,
  customOptions: Partial<CmsApiRequestOpts>,
  log: TaskrLog,
) {
  const opts: CmsApiRequestOpts = {
    subject: "data",
    useCache: false,
    ...(customOptions || {}),
  };
  const hasCache = opts.useCache && cache[endpoint];

  const url = `${cmsGetApiUrl()}${endpoint}`;

  if (hasCache) {
    log.success(
      log.chalk.dim.italic(`Retrieving ${opts.subject} from CMS local cache.`),
    );
    return cache[endpoint] as Promise<TData>;
  }

  log.info(
    log.chalk.dim.italic(`Retrieving ${opts.subject} from CMS API ${url}...`),
  );
  const promise = apiGet<TData>(url);

  promise.then(
    () => {
      log.success(
        log.chalk.dim.italic(`Successfully retrieved ${opts.subject}`),
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_error) => {
      log.error(
        log.chalk.dim.italic(`Failed retrieving ${opts.subject}`),
        // error
      );
    },
  );

  if (!hasCache) {
    cache[endpoint] = promise;
  }

  return promise;
}

export async function cmsGetStructure(log: TaskrLog) {
  const res = await cmsApiGet<CmsResponseDataStructure>(
    "/structure",
    {
      useCache: true,
      subject: "structure",
    },
    log,
  );
  return res;
}

/**
 * Get API url
 */
function cmsGetApiUrl() {
  return removeTrailingSlashes(process.env["CMS_API_URL"]);
}
