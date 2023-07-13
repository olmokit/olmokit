import { detect } from "./detect";
import { device } from "./device";

const { phone } = device();

export const isPhone = phone;

export function detectPhone() {
  return detect(() => ["phone", phone], "is", "is-not");
}
