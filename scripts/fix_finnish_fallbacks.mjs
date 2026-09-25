import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const replacements = new Map(Object.entries({
  "You have not blocked anyone.": "Et ole estänyt ketään.",
  "Finding exercises…": "Etsitään liikkeitä…",
  "Date (YYYY-MM-DD)": "Päivämäärä (VVVV-KK-PP)",
  "Custom timed activity · calorie estimate uses a general activity rate": "Mukautettu ajastettu harjoitus · kaloriarvio käyttää yleistä aktiivisuustasoa",
  "Reps": "Toistot",
  "Minutes": "Minuutit",
  "Remove exercise": "Poista liike",
  "Calories are estimates. Use Calculate in the diary after adding your workout.": "Kalorit ovat arvioita. Käytä päiväkirjan Laske-toimintoa treenin lisäämisen jälkeen.",
  "Edit description": "Muokkaa kuvausta",
  "Adding…": "Lisätään…",
  "Text": "Teksti",
  "Add to diary": "Lisää päiväkirjaan",
  "Set %1$d · %2$s": "Sarja %1$d · %2$s",
  "Estimated burn: %1$d kcal": "Arvioitu kulutus: %1$d kcal",
  "Effort (moderate if unspecified)": "Rasitustaso (oletuksena kohtalainen)",
  "Vigorous": "Raskas",
  "RPE 1–10": "RPE 1–10",
  "Ruoka + Treeni uses the camera to scan food and barcodes.": "Ruoka + Treeni käyttää kameraa ruoan ja viivakoodien skannaamiseen.",
  "Ruoka + Treeni saves meal photos to your photo library when you tap Save.": "Ruoka + Treeni tallentaa ateriakuvat kuvakirjastoosi, kun napautat Tallenna.",
  "Needs attention": "Vaatii huomiota",
  "Gemma 4 download progress": "Gemma 4:n latauksen edistyminen",
  "Verifying Gemma 4 download": "Vahvistetaan Gemma 4:n latausta",
  "Delete Gemma 4?": "Poistetaanko Gemma 4?",
  "The downloaded model and its compiled cache will be removed from this iPhone. You can download it again later.": "Ladattu malli ja sen käännetty välimuisti poistetaan tästä iPhonesta. Voit ladata mallin myöhemmin uudelleen.",
  "This on-device image and text model is available on iPhones with at least 8 GB of physical memory.": "Tämä laitteessa toimiva kuva- ja tekstimalli on käytettävissä iPhoneissa, joissa on vähintään 8 Gt fyysistä muistia.",
  "2.59 GB download. Ruoka + Treeni checks for an additional 1 GB of free installation headroom.": "Latauksen koko on 2,59 Gt. Ruoka + Treeni tarkistaa lisäksi, että asennusta varten on 1 Gt vapaata tilaa.",
  "Verified and stored locally (%@). Tap Prepare now, or it will load on first use.": "Vahvistettu ja tallennettu paikallisesti (%@). Napauta Valmistele nyt, tai malli ladataan ensimmäisellä käyttökerralla.",
  "Verified and stored locally. Tap Prepare now, or it will load on first use.": "Vahvistettu ja tallennettu paikallisesti. Napauta Valmistele nyt, tai malli ladataan ensimmäisellä käyttökerralla.",
  "Downloading the pinned Gemma 4 model… Keep Ruoka + Treeni open until it finishes.": "Ladataan kiinnitettyä Gemma 4 -mallia… Pidä Ruoka + Treeni avoinna latauksen valmistumiseen asti.",
  "Checking the exact file size and SHA-256 before installation…": "Tarkistetaan tarkka tiedostokoko ja SHA-256 ennen asennusta…",
  "Compiling and loading the LiteRT-LM Metal runtime…": "Käännetään ja ladataan LiteRT-LM Metal -suoritusympäristöä…",
  "Ready for private, offline food images and text.": "Valmis yksityiseen ruokakuvien ja tekstin käsittelyyn ilman verkkoyhteyttä.",
  "Generating locally on this iPhone…": "Luodaan paikallisesti tällä iPhonella…",
  "Gemma 4 requires an iPhone with at least 8 GB of memory.": "Gemma 4 vaatii iPhonen, jossa on vähintään 8 Gt muistia.",
  "Gemma 4 is not downloaded. Download it in Settings → AI Providers.": "Gemma 4:ää ei ole ladattu. Lataa se kohdasta Asetukset → Tekoälypalveluntarjoajat.",
  "Gemma 4 is already busy. Please wait for the current operation to finish.": "Gemma 4 on jo käytössä. Odota nykyisen toiminnon valmistumista.",
  "Gemma 4 needs %@ free, including installation headroom. This iPhone currently has %@ available.": "Gemma 4 tarvitsee %@ vapaata tilaa asennusvara mukaan lukien. Tällä iPhonella on nyt käytettävissä %@.",
  "Available storage could not be checked, so the large model download was not started.": "Käytettävissä olevaa tallennustilaa ei voitu tarkistaa, joten suuren mallin latausta ei aloitettu.",
  "The Gemma 4 download could not be verified (%@). Please try again.": "Gemma 4:n latausta ei voitu vahvistaa (%@). Yritä uudelleen.",
  "Gemma 4 returned an empty response. Please try again.": "Gemma 4 palautti tyhjän vastauksen. Yritä uudelleen.",
  "expected %@ bytes, received %@": "odotettiin %@ tavua, vastaanotettiin %@",
  "The model server returned an invalid response.": "Mallipalvelin palautti virheellisen vastauksen.",
  "The model server returned HTTP %@.": "Mallipalvelin palautti HTTP-tilan %@.",
  "The model download completed without a file.": "Mallin lataus valmistui ilman tiedostoa.",
  "Multilingual Whisper Base running entirely on this iPhone. Download once for private offline transcription.": "Monikielinen Whisper Base toimii kokonaan tällä iPhonella. Lataa se kerran yksityistä offline-litterointia varten.",
  "Whisper Base download progress": "Whisper Basen latauksen edistyminen",
  "Delete Whisper Base?": "Poistetaanko Whisper Base?",
  "The downloaded model will be removed from this iPhone. You can download it again later.": "Ladattu malli poistetaan tästä iPhonesta. Voit ladata sen myöhemmin uudelleen.",
  "About 147 MB. Runs fully on-device after download.": "Noin 147 Mt. Toimii latauksen jälkeen kokonaan laitteessa.",
  "Stored locally (%@). No audio leaves this iPhone.": "Tallennettu paikallisesti (%@). Ääntä ei lähetetä tästä iPhonesta.",
  "Stored locally. No audio leaves this iPhone.": "Tallennettu paikallisesti. Ääntä ei lähetetä tästä iPhonesta.",
  "Downloading the multilingual Core ML model…": "Ladataan monikielistä Core ML -mallia…",
  "Optimizing the model for this iPhone…": "Optimoidaan mallia tälle iPhonelle…",
  "Transcribing locally…": "Litteroidaan paikallisesti…",
  "Whisper Base is not downloaded. Download it in Settings → Speech-to-Text.": "Whisper Basea ei ole ladattu. Lataa se kohdasta Asetukset → Puhe tekstiksi.",
  "Whisper Base is already busy. Please wait for the current operation to finish.": "Whisper Base on jo käytössä. Odota nykyisen toiminnon valmistumista.",
  "Whisper Base could not detect any speech in this recording.": "Whisper Base ei havainnut puhetta tässä tallenteessa.",
  "Loading notices…": "Ladataan ilmoituksia…",
  "Notices Unavailable": "Ilmoitukset eivät ole saatavilla",
  "The bundled notice file could not be found.": "Sovellukseen sisältyvää ilmoitustiedostoa ei löytynyt.",
  "The bundled notice file could not be opened.": "Sovellukseen sisältyvää ilmoitustiedostoa ei voitu avata.",
  "LiteRT-LM Third-Party Notices": "LiteRT-LM:n kolmansien osapuolten ilmoitukset",
  "On-Device Model": "Laitteessa toimiva malli",
  "Blocked Participants": "Estetyt osallistujat",
  "Calculated locally. No raw food, water, workout, Health, body-weight, or weight-loss data is uploaded.": "Lasketaan paikallisesti. Raakoja ruoka-, vesi-, treeni-, Terveys-, paino- tai painonpudotustietoja ei lähetetä.",
  "Challenge Deletion Pending": "Haasteen poisto odottaa",
  "Challenge category": "Haasteen luokka",
  "Challenge deletion is pending and will retry automatically when Ruoka + Treeni is online.": "Haasteen poisto odottaa ja sitä yritetään automaattisesti uudelleen, kun Ruoka + Treeni on verkossa.",
  "Choose a different display name that follows the Community Rules.": "Valitse toinen näyttönimi, joka noudattaa yhteisösääntöjä.",
  "Edit Public Profile": "Muokkaa julkista profiilia",
  "Eligibility & Community": "Kelpoisuus ja yhteisö",
  "Enter a handle only—without @, spaces, or a profile URL.": "Kirjoita vain käyttäjätunnus ilman @-merkkiä, välilyöntejä tai profiilin URL-osoitetta.",
  "Enter a handle, not a URL.": "Kirjoita käyttäjätunnus, ei URL-osoitetta.",
  "Enter the selected social handle, or choose No social link.": "Kirjoita valitun palvelun käyttäjätunnus tai valitse Ei sosiaalista linkkiä.",
  "Exact weekly aggregate payload": "Tarkka viikoittainen koontitietosisältö",
  "Ruoka + Treeni calculates these totals on this device. It never uploads food names, meals, timestamps, water entries, workout details, Health records, body weight, or weight loss.": "Ruoka + Treeni laskee nämä summat tällä laitteella. Se ei koskaan lähetä ruokien nimiä, aterioita, aikaleimoja, vesimerkintöjä, treenitietoja, Terveys-tietoja, painoa tai painonpudotusta.",
  "Ruoka + Treeni could not join the challenge. Try again.": "Ruoka + Treeni ei voinut liittyä haasteeseen. Yritä uudelleen.",
  "Ruoka + Treeni does not read or upload your date of birth for this confirmation.": "Ruoka + Treeni ei lue eikä lähetä syntymäaikaasi tätä vahvistusta varten.",
  "Ruoka + Treeni kept only the secure deletion credential and will retry removing your remote challenge data when you are online.": "Ruoka + Treeni säilytti vain suojatun poistotunnisteen ja yrittää etähaastetietojen poistamista uudelleen, kun olet verkossa.",
  "Handle without @": "Käyttäjätunnus ilman @-merkkiä",
  "I agree to the Community Rules": "Hyväksyn yhteisösäännöt",
  "Join Weekly Challenge": "Liity viikkohaasteeseen",
  "Join an optional, privacy-first leaderboard based on healthy weekly habits—not body weight. You must be 18 or older.": "Liity valinnaiseen, yksityisyyttä kunnioittavaan tulostaulukkoon, joka perustuu terveisiin viikkotapoihin eikä painoon. Sinun on oltava vähintään 18-vuotias.",
  "Last updated %1$@": "Päivitetty viimeksi %1$@",
  "Leaderboard results are visible only to people who join. You can leave and delete your remote challenge data at any time.": "Tulostaulukon tulokset näkyvät vain liittyneille. Voit poistua ja poistaa etähaastetietosi milloin tahansa.",
  "Leave & Delete Remote Data": "Poistu ja poista etätiedot",
  "Leave Challenge": "Poistu haasteesta",
  "Leave Weekly Challenge?": "Poistutaanko viikkohaasteesta?",
  "Loading leaderboard": "Ladataan tulostaulukkoa",
  "Manage Blocked Participants": "Hallitse estettyjä osallistujia",
  "More actions for %1$@": "Lisää toimintoja käyttäjälle %1$@",
  "No Blocked Participants": "Ei estettyjä osallistujia",
  "No leaderboard results are available yet.": "Tulostaulukon tuloksia ei ole vielä saatavilla.",
  "No other participants are ranked yet.": "Muita osallistujia ei ole vielä sijoitettu.",
  "No social link": "Ei sosiaalista linkkiä",
  "Offline — showing saved results": "Ei verkkoyhteyttä — näytetään tallennetut tulokset",
  "Offline — showing saved results · Last updated %1$@": "Ei verkkoyhteyttä — näytetään tallennetut tulokset · Päivitetty viimeksi %1$@",
  "Only weekly totals leave your device": "Vain viikkosummat poistuvat laitteeltasi",
  "Open @%1$@ on %2$@": "Avaa @%1$@ palvelussa %2$@",
  "Opens the optional public profile and consent form.": "Avaa valinnaisen julkisen profiilin ja suostumuslomakkeen.",
  "Optional report details": "Valinnaiset ilmoituksen lisätiedot",
  "Progress view": "Edistymisnäkymä",
  "Public Profile": "Julkinen profiili",
  "Remote challenge data was not deleted. Check your connection and try again.": "Etähaastetietoja ei poistettu. Tarkista yhteys ja yritä uudelleen.",
  "Report Participant": "Ilmoita osallistujasta",
  "Report reason": "Ilmoituksen syy",
  "Reports contain only the participant ID, selected reason, and optional details you type. No health or food data is included.": "Ilmoitukset sisältävät vain osallistujatunnuksen, valitun syyn ja kirjoittamasi valinnaiset lisätiedot. Terveys- tai ruokatietoja ei sisällytetä.",
  "Retry Deletion": "Yritä poistoa uudelleen",
  "Saving public profile": "Tallennetaan julkista profiilia",
  "Shared Weekly Totals": "Jaetut viikkosummat",
  "Thank you. The report was submitted for review.": "Kiitos. Ilmoitus lähetettiin tarkistettavaksi.",
  "The leaderboard could not be updated. Pull down to try again.": "Tulostaulukkoa ei voitu päivittää. Yritä uudelleen vetämällä alas.",
  "The report could not be sent. Try again.": "Ilmoitusta ei voitu lähettää. Yritä uudelleen.",
  "Unknown participant": "Tuntematon osallistuja",
  "Updating leaderboard": "Päivitetään tulostaulukkoa",
  "Use 2 to 40 letters or numbers.": "Käytä 2–40 kirjainta tai numeroa.",
  "Use 2–40 letters or numbers. Spaces, periods, underscores, apostrophes, and hyphens are allowed.": "Käytä 2–40 kirjainta tai numeroa. Välilyönnit, pisteet, alaviivat, heittomerkit ja yhdysmerkit ovat sallittuja.",
  "Waiting for first update": "Odotetaan ensimmäistä päivitystä",
  "Your display name and optional one social handle are visible to joined participants.": "Näyttönimesi ja yksi valinnainen sosiaalisen median tunnus näkyvät haasteeseen liittyneille.",
  "Your latest weekly totals are saved on this device and will retry automatically.": "Uusimmat viikkosummasi on tallennettu tälle laitteelle, ja lähettämistä yritetään automaattisesti uudelleen.",
  "Your public challenge profile could not be updated.": "Julkista haasteprofiiliasi ei voitu päivittää.",
  "Your public profile, weekly scores, and challenge reports will be deleted from Ruoka + Treeni. Your private food, water, and workout history stays on this device.": "Julkinen profiilisi, viikkopisteesi ja haasteilmoituksesi poistetaan Ruoka + Treeni -palvelusta. Yksityinen ruoka-, vesi- ja treenihistoriasi säilyy tällä laitteella.",
  "Ruoka + Treeni is live on Product Hunt 🚀": "Ruoka + Treeni on nyt Product Huntissa 🚀",
  "Ruoka + Treeni logo": "Ruoka + Treeni -logo",
  "Ruoka + Treeni is free with your own API keys (BYOK) — and always will be. If juggling keys feels confusing, Plus and Pro plans run the AI for you with no keys to manage. Totally optional, nothing changes unless you switch.": "Ruoka + Treeni on ilmainen omilla API-avaimillasi (BYOK) — ja pysyy sellaisena. Jos avainten hallinta tuntuu hankalalta, Plus- ja Pro-paketit hoitavat tekoälyn ilman omia avaimia. Tämä on täysin valinnaista, eikä mikään muutu, ellet vaihda.",
  "Ruoka + Treeni is live on Product Hunt": "Ruoka + Treeni on nyt Product Huntissa",
  "Ruoka + Treeni is an estimation tool, not a clinical instrument. Predictive equations carry inherent error (typically ±10%% for BMR). Consult a registered dietitian, physician, or sports medicine professional before significant diet changes — especially if you have a medical condition, are pregnant or breastfeeding, are under 18, or are managing an eating disorder.": "Ruoka + Treeni on arviointityökalu, ei kliininen mittalaite. Ennustekaavoihin liittyy luontainen virhe (BMR:ssä tyypillisesti ±10 %%). Keskustele laillistetun ravitsemusterapeutin, lääkärin tai urheilulääketieteen ammattilaisen kanssa ennen merkittäviä ruokavaliomuutoksia — etenkin jos sinulla on sairaus, olet raskaana tai imetät, olet alle 18-vuotias tai hoidat syömishäiriötä.",
  "Image AI Fallback": "Kuvatekoälyn varavaihtoehto",
  "Workout Burn Sync": "Treenikulutuksen synkronointi",
  "Ruoka + Treeni needs at least 3 recent days of Health Connect energy data before it can use your measured burn.": "Ruoka + Treeni tarvitsee vähintään kolmen viime päivän Health Connect -energiatiedot ennen mitatun kulutuksen käyttämistä.",
  "Ruoka + Treeni Today": "Ruoka + Treeni tänään",
  "Ruoka + Treeni Calories": "Ruoka + Treeni -kalorit",
  "Ruoka + Treeni Protein": "Ruoka + Treeni -proteiini",
  "Ruoka + Treeni widget needs a refresh. Open Ruoka + Treeni.": "Ruoka + Treeni -widget tarvitsee päivityksen. Avaa Ruoka + Treeni.",
  "Ruoka + Treeni Water": "Ruoka + Treeni -vesi"
  ,"Ruoka + Treeni is now completely free — the optional Premium subscription has been removed.": "Ruoka + Treeni on nyt täysin ilmainen — valinnainen Premium-tilaus on poistettu."
  ,"Ruoka + Treeni — AI Calorie Tracker": "Ruoka + Treeni — tekoälypohjainen kaloriseuranta"
  ,"Ruoka + Treeni is an estimation tool, not a clinical instrument. Predictive equations carry inherent error (typically ±10% for BMR). Consult a registered dietitian, physician, or sports medicine professional before significant diet changes — especially if you have a medical condition, are pregnant or breastfeeding, are under 18, or are managing an eating disorder.": "Ruoka + Treeni on arviointityökalu, ei kliininen mittalaite. Ennustekaavoihin liittyy luontainen virhe (BMR:ssä tyypillisesti ±10 %). Keskustele laillistetun ravitsemusterapeutin, lääkärin tai urheilulääketieteen ammattilaisen kanssa ennen merkittäviä ruokavaliomuutoksia — etenkin jos sinulla on sairaus, olet raskaana tai imetät, olet alle 18-vuotias tai hoidat syömishäiriötä."
  ,"Ruoka + Treeni would like to send you Notifications": "Ruoka + Treeni haluaa lähettää sinulle ilmoituksia"
  ,"Max Response Tokens": "Vastauksen tunnisteiden enimmäismäärä"
  ,"AI Providers & Fallbacks": "Tekoälypalveluntarjoajat ja varavaihtoehdot"
}));

function replaceNode(node) {
  if (!node || typeof node !== "object") return;
  if (typeof node.stringUnit?.value === "string") {
    node.stringUnit.value = replacements.get(node.stringUnit.value) ?? node.stringUnit.value;
  }
  for (const child of Object.values(node)) replaceNode(child);
}

for (const filename of [
  "Localizable.xcstrings", "AIErrorMessages.xcstrings", "BarcodeLookup.xcstrings",
  "InfoPlist.xcstrings", "LocalModels.xcstrings", "WeeklyChallenge.xcstrings"
]) {
  const file = path.join(root, "ios", "calorietracker", filename);
  const catalog = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const entry of Object.values(catalog.strings ?? {})) replaceNode(entry.localizations?.fi);
  fs.writeFileSync(file, `${JSON.stringify(catalog, null, 2)}\n`);
}

const fiDir = path.join(root, "android", "app", "src", "main", "res", "values-fi");
for (const filename of fs.readdirSync(fiDir).filter(name => name.endsWith(".xml"))) {
  const file = path.join(fiDir, filename);
  let xml = fs.readFileSync(file, "utf8");
  for (const [english, finnish] of replacements) xml = xml.replaceAll(english, finnish);
  fs.writeFileSync(file, xml);
}
