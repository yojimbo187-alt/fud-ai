import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const translationMemory = new Map();

function directValue(localization) {
  return localization?.stringUnit?.value;
}

for (const filename of fs.readdirSync(path.join(root, "ios", "calorietracker")).filter(name => name.endsWith(".xcstrings"))) {
  const catalog = JSON.parse(fs.readFileSync(path.join(root, "ios", "calorietracker", filename), "utf8"));
  for (const [key, entry] of Object.entries(catalog.strings ?? {})) {
    const english = directValue(entry.localizations?.en) ?? key;
    const finnish = directValue(entry.localizations?.fi);
    if (finnish && finnish !== english) translationMemory.set(english, finnish);
  }
}

const valuesRoot = path.join(root, "android", "app", "src", "main", "res", "values");
const finnishRoot = path.join(root, "android", "app", "src", "main", "res", "values-fi");
for (const filename of fs.readdirSync(finnishRoot).filter(name => name.endsWith(".xml"))) {
  const basePath = path.join(valuesRoot, filename);
  if (!fs.existsSync(basePath)) continue;
  const base = fs.readFileSync(basePath, "utf8");
  const finnish = fs.readFileSync(path.join(finnishRoot, filename), "utf8");
  const values = new Map();
  for (const match of finnish.matchAll(/<string\b[^>]*name="([^"]+)"[^>]*>([\s\S]*?)<\/string>/g)) values.set(match[1], match[2]);
  for (const match of base.matchAll(/<string\b[^>]*name="([^"]+)"[^>]*>([\s\S]*?)<\/string>/g)) {
    const translated = values.get(match[1]);
    if (translated && translated !== match[2]) translationMemory.set(match[2], translated);
  }
}

let replacements = 0;
for (const filename of ["InfoPlist.xcstrings", "LocalModels.xcstrings", "WeeklyChallenge.xcstrings"]) {
  const file = path.join(root, "ios", "calorietracker", filename);
  const catalog = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const [key, entry] of Object.entries(catalog.strings ?? {})) {
    const english = directValue(entry.localizations?.en) ?? key;
    const unit = entry.localizations?.fi?.stringUnit;
    const translated = translationMemory.get(english);
    if (unit && unit.value === english && translated && translated !== english) {
      unit.value = translated;
      unit.state = "translated";
      replacements += 1;
    }
  }
  fs.writeFileSync(file, `${JSON.stringify(catalog, null, 2)}\n`);
}

console.log(`Filled ${replacements} Finnish strings from existing cross-platform translations.`);
