import { appendFileSync, createReadStream, existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import {
  basename,
  dirname,
  extname,
  join,
  normalize,
  resolve,
} from "node:path";
import {
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import ci from "ci-info";
import { ensureDir } from "fs-extra";
import { glob } from "glob";
import mime from "mime";
import { getEnvVarsByEnvNameList } from "../../config-env.js";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

type AssetsS3Options = {
  /**
   * An absolute path from where to look the files to upload, the path is
   * prepended to the {@link AssetsS3Options["glob"]}
   */
  base: string;
  /**
   * A glob path to determine the files to upload, the glob is prepended by the
   * to the {@link AssetsS3Options["src"]}
   */
  glob: string;
  /**
   * A folder path to prepend to the files path relative to `src` when uploading
   * the files to S3.
   */
  dest: string;
  /**
   * A file path where to store the `s3.logs`, including the file name
   */
  logs?: string;
  /**
   * S3 options
   */
  s3: {
    accessKeyId: string;
    secretAccessKey: string;
    Bucket: string;
    region: string;
  };
  // cdnUrl: string;
};

type Uploadable = {
  /**
   * The relative path of the asset destination on S3
   */
  dest: string;
  /**
   * The source asset absolute path
   */
  srcAbsolute: string;
  /**
   * The source asset relative path
   */
  srcRelative: string;
  /**
   * The asset's key that will be used in the `manifest`
   */
  manifestKey: string;
  /**
   * The asset's value that will be used in the `manifest`
   */
  manifestValue: string;
};

/**
 * Assets S3 upload
 *
 * @resources
 * - [Get started with S3](https://aws.amazon.com/cn/s3/getting-started/)
 * - [PutObjectCommand official docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/putobjectcommand.html)
 */
export const assetsS3: CliLaravel.Task = async ({
  ctx,
  log,
  spinner,
  chalk,
}) => {
  const options: AssetsS3Options = {
    base: paths.frontend.dest.public,
    glob: `/${paths.frontend.dest.folders.assets}/**/*.*`,
    dest: process.env.PUBLIC_PATH,
    // logs: join(paths.laravel.app.storage, "/logs/s3.log"),
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      Bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_DEFAULT_REGION,
    },
  };

  const s3Client = new S3Client({
    region: options.s3.region,
    credentials: {
      accessKeyId: options.s3.accessKeyId,
      secretAccessKey: options.s3.secretAccessKey,
    },
  });

  const succeded: Uploadable[] = [];
  const failed: Uploadable[] = [];

  spinner.suffixText = chalk.dim("S3 upload");
  spinner.start();

  prepareLogs();

  try {
    const uploadables: Uploadable[] = (
      await glob(options.glob, {
        absolute: false,
        root: options.base,
        cwd: options.base,
        ignore: [
          options.base + "/**/*.LICENSE.txt",
          join(options.base, paths.frontend.dest.relativeUrls.manifest),
        ],
      })
    ).map((srcRelative) => {
      const srcAbsolute = join(options.base, srcRelative);
      // ensure foward slashes and remove the initial slash as S3 likes
      const dest = join(options.dest, srcRelative)
        .replace(/\\/g, "/")
        .replace(/^^\/+/, "");
      const manifestKey = getAssetNameFromRelativePath(srcRelative);
      // NOTE: remove the `/public/` initial, that is only needed for the
      // upload but when using the manifest value `public` is not needed
      const manifestValue = dest.replace(/^\/*public\/*/, "");

      return {
        dest,
        srcAbsolute: normalize(resolve(srcAbsolute)),
        srcRelative,
        manifestKey,
        manifestValue,
      };
    });

    spinner.info(`Start to upload ${chalk.bold(uploadables.length)} files`);

    await Promise.all(uploadables.map((uploadable) => upload(uploadable)));

    spinner.succeed(`Uploaded ${chalk.bold(succeded.length)} files`);

    await saveCorsConfiguration();
  } catch (err) {
    spinner.fail("Upload failed");
    log.error("", "", "", err);
    throw err;
  }

  function getAssetNameFromRelativePath(relativeSrc: string) {
    const ext = extname(relativeSrc);
    const managedExtensions = [".css", ".js"];

    if (managedExtensions.includes(ext)) {
      const filename = basename(relativeSrc, ext);
      const dir = dirname(relativeSrc);
      // now remove the hash from the filename, e.g. `spaces.a4b1dd010cdd578d4680`
      const [cleanFilename] = filename.split(".");
      // ...then remove `entries` folder path, leave the `chunks` instead
      return join(dir.replace("entries", ""), cleanFilename) + ext;
    }

    return relativeSrc;
  }

  async function prepareLogs() {
    const filepath = options.logs;

    if (filepath && !existsSync(filepath)) {
      await ensureDir(dirname(filepath));
      await writeFile(filepath, `${"assetsS3"}: logs\n\n`);
    }
  }

  function appendLogs(text: string) {
    const filepath = options.logs;

    if (filepath) {
      appendFileSync(filepath, `\n ${text}`, "utf-8");
    }
  }

  async function upload(uploadable: Uploadable) {
    const name = uploadable.manifestKey;
    spinner.text = `Uploading ${chalk.dim(name)}`;
    spinner.start();
    const result = await s3Put(uploadable);

    if (result.ok) {
      succeded.push(uploadable);

      spinner.text = `Uploaded ${chalk.dim(name)}`;

      if (options.logs) {
        appendLogs(JSON.stringify(result.data));
      }
    } else {
      failed.push(uploadable);

      spinner.stopAndPersist({
        text: `Failed uploading ${chalk.dim(uploadable.dest)}`,
        suffixText: chalk.dim(result.error.message),
      });
    }
  }

  async function s3Put({ srcAbsolute, dest }: Uploadable) {
    try {
      const data = await s3Client.send(
        new PutObjectCommand({
          Bucket: options.s3.Bucket,
          Body: createReadStream(srcAbsolute),
          Key: dest,
          ContentType: mime.getType(dest) ?? undefined,
        })
      );
      return {
        ok: true,
        data,
      } as const;
    } catch (error) {
      return {
        ok: false,
        error: error as Error,
      } as const;
    }
  }

  /**
   * @resources
   * - https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html
   * - https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManageCorsUsing.html
   * - https://docs.aws.amazon.com/AmazonS3/latest/userguide/enabling-cors-examples.html
   * - https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutBucketCors.html
   * - [JS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketCors-property)
   */
  async function saveCorsConfiguration() {
    const appUrls = getEnvVarsByEnvNameList(ctx).map((env) => env.vars.APP_URL);
    try {
      await s3Client.send(
        new PutBucketCorsCommand({
          Bucket: options.s3.Bucket,
          CORSConfiguration: {
            CORSRules: [
              {
                AllowedHeaders: ["*"],
                AllowedMethods: ["GET"],
                AllowedOrigins: appUrls,
              },
            ],
          },
          ContentMD5: "",
        })
      );

      log.success(
        `Saved ${log.chalk.bold(
          "S3 Cors"
        )} configuration with allowed origins: ${log.chalk.italic(
          appUrls.join(", ")
        )}`
      );
    } catch (e) {
      log.error(`Failed to save ${log.chalk.bold("S3 Cors")} configuration`);
    }
  }
};
assetsS3.meta = {
  title: "Manage assets with S3",
  ownLog: ["start", "end"],
  whether: () => {
    // TODO: allow to run this from local machine too?
    return process.env.CDN === "s3" && ci.isCI;
  },
};
