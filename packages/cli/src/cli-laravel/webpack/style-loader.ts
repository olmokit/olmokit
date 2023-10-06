/**
 * @file This style-loader tweak works for and in tandem with barba in order to
 * enable/disable specific route loader on enter/leave transitions during
 * development, the `<style>` tags produced by style-loader  will have a route
 * identifier as "id" that will be targeted by the base core/barba/route.js
 * class.
 *
 * FIXME: perhaps we will not need this anymore once style-loader will accept
 * attributes with interpolation, follow https://git.io/JU1qO
 */
// import loader from "style-loader";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const loader = require("style-loader");

// eslint-disable-next-line @typescript-eslint/no-empty-function
module.exports = function () {};

// @ts-expect-error webpack custom plugin
module.exports.pitch = function (request) {
  const result = loader.pitch.call(this, request);

  // inside indexOf just put an option produced by webapck, you can check what
  // to target by logging the `result` variable with the following console.log
  // console.log("style loader pitch result: ", result);
  const index = result.indexOf("options.singleton = false");

  if (index <= -1) return result;
  const insertIndex = index - 1;

  let uniqueName = "";
  let id = "";
  const resourcePath = this.resourcePath;
  const srcRoutes = "src/routes/"; // TODO: should grab it from `paths.frontend`
  if (resourcePath.indexOf(srcRoutes) !== -1) {
    const pathEnd = resourcePath.split(srcRoutes);
    // console.log("pathEnd", pathEnd);
    const matches = pathEnd[1] ? pathEnd[1].match(/(.+)\/.+.scss/) : [];
    if (matches[1]) {
      uniqueName = matches[1];
      id = `__route-style-${uniqueName}`;
    }
  }

  const insertAttr = id
    ? `
if (typeof options.attributes !== 'object') {
  options.attributes = {};
}
options.attributes["id"] = '${id}';
options.attributes["data-route-style"] = '${uniqueName}';
`
    : "";

  return result.slice(0, insertIndex) + insertAttr + result.slice(insertIndex);
};
