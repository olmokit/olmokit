import "./index.scss";

/**
 * Icon template (it needs an HTML embedded `svgicon`)
 *
 * TODO: check sideEffects...
 *
 * @param glyph The name of the SVG glyph to `use`
 */
export const iconTpl = (glyph: string, className?: string, id?: string) => {
  return (
    `<svg class="icon icon-${glyph}${className ? " " + className : ""}"` +
    `${id ? 'id="' + id + '"' : ""}><use xlink:href="#${glyph}"></use></svg>`
  );
};
