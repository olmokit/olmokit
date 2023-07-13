import { execSync } from "node:child_process";
import { createWriteStream } from "node:fs";
import { join } from "node:path";
import archiver from "archiver";
import { glob } from "glob";
import { rimraf } from "rimraf";
import { filer } from "@olmokit/cli-utils/filer";
import type { TaskrLog } from "@olmokit/cli-utils/taskr";
import { normaliseUrl, removeTrailingSlashes } from "../../helpers-getters.js";
import { touchFiles } from "../../touchFiles.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";
import { visit } from "./visit.js";

/**
 * Call deploy endpoint
 *
 * Use http to avoid issues on the runner such as this error encountered when
 * requesting `https` URLs:
 * `Failed to connect to myconfig.company.com port 443: Connection refused`
 * We also make sure to add http authentication for http protected endpoints
 */
async function callDeployEndpoint(
  log: TaskrLog,
  path: string,
  action = "",
  async = false
) {
  const url = normaliseUrl(process.env.APP_URL + "/" + path);

  // alternative with curl:
  log.info(`Calling ${action} script at url: ${url}`);
  if (async) {
    execSync(`curl ${url}`);
    log.success(`Done calling ${action} script`);

    // exec(`curl ${url}`);
    // // we do not want to wait for the async `exec` to complete here, but still
    // // we want to wait a bit to be sure that the command is spawned.
    // setTimeout(
    //   () => log(`Script ${action} will run in the background...`),
    //   200
    // );
  } else {
    execSync(`curl ${url}`);
    log.success(`Done calling ${action} script`);
  }
}

/**
 * Run composer to install vendor files
 */
const ciComposer: CliLaravel.CmdDeploy.Task = async () => {
  execSync(
    "composer install --no-interaction --no-progress --no-dev --prefer-dist --quiet"
  );
  // execSync("composer dump-autoload"); // done by laravel already
};
ciComposer.meta = { title: "Run composer" };

/**
 * Zip the vendor folder
 */
const ciComposerZip: CliLaravel.CmdDeploy.Task = ({ ctx, log }) =>
  new Promise<void>((resolve, reject) => {
    // create a file to stream archive data to.
    const output = createWriteStream(join(ctx.project.root, "vendor.zip"));
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", async () => {
      // now delete the vendor folder so that it does not get synced to the server
      await rimraf(join(ctx.project.root, "vendor"));

      log.success("Created vendor.zip and deleted vendor folder");

      resolve();
    });

    output.on("end", () => {
      log.info("vendor.zip: data has been drained");
    });

    archive.on("warning", (err) => {
      if (err.code !== "ENOENT") {
        // } else {
        throw err;
      }
    });

    archive.on("error", (err) => {
      reject();
      throw err;
    });

    archive.directory(join(ctx.project.root, "vendor/"), false);

    archive.pipe(output);
    archive.finalize();
  });
ciComposerZip.meta = { title: "Zip composer packages" };

/**
 * Clean files that should not end up on the server
 */
const ciClean: CliLaravel.CmdDeploy.Task = async ({ ctx }) => {
  const root = ctx.project.root;
  await rimraf(
    [
      join(root, ".env.*"),
      join(paths.frontend.dest.public, ".htaccess.*"),
      join(root, "package.json"),
      join(root, "package-lock.json"),
      join(root, "pnpm-lock.yaml"),
      join(root, "composer.lock"),
      join(root, "tsconfig.json"),
      join(root, "olmo.ts"),
      join(root, ".npmrc"),
      join(root, "*.md"),
      join(root, ".vscode"),
      join(root, ".husky"),
      join(paths.frontend.src.base),
    ],
    { glob: true }
    // FIXME: check former `del` options were:
    // { force: true, dot: true }
  );
};
ciClean.meta = { title: "Clean files that should not end up on the server" };

/**
 * Touch files in order to change their timestamps and force lftp to update them
 * despite having the same byte length.
 */
const ciTouch: CliLaravel.CmdDeploy.Task = async () => {
  const filepaths = await glob(join(paths.frontend.dest.base, "/**/*"), {
    dot: true, // htaccess too
  });
  await touchFiles(filepaths);
};
ciTouch.meta = { title: "Touch generated files timestamps" };

/**
 * Sync files, either via ftp or ssh
 *
 * all commands are synchronous here, just run them one by one
 */
const ciSync: CliLaravel.CmdDeploy.Task = async ({
  spinner,
  chalk,
  arg,
  ctx,
}) => {
  const mode = ctx.options.mode;

  spinner.start();
  if (mode === "ftp") {
    spinner.text = `Sync files via ${chalk.bold(mode)}`;
    return ciSyncFtp(arg);
  } else if (mode === "ssh") {
    spinner.text = `Sync files via ${chalk.bold(mode)}`;
    return ciSyncSsh(arg);
  } else {
    throw new Error(
      `deploy script supports 'ftp' and 'ssh'. Mode '${mode}' is not recognised`
    );
  }
};
ciSync.meta = { title: "Sync files" };

/**
 * Sync files via ftp
 *
 * all commands are synchronous here, just run them one by one
 */
