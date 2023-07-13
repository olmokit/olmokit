import { Agent } from "node:https";
import axios, { type AxiosResponse } from "axios";
import chalk from "chalk";
import type { TaskrLog } from "@olmokit/cli-utils/taskr";
import { removeTrailingSlashes } from "../../helpers-getters.js";

type CmsApiRequestOpts = {
  /** @default "data" */
  subject: string;
  /** @default false */
  useCache?: boolean;
};

const cache: Record<string, Promise<AxiosResponse<any>>> = {};

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

/**
 * API axios instance
 */
const cmsApi = axios.create({
  httpsAgent: new Agent({
    rejectUnauthorized: false,
  }),
});

/**
 * Get API data (from CMS)
 */
function cmsApiGet<TData extends object>(
  endpoint: string,
  customOptions: Partial<CmsApiRequestOpts>,
  log: TaskrLog
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
      chalk.dim.italic(`Retrieving ${opts.subject} from CMS local cache.`)
    );
    return cache[endpoint] as Promise<AxiosResponse<TData, any>>;
  }

  log.info(
    chalk.dim.italic(`Retrieving ${opts.subject} from CMS API ${url}...`)
  );
  const promise = cmsApi.get<TData>(url);

  promise.then(
    () => {
      log.success(chalk.dim.italic(`Successfully retrieved ${opts.subject}`));
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_error) => {
      log.error(
        chalk.dim.italic(`Failed retrieving ${opts.subject}`)
        // error
      );
    }
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
    log
  );
  return res;
}

/**
 * Get API url
 */
function cmsGetApiUrl() {
  return removeTrailingSlashes(process.env["CMS_API_URL"]);
}
