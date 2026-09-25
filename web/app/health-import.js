(() => {
  const u16=(v,o)=>v.getUint16(o,true), u32=(v,o)=>v.getUint32(o,true);
  async function xmlFromZip(buffer) {
    const view=new DataView(buffer); let eocd=-1;
    for(let i=buffer.byteLength-22;i>=Math.max(0,buffer.byteLength-65557);i--){if(u32(view,i)===0x06054b50){eocd=i;break;}}
    if(eocd<0) throw new Error('ZIP directory not found');
    const entries=u16(view,eocd+10), directory=u32(view,eocd+16); let offset=directory, found=null;
    const decoder=new TextDecoder();
    for(let i=0;i<entries;i++){
      if(u32(view,offset)!==0x02014b50) break;
      const method=u16(view,offset+10), compressed=u32(view,offset+20), nameLength=u16(view,offset+28), extraLength=u16(view,offset+30), commentLength=u16(view,offset+32), localOffset=u32(view,offset+42);
      const name=decoder.decode(new Uint8Array(buffer,offset+46,nameLength));
      if(name.toLowerCase().endsWith('export.xml')) found={method,compressed,localOffset,name};
      offset+=46+nameLength+extraLength+commentLength;
    }
    if(!found) throw new Error('export.xml was not found in this ZIP');
    if(u32(view,found.localOffset)!==0x04034b50) throw new Error('Invalid ZIP entry');
    const nameLength=u16(view,found.localOffset+26), extraLength=u16(view,found.localOffset+28);
    const start=found.localOffset+30+nameLength+extraLength;
    const bytes=new Uint8Array(buffer,start,found.compressed);
    if(found.method===0) return decoder.decode(bytes);
    if(found.method!==8||typeof DecompressionStream==='undefined') throw new Error('This browser cannot decompress the Health ZIP. Extract export.xml in Files and select that file instead.');
    try{return await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();}
    catch{throw new Error('The ZIP could not be decompressed here. Extract export.xml in Files and select it instead.');}
  }
  const attrs=tag=>{const result={}; for(const m of tag.matchAll(/([\w:.-]+)="([^"]*)"/g)) result[m[1]]=m[2]; return result;};
  const n=value=>Number.parseFloat(value)||0;
  const dayOf=a=>(a.startDate||a.creationDate||'').slice(0,10);
  function unitValue(value,unit,kind){
    const v=n(value); if(kind==='energy'&&unit==='kJ') return v/4.184;
    if(kind==='weight'&&unit==='lb') return v*0.45359237;
    return v;
  }
  function parseHealthXml(xml,onProgress=()=>{}){
    if(!xml.includes('<HealthData')) throw new Error('This does not look like an Apple Health export.xml file.');
    const days={}; let records=0; const tags=xml.match(/<(?:Record|Workout)\b[^>]*>/g)||[];
    tags.forEach((tag,index)=>{
      const a=attrs(tag), day=dayOf(a); if(!day) return;
      const d=days[day]||(days[day]={date:day,weight:null,bodyFat:null,steps:0,activeEnergy:0,dietaryEnergy:0,protein:0,carbs:0,fat:0,workouts:0,workoutMinutes:0});
      const type=a.type||a.workoutActivityType||'';
      if(type.endsWith('BodyMass')) d.weight=unitValue(a.value,a.unit,'weight');
      else if(type.endsWith('BodyFatPercentage')) d.bodyFat=n(a.value)*(a.unit==='%'&&n(a.value)<=1?100:1);
      else if(type.endsWith('StepCount')) d.steps+=n(a.value);
      else if(type.endsWith('ActiveEnergyBurned')) d.activeEnergy+=unitValue(a.value,a.unit,'energy');
      else if(type.endsWith('DietaryEnergyConsumed')) d.dietaryEnergy+=unitValue(a.value,a.unit,'energy');
      else if(type.endsWith('DietaryProtein')) d.protein+=n(a.value);
      else if(type.endsWith('DietaryCarbohydrates')) d.carbs+=n(a.value);
      else if(type.endsWith('DietaryFatTotal')) d.fat+=n(a.value);
      if(tag.startsWith('<Workout')){d.workouts++;d.workoutMinutes+=a.durationUnit==='min'?n(a.duration):n(a.duration)/60;d.activeEnergy+=unitValue(a.totalEnergyBurned,a.totalEnergyBurnedUnit,'energy');}
      records++; if(index%25000===0) onProgress(Math.min(98,Math.round(index/Math.max(1,tags.length)*100)));
    });
    onProgress(100);
    return {importedAt:new Date().toISOString(),recordCount:records,days:Object.values(days).sort((a,b)=>b.date.localeCompare(a.date))};
  }
  window.RTHealthImport={
    parseXml:parseHealthXml,
    async parse(file,onProgress){
      onProgress(3); const buffer=await file.arrayBuffer(); onProgress(10);
      const xml=file.name.toLowerCase().endsWith('.zip')?await xmlFromZip(buffer):new TextDecoder().decode(buffer);
      onProgress(25); return parseHealthXml(xml,onProgress);
    }
  };
})();
