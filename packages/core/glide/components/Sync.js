/**
 * Sync custom component
 *
 * Make a slider in sync with another
 *
 * @param {import("../helpers").glideInstance} Glide
 * @param {import("../helpers").glideComponents} Components
 */
export default function Sync(Glide, Components) {
  // TODO:
  const synced = Glide.settings.sync;

  Glide.on("run", () => {
    synced.go(`=${Glide.index}`);
  });

  // synced.on("run.after", () => {
  //   syncedRunnedFirst = false;
  // });

  synced.on("run", () => {
    Glide.go(`=${synced.index}`);
  });

  // synced.on("run.after", () => {
  // });

  Glide.on("pause", () => synced.pause());
  synced.on("pause", () => Glide.pause());

  return {};
}
