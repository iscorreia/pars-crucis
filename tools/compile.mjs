import { compilePack } from "@foundryvtt/foundryvtt-cli";
import { promises as fs } from "fs";

const SYSTEM_ID = process.cwd();
const yaml = false;
const packs = await fs.readdir("./pack-sources/");

for (const pack of packs) {
  if (pack.startsWith(".")) continue;
  console.log(`Packing: ${pack}`);
  await compilePack(
    `${SYSTEM_ID}/pack-sources/${pack}`,
    `${SYSTEM_ID}/packs/${pack}`,
    yaml,
  );
}
