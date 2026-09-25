import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const endpoint = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fi&dt=t&q=";
const cache = new Map();
const preservedFinnish = new Set([
  "Ruoka + Treeni", "Koti", "Edistyminen", "Valmentaja", "Asetukset", "Ohjelmat",
  "Treeniohjelmat", "Suomi", "Tietoja", "Sovellusversio", "Valmis", "Peruuta",
  "Tallenna", "Poista", "Henkilötiedot", "Tavoitteet ja ravinto", "Ilmoitukset",
  "Puhe tekstiksi", "Terveys ja tiedot", "Tietojen hallinta", "Poista kaikki tiedot",
  "Työntävät", "Vetävät", "Jalat", "Ylävartalo", "Alavartalo", "Liikkuvuus", "Tekniikka"
]);

const placeholderPattern = /(%(?:\d+\$)?[-+#0 .,\d]*[a-zA-Z@]|\\n|\\t|<[^>]+>|&(?:[a-zA-Z]+|#\d+);|https?:\/\/[^\s<]+)/g;

function protect(text) {
  const values = [];
  return {
    text: text.replace(placeholderPattern, value => {
      const token = `ZXQPH${values.length}QXZ`;
      values.push(value);
      return token;
    }),
    restore(translated) {
      let result = translated;
      values.forEach((value, index) => {
        result = result.replaceAll(`ZXQPH${index}QXZ`, value)
          .replaceAll(`ZXQPH ${index} QXZ`, value);
      });
      return result;
    }
  };
}

function shouldTranslate(value) {
  const trimmed = value.trim();
  if (!trimmed || preservedFinnish.has(trimmed)) return false;
  if (/^[@%\d\W_]+$/u.test(trimmed)) return false;
  if (/^(Ruoka \+ Treeni)(\s|$)/.test(trimmed)) return false;
  return /[A-Za-z]/.test(trimmed);
}

async function translate(value) {
  if (!shouldTranslate(value)) return value;
  if (cache.has(value)) return cache.get(value);
  const holder = protect(value);
  let lastError;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(endpoint + encodeURIComponent(holder.text));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      const translated = holder.restore((json[0] ?? []).map(part => part[0]).join(""));
      cache.set(value, translated || value);
      return translated || value;
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 400 * (attempt + 1)));
    }
  }
  console.warn(`Translation fallback for: ${value.slice(0, 80)} (${lastError})`);
  cache.set(value, value);
  return value;
}

async function mapLimit(items, limit, mapper) {
  const result = new Array(items.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      result[index] = await mapper(items[index], index);
    }
  }));
  return result;
}

function collectStringUnits(node, output) {
  if (!node || typeof node !== "object") return;
  if (typeof node.stringUnit?.value === "string") output.push(node.stringUnit);
  for (const child of Object.values(node)) collectStringUnits(child, output);
}

const iosUnits = [];
const iosCatalogs = [];
const additionalOnly = process.argv.includes("--additional");
const catalogNames = additionalOnly
  ? ["InfoPlist.xcstrings", "LocalModels.xcstrings", "WeeklyChallenge.xcstrings"]
  : ["Localizable.xcstrings", "AIErrorMessages.xcstrings", "BarcodeLookup.xcstrings"];
for (const filename of catalogNames) {
  const file = path.join(root, "ios", "calorietracker", filename);
  const catalog = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const entry of Object.values(catalog.strings ?? {})) {
    collectStringUnits(entry.localizations?.fi, iosUnits);
  }
  iosCatalogs.push({ file, catalog });
}

const androidFiles = additionalOnly ? [] : fs.readdirSync(path.join(root, "android", "app", "src", "main", "res", "values-fi"))
  .filter(name => name.endsWith(".xml"));
const androidDocuments = androidFiles.map(name => {
  const file = path.join(root, "android", "app", "src", "main", "res", "values-fi", name);
  return { file, xml: fs.readFileSync(file, "utf8") };
});

const candidates = new Set(iosUnits.map(unit => unit.value));
for (const document of androidDocuments) {
  for (const match of document.xml.matchAll(/<(?:string|item)\b[^>]*>([\s\S]*?)<\/(?:string|item)>/g)) {
    candidates.add(match[1]);
  }
}
const values = [...candidates].filter(shouldTranslate);
console.log(`Translating ${values.length} unique UI strings to Finnish...`);
await mapLimit(values, 6, async (value, index) => {
  const result = await translate(value);
  if ((index + 1) % 100 === 0) console.log(`${index + 1}/${values.length}`);
  return result;
});

for (const unit of iosUnits) unit.value = cache.get(unit.value) ?? unit.value;
for (const { file, catalog } of iosCatalogs) {
  fs.writeFileSync(file, `${JSON.stringify(catalog, null, 2)}\n`);
}

for (const document of androidDocuments) {
  document.xml = document.xml.replace(
    /<(string|item)\b([^>]*)>([\s\S]*?)<\/\1>/g,
    (whole, tag, attrs, value) => `<${tag}${attrs}>${cache.get(value) ?? value}</${tag}>`
  );
  fs.writeFileSync(document.file, document.xml);
}

console.log(`Finnish translation complete (${cache.size} translated strings).`);
