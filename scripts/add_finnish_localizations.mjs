import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const sourceTranslations = {
  "Home": "Koti",
  "Progress": "Edistyminen",
  "Coach": "Valmentaja",
  "Settings": "Asetukset",
  "Programs": "Ohjelmat",
  "Workouts": "Treenit",
  "Training Programs": "Treeniohjelmat",
  "Choose a plan that fits your week. Your calorie and macro targets adapt automatically.": "Valitse viikkoosi sopiva ohjelma. Kalori- ja makrotavoitteet mukautuvat automaattisesti.",
  "Push, Pull, Legs, Upper, Lower": "Työntävät, vetävät, jalat, ylävartalo, alavartalo",
  "Upper / Lower": "Ylä- / alavartalo",
  "Full Body": "Koko vartalo",
  "Active Recovery": "Aktiivinen palautuminen",
  "Five training days for balanced strength and hypertrophy.": "Viisi treenipäivää tasapainoiseen voima- ja lihaskasvuharjoitteluun.",
  "Four training days with two upper- and two lower-body sessions.": "Neljä treenipäivää: kaksi ylä- ja kaksi alavartalotreeniä.",
  "Three full-body sessions with recovery days between them.": "Kolme koko vartalon treeniä ja palautumispäivät niiden välissä.",
  "Two light sessions for mobility, technique, and recovery.": "Kaksi kevyttä harjoitusta liikkuvuuteen, tekniikkaan ja palautumiseen.",
  "PROGRAMS": "OHJELMAT",
  "Active program": "Aktiivinen ohjelma",
  "Recommended": "Suositeltu",
  "%lld days/week": "%lld päivää/viikko",
  "%lld training days": "%lld treenipäivää",
  "The exact exercise list will be added after you confirm it. This keeps the five-day structure active without finalizing exercises you have not approved.": "Tarkka liikelista lisätään vahvistuksesi jälkeen. Viisipäiväinen rakenne pysyy käytössä ilman, että hyväksymättömiä liikkeitä viimeistellään.",
  "Push": "Työntävät",
  "Pull": "Vetävät",
  "Legs": "Jalat",
  "Upper": "Ylävartalo",
  "Lower": "Alavartalo",
  "Upper A": "Ylävartalo A",
  "Lower A": "Alavartalo A",
  "Upper B": "Ylävartalo B",
  "Lower B": "Alavartalo B",
  "Full Body A": "Koko vartalo A",
  "Full Body B": "Koko vartalo B",
  "Full Body C": "Koko vartalo C",
  "Mobility": "Liikkuvuus",
  "Technique": "Tekniikka",
  "Finnish": "Suomi",
  "About": "Tietoja",
  "App Version": "Sovellusversio",
  "Version %@": "Versio %@",
  "Version %1$@": "Versio %1$@",
  "Calories": "Kalorit",
  "Protein": "Proteiini",
  "Carbs": "Hiilihydraatit",
  "Fat": "Rasva",
  "Water": "Vesi",
  "Today": "Tänään",
  "Yesterday": "Eilen",
  "Save": "Tallenna",
  "Cancel": "Peruuta",
  "Done": "Valmis",
  "Delete": "Poista",
  "Edit": "Muokkaa",
  "Add": "Lisää",
  "Back": "Takaisin",
  "Next": "Seuraava",
  "Search": "Haku",
  "Analyze": "Analysoi",
  "Camera": "Kamera",
  "Photo Library": "Kuvakirjasto",
  "Barcode": "Viivakoodi",
  "Scan Nutrition Label": "Skannaa ravintoarvomerkintä",
  "Voice": "Puhe",
  "Text": "Teksti",
  "Activity Level": "Aktiivisuustaso",
  "Goals & Nutrition": "Tavoitteet ja ravinto",
  "Personal Info": "Henkilötiedot",
  "Notifications": "Ilmoitukset",
  "AI Access": "AI-käyttö",
  "Speech-to-Text": "Puhe tekstiksi",
  "Health & Data": "Terveys ja tiedot",
  "Data Management": "Tietojen hallinta",
  "Delete All Data": "Poista kaikki tiedot",
  "Male": "Mies",
  "Female": "Nainen",
  "Other": "Muu",
  "Sedentary": "Vähän liikkuva",
  "Light Activity": "Kevyt aktiivisuus",
  "Moderate": "Kohtalainen",
  "Active": "Aktiivinen",
  "Very Active": "Erittäin aktiivinen",
  "Extra Active": "Huippuaktiivinen"
};

function replaceBrand(value) {
  return value.replaceAll("Fud AI", "Ruoka + Treeni");
}

function translateValue(value) {
  return replaceBrand(sourceTranslations[value] ?? value);
}

function translateLocalizationNode(node) {
  if (!node || typeof node !== "object") return;
  if (node.stringUnit?.value) node.stringUnit.value = translateValue(node.stringUnit.value);
  for (const value of Object.values(node)) translateLocalizationNode(value);
}

