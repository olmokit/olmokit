/**
 * TODO: finish it
 *
 * Related GitHub issues:
 * @see https://github.com/glidejs/glide/issues/370
 * @see https://github.com/glidejs/glide/issues/213
 */
export default function Interactive(Glide, Components, Events) {
  const component = {
    set() {
      const { interactive } = Glide.settings;
      // console.log('Interactive, interactive is', interactive);
      if (interactive === false && !Glide.disabled) {
        Glide.go("<<");
        Glide.disable();
      } else if (
        typeof interactive === "undefined" ||
        (interactive === true && Glide.disabled)
      ) {
        Glide.enable();
      }
    },
  };

  Events.on(["mount", "resize"], () => {
    setTimeout(component.set, 10);
  });

  return component;
}
