import ci from "ci-info";
import type { CliLaravel } from "../pm.js";

global.__IPS = {
  local: "",
  cms: "",
  auth: "",
  all: new Set([]),
};

const setupServerPort: CliLaravel.Task = async ({ logger, chalk }) => {
  const getPort = (await import("get-port")).default;

  return new Promise<void>((resolve, reject) => {
    getPort({ port: [8080, 3000, 3002, 3004, 3006, 3008] })
      .then((port) => {
        global.__FREEPORT = port;

        logger.finish("Local server will use free port " + chalk.bold(port));
        resolve();
      })
      .catch(reject);
  });
};
setupServerPort.meta = {
  title: "Setting up server port",
  ownLog: ["end"],
  whether: () => {
    return process.env["NODE_ENV"] === "development";
  },
};

const setupMachineIP: CliLaravel.Task = async ({ logger, chalk }) => {
  const publicIpv4 = (await import("public-ip")).publicIpv4;

  return new Promise<void>((resolve, reject) => {
    publicIpv4()
      .then((ip) => {
        global.__IPS["local"] = ip;
        global.__IPS["all"].add(ip);

        logger.finish("Local machine public IP " + chalk.bold(ip), 1);
        resolve();
      })
      .catch(() => {
        logger.finish(
          chalk.red("Could not determine local machine public IP.")
        );
        reject();
      });
  });
};
setupMachineIP.meta = {
  title: "Looking for this machine IP",
  ownLog: ["end"],
  whether: () => {
    return !ci.isCI;
  },
};

const setupApisIPs: CliLaravel.Task = async ({ logger, chalk }) => {
  const Resolver = (await import("node:dns/promises")).Resolver;
  const URL = (await import("node:url")).URL;
  const resolver = new Resolver();

  const apisPromises = [
    { type: "cms", url: process.env["CMS_API_URL"] },
    // { type: "auth", url: process.env["AUTH_API_URL"] },
  ].filter((data) => !!data.url) as {
    type: "cms";
    url: string;
  }[];

  await Promise.all(
    apisPromises.map((data) => {
      const url = new URL(data.url);
      return new Promise<void>((resolve, reject) => {
        resolver
          .resolve4(url.hostname)
          .then(
            (ips) => {
              global.__IPS[data.type] = ips.join(",");
              ips.forEach((ip) => global.__IPS["all"].add(ip));

              logger.finish(
                `API ${data.type} public IP ${chalk.bold(ips.join(","))}`
              );
              resolve();
            },
            () => {
              reject();
            }
          )
          .catch(reject);
      });
    })
  );
};
setupApisIPs.meta = {
  title: "Set up APIs IPs addresses",
  ownLog: ["end"],
  whether: () => {
    return !ci.isCI;
  },
};

export const setup: CliLaravel.TaskGroup = {
  meta: { title: "Preliminary setup" },
  children: [setupServerPort, setupMachineIP, setupApisIPs],
  parallel: true,
};
