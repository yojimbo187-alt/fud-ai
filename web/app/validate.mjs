import { access, readFile } from 'node:fs/promises';

const files=['index.html','styles.css','programs.js','health-import.js','app.js','sw.js','manifest.webmanifest'];
await Promise.all(files.map(file=>access(new URL(file,import.meta.url))));
const manifest=JSON.parse(await readFile(new URL('manifest.webmanifest',import.meta.url),'utf8'));
if(manifest.display!=='standalone'||!manifest.start_url||!manifest.icons?.length)throw new Error('PWA manifest is incomplete');
for(const script of ['programs.js','health-import.js','app.js','sw.js']){
  const source=await readFile(new URL(script,import.meta.url),'utf8');
  new Function(source);
}
globalThis.window=globalThis;
new Function(await readFile(new URL('programs.js',import.meta.url),'utf8'))();
if(RT_PROGRAMS.pplul.plan.map(day=>day.slots.length).join(',')!=='6,6,6,7,6')throw new Error('PPLUL catalog structure changed');
if(RT_PROGRAMS.pplul.plan.some(day=>day.slots.some(slot=>slot.options.length!==5)))throw new Error('Every PPLUL slot must keep five ranked choices');
new Function(await readFile(new URL('health-import.js',import.meta.url),'utf8'))();
const sample=RTHealthImport.parseXml(`<?xml version="1.0"?><HealthData><Record type="HKQuantityTypeIdentifierBodyMass" unit="kg" startDate="2026-09-25 08:00:00 +0300" value="81.2"/><Record type="HKQuantityTypeIdentifierStepCount" unit="count" startDate="2026-09-25 09:00:00 +0300" value="1234"/><Workout workoutActivityType="HKWorkoutActivityTypeTraditionalStrengthTraining" duration="45" durationUnit="min" totalEnergyBurned="250" totalEnergyBurnedUnit="kcal" startDate="2026-09-25 10:00:00 +0300"/></HealthData>`);
if(sample.days[0]?.weight!==81.2||sample.days[0]?.steps!==1234||sample.days[0]?.workouts!==1)throw new Error('Apple Health XML parser failed its fixture');
const html=await readFile(new URL('index.html',import.meta.url),'utf8');
for(const required of ['manifest.webmanifest','apple-mobile-web-app-capable','health-file','serviceWorker']){
  if(!html.includes(required)&&required!=='serviceWorker')throw new Error(`index.html is missing ${required}`);
}
console.log(`Validated ${files.length} Ruoka + Treeni PWA files.`);