for (const filename of [
  "Localizable.xcstrings", "AIErrorMessages.xcstrings", "BarcodeLookup.xcstrings",
  "InfoPlist.xcstrings", "LocalModels.xcstrings", "WeeklyChallenge.xcstrings"
]) {
  const file = path.join(root, "ios", "calorietracker", filename);
  const catalog = JSON.parse(fs.readFileSync(file, "utf8"));
  if (filename === "Localizable.xcstrings") {
    for (const source of Object.keys(sourceTranslations)) catalog.strings[source] ??= {};
  }
  for (const [source, entry] of Object.entries(catalog.strings ?? {})) {
    entry.localizations ??= {};
    if (entry.localizations.fi) continue;
    if (entry.localizations.en) {
      entry.localizations.fi = structuredClone(entry.localizations.en);
      translateLocalizationNode(entry.localizations.fi);
    } else {
      entry.localizations.fi = {
        stringUnit: { state: "translated", value: translateValue(source) }
      };
    }
  }
  fs.writeFileSync(file, `${JSON.stringify(catalog, null, 2)}\n`);
}

const androidNameTranslations = {
  app_name: "Ruoka + Treeni",
  nav_home: "Koti",
  nav_progress: "Edistyminen",
  nav_coach: "Valmentaja",
  nav_settings: "Asetukset",
  nav_workouts: "Ohjelmat",
  training_programs_title: "Treeniohjelmat",
  training_programs_subtitle: "Valitse viikkoosi sopiva ohjelma. Kalori- ja makrotavoitteet mukautuvat automaattisesti.",
  training_program_pplul: "Työntävät, vetävät, jalat, ylävartalo, alavartalo",
  training_program_upper_lower: "Ylä- / alavartalo",
  training_program_full_body: "Koko vartalo",
  training_program_active_recovery: "Aktiivinen palautuminen",
  training_summary_pplul: "Viisi treenipäivää tasapainoiseen voima- ja lihaskasvuharjoitteluun.",
  training_summary_upper_lower: "Neljä treenipäivää: kaksi ylä- ja kaksi alavartalotreeniä.",
  training_summary_full_body: "Kolme koko vartalon treeniä ja palautumispäivät niiden välissä.",
  training_summary_active_recovery: "Kaksi kevyttä harjoitusta liikkuvuuteen, tekniikkaan ja palautumiseen.",
  training_days_format: "%1$d treenipäivää",
  training_days_per_week: "%1$d päivää/viikko",
  training_recommended: "Suositeltu",
  training_active_program: "Aktiivinen ohjelma",
  training_exercises_pending: "Liikelista odottaa vahvistustasi",
  training_day_push: "Työntävät",
  training_day_pull: "Vetävät",
  training_day_legs: "Jalat",
  training_day_upper: "Ylävartalo",
  training_day_lower: "Alavartalo",
  training_day_upper_a: "Ylävartalo A",
  training_day_lower_a: "Alavartalo A",
  training_day_upper_b: "Ylävartalo B",
  training_day_lower_b: "Alavartalo B",
  training_day_full_a: "Koko vartalo A",
  training_day_full_b: "Koko vartalo B",
  training_day_full_c: "Koko vartalo C",
  training_day_mobility: "Liikkuvuus",
  training_day_technique: "Tekniikka",
  speech_language_finnish: "Suomi",
  about_category_app_updates: "Tietoja",
  about_app_version: "Sovellusversio",
  action_done: "Valmis",
  action_cancel: "Peruuta",
  action_save: "Tallenna",
  action_delete: "Poista",
  settings_title: "Asetukset",
  settings_section_personal: "Henkilötiedot",
  settings_section_goals: "Tavoitteet ja ravinto",
  settings_notifications: "Ilmoitukset",
  settings_category_ai_providers: "AI-palveluntarjoajat ja varavaihtoehdot",
  settings_section_speech: "Puhe tekstiksi",
  settings_section_app: "Sovellusasetukset",
  settings_section_health: "Terveys ja tiedot",
  settings_section_data_management: "Tietojen hallinta",
  settings_delete_all_data: "Poista kaikki tiedot"
};

const androidRes = path.join(root, "android", "app", "src", "main", "res");
const fiDir = path.join(androidRes, "values-fi");
fs.mkdirSync(fiDir, { recursive: true });
for (const filename of fs.readdirSync(path.join(androidRes, "values"))) {
  if (!filename.endsWith(".xml") || filename === "colors.xml" || filename === "themes.xml") continue;
  const source = path.join(androidRes, "values", filename);
  const target = path.join(fiDir, filename);
  if (fs.existsSync(target)) continue;
  let xml = fs.readFileSync(source, "utf8").replaceAll("Fud AI", "Ruoka + Treeni");
  xml = xml.replace(/<string name="([^"]+)"([^>]*)>([\s\S]*?)<\/string>/g, (whole, name, attrs, value) => {
    const translated = androidNameTranslations[name];
    return translated == null ? whole : `<string name="${name}"${attrs}>${translated}</string>`;
  });
  fs.writeFileSync(target, xml);
}

console.log("Finnish catalogs updated for iOS and Android.");