async function ciSyncFtp(arg: CliLaravel.CmdDeploy.TaskArg) {
  const { spinner } = arg;
  const { username, password, host, folder: folderRaw } = arg.ctx.options;
  const cmdPrefx = `lftp -c "set ftp:ssl-allow no; open -u`;
  const cmdDefaults = `mirror --reverse --parallel=50`;
  const cmdCommon = `${cmdPrefx} ${username},${password} ${host}; ${cmdDefaults}`;
  const folder = removeTrailingSlashes(folderRaw);

  // selective incremental sync (without delete, for long cached files)
  spinner.text = "Syncing storage folder...";
  execSync(`${cmdCommon} ./storage ${folder}/storage" || true`);

  // selective excluding sync (with delete)
  spinner.text = "Syncing public folder...";
  execSync(`${cmdCommon} --delete ./public ${folder}/public" || true`);

  spinner.text = "Syncing resources folder...";
  execSync(`${cmdCommon} --delete ./resources ${folder}/resources" || true`);

  spinner.text = "Syncing all the rest...";
  execSync(
    `${cmdCommon} --delete --exclude-glob=.git* --exclude=^.git/ --exclude=^.npm/ --exclude=^node_modules/ --exclude=^vendor/ --exclude=^public/ --exclude=^resources/ --exclude=^storage/ ./ ${folder}/" || true`
  );

  spinner.stop();
}

/**
 * Sync files via ssh
 *
 * all commands are synchronous here, just run them one by one
 */
async function ciSyncSsh(arg: CliLaravel.CmdDeploy.TaskArg) {
  const { spinner } = arg;
  const { sshkeyvar, port, host: hostRaw, folder, password } = arg.ctx.options;
  let cmdPrefx = `rsync --recursive --verbose`;
  let address = "";
  let host = hostRaw;

  // ensure host ends with column without doubling it
  host = host.trim().replace(/:+$/, "") + ":";
  // turn the folder into the full server address
  address = host + removeTrailingSlashes(folder);
  // listen to port if necessary
  if (port) {
    address = `-e 'ssh -p ${port}' ${address}`;
  }

  spinner.text = "Configuring ssh access...";

  // standard SSH auth via SSH key
  if (sshkeyvar) {
    execSync(`mkdir -p ~/.ssh`);
    execSync(`cat "$${sshkeyvar}" > ~/.ssh/id_dsa`);
    execSync(`chmod 600 ~/.ssh/id_dsa`);
    execSync(`echo "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config`);
  }
  // less standard authentication via `sshpass`
  else if (password) {
    cmdPrefx = `sshpass -p "${password}" ${cmdPrefx}`;
  }

  // selective incremental sync (without delete, for long cached files)
  spinner.text = "Syncing storage folder...";
  execSync(
    `${cmdPrefx} --update --exclude 'framework/cache/data' ./storage ${address}/`
  );

  // selective excluding sync (with delete)
  spinner.text = "Syncing public folder...";
  execSync(
    `${cmdPrefx} --delete-after --exclude 'page-cache' ./public ${address}/`
  );
  spinner.text = "Syncing resources folder...";
  execSync(`${cmdPrefx} --delete-after ./resources ${address}/`);
  spinner.text = "Syncing all the rest...";
  execSync(
    `${cmdPrefx} --delete-after --exclude '.git*' --exclude '.npm' --exclude 'node_modules' --exclude 'vendor' --exclude 'public' --exclude 'resources' --exclude 'storage' ./ ${address}/`
  );

  if (sshkeyvar) {
    execSync(`rm ~/.ssh/id_dsa`);
  }

  spinner.stop();
}

/**
 * Copy deployer script in public folder so that it will be uploaded
 */
const ciCopyScripts: CliLaravel.CmdDeploy.Task = async () => {
  await filer("deployer.php", {
    base: paths.self.templates,
    dest: paths.frontend.dest.public,
  });
};
ciCopyScripts.meta = { title: "Copy scripts" };

/**
 * Call deployer script temporarily put on server
 */
const ciDeployer: CliLaravel.CmdDeploy.Task = async ({ log }) => {
  return callDeployEndpoint(log, "deployer.php", "deployer");
};
ciDeployer.meta = { title: "Run deployer.php" };

/**
 * Call laravel-frontend exposed hook
 */
const ciHooks: CliLaravel.CmdDeploy.Task = async ({ log }) => {
  return callDeployEndpoint(
    log,
    "_/hooks/deploy/end/",
    "deploy end hook",
    true
  );
};
ciHooks.meta = { title: "Run deploy hooks" };

/**
 * Visit all website url to re-create caches
 */
const ciVisit: CliLaravel.CmdDeploy.Task = async ({ ctx, log }) => {
  const mode = process.env.CI_VISIT_MODE;

  if (!mode || (mode && mode.trim() === "false")) {
    log.info("CI visit will not run.");
    return;
  } else if (mode && mode.trim() === "node") {
    log.info("CI visit will run as a node task.");
    return visit(ctx, log);
  } else {
    log.info("CI visit will run as a php task.");
    return;
  }
};
ciVisit.meta = { title: "Run visit task" };

export const ci: CliLaravel.CmdDeploy.TaskGroup = {
  meta: { /* subject: "ci", */ title: "CI" },
  children: [
    ciComposer,
    ciComposerZip,
    ciCopyScripts,
    ciClean,
    ciTouch,
    ciSync,
    ciDeployer,
    ciHooks,
    ciVisit,
  ],
};
