import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const roots = [
  "ios/calorietracker",
  "ios/FudAIWidgets",
  "ios/FudAIWatchApp",
  "ios/FudAIWatchWidgets",
  "ios/calorietrackerShare",
  "android/app/src/main"
].map(relative => path.join(root, relative));
const extensions = new Set([".swift", ".kt", ".xml", ".plist", ".xcstrings"]);

function visit(target) {
  if (!fs.existsSync(target)) return;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    for (const child of fs.readdirSync(target)) visit(path.join(target, child));
    return;
  }
  if (!extensions.has(path.extname(target))) return;
  const source = fs.readFileSync(target, "utf8");
  const updated = source.replaceAll("Fud AI", "Ruoka + Treeni");
  if (updated !== source) fs.writeFileSync(target, updated);
}

roots.forEach(visit);
