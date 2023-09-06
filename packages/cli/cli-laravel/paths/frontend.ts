import { join } from "node:path";
import { project } from "../../project.js";

const srcFolder = "src";
const destFolder = "resources";
const publicFolder = "public";
const destFolders = {
  assets: "assets",
  chunks: "chunks",
  entries: "entries",
  images: "images",
  media: "media",
  fonts: "fonts",
  favicons: "favicons",
};

// ensure trailing slashes
const destRelativePaths = {
  assets: `/${destFolders.assets}`,
  chunks: `/${destFolders.assets}/${destFolders.chunks}`,
  entries: `/${destFolders.assets}/${destFolders.entries}`,
  images: `/${destFolders.assets}/${destFolders.images}`,
  media: `/${destFolders.assets}/${destFolders.media}`,
  favicons: `/${destFolders.assets}/${destFolders.favicons}`,
  fonts: `/${destFolders.assets}/${destFolders.fonts}`,
  serviceWorker: `/${destFolders.assets}/service-worker.js`,
  manifest: `/${destFolders.assets}/manifest.json`,
};

const root = project.root;
const destPublic = join(root, publicFolder);
const destPath = join(root, destFolder);
const srcPath = join(root, srcFolder);

/**
 * All default paths are defined here
 */
export const pathsFrontend = {
  filenames: {
    assetsHeadPartial: "assets-head.blade.php",
    assetsBodyPartial: "assets-body.blade.php",
    faviconsPartial: "favicons.blade.php",
    svgIconsPartial: "svgicons.blade.php",
    middlewares: "Middlewares.php",
    translations: "translations.csv",
  },
  src: {
    folder: srcFolder,
    base: srcPath,
    // static
    assets: join(srcPath, "assets"),
    favicons: join(srcPath, "assets"),
    images: join(srcPath, "assets/images"),
    media: join(srcPath, "assets/media"),
    fonts: join(srcPath, "assets/fonts"),
    svgicons: join(srcPath, "assets/svgicons"),
    // non-static:
    config: join(srcPath, "config"),
    components: join(srcPath, "components"),
    core: join(srcPath, "core"),
    fragments: join(srcPath, "fragments"),
    layouts: join(srcPath, "layouts"),
    middlewares: join(srcPath, "middlewares"),
    routes: join(srcPath, "routes"),
    services: join(srcPath, "services"),
    translations: join(srcPath, "assets"),
    utils: join(srcPath, "utils"),
    vendor: join(srcPath, "vendor"),
  },
  dest: {
    folders: destFolders,
    relativeUrls: destRelativePaths,
    base: destPath,
    public: destPublic,
    // static
    assets: join(destPublic, destRelativePaths.assets),
    favicons: join(destPublic, destRelativePaths.favicons),
    images: join(destPublic, destRelativePaths.images),
    media: join(destPublic, destRelativePaths.media),
    fonts: join(destPublic, destRelativePaths.fonts),
    chunks: join(destPublic, destRelativePaths.chunks),
    entries: join(destPublic, destRelativePaths.entries),
    // non-static:
    automated: join(destPath, "components"),
    config: join(root, "config"),
    components: join(destPath, "components"),
    core: join(destPath, "components"),
    fragments: join(destPath, "fragments"),
    layouts: join(destPath, "layouts"),
    middlewares: join(destPath, "middlewares"),
    routes: join(destPath, "routes"),
    services: join(destPath, "services"),
    translations: join(destPath),
    utils: join(destPath, "components"),
  },
};
