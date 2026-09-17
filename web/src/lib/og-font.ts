import { readFile } from "node:fs/promises";
import { join } from "node:path";

export function loadGeistMedium() {
  return readFile(join(process.cwd(), "src/app/fonts/Geist-Medium.ttf"));
}
