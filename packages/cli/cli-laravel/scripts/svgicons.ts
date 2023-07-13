import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ensureDir } from "fs-extra";
import { glob } from "glob";
import SVGSpriter from "svg-sprite";
import { paths } from "../paths/index.js";
import type { CliLaravel } from "../pm.js";

/**
 * Generate svg inline html definitions from svg images
 */
export const svgicons: CliLaravel.Task = async ({ logger }) => {
  const svgPaths = await glob(join(paths.frontend.src.svgicons, "*.svg"));
  const svgs = await Promise.all(
    svgPaths.map(async (svgPath) => {
      const content = await readFile(svgPath, { encoding: "utf-8" });
      return {
        path: svgPath,
        content,
      };
    })
  );

  const spriter = new SVGSpriter({
    mode: {
      symbol: {
        // @ts-expect-error FIXME: weird, check docs at https://github.com/svg-sprite/svg-sprite#a-standalone-sprite
        inline: true,
      },
    },
  });

  svgs.forEach((svg) => spriter.add(svg.path, null, svg.content));

  try {
    const { result } = await spriter.compileAsync();
    const file = result.symbol.sprite;

    // FIXME: after a `wipe` command we do not have this folder, we could enforce
    // its presence at a lower level
    await ensureDir(paths.frontend.dest.components);

    // write the svicons partial
    await writeFile(
      join(
        paths.frontend.dest.components,
        paths.frontend.filenames.svgIconsPartial
      ),
      file.contents
    );

    logger.finish(
      `Generated ${svgPaths.length} SVG icons in ${paths.frontend.filenames.svgIconsPartial}`
    );
  } catch (e) {
    console.error(e);
  }
};

svgicons.meta = { title: "Generate SVG icons", ownLog: ["end"] };
