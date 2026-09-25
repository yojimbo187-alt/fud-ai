import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogFile = path.join(root, "ios", "calorietracker", "Localizable.xcstrings");
const catalog = JSON.parse(fs.readFileSync(catalogFile, "utf8"));
for (const key of [
  "Leave a Tip",
  "An optional Tip Jar in Settings → About lets you support development.",
  "Ruoka + Treeni is free and open source — no subscriptions, no paywalls, everything already unlocked. If it's helped you, a tip keeps it that way.",
  "Made by Apoorv Darshan",
  "with care, for everyone"
]) delete catalog.strings[key];
fs.writeFileSync(catalogFile, `${JSON.stringify(catalog, null, 2)}\n`);

const res = path.join(root, "android", "app", "src", "main", "res");
for (const directory of fs.readdirSync(res).filter(name => name.startsWith("values"))) {
  const stringsFile = path.join(res, directory, "strings.xml");
  if (!fs.existsSync(stringsFile)) continue;
  let xml = fs.readFileSync(stringsFile, "utf8");
  xml = xml.replace(/^\s*<string name="(?:about_leave_tip_kofi|about_made_by|about_with_care)"[^>]*>.*?<\/string>\r?\n/gm, "");
  fs.writeFileSync(stringsFile, xml);
}
