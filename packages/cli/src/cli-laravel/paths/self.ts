import { join } from "node:path";
import { meta } from "../../meta.js";

export const pathsSelf = {
  templates: join(meta.root, "/cli-laravel/templates"),
};
