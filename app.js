
const CURRENT_WELCOME_VERSION='1.0.1';

function initializeBrandSplash(){
 const splash=document.querySelector('#brandSplash');
 if(!splash)return;

 const mode=state.preferences?.welcomeMode||'updates';
 const lastSeen=localStorage.getItem('uvpc-last-welcome-version')||state.preferences.lastWelcomeVersion||'';
 const shouldShow=mode==='always'||(mode==='updates'&&lastSeen!==CURRENT_WELCOME_VERSION);

 if(!shouldShow){
  splash.remove();
  return;
 }

 if(typeof window.UVPCDismissWelcome==='function'){
  // The standalone page controller already owns click and keyboard dismissal.
  splash.focus();
 }
}


function initializeSupportMilestone(){
 const key='uvpc-support-reminder-dismissed';
 const usageCount=state.projects?.length||0;
 const reminder=$('#milestoneSupport');
 if(!reminder||localStorage.getItem(key)==='true'||usageCount<10)return;

 $('#milestoneTitle').textContent=`You have ${usageCount} saved projects.`;
 $('#milestoneText').textContent='If UV Project Calculator Pro has helped your work, consider supporting continued development.';
 reminder.hidden=false;

 $('#closeMilestoneBtn').addEventListener('click',()=>{
  reminder.hidden=true;
  localStorage.setItem(key,'true');
 });
 $('#milestoneSupportBtn').addEventListener('click',()=>{
  reminder.hidden=true;
  navigate('support');
 });
}




function initializeSupportPage(){
 if($('#supportPayPalStatus'))$('#supportPayPalStatus').textContent='Opens PayPal securely';
 if($('#supportCoffeeStatus'))$('#supportCoffeeStatus').textContent='Opens Buy Me a Coffee securely';
 initializeSupportMilestone();
}


const SUPPORT_CONFIG={
 paypalUrl:'https://www.paypal.com/ncp/payment/QDN4D4CWH7Y7C',
 buyMeACoffeeUrl:'https://buymeacoffee.com/wetthefsce'
};


function renderSetupProfile(){
 if($('#setupProfileName'))$('#setupProfileName').textContent=state.profile.name;
 if($('#setupProfileBusiness'))$('#setupProfileBusiness').textContent=state.profile.business;
 if($('#setupProfileCountry'))$('#setupProfileCountry').textContent=state.profile.country;
 if($('#setupProfileCurrency'))$('#setupProfileCurrency').textContent=state.profile.currency;
}


function runTerminologyAudit(){
 const forbidden=['What-If Pricing','Quote Summary','Recommended Order Total'];
 const text=document.body.innerText;
 forbidden.forEach(term=>{
  if(text.includes(term))console.warn(`Terminology audit: legacy label still present: ${term}`);
 });
}

window.addEventListener('error',event=>{
 console.error('UV Project Calculator Pro startup error:',event.error||event.message);
 const toast=document.querySelector('#toast');
 if(toast){
  toast.textContent='An application error occurred. Open the browser console for details.';
  toast.classList.add('show');
 }
});
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function initializePricingWorkspaceRecalculation(){
 const quantityField=document.getElementById('quantity');
 if(quantityField){
  const recalculate=()=>{
   calculate();
   if(typeof renderDashboard==='function')renderDashboard();
  };
  quantityField.addEventListener('input',recalculate);
  quantityField.addEventListener('change',recalculate);
 }
 document.querySelectorAll('#view-calculator input, #view-calculator select').forEach(control=>{
  if(control===quantityField)return;
  if(control.dataset.pricingRecalcBound==='true')return;
  control.dataset.pricingRecalcBound='true';
  control.addEventListener('input',()=>calculate());
  control.addEventListener('change',()=>calculate());
 });
}


const UVPC_APP_VERSION='1.0.1';
const UVPC_BUILD_NUMBER='1059';
const UVPC_SUPPORT_EMAIL='MrDon123@gmail.com';

function getCurrentScreenName(){
 const active=document.querySelector('.view.active');
 if(!active)return 'Unknown';
 const key=active.id.replace('view-','');
 return titles[key]?.[0]||key;
}

function detectOperatingSystem(){
 const ua=navigator.userAgent||'';
 const platform=navigator.userAgentData?.platform||navigator.platform||'Unknown';
 if(/Windows/i.test(ua)||/Win/i.test(platform))return 'Windows';
 if(/Macintosh|Mac OS X/i.test(ua)||/Mac/i.test(platform))return 'macOS';
 if(/iPad|iPhone|iPod/i.test(ua))return 'iOS/iPadOS';
 if(/Android/i.test(ua))return 'Android';
 if(/Linux/i.test(ua)||/Linux/i.test(platform))return 'Linux';
 return platform;
}

function detectBrowser(){
 const ua=navigator.userAgent||'';
 if(/Edg\//.test(ua))return 'Microsoft Edge';
 if(/OPR\//.test(ua))return 'Opera';
 if(/Chrome\//.test(ua)&&!/Edg\//.test(ua))return 'Google Chrome';
 if(/Firefox\//.test(ua))return 'Mozilla Firefox';
 if(/Safari\//.test(ua)&&!/Chrome\//.test(ua))return 'Apple Safari';
 return ua||'Unknown browser';
}

function buildFeedbackDiagnostics(){
 let printer='Unknown';
 try{printer=activePrinterLabel()}catch(error){printer=state?.printer?.model||'Unknown'}
 return [
  'Automatic Diagnostic Information',
  '----------------------------------------',
  `Application: UV Project Calculator Pro Community Edition`,
  `Version: ${UVPC_APP_VERSION}`,
  `Build: ${UVPC_BUILD_NUMBER}`,
  `Browser: ${detectBrowser()}`,
  `Operating System: ${detectOperatingSystem()}`,
  `Current Screen: ${getCurrentScreenName()}`,
  `Active Printer: ${printer}`,
  `Date and Time: ${new Date().toLocaleString()}`,
  `Storage Status: ${document.querySelector('#storageStatusLabel')?.textContent||'Unknown'}`,
  '----------------------------------------'
 ].join('\n');
}

function openEmailDraft(subject,body){
 openEmailDraftTo(UVPC_SUPPORT_EMAIL,subject,body);
}
function openEmailDraftTo(to,subject,body){
 const uri=`mailto:${encodeURIComponent(to||'')}?subject=${encodeURIComponent(subject||'')}&body=${encodeURIComponent(body||'')}`;
 window.location.href=uri;
}

function openFeedbackModal(id){
 const modal=document.getElementById(id);
 if(modal)modal.hidden=false;
}

function closeFeedbackModal(id){
 const modal=document.getElementById(id);
 if(modal)modal.hidden=true;
}

function initializeFeedbackCenter(){
 const preview=document.getElementById('feedbackDiagnosticsPreview');
 if(preview)preview.textContent=buildFeedbackDiagnostics();

 const bugButton=document.getElementById('openBugReportBtn');
 const featureButton=document.getElementById('openFeatureRequestBtn');
 const contactButton=document.getElementById('contactSupportBtn');

 if(bugButton)bugButton.addEventListener('click',()=>openFeedbackModal('bugReportModal'));
 if(featureButton)featureButton.addEventListener('click',()=>openFeedbackModal('featureRequestModal'));
 if(contactButton)contactButton.addEventListener('click',()=>{
  const body=[
   'Hello Don,',
   '',
   'I need help with UV Project Calculator Pro.',
   '',
   'My question:',
   '',
   '',
   buildFeedbackDiagnostics()
  ].join('\n');
  openEmailDraft('UV Project Calculator Pro Support Request',body);
 });

 document.querySelectorAll('[data-close-feedback-modal]').forEach(button=>{
  button.addEventListener('click',()=>closeFeedbackModal(button.dataset.closeFeedbackModal));
 });

 const bugSend=document.getElementById('sendBugReportBtn');
 if(bugSend)bugSend.addEventListener('click',()=>{
  const doing=document.getElementById('bugDoing').value.trim();
  const happened=document.getElementById('bugHappened').value.trim();
  const expected=document.getElementById('bugExpected').value.trim();
  if(!doing||!happened||!expected){
   showToast('Please complete all three bug-report fields.');
   return;
  }
  const include=document.getElementById('bugIncludeDiagnostics').checked;
  const body=[
   'UV Project Calculator Pro Bug Report',
   '',
   'What I was doing:',
   doing,
   '',
   'What happened:',
   happened,
   '',
   'What I expected:',
   expected,
   '',
   include?buildFeedbackDiagnostics():'Diagnostic information was not included.'
  ].join('\n');
  openEmailDraft(`UV Project Calculator Pro Bug Report — Build ${UVPC_BUILD_NUMBER}`,body);
 });

 const featureSend=document.getElementById('sendFeatureRequestBtn');
 if(featureSend)featureSend.addEventListener('click',()=>{
  const title=document.getElementById('featureTitle').value.trim();
  const description=document.getElementById('featureDescription').value.trim();
  const benefit=document.getElementById('featureBenefit').value.trim();
  const priority=document.getElementById('featurePriority').value;
  if(!title||!description||!benefit){
   showToast('Please complete the feature title, description, and workflow benefit.');
   return;
  }
  const include=document.getElementById('featureIncludeDiagnostics').checked;
  const body=[
   'UV Project Calculator Pro Feature Request',
   '',
   `Feature: ${title}`,
   `Priority: ${priority}`,
   '',
   'Description:',
   description,
   '',
   'How it would improve my workflow:',
   benefit,
   '',
   include?buildFeedbackDiagnostics():'Diagnostic information was not included.'
  ].join('\n');
  openEmailDraft(`UV Project Calculator Pro Feature Request — ${title}`,body);
 });

 const copyButton=document.getElementById('copyDiagnosticsBtn');
 if(copyButton)copyButton.addEventListener('click',async()=>{
  const text=buildFeedbackDiagnostics();
  if(preview)preview.textContent=text;
  try{
   await navigator.clipboard.writeText(text);
   showToast('Diagnostics copied.');
  }catch(error){
   window.prompt('Copy diagnostic information:',text);
  }
 });
}


function applyAppearanceState(){
 const isLight=document.body.classList.contains('light');
 const darkToggle=$('#darkToggleSettings');
 const compactToggle=$('#compactToggleSettings');
 if(darkToggle)darkToggle.checked=!isLight;
 if(compactToggle)compactToggle.checked=document.body.classList.contains('compact');
}
function initializeConsolidatedSettings(){
 const themeButton=$('#themeBtn');
 const darkToggle=$('#darkToggleSettings');
 const compactToggle=$('#compactToggleSettings');
 const setupButton=$('#runGuidedSetupBtn');

 if(themeButton)themeButton.addEventListener('click',()=>{
  document.body.classList.toggle('light');
  applyAppearanceState();
 });
 if(darkToggle)darkToggle.addEventListener('change',event=>{
  document.body.classList.toggle('light',!event.target.checked);
  applyAppearanceState();
 });
 if(compactToggle)compactToggle.addEventListener('change',event=>{
  document.body.classList.toggle('compact',event.target.checked);
  applyAppearanceState();
 });
 if(setupButton)setupButton.addEventListener('click',()=>showWizard(true));
}

const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(n)||0);
const defaults={
 profile:{name:'UV Printer Owner',business:'UV Project Calculator Pro',country:'United States',currency:'USD',setupComplete:false},
 business:{owner:'Donald Youngner',email:'',phone:'',website:'',overhead:0,tax:0,shipping:0,quoteValidity:'14 days',deposit:0,terms:'Thank you for the opportunity to provide this estimate.'},
 printer:{model:'EufyMake E1',profileName:'Main E1 Printer',inkCartridgePrice:29.99,inkCartridgeCapacity:100,cleaningCartridgePrice:29.99,cleaningCartridgeCapacity:380,cleaning:.25,primerDefault:.35,serviceReserve:.50},
 printerProfiles:{'eufymake-e1':{family:'EufyMake E1',editions:{standard:{name:'EufyMake E1',edition:'Standard UV Profile',workflows:['Direct UV','UV DTF','Rotary','3D Texture'],inkFields:['cyan','magenta','yellow','black','white','gloss'],rates:{ink:.2999,cyan:.2999,magenta:.2999,yellow:.2999,black:.2999,white:.2999,gloss:.2999,fluorescent:0,flexWhite:0,dtColor:0,dtWhite:0,machine:5,electric:.30,maintenance:.50,cleaning:.25,primer:.35,serviceReserve:.50},cartridges:{inkPrice:29.99,inkCapacity:100,cleaningPrice:29.99,cleaningCapacity:380},note:'Official US EufyMake pricing effective July 2026: CMYKWG ink cartridges are $29.99 per 100 mL and the cleaning cartridge is $29.99 per 380 mL. Review regional pricing before quoting.'}}},'xtool-o1':{family:'xTool Omni',editions:{'single-uv':{name:'xTool Omni',edition:'Single UV Edition',bestFor:'Entry-level makers for rigid material personalization',workingArea:'Standard bed: 13 × 4.8 in (330 × 122 mm); large bed: 13 × 16.5 in (330 × 420 mm)',printHeads:'1 × Epson F1080',resolution:'720 × 1440 dpi',inkChannels:'CMYKWW; 3-in-1 varnish supports matte, gloss, and foil effects',workflows:['Direct UV','UV DTF','Varnish Effects'],inkFields:['cyan','magenta','yellow','black','white','varnish'],inkLabels:{varnish:'3-in-1 Varnish'},rates:{cyan:.50,magenta:.50,yellow:.50,black:.50,white:.57,varnish:.56,machine:7.5,electric:.40,maintenance:.75,cleaning:.35,primer:.35,serviceReserve:.75},cartridges:{inkCapacity:125,capacities:{}},note:'Hardware specifications confirmed from the supplied xTool Omni comparison. Ink and operating costs remain editable planning assumptions until official prices are available.'},'dual-uv':{name:'xTool Omni',edition:'Dual-Head UV Edition',bestFor:'Creators focused on advanced UV applications and exclusive neon effects',workingArea:'Standard bed: 13 × 4.8 in (330 × 122 mm); large bed: 13 × 16.5 in (330 × 420 mm)',printHeads:'2 × Epson F1080',resolution:'720 × 1440 dpi',inkChannels:'CMYKWW + rigid white, flexible white, fluorescent red, fluorescent yellow, and 3-in-1 varnish',workflows:['Direct UV','UV DTF','Fluorescent Effects','Flexible White','Varnish Effects'],inkFields:['cyan','magenta','yellow','black','white','rigidWhite','flexWhite','fluorescentRed','fluorescentYellow','varnish'],inkLabels:{rigidWhite:'Rigid White',flexWhite:'Flexible White',fluorescentRed:'Fluorescent Red',fluorescentYellow:'Fluorescent Yellow',varnish:'3-in-1 Varnish'},rates:{cyan:.50,magenta:.50,yellow:.50,black:.50,white:.57,rigidWhite:.57,flexWhite:.65,fluorescentRed:.65,fluorescentYellow:.65,varnish:.56,machine:10,electric:.50,maintenance:1,cleaning:.45,primer:.35,serviceReserve:1},cartridges:{inkCapacity:125,capacities:{white:290,rigidWhite:290,flexWhite:290}},note:'Hardware specifications confirmed from the supplied xTool Omni comparison. Ink and operating costs remain editable planning assumptions until official prices are available.'},'uv-dt-fabric':{name:'xTool Omni',edition:'UV + DT Fabric Edition',bestFor:'Creators with both apparel and hard-goods printing needs',workingArea:'Standard bed: 13 × 4.8 in (330 × 122 mm); large bed: 13 × 16.5 in (330 × 420 mm); DTG platen: 11.8 × 15.4 in (300 × 390 mm)',printHeads:'2 × Epson F1080',resolution:'720 × 1440 dpi',inkChannels:'UV: CMYKWWDT; fabric: CMYKWW; 3-in-1 varnish supports matte, gloss, and foil effects',workflows:['Direct UV','DT Fabric','UV DTF','Varnish Effects'],inkFields:['cyan','magenta','yellow','black','white','dtColor','dtWhite','varnish'],inkLabels:{dtColor:'DT Color',dtWhite:'DT White',varnish:'3-in-1 Varnish'},rates:{cyan:.50,magenta:.50,yellow:.50,black:.50,white:.57,dtColor:.55,dtWhite:.60,varnish:.56,machine:10,electric:.55,maintenance:1.1,cleaning:.50,primer:.35,serviceReserve:1.1},cartridges:{inkCapacity:125,capacities:{white:290,dtWhite:290}},note:'Hardware specifications confirmed from the supplied xTool Omni comparison. Ink and operating costs remain editable planning assumptions until official prices are available.'}}}},
 activePrinter:{family:'eufymake-e1',edition:'standard',workflow:'Direct UV'},
 preferences:{numberFormat:'us',autosave:true,lastCustomer:false,showCosts:true,confirmDelete:true,defaultStatus:'Draft',rounding:'1',welcomeMode:'updates',lastWelcomeVersion:''},
 activities:[
  {icon:'✓',text:'Community Edition loaded',time:'Today'},
  {icon:'▤',text:'Sample project data prepared',time:'Today'},
  {icon:'⚙',text:'Default shop rates applied',time:'Today'}
 ],
 rates:{ink:0.2999,color:0.2999,white:0.2999,varnish:0.2999,labor:27,machine:5,electric:0.30,maintenance:0.50,waste:5,margin:45},
 customers:[
  {name:'Walk-in Customer',type:'Retail',discount:0,email:'—'},
  {name:'James Walker',type:'Repeat Customer',discount:5,email:'james@example.com'},
  {name:'Sarah Johnson',type:'Retail',discount:0,email:'sarah@example.com'}
 ],
 materials:[
  {name:'4-Inch Ceramic Round',category:'Ceramic',cost:.77,supplier:'Primary Supplier',sku:'CER-4',note:'Standard coaster blank'},
  {name:'3-Inch Ceramic Round',category:'Ceramic',cost:.54,supplier:'Primary Supplier',sku:'CER-3',note:'Small coaster blank'},
  {name:'Faux Leather Patch',category:'Leather',cost:1.15,supplier:'Patch Vendor',sku:'LP-BRN',note:'Brown adhesive-back'},
  {name:'Clear Acrylic Plate',category:'Acrylic',cost:3.40,supplier:'Acrylic Vendor',sku:'ACR-CLR',note:'Small sign blank'}
 ],
 physicalPrinters:[
  {id:'e1-main',name:'Main E1 Printer',family:'eufymake-e1',edition:'standard',lastReconciledAt:'',consumables:[
   {id:'cyan',name:'Cyan',category:'Ink',unit:'mL',capacity:100,packagePrice:29.99,remaining:100,lowThreshold:20,color:'#16c7d9',includeInPricing:true},
   {id:'magenta',name:'Magenta',category:'Ink',unit:'mL',capacity:100,packagePrice:29.99,remaining:100,lowThreshold:20,color:'#ec4c9a',includeInPricing:true},
   {id:'yellow',name:'Yellow',category:'Ink',unit:'mL',capacity:100,packagePrice:29.99,remaining:100,lowThreshold:20,color:'#f1c40f',includeInPricing:true},
   {id:'black',name:'Black',category:'Ink',unit:'mL',capacity:100,packagePrice:29.99,remaining:100,lowThreshold:20,color:'#3d4853',includeInPricing:true},
   {id:'white',name:'White',category:'Ink',unit:'mL',capacity:100,packagePrice:29.99,remaining:100,lowThreshold:20,color:'#dfe8f0',includeInPricing:true},
   {id:'gloss',name:'Gloss',category:'Ink',unit:'mL',capacity:100,packagePrice:29.99,remaining:100,lowThreshold:20,color:'#8bd6ff',includeInPricing:true},
   {id:'cleaning',name:'Cleaning Cartridge',category:'Cleaning',unit:'mL',capacity:380,packagePrice:29.99,remaining:380,lowThreshold:76,color:'#7ad9a6',includeInPricing:false}
  ]}
 ],
 inventoryTransactions:[],
 projects:[
  {id:1,status:'Approved',notes:'',name:'Custom Leather Patch',customer:'James Walker',qty:10,cost:73.25,price:125,margin:41.4,date:'Jul 10, 2026'},
  {id:2,status:'Quoted',notes:'',name:'Coasters - Eagle Design',customer:'Walk-in Customer',qty:4,cost:47.45,price:86.75,margin:45.3,date:'Jul 9, 2026'},
  {id:3,status:'In Production',notes:'',name:'Tumbler UV Print',customer:'Sarah Johnson',qty:1,cost:20.02,price:32.40,margin:38.2,date:'Jul 8, 2026'},
  {id:4,status:'Completed',notes:'',name:'Nameplate - Aluminum',customer:'Walk-in Customer',qty:2,cost:34.80,price:58.10,margin:40.1,date:'Jul 7, 2026'},
  {id:5,status:'Estimate',notes:'',name:'4-Inch Ceramic Coaster',customer:'Walk-in Customer',qty:1,cost:9.42,price:31,margin:69.6,date:'Jul 12, 2026'}
 ]
};
function installXtoolRetailCatalog(){
 const editions=defaults.printerProfiles['xtool-o1'].editions;
 const essentialRate=120.99/750,essentialBottle=120.99/6;
 const essentialRates={cyan:essentialRate,magenta:essentialRate,yellow:essentialRate,black:essentialRate,white:essentialRate,varnish:essentialRate};
 const essentialPrices={cyan:essentialBottle,magenta:essentialBottle,yellow:essentialBottle,black:essentialBottle,white:essentialBottle,varnish:essentialBottle};
 const commonConsumables=[
  {id:'uvMaintenanceTank',name:'UV Maintenance Tank',category:'Maintenance',unit:'mL',capacity:260,packagePrice:31.99,color:'#7c8ca5',includeInPricing:true},
  {id:'primerWipes',name:'UV Printing Primer Wipes',category:'Primer',unit:'wipe',capacity:50,packagePrice:15,color:'#59c98a',includeInPricing:true}
 ];
 Object.assign(editions['single-uv'],{
  confirmedRateFields:Object.keys(essentialRates),rates:{...editions['single-uv'].rates,...essentialRates},
  cartridges:{inkCapacity:125,capacities:{},prices:essentialPrices,sets:{uvEssential:{name:'UV Ink Essential Set',retailPrice:120.99,totalVolume:750}}},
  additionalConsumables:structuredClone(commonConsumables),
  note:'Confirmed retail: UV Ink Essential Set $120.99 (six 125 mL inks), UV Maintenance Tank $31.99, and Primer Wipes $15 per 50. Machine and other operating rates remain editable planning assumptions.'
 });
 Object.assign(editions['dual-uv'],{
  confirmedRateFields:Object.keys(essentialRates),rates:{...editions['dual-uv'].rates,...essentialRates},
  cartridges:{inkCapacity:125,capacities:{rigidWhite:290,flexWhite:290},prices:essentialPrices,sets:{uvEssential:{name:'UV Ink Essential Set',retailPrice:120.99,totalVolume:750}}},
  additionalConsumables:structuredClone(commonConsumables),
  note:'Confirmed retail: UV Ink Essential Set $120.99, UV Maintenance Tank $31.99, and Primer Wipes $15 per 50. Expansion-set ink prices and operating rates remain editable assumptions.'
 });
 const fabricRate=104.99/790,dtRates={dtCyan:fabricRate,dtMagenta:fabricRate,dtYellow:fabricRate,dtBlack:fabricRate,dtWhite:fabricRate};
 const dtPrices={dtCyan:fabricRate*125,dtMagenta:fabricRate*125,dtYellow:fabricRate*125,dtBlack:fabricRate*125,dtWhite:fabricRate*290};
 Object.assign(editions['uv-dt-fabric'],{
  inkFields:['cyan','magenta','yellow','black','white','varnish','dtCyan','dtMagenta','dtYellow','dtBlack','dtWhite'],
  inkLabels:{varnish:'3-in-1 Varnish',dtCyan:'DT Cyan',dtMagenta:'DT Magenta',dtYellow:'DT Yellow',dtBlack:'DT Black',dtWhite:'DT White'},
  confirmedRateFields:[...Object.keys(essentialRates),...Object.keys(dtRates)],
  rates:{...editions['uv-dt-fabric'].rates,...essentialRates,...dtRates},
  cartridges:{inkCapacity:125,capacities:{dtWhite:290},prices:{...essentialPrices,...dtPrices},sets:{uvEssential:{name:'UV Ink Essential Set',retailPrice:120.99,totalVolume:750},dtFabric:{name:'DT Fabric Ink Set',retailPrice:104.99,totalVolume:790}}},
  additionalConsumables:[...structuredClone(commonConsumables),{id:'dtMaintenanceTank',name:'DT Maintenance Tank',category:'Maintenance',unit:'mL',capacity:260,packagePrice:31.99,color:'#647b6c',includeInPricing:true}],
  note:'Confirmed retail: UV Ink Essential Set $120.99, DT Fabric Ink Set $104.99, UV/DT Maintenance Tanks $31.99 each, and Primer Wipes $15 per 50. Machine and other operating rates remain editable assumptions.'
 });
}
installXtoolRetailCatalog();
function installXtoolPublicLaunchSpecifications(){
 const family=defaults.printerProfiles['xtool-o1'],editions=family.editions;
 family.family='xTool O1 Omni Printer';
 const common={
  name:'xTool O1 Omni Printer',resolution:'Up to 720 × 1440 dpi',embossedHeight:'Up to 7 mm (0.28 in)',visionSystem:'Pixel-Scan™ Vision System — 1440 × 1200 dpi',positioningAccuracy:'±0.2 mm',dimensions:'28.1 × 14.7 × 18.4 in (714 × 374 × 468.5 mm)',supportedOS:'macOS and Windows',remoteManagement:'App remote cleaning and control',automatedMaintenance:'Automatic white-ink stirring and circulation; automatic printhead moisture protection',upgradeNotice:'Factory-configured edition — printhead and ink-system editions cannot be upgraded later.',launchStatus:'Publicly released',officialSource:'xTool product page, support FAQ, and O1 user manual; audited September 2026'
 };
 Object.assign(editions['single-uv'],common,{
  inkChannels:'UV printhead: CMYKWV (Cyan, Magenta, Yellow, Black, White, Varnish)',
  materials:'Basic rigid materials: acrylic, wood, metal, glass, ceramic, and compatible plastics',
  certifications:'Non-reprotoxic ink; GREENGUARD® certified UV ink',weight:'89.5 lb (40.6 kg)',
  workflows:['Direct UV','UV DTF (requires laminator)','Varnish Effects','3D Texture'],
  note:`${editions['single-uv'].note} Official public-launch specifications audited September 2026. This edition is factory configured and cannot be upgraded to another printhead edition.`
 });
 Object.assign(editions['dual-uv'],common,{
  inkChannels:'UV head 1: CMYKWV; UV head 2: Rigid White, Flexible White, Fluorescent Red, Fluorescent Yellow',
  materials:'Rigid and flexible materials: acrylic, leather, wood, canvas, metal, glass, ceramic, and compatible plastics',
  certifications:'Non-reprotoxic ink; GREENGUARD® Gold certified UV ink',weight:'90.7 lb (41.12 kg)',
  workflows:['Direct UV','UV DTF (requires laminator)','Fluorescent Effects','Rigid White','Flexible White','Varnish Effects','3D Texture'],
  note:`${editions['dual-uv'].note} Official public-launch specifications audited September 2026. This edition is factory configured and cannot be upgraded to another printhead edition.`
 });
 Object.assign(editions['uv-dt-fabric'],common,{
  inkChannels:'UV printhead: CMYKWV; DT fabric printhead: CMYKWW',
  materials:'Rigid and fabric materials: acrylic, wood, metal, glass, ceramic, leather, canvas, cotton, polyester, and compatible fabrics',
  certifications:'Non-reprotoxic ink; GREENGUARD® Gold certified UV ink; OEKO-TEX® certified DT fabric ink',weight:'90.7 lb (41.12 kg)',
  workflows:['Direct UV','UV DTF (requires laminator)','DTG Direct-to-Garment','DTF Fabric Transfer','Varnish Effects','3D Texture'],
  note:`${editions['uv-dt-fabric'].note} Official public-launch ink paths are UV CMYKWV plus a separate DT CMYKWW printhead. This edition is factory configured and cannot be upgraded to another printhead edition.`
 });
}
installXtoolPublicLaunchSpecifications();
let state=window.__UVPC_INITIAL_STATE__||structuredClone(defaults);
state.profile={...defaults.profile,...(state.profile||{})};
state.activities=state.activities||structuredClone(defaults.activities);
state.business={...defaults.business,...(state.business||{})};
state.printer={...defaults.printer,...(state.printer||{})};
state.printerProfiles=state.printerProfiles||structuredClone(defaults.printerProfiles);
function upgradeConfirmedXtoolProfiles(){
 const confirmed=defaults.printerProfiles['xtool-o1'],saved=state.printerProfiles['xtool-o1']||{};
 const editions={...(saved.editions||{})};
 const legacyRates={cyan:.50,magenta:.50,yellow:.50,black:.50,white:.57,varnish:.56,dtColor:.55,dtWhite:.60};
 Object.entries(confirmed.editions).forEach(([id,spec])=>{
  const previous=editions[id]||{},rates={...spec.rates,...(previous.rates||{})};
  (spec.confirmedRateFields||[]).forEach(field=>{const old=previous.rates?.[field];if(old===undefined||Math.abs(Number(old)-Number(legacyRates[field]))<.000001)rates[field]=spec.rates[field]});
  editions[id]={...previous,...structuredClone(spec),rates,cartridges:{...(previous.cartridges||{}),...spec.cartridges,capacities:{...(previous.cartridges?.capacities||{}),...(spec.cartridges?.capacities||{})},prices:{...(previous.cartridges?.prices||{}),...(spec.cartridges?.prices||{})},sets:{...(previous.cartridges?.sets||{}),...(spec.cartridges?.sets||{})}}};
 });
 state.printerProfiles['xtool-o1']={...saved,...confirmed,editions};
}
upgradeConfirmedXtoolProfiles();
state.activePrinter={...defaults.activePrinter,...(state.activePrinter||{})};
state.preferences={...defaults.preferences,...(state.preferences||{})};

state.rates={...defaults.rates,...(state.rates||{})};
if(!Number.isFinite(Number(state.rates.ink))){
 const legacy=[state.rates.color,state.rates.white,state.rates.varnish].map(Number).filter(Number.isFinite);
 state.rates.ink=legacy.length?legacy.reduce((a,b)=>a+b,0)/legacy.length:defaults.rates.ink;
}
state.printer={
 ...defaults.printer,
 ...(state.printer||{}),
 inkCartridgePrice:Number(state.printer?.inkCartridgePrice)||defaults.printer.inkCartridgePrice,
 inkCartridgeCapacity:Number(state.printer?.inkCartridgeCapacity)||defaults.printer.inkCartridgeCapacity,
 cleaningCartridgePrice:Number(state.printer?.cleaningCartridgePrice)||defaults.printer.cleaningCartridgePrice,
 cleaningCartridgeCapacity:Number(state.printer?.cleaningCartridgeCapacity)||defaults.printer.cleaningCartridgeCapacity
};

state.materials=(state.materials||[]).map(m=>({supplier:'',sku:'',note:'',...m}));
state.projects=(state.projects||[]).map(p=>({status:'Draft',notes:'',printer:'EufyMake E1 — Standard UV Profile',printerFamily:'eufymake-e1',printerEdition:'standard',...p,inputs:p.inputs?{quantityPricingMode:'batch-job',setupMinutes:0,...p.inputs}:p.inputs}));
state.physicalPrinters=(state.physicalPrinters||structuredClone(defaults.physicalPrinters)).map(printer=>({...printer,consumables:(printer.consumables||[]).map(item=>({category:'Ink',unit:'mL',capacity:100,packagePrice:0,remaining:0,lowThreshold:20,color:'#2997ff',includeInPricing:true,...item}))}));
state.inventoryTransactions=state.inventoryTransactions||[];
function normalizeInventoryState(){
 state.printerProfiles=state.printerProfiles||structuredClone(defaults.printerProfiles);upgradeConfirmedXtoolProfiles();
 state.physicalPrinters=(Array.isArray(state.physicalPrinters)&&state.physicalPrinters.length?state.physicalPrinters:structuredClone(defaults.physicalPrinters)).map(printer=>({...printer,consumables:(printer.consumables||[]).map(item=>({category:'Ink',unit:'mL',capacity:100,packagePrice:0,remaining:0,lowThreshold:20,color:'#2997ff',includeInPricing:true,...item}))}));
 state.inventoryTransactions=Array.isArray(state.inventoryTransactions)?state.inventoryTransactions:[];
 state.physicalPrinters.filter(printer=>printer.family==='xtool-o1').forEach(synchronizeConfirmedXtoolConsumables);
 state.projects=(state.projects||[]).map(project=>({...project,inventoryDeducted:!!project.inventoryDeducted,inventoryTransactionIds:project.inventoryTransactionIds||[]}));
}
normalizeInventoryState();
let editingId=null;
let scenarioOriginal=null;
let scenarioSourceId=null;
function save(activityText){
 if(activityText){state.activities.unshift({icon:'✓',text:activityText,time:'Just now'});state.activities=state.activities.slice(0,8)}
 window.UVPCStorage.saveState(state).then(()=>{
  const label=$('#storageStatusLabel');if(label)label.textContent='Saved locally';
  const last=$('#lastAutoSave');if(last)last.textContent=new Date().toLocaleString();
  showToast('Saved locally');
 }).catch(error=>{console.error(error);showToast('Local save failed')});
}
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
const titles={
 dashboard:['Business Dashboard','See the price, profit, margin, and health of your current UV project at a glance.'],
 projects:['Projects','Manage estimates, quotes, and production jobs.'],
 calculator:['Pricing Workspace','Build accurate quotes using your real production costs.'],
 customers:['Customers Library','Manage customer details, discounts, and contact information.'],
 materials:['Material Library','Maintain reusable blanks, supplies, suppliers, SKUs, and unit costs.'],
 inventory:['Consumables & Ink Center','Estimate remaining supplies by physical printer and completed job.'],
 global:['Application Settings','Manage cost rates, printer, business, backup, preferences, appearance, setup, readiness, and reset options.'],
 whatif:['Scenario Builder','Experiment freely without changing the original project.'],
 reports:['Reports','Review selling prices, production costs, profit, and project performance.'],
 help:['Help & Feedback','Report bugs, request features, and contact support.'],
 support:['Support the Project','Optional ways to support continued development.'],
 about:['About','Application information, version details, and edition status.']
};
function navigate(view){
 $$('.view').forEach(v=>v.classList.remove('active')); $('#view-'+view).classList.add('active');
 $$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===view));
 $('#pageTitle').textContent=titles[view][0];$('#pageSubtitle').textContent=titles[view][1];
 $('#sidebar').classList.remove('open'); window.scrollTo({top:0,behavior:'smooth'});
 if(view==='calculator') calculate(); if(view==='reports') renderReports(); if(view==='help'){const p=$('#feedbackDiagnosticsPreview');if(p)p.textContent=buildFeedbackDiagnostics();}
}
$$('.nav-item[data-view]').forEach(b=>b.onclick=()=>navigate(b.dataset.view));
$$('[data-view-target]').forEach(b=>b.onclick=()=>navigate(b.dataset.viewTarget));
$$('[data-open-calculator]').forEach(b=>b.onclick=()=>{editingId=null;resetForm();navigate('calculator')});
$('#newProjectBtn').onclick=()=>{editingId=null;resetForm();navigate('calculator')}; $('#menuBtn').onclick=()=>$('#sidebar').classList.toggle('open');

function createPricingSnapshot(values={}){
 const cost=Math.max(0,Number(values.cost??values.totalCost)||0);
 const price=Math.max(0,Number(values.priceBeforeTax??values.price??values.orderPrice)||0);
 const taxRate=Math.max(0,Number(values.taxRate??values.tax)||0);
 const taxAmount=Number.isFinite(Number(values.taxAmount))?Number(values.taxAmount):price*taxRate/100;
 const customerTotal=Number.isFinite(Number(values.customerTotal))?Number(values.customerTotal):(Number.isFinite(Number(values.withTax))?Number(values.withTax):price+taxAmount);
 const profit=Number.isFinite(Number(values.profit))?Number(values.profit):price-cost;
 const margin=Number.isFinite(Number(values.margin))?Number(values.margin):(price?profit/price*100:0);
 return {schemaVersion:1,cost,priceBeforeTax:price,taxRate,taxAmount,customerTotal,profit,margin};
}
function getProjectPricing(project){
 const stored=project?.pricing||{};
 const pricing=createPricingSnapshot({
  cost:Number.isFinite(Number(stored.cost))?stored.cost:project?.cost,
  priceBeforeTax:Number.isFinite(Number(stored.priceBeforeTax))?stored.priceBeforeTax:project?.price,
  taxRate:Number.isFinite(Number(stored.taxRate))?stored.taxRate:(project?.taxRate??project?.inputs?.salesTax),
  taxAmount:stored.taxAmount,
  customerTotal:Number.isFinite(Number(stored.customerTotal))?stored.customerTotal:project?.customerTotal,
  profit:stored.profit,
  margin:stored.margin
 });
 return {...pricing,price:pricing.priceBeforeTax,qty:Math.max(1,Number(project?.qty)||1)};
}
function totals(){
 const values=state.projects.map(getProjectPricing);
 const revenue=values.reduce((s,p)=>s+p.price,0),cost=values.reduce((s,p)=>s+p.cost,0),profit=revenue-cost;
 return {revenue,cost,profit,margin:revenue?profit/revenue*100:0};
}
function getDashboardProject(){
 const select=$('#dashboardProjectSelect');
 const selectedId=select?Number(select.value):dashboardSelectedProjectId;
 return state.projects.find(p=>Number(p.id)===selectedId)||state.projects[state.projects.length-1]||null;
}
function getBusinessHealth(project){
 if(!project)return {level:'neutral',label:'No Project',title:'No Project Selected',message:'Select a project to review pricing and profitability.',recommendation:'Create or select a project to begin.'};
 const target=Number(state.rates.margin)||45;
 const pricing=getProjectPricing(project);
 const margin=pricing.margin;
 const profit=pricing.profit;
 if(profit<=0||margin<target-15)return {level:'danger',label:'Action Required',title:'Below Target',message:`This project is producing ${money(profit)} profit at a ${margin.toFixed(1)}% margin.`,recommendation:`Increase the selling price to approximately ${money(pricing.cost/(1-target/100))} to reach the ${target.toFixed(1)}% target margin.`};
 if(margin<target)return {level:'warning',label:'Review Pricing',title:'Review Pricing',message:`The project is profitable, but its ${margin.toFixed(1)}% margin is below your ${target.toFixed(1)}% target.`,recommendation:`Consider increasing the quote by ${money(Math.max(0,pricing.cost/(1-target/100)-pricing.price))}.`};
 return {level:'good',label:'Healthy',title:'Healthy Project',message:`The project meets or exceeds your ${target.toFixed(1)}% target margin.`,recommendation:'The current customer quote supports your pricing goal. No increase is required.'};
}
function renderDashboard(){
 const t=totals();
 const hour=new Date().getHours(),greeting=hour<12?'Good morning':hour<18?'Good afternoon':'Good evening';
 if($('#dashboardGreeting'))$('#dashboardGreeting').textContent=`${greeting}, ${state.profile.name}.`;
 $('#accountName').textContent=state.profile.name;$('#menuAccountName').textContent=state.profile.name;$('#menuBusinessName').textContent=state.profile.business;
 $('#accountAvatar').textContent=state.profile.name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()||'UV';
 $('#setupProgressBar').style.width=state.profile.setupComplete?'100%':'35%';
 $('#setupSummary').textContent=state.profile.setupComplete?`Configured for ${state.profile.business}. You can rerun setup at any time.`:'Complete Guided Setup to personalize printer costs, business rates, and pricing goals.';

 populateDashboardProjectSelect();
 const p=getDashboardProject();
 const health=getBusinessHealth(p);
 const target=Number(state.rates.margin)||45;

 $('#metricProjects').textContent=state.projects.length;
 $('#sumRevenue').textContent=money(t.revenue);
 $('#metricProfit').textContent=money(t.profit);
 $('#metricMargin').textContent=t.margin.toFixed(1)+'%';

 if(p){
  const pricing=getProjectPricing(p);
  const profit=pricing.profit;
  const unitPrice=pricing.price/Math.max(1,p.qty);
  $('#dashboardHeroPrice').textContent=money(pricing.price);
  $('#dashboardHeroUnit').textContent=`${money(unitPrice)} per unit`;
  $('#dashboardHeroProject').textContent=p.name;
  $('#dashboardHeroStatus').textContent=p.status||'Draft';
  $('#dashboardProductionCost').textContent=money(pricing.cost);
  $('#dashboardExpectedProfit').textContent=money(profit);
  $('#dashboardProfitPerUnit').textContent=`${money(profit/Math.max(1,p.qty))} profit per item`;
  $('#dashboardProfitMargin').textContent=pricing.margin.toFixed(1)+'%';
  $('#dashboardMarginTarget').textContent=`Target ${target.toFixed(1)}%`;
  $('#dashboardHeroMessage').textContent=health.message;
  $('#currentProjectName').textContent=p.name;
  $('#currentProjectCustomer').textContent=p.customer;
  $('#currentProjectPrinter').textContent=p.printer||activePrinterLabel();
  $('#currentProjectStatus').textContent=p.status||'Draft';
  $('#currentProjectStatus').className=`dashboard-status ${getProjectStatusClass(p.status)}`;
  $('#dashboardHeroStatus').className=`dashboard-status ${getProjectStatusClass(p.status)}`;
  $('#currentProjectQuantity').textContent=p.qty;
  $('#currentProjectDate').textContent=p.date||'—';
 }else{
  ['dashboardHeroPrice','dashboardProductionCost','dashboardExpectedProfit'].forEach(id=>$('#'+id).textContent='$0.00');
  $('#dashboardHeroUnit').textContent='$0.00 per unit';$('#dashboardProfitMargin').textContent='0.0%';$('#dashboardMarginTarget').textContent=`Target ${target.toFixed(1)}%`;
  $('#dashboardHeroProject').textContent='No project selected';$('#dashboardHeroStatus').textContent='—';$('#dashboardHeroMessage').textContent=health.message;
  ['currentProjectName','currentProjectCustomer','currentProjectPrinter','currentProjectStatus','currentProjectQuantity','currentProjectDate'].forEach(id=>$('#'+id).textContent='—');
  $('#currentProjectStatus').className='';$('#dashboardHeroStatus').className='';
 }

 const card=$('#businessHealthCard');
 card.classList.remove('warning','danger-state');
 if(health.level==='warning')card.classList.add('warning');
 if(health.level==='danger')card.classList.add('danger-state');
 $('#businessHealthTitle').textContent=health.title;
 $('#businessHealthMessage').textContent=health.message;
 $('#businessHealthRecommendation').textContent=health.recommendation;
 $('#dashboardHealthPill').textContent=health.label;
 $('#businessHealthIndicator').textContent='●';

 const profile=getActivePrinterProfile();
 const printerCard=$('#activePrinterDashboardCard');
 if(printerCard){
  printerCard.classList.remove('eufymake','xtool');
  printerCard.classList.add(state.activePrinter.family==='xtool-o1'?'xtool':'eufymake');
 }
 $('#dashboardPrinterName').textContent=profile.name;
 $('#dashboardPrinterEdition').textContent=profile.edition;
 $('#dashboardPrinterWorkflow').textContent=state.activePrinter.workflow||profile.workflows[0];
 $('#dashboardMachineRate').textContent=`${money(state.rates.machine)}/hr`;
 $('#dashboardPrinterMark').textContent=state.activePrinter.family==='xtool-o1'?'xT':'E1';
 if($('#dashboardHeroPrinter'))$('#dashboardHeroPrinter').textContent=`${profile.name} — ${profile.edition}`;

 renderDashboardBackupStatus();
 $('#recentProjectsBody').innerHTML=state.projects.slice(-5).reverse().map(project=>{const pricing=getProjectPricing(project);return `<tr data-project-id="${project.id}"><td><strong>${esc(project.name)}</strong><br><small>${esc(project.date||'')}</small></td><td>${esc(project.customer)}</td><td><strong>${money(pricing.price)}</strong></td><td class="positive">${money(pricing.profit)}</td><td class="${pricing.margin>=target?'positive':''}">${pricing.margin.toFixed(1)}%</td><td><span class="status-pill">${esc(project.status||'Draft')}</span></td></tr>`}).join('')||'<tr><td colspan="6">No projects yet. Create your first quote to activate Dashboard 2.0.</td></tr>';
 document.querySelectorAll('#recentProjectsBody tr[data-project-id]').forEach(row=>row.onclick=()=>{dashboardSelectedProjectId=Number(row.dataset.projectId);$('#dashboardProjectSelect').value=String(dashboardSelectedProjectId);renderDashboard()});
}
function getBackupHealth(){
 const raw=localStorage.getItem('uvpc-last-backup-at');
 if(!raw)return {level:'never',title:'No Backup Created',detail:'No backup recorded',showReminder:true};
 const date=new Date(raw);
 if(Number.isNaN(date.getTime()))return {level:'never',title:'No Backup Created',detail:'No valid backup date recorded',showReminder:true};
 const days=Math.floor((Date.now()-date.getTime())/86400000);
 if(days<30)return {level:'current',title:'Backup Current',detail:`Last backup: ${date.toLocaleString()}`,showReminder:false};
 if(days<90)return {level:'aging',title:'Backup Aging',detail:`Last backup: ${date.toLocaleString()} (${days} days ago)`,showReminder:true};
 return {level:'overdue',title:'Backup Recommended',detail:`Last backup: ${date.toLocaleString()} (${days} days ago)`,showReminder:true};
}
function renderDashboardBackupStatus(){
 const status=getBackupHealth();
 const dot=$('#dashboardBackupDot'),health=$('#dashboardBackupHealth'),last=$('#dashboardBackupLast');
 if(dot){dot.classList.remove('good','aging','overdue');dot.classList.add(status.level==='current'?'good':status.level==='aging'?'aging':'overdue')}
 if(health)health.textContent=status.title;
 if(last)last.textContent=status.detail;
 const backupValue=$('#backupStatusValue');if(backupValue)backupValue.textContent=status.level==='never'?'Never':status.detail.replace('Last backup: ','');
 const lastLabel=$('#lastBackupLabel');if(lastLabel&&status.level!=='never')lastLabel.textContent=status.detail;
 const reminder=$('#dashboardBackupReminder');
 const dismissedAt=Number(localStorage.getItem('uvpc-backup-reminder-dismissed-at')||0);
 const dismissalActive=Date.now()-dismissedAt<7*86400000;
 if(reminder){reminder.hidden=!status.showReminder||dismissalActive;
  if(!reminder.hidden){
   $('#dashboardBackupReminderTitle').textContent=status.title;
   $('#dashboardBackupReminderText').textContent=status.level==='never'?'Your projects and settings are stored only in this browser. Create your first complete backup now.':status.level==='aging'?'It has been at least 30 days since your last backup. Create a fresh copy of your workspace.':'Your backup is over 90 days old. Create a new backup to protect recent work.';
  }
 }
 const storageLabel=$('#storageStatusLabel')?.textContent||'IndexedDB local storage active';
 if($('#dashboardStorageHealth'))$('#dashboardStorageHealth').textContent=storageLabel.includes('fail')?'Local storage needs attention.':'IndexedDB local storage is active.';
}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

let dashboardSelectedProjectId=null;
function populateDashboardProjectSelect(){
 const select=$('#dashboardProjectSelect');
 if(!select)return;
 const current=dashboardSelectedProjectId!==null?String(dashboardSelectedProjectId):select.value;
 select.innerHTML=state.projects.map(p=>`<option value="${p.id}">${esc(p.name)} — ${esc(p.customer)}</option>`).join('');
 if(state.projects.some(p=>String(p.id)===String(current))){
  select.value=String(current);
  dashboardSelectedProjectId=Number(current);
 }else if(state.projects.length){
  const latest=state.projects[state.projects.length-1];
  select.value=String(latest.id);
  dashboardSelectedProjectId=Number(latest.id);
 }
}
function updateDashboardProjectSnapshot(){
 dashboardSelectedProjectId=Number($('#dashboardProjectSelect').value);
 renderDashboard();
}
function renderDashboardProjectSnapshot(){populateDashboardProjectSelect();}
let activeProjectTypeFilter='all';
function getProjectVisualType(project){
 if(project.projectType==='scenario')return 'scenario';
 if(project.projectType==='production')return 'production';
 const name=String(project.name||'').toLowerCase();
 const notes=String(project.notes||'').toLowerCase();
 return name.includes('scenario')||notes.includes('created in scenario builder')?'scenario':'production';
}
function getProjectStatusClass(status){
 const value=String(status||'Draft').toLowerCase().replace(/\s+/g,'-');
 const allowed=['draft','estimate','quoted','approved','in-production','completed','cancelled'];
 return allowed.includes(value)?value:'draft';
}
function renderProjects(){
 const q=$('#projectSearch').value.toLowerCase(),f=$('#projectFilter').value;
 const rows=state.projects.filter(p=>{
  const type=getProjectVisualType(p);
  return (p.name+' '+p.customer).toLowerCase().includes(q)
   &&(f==='all'||(f==='high'?p.margin>=40:p.margin<40))
   &&(activeProjectTypeFilter==='all'||type===activeProjectTypeFilter);
 });
 $('#projectCards').innerHTML=rows.map(p=>{
  const type=getProjectVisualType(p);
  const statusClass=getProjectStatusClass(p.status);
  const pricing=getProjectPricing(p);
  return `<article class="project-card project-${type}">
   
   <div class="project-card-header">
    <div><h3>${esc(p.name)}</h3><p>${esc(p.customer)} · ${p.date}</p></div>
    <span class="project-type-badge ${type}">${type==='scenario'?'Scenario':'Production'}</span>
   </div>
   <span class="project-status-badge ${statusClass}">${esc(p.status||'Draft')}</span>
   <div class="financial-snapshot">
    <div><span>Quote Before Tax</span><strong>${money(pricing.price)}</strong></div>
    <div><span>Customer Quote</span><strong>${money(pricing.customerTotal)}</strong></div>
    <div><span>Profit</span><strong class="${pricing.profit<0?'profit-status-negative':'positive'}">${money(pricing.profit)}</strong></div>
    <div><span>Margin</span><strong>${pricing.margin.toFixed(1)}%</strong></div>
    <div><span>Quantity</span><strong>${p.qty}</strong></div>
   </div>
   <div class="card-actions">
    <button class="secondary small" onclick="editProject(${p.id})">Open</button>
    <button class="secondary small" onclick="emailProjectQuote(${p.id})">Email Quote</button>
    <button class="secondary small" onclick="duplicateProject(${p.id})">Duplicate</button>
    ${p.inputs?.detailedConsumablesEnabled&&!p.inventoryDeducted?`<button class="primary small" onclick="completeProjectInventory(${p.id})">Complete & Deduct</button>`:''}
    ${p.inventoryDeducted?`<button class="secondary small" onclick="reverseProjectInventory(${p.id})">Reverse Inventory</button>`:''}
    <button class="danger small" onclick="deleteProject(${p.id})">Delete</button>
   </div>
   ${p.inventoryDeducted?'<div class="inventory-posted-badge">✓ Inventory deducted</div>':''}
  </article>`;
 }).join('')||'<p>No matching projects.</p>';
}

let emailQuoteProjectId=null;
function findCustomerEmail(customerName){
 const customer=state.customers.find(item=>String(item.name||'').trim().toLowerCase()===String(customerName||'').trim().toLowerCase());
 const email=String(customer?.email||'').trim();
 return email && email!=='—' ? email : '';
}
function buildQuoteEmail(project){
 const pricing=getProjectPricing(project);
 const businessName=String(state.profile.business||'').trim()||'Your Company';
 const owner=String(state.business.owner||state.profile.name||'').trim();
 const validity=String(state.business.quoteValidity||'14 days').trim();
 const terms=String(state.business.terms||'').trim();
 const quoteRef=`Q-${project.id}`;
 const subject=`Quote ${quoteRef} — ${project.name}`;
 const lines=[
  `Hello${project.customer && project.customer!=='Walk-in Customer' ? ` ${project.customer}` : ''},`,
  '',
  'Thank you for the opportunity to provide this quote.',
  '',
  `Quote Reference: ${quoteRef}`,
  `Project: ${project.name}`,
  `Quantity: ${Math.max(1,Number(project.qty)||1)}`,
  '',
  `Quote Before Tax: ${money(pricing.price)}`,
  `Sales Tax (${Number(pricing.taxRate).toFixed(2).replace(/\\.00$/,'')}%): ${money(pricing.taxAmount)}`,
  `Total Quote: ${money(pricing.customerTotal)}`,
  '',
  `This quote is valid for ${validity}.`
 ];
 if(terms)lines.push('',terms);
 lines.push('','Regards,');
 if(owner)lines.push(owner);
 lines.push(businessName);
 if(state.business.phone)lines.push(String(state.business.phone));
 if(state.business.email)lines.push(String(state.business.email));
 if(state.business.website)lines.push(String(state.business.website));
 return {to:findCustomerEmail(project.customer),subject,body:lines.join('\n')};
}
window.emailProjectQuote=id=>{
 const project=state.projects.find(item=>item.id===id);
 if(!project){showToast('Project not found');return}
 emailQuoteProjectId=id;
 const draft=buildQuoteEmail(project);
 $('#emailQuoteProjectName').textContent=project.name;
 $('#emailQuoteTo').value=draft.to;
 $('#emailQuoteSubject').value=draft.subject;
 $('#emailQuoteBody').value=draft.body;
 $('#emailQuoteError').hidden=true;
 $('#emailQuoteModal').hidden=false;
 setTimeout(()=>$('#emailQuoteTo').focus(),0);
};

function consumableUnitCost(item){return clampNumber(item.packagePrice)/Math.max(.0001,clampNumber(item.capacity,.0001))}
function getPhysicalPrinter(id){return state.physicalPrinters.find(printer=>printer.id===id)||null}
function activePhysicalPrinters(){
 const matches=state.physicalPrinters.filter(printer=>printer.family===state.activePrinter.family&&printer.edition===state.activePrinter.edition);
 return matches.length?matches:state.physicalPrinters;
}
function populateProjectPhysicalPrinters(selected=''){
 const select=$('#projectPhysicalPrinter');if(!select)return;
 const printers=activePhysicalPrinters();
 select.innerHTML=printers.map(printer=>`<option value="${esc(printer.id)}">${esc(printer.name)}</option>`).join('');
 select.value=printers.some(p=>p.id===selected)?selected:(printers[0]?.id||'');
}
function renderProjectConsumableFields(usage={}){
 const printer=getPhysicalPrinter($('#projectPhysicalPrinter')?.value);
 const grid=$('#projectConsumableGrid');if(!grid)return;
 if(!printer){grid.innerHTML='<p>No physical printer is configured for this profile.</p>';return}
 const perItem=$('#quantityPricingMode')?.value!=='batch-job',scope=perItem?'per item':'for complete batch';
 grid.innerHTML=printer.consumables.map(item=>`<label class="project-consumable-field"><span><i style="background:${esc(item.color)}"></i>${esc(item.name)} <small>${clampNumber(item.remaining).toFixed(2)} ${esc(item.unit)} left</small></span><input class="project-consumable-usage" data-consumable-id="${esc(item.id)}" type="number" min="0" step=".01" value="${clampNumber(usage[item.id])}"><em>${esc(item.unit)} ${scope} · ${money(consumableUnitCost(item))}/${esc(item.unit)}</em></label>`).join('');
 $$('.project-consumable-usage').forEach(field=>field.addEventListener('input',()=>{updateProjectConsumableSummary();calculate()}));
 updateProjectConsumableSummary();
}
function updateProjectConsumableSummary(){
 const printer=getPhysicalPrinter($('#projectPhysicalPrinter')?.value);if(!printer)return;
 const multiplier=$('#quantityPricingMode')?.value==='batch-job'?1:Math.max(1,Math.round(val('quantity')));
 let cost=0,shortages=[];
 $$('.project-consumable-usage').forEach(field=>{const item=printer.consumables.find(x=>x.id===field.dataset.consumableId),used=clampNumber(field.value)*multiplier;if(!item)return;if(item.includeInPricing)cost+=used*consumableUnitCost(item);if(used>item.remaining)shortages.push(item.name)});
 if($('#projectConsumableCost'))$('#projectConsumableCost').textContent=money(cost);
 if($('#projectConsumableAvailability'))$('#projectConsumableAvailability').textContent=shortages.length?`Insufficient estimated inventory: ${shortages.join(', ')}`:'Estimated inventory is sufficient for this job.';
}
function recordInventoryTransaction(printer,item,change,reason,projectId=null,kind='manual'){
 const previous=clampNumber(item.remaining),next=Math.max(0,previous+change),appliedChange=next-previous;
 item.remaining=next;
 const tx={id:`tx-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,printerId:printer.id,consumableId:item.id,consumableName:item.name,change:appliedChange,balance:item.remaining,reason,projectId,kind,createdAt:new Date().toISOString()};
 state.inventoryTransactions.unshift(tx);return tx;
}
function deductProjectInventory(project){
 if(project.inventoryDeducted)return false;
 const printer=getPhysicalPrinter(project.physicalPrinterId||project.inputs?.physicalPrinterId);if(!printer)return false;
 const usage=project.consumableUsage||project.inputs?.consumableUsage||{},multiplier=project.inputs?.quantityPricingMode==='per-item'?Math.max(1,Number(project.qty)||1):1,ids=[];
 if(printer.consumables.some(item=>clampNumber(usage[item.id])*multiplier>clampNumber(item.remaining)))return false;
 printer.consumables.forEach(item=>{const amount=clampNumber(usage[item.id])*multiplier;if(amount>0){const tx=recordInventoryTransaction(printer,item,-amount,`Completed project: ${project.name}`,project.id,'project');ids.push(tx.id)}});
 project.inventoryDeducted=true;project.inventoryTransactionIds=ids;project.status='Completed';project.inventoryDeductedAt=new Date().toISOString();return true;
}
window.completeProjectInventory=id=>{
 const project=state.projects.find(p=>p.id===id);if(!project||project.inventoryDeducted)return;
 const printer=getPhysicalPrinter(project.physicalPrinterId||project.inputs?.physicalPrinterId);
 if(!printer){showToast('The physical printer is no longer available');return}
 const usage=project.consumableUsage||project.inputs?.consumableUsage||{},multiplier=project.inputs?.quantityPricingMode==='per-item'?Math.max(1,Number(project.qty)||1):1;
 const summary=printer.consumables.filter(item=>clampNumber(usage[item.id])>0).map(item=>`${item.name}: ${clampNumber(usage[item.id])*multiplier} ${item.unit}`).join('\n');
 if(!confirm(`Complete this project and deduct these estimated consumables from ${printer.name}?\n\n${summary||'No usage recorded'}`))return;
 if(deductProjectInventory(project)){save('Project completed and inventory deducted');renderAll()}else alert('Inventory was not deducted because one or more estimated consumables are insufficient.');
};
window.reverseProjectInventory=id=>{
 const project=state.projects.find(p=>p.id===id);if(!project?.inventoryDeducted)return;
 if(!confirm(`Reverse the inventory deductions for ${project.name}?`))return;
 const original=state.inventoryTransactions.filter(tx=>(project.inventoryTransactionIds||[]).includes(tx.id));
 original.forEach(tx=>{const printer=getPhysicalPrinter(tx.printerId),item=printer?.consumables.find(x=>x.id===tx.consumableId);if(printer&&item)recordInventoryTransaction(printer,item,Math.abs(tx.change),`Reversal: ${project.name}`,project.id,'reversal')});
 project.inventoryDeducted=false;project.inventoryTransactionIds=[];project.inventoryDeductedAt='';save('Project inventory deduction reversed');renderAll();
};
function inventorySelectedPrinter(){return getPhysicalPrinter($('#inventoryPrinterSelect')?.value)||null}
function inventoryPrinterMatchesActive(printer){return !!printer&&printer.family===state.activePrinter.family&&printer.edition===state.activePrinter.edition}
function inventoryPrintersForActiveProfile(){return state.physicalPrinters.filter(printer=>printer.family===state.activePrinter.family&&printer.edition===state.activePrinter.edition)}
function selectInventoryForActiveProfile(){
 const match=inventoryPrintersForActiveProfile()[0],select=$('#inventoryPrinterSelect');
 if(select&&match)select.value=match.id;
 renderInventory();
}
function renderInventory(){
 const select=$('#inventoryPrinterSelect');if(!select)return;
 const old=select.value;
 const activeProfile=getActivePrinterProfile(),matchingOnly=!!$('#matchingInventoryPrintersOnly')?.checked;
 const matching=inventoryPrintersForActiveProfile();
 const visible=matchingOnly?matching:[...state.physicalPrinters].sort((a,b)=>Number(inventoryPrinterMatchesActive(b))-Number(inventoryPrinterMatchesActive(a)));
 $('#inventoryActiveProfileLabel').textContent=`${activeProfile.name} — ${activeProfile.edition}`;
 select.innerHTML=visible.map(printer=>`<option value="${esc(printer.id)}">${esc(printer.name)}${inventoryPrinterMatchesActive(printer)?' — Recommended':''}</option>`).join('');
 $('#inventoryPrinterCountLabel').textContent=matchingOnly?`${matching.length} matching · ${state.physicalPrinters.length} total physical printer${state.physicalPrinters.length===1?'':'s'}`:`${state.physicalPrinters.length} physical printer${state.physicalPrinters.length===1?'':'s'} configured`;
 select.disabled=!visible.length;
 select.value=visible.some(p=>p.id===old)?old:(visible[0]?.id||'');
 const printer=inventorySelectedPrinter();
 const noMatch=!matching.length;
 $('#inventoryNoMatchingPrinter').hidden=!noMatch;
 if(noMatch){
  $('#inventoryNoMatchTitle').textContent=`No physical ${activeProfile.name} — ${activeProfile.edition} printer is configured`;
  $('#inventoryNoMatchText').textContent='The active pricing profile has no matching physical printer. Add one before assigning detailed job usage or deducting inventory.';
 }
 $('#addConsumableBtn').disabled=!printer;$('#reconcileInventoryBtn').disabled=!printer;$('#recordInventoryActionBtn').disabled=!printer;
 if(!printer){$('#inventoryDisplayedPrinterLabel').textContent='None';$('#inventoryReconciledAt').textContent='Never';$('#inventoryGaugeGrid').innerHTML='<div class="panel inventory-empty-state">No matching inventory printer is displayed.</div>';$('#inventoryActionConsumable').innerHTML='';$('#inventoryTransactionBody').innerHTML='<tr><td colspan="5">No inventory printer selected.</td></tr>';return}
 const profile=state.printerProfiles[printer.family],edition=profile?.editions?.[printer.edition];
 $('#inventoryDisplayedPrinterLabel').textContent=`${printer.name} (${edition?`${edition.name} — ${edition.edition}`:`${printer.family} — ${printer.edition}`})`;
 $('#inventoryReconciledAt').textContent=printer.lastReconciledAt?new Date(printer.lastReconciledAt).toLocaleString():'Never';
 $('#inventoryGaugeGrid').innerHTML=printer.consumables.map(item=>{const capacity=Math.max(.01,clampNumber(item.capacity,.01)),remaining=clampNumber(item.remaining),pct=Math.max(0,Math.min(100,remaining/capacity*100)),level=pct<=item.lowThreshold/capacity*100?'low':pct<=40?'review':'good';return `<article class="panel inventory-gauge-card ${level}"><div class="inventory-gauge-head"><span class="consumable-swatch" style="background:${esc(item.color)}"></span><div><h3>${esc(item.name)}</h3><small>${esc(item.category)} · ${esc(item.unit)}</small></div><strong>${pct.toFixed(1)}%</strong></div><div class="inventory-tank"><div style="height:${pct}%;background:${esc(item.color)}"></div></div><div class="inventory-gauge-values"><strong>${remaining.toFixed(2)} ${esc(item.unit)}</strong><span>of ${capacity.toFixed(2)} ${esc(item.unit)}</span><small>${money(remaining*consumableUnitCost(item))} estimated value</small></div></article>`}).join('');
 $('#inventoryActionConsumable').innerHTML=printer.consumables.map(item=>`<option value="${esc(item.id)}">${esc(item.name)}</option>`).join('');
 const transactions=state.inventoryTransactions.filter(tx=>tx.printerId===printer.id);
 $('#inventoryTransactionBody').innerHTML=transactions.slice(0,100).map(tx=>`<tr><td>${new Date(tx.createdAt).toLocaleString()}</td><td>${esc(tx.consumableName)}</td><td class="${tx.change<0?'inventory-negative':'positive'}">${tx.change>0?'+':''}${Number(tx.change).toFixed(2)}</td><td>${esc(tx.reason)}</td><td>${Number(tx.balance).toFixed(2)}</td></tr>`).join('')||'<tr><td colspan="5">No inventory transactions yet.</td></tr>';
}
function profileConsumables(family,edition){
 const profile=state.printerProfiles[family]?.editions?.[edition],cartridge=profile?.cartridges||{},fields=profile?.inkFields||[];
 const colors={cyan:'#16c7d9',magenta:'#ec4c9a',yellow:'#f1c40f',black:'#3d4853',white:'#dfe8f0',rigidWhite:'#eef3f7',flexWhite:'#d5e6ef',fluorescentRed:'#ff385d',fluorescentYellow:'#dfff36',varnish:'#8bd6ff',gloss:'#8bd6ff',dtColor:'#b06cff',dtCyan:'#16c7d9',dtMagenta:'#ec4c9a',dtYellow:'#f1c40f',dtBlack:'#3d4853',dtWhite:'#f4f4f4'};
 const inks=fields.map(id=>{const capacity=Number(cartridge.capacities?.[id])||Number(cartridge.inkCapacity)||100;return {id,name:profile.inkLabels?.[id]||id.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase()),category:'Ink',unit:'mL',capacity,packagePrice:Number(cartridge.prices?.[id])||Number(cartridge.inkPrice)||((Number(profile.rates[id])||Number(profile.rates.ink)||0)*capacity),remaining:capacity,lowThreshold:capacity*.2,color:colors[id]||'#2997ff',includeInPricing:true}});
 const extras=(profile.additionalConsumables||[]).map(item=>({...item,remaining:Number(item.capacity)||1,lowThreshold:(Number(item.capacity)||1)*.2}));
 return [...inks,...extras];
}
function createPhysicalPrinter(name,family,edition){
 const printer={id:`printer-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,name:name.trim(),family,edition,lastReconciledAt:'',consumables:profileConsumables(family,edition)};
 state.physicalPrinters.push(printer);return printer;
}
function synchronizeConfirmedXtoolConsumables(printer){
 const aliases=printer.edition==='dual-uv'?{gloss:'varnish',fluorescent:'fluorescentRed'}:printer.edition==='uv-dt-fabric'?{gloss:'varnish',dtColor:'dtCyan'}:{gloss:'varnish'};
 Object.entries(aliases).forEach(([oldId,newId])=>{
  const oldItem=printer.consumables.find(item=>item.id===oldId),newItem=printer.consumables.find(item=>item.id===newId);
  if(oldItem&&!newItem)oldItem.id=newId;
  state.inventoryTransactions.filter(tx=>tx.printerId===printer.id&&tx.consumableId===oldId).forEach(tx=>{tx.consumableId=newId});
 });
 const confirmed=profileConsumables(printer.family,printer.edition);
 confirmed.forEach(spec=>{
  const item=printer.consumables.find(existing=>existing.id===spec.id);
  if(!item){printer.consumables.push(spec);return}
  const previousCapacity=Number(item.capacity)||100;
  if(Math.abs(previousCapacity-spec.capacity)>.0001){
   const fraction=Math.max(0,Math.min(1,(Number(item.remaining)||0)/previousCapacity));
   item.capacity=spec.capacity;item.remaining=spec.capacity*fraction;item.lowThreshold=spec.lowThreshold;
  }
  item.name=spec.name;item.category=spec.category;item.unit=spec.unit;item.color=spec.color;item.packagePrice=spec.packagePrice;item.includeInPricing=spec.includeInPricing;
 });
}
function addPhysicalPrinter(){
 const name=prompt('Name this physical printer (for example, Main E1 Printer):');if(!name?.trim())return;
 let family=prompt(`Printer profile family ID:\n${Object.keys(state.printerProfiles).join('\n')}\n\nEnter a new ID to create a custom profile.`,state.activePrinter.family);if(!family)return;
 family=family.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 if(!state.printerProfiles[family]){
  const displayName=prompt('Custom printer manufacturer and model:',name.trim())||name.trim();
  const workflow=prompt('Primary workflow:','Direct UV')||'Custom';
  const inkRate=clampNumber(prompt('Default ink cost per mL:','0.2999'));
  state.printerProfiles[family]={family:displayName,editions:{standard:{name:displayName,edition:'Custom Profile',workflows:[workflow],inkFields:[],rates:{ink:inkRate,machine:clampNumber(prompt('Machine cost per hour:','5')),electric:clampNumber(prompt('Electricity cost per hour:','0.30')),maintenance:clampNumber(prompt('Maintenance allowance per job:','0.50')),cleaning:0,primer:0,serviceReserve:0},note:'User-created custom printer profile.'}}};
 }
 const editions=Object.keys(state.printerProfiles[family].editions),edition=prompt(`Edition ID:\n${editions.join('\n')}`,editions[0]);if(!edition||!state.printerProfiles[family].editions[edition]){alert('Edition not found.');return}
 const printer=createPhysicalPrinter(name,family,edition);save('Physical printer added');
 if(!inventoryPrinterMatchesActive(printer))$('#matchingInventoryPrintersOnly').checked=false;
 renderInventory();$('#inventoryPrinterSelect').value=printer.id;renderInventory();populateProjectPhysicalPrinters();
}
function addMatchingPhysicalPrinter(){
 const profile=getActivePrinterProfile(),name=prompt(`Name this physical ${profile.name} printer:`,`${profile.name} Printer`);if(!name?.trim())return;
 const printer=createPhysicalPrinter(name,state.activePrinter.family,state.activePrinter.edition);
 $('#matchingInventoryPrintersOnly').checked=true;save('Matching physical printer added');renderInventory();$('#inventoryPrinterSelect').value=printer.id;renderInventory();populateProjectPhysicalPrinters();
}
function changeInventoryPrinter(){
 const printer=inventorySelectedPrinter();if(!printer)return;
 if(!inventoryPrinterMatchesActive(printer)){
  const profile=state.printerProfiles[printer.family]?.editions?.[printer.edition];
  if(confirm(`${printer.name} uses ${profile?.name||printer.family} — ${profile?.edition||printer.edition}.\n\nSwitch the active pricing profile to match this physical printer?`)){
   switchPrinterProfile(printer.family,printer.edition);
   $('#inventoryPrinterSelect').value=printer.id;renderInventory();
   return;
  }
  showToast('Viewing inventory only; active pricing profile unchanged');
 }
 renderInventory();
}
function addConsumable(){
 const printer=inventorySelectedPrinter();if(!printer){showToast('Add a printer first');return}
 const name=prompt('Consumable name:');if(!name?.trim())return;
 const unit=prompt('Measurement unit (mL, g, sheet, ft, m, use):','mL')||'mL';
 const capacity=clampNumber(prompt('Package capacity:','100'),.01),packagePrice=clampNumber(prompt('Package price:','29.99')),category=prompt('Category:','Ink')||'Other';
 printer.consumables.push({id:`custom-${Date.now()}`,name:name.trim(),category,unit,capacity,packagePrice,remaining:capacity,lowThreshold:capacity*.2,color:'#2997ff',includeInPricing:confirm('Include this consumable in project pricing?')});
 save('Consumable added');renderInventory();renderProjectConsumableFields({});
}
function recordInventoryAction(){
 const printer=inventorySelectedPrinter(),item=printer?.consumables.find(x=>x.id===$('#inventoryActionConsumable').value);if(!printer||!item)return;
 const type=$('#inventoryActionType').value,amount=clampNumber($('#inventoryActionAmount').value),reason=$('#inventoryActionReason').value.trim()||type;
 let change=0;if(type==='replace')change=clampNumber(item.capacity)-clampNumber(item.remaining);else if(type==='add')change=amount;else if(type==='consume')change=-amount;else change=amount-clampNumber(item.remaining);
 recordInventoryTransaction(printer,item,change,reason,null,type);if(type==='set'||type==='replace')printer.lastReconciledAt=new Date().toISOString();
 $('#inventoryActionAmount').value='';$('#inventoryActionReason').value='';save('Inventory action recorded');renderInventory();
}
function closeEmailQuoteModal(){
 $('#emailQuoteModal').hidden=true;
 emailQuoteProjectId=null;
}
function sendEmailQuote(){
 const to=$('#emailQuoteTo').value.trim();
 const subject=$('#emailQuoteSubject').value.trim();
 const body=$('#emailQuoteBody').value.trim();
 const error=$('#emailQuoteError');
 if(to && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(to)){
  error.textContent='Enter a valid customer email address, or leave the To field blank and add it in your email program.';
  error.hidden=false;
  return;
 }
 if(!subject||!body){error.textContent='The subject and message cannot be empty.';error.hidden=false;return}
 error.hidden=true;
 openEmailDraftTo(to,subject,body);
}

$('#projectSearch').oninput=renderProjects;$('#projectFilter').onchange=renderProjects;
document.querySelectorAll('[data-project-type-filter]').forEach(button=>{
 button.addEventListener('click',()=>{
  activeProjectTypeFilter=button.dataset.projectTypeFilter;
  document.querySelectorAll('[data-project-type-filter]').forEach(x=>x.classList.toggle('active',x===button));
  renderProjects();
 });
});
window.deleteProject=id=>{state.projects=state.projects.filter(p=>p.id!==id);save('Project deleted');renderAll()};
window.duplicateProject=id=>{
 const p=state.projects.find(x=>x.id===id);
 if(!p)return;
 const copy={
  ...p,
  id:Date.now(),
  name:p.name+' Copy',
  inputs:p.inputs?{...p.inputs}:undefined,
  inventoryDeducted:false,
  inventoryTransactionIds:[],
  inventoryDeductedAt:'',
  status:'Draft',
  createdAt:new Date().toISOString(),
  updatedAt:new Date().toISOString(),
  date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})
 };
 state.projects.push(copy);
 save('Project duplicated');
 renderAll();
};

function capturePricingInputs(){
 const detailed=!!$('#useDetailedConsumables')?.checked;
 const consumableUsage={};
 $$('.project-consumable-usage').forEach(field=>{consumableUsage[field.dataset.consumableId]=clampNumber(field.value)});
 const physicalPrinter=getPhysicalPrinter($('#projectPhysicalPrinter')?.value);
 const detailedInkCost=detailed&&physicalPrinter?physicalPrinter.consumables.reduce((sum,item)=>sum+(item.includeInPricing?clampNumber(consumableUsage[item.id])*consumableUnitCost(item):0),0):null;
 const detailedInkTotal=detailed&&physicalPrinter?physicalPrinter.consumables.reduce((sum,item)=>sum+(item.category==='Ink'?clampNumber(consumableUsage[item.id]):0),0):null;
 return {
  quantity:Math.max(1,val('quantity')),
  quantityPricingMode:$('#quantityPricingMode')?.value||'per-item',
  materialName:$('#projectMaterial')?.value==='__custom__'?'':($('#projectMaterial option:checked')?.textContent||''),
  materialLibraryIndex:$('#projectMaterial')?.value==='__custom__'?'':Number($('#projectMaterial')?.value),
  blankCost:val('blankCost'),
  totalInk:detailed?detailedInkTotal:val('totalInk'),
  printMinutes:val('printMinutes'),
  laborMinutes:val('laborMinutes'),
  setupMinutes:val('setupMinutes'),
  packagingCost:val('packagingCost'),
  primerCost:val('primerCost'),
  otherCost:val('otherCost'),
  wastePercent:val('wastePercent'),
  profitMargin:val('profitMargin'),
  salesTax:val('projectTax'),
  manualPriceEnabled:!!$('#useManualPrice')?.checked,
  manualPrice:$('#manualPrice')?.value===''?'':val('manualPrice'),
  rounding:$('#rounding')?.value||'1',
  detailedConsumablesEnabled:detailed,
  physicalPrinterId:detailed?($('#projectPhysicalPrinter')?.value||''):'',
  consumableUsage,
  detailedInkCost
 };
}

function customerSnapshotFromSelection(){
 const select=$('#customerName');
 const value=select?.value||'__walkin__';
 if(value==='__walkin__')return {name:'Walk-in Customer',type:'Walk-in',email:'',discount:0};
 if(value==='__snapshot__')return {
  name:select?.dataset.snapshotName||select?.selectedOptions?.[0]?.textContent||'Walk-in Customer',
  type:select?.dataset.snapshotType||'',
  email:select?.dataset.snapshotEmail||'',
  discount:Number(select?.dataset.snapshotDiscount)||0
 };
 const customer=state.customers[Number(value)];
 return customer?{name:customer.name||'Walk-in Customer',type:customer.type||'',email:customer.email||'',discount:Number(customer.discount)||0}:{name:'Walk-in Customer',type:'Walk-in',email:'',discount:0};
}

function renderProjectCustomerDetails(snapshot){
 const customer=snapshot||customerSnapshotFromSelection();
 if($('#projectCustomerType'))$('#projectCustomerType').value=customer.type||'';
 if($('#projectCustomerEmail'))$('#projectCustomerEmail').value=customer.email||'';
 if($('#projectCustomerDiscount'))$('#projectCustomerDiscount').value=`${Number(customer.discount||0).toFixed(2).replace(/\.00$/,'')}%`;
}

function populateProjectCustomerSelector(snapshot=null){
 const select=$('#customerName');
 if(!select)return;
 const saved=snapshot||{name:'Walk-in Customer',type:'Walk-in',email:'',discount:0};
 select.innerHTML='<option value="__walkin__">Walk-in Customer</option>'+state.customers.map((c,i)=>`<option value="${i}">${esc(c.name)}</option>`).join('');
 const match=state.customers.findIndex(c=>String(c.name||'').trim().toLowerCase()===String(saved.name||'').trim().toLowerCase());
 if(match>=0){
  select.value=String(match);
 }else if(saved.name&&saved.name!=='Walk-in Customer'){
  const option=document.createElement('option');option.value='__snapshot__';option.textContent=saved.name+' (saved project snapshot)';select.appendChild(option);select.value='__snapshot__';
  select.dataset.snapshotName=saved.name||'';select.dataset.snapshotType=saved.type||'';select.dataset.snapshotEmail=saved.email||'';select.dataset.snapshotDiscount=String(Number(saved.discount)||0);
 }else select.value='__walkin__';
 renderProjectCustomerDetails(saved);
}

function populateProjectMaterialSelector(selectedName='',preserveCost=true){
 const select=$('#projectMaterial');
 if(!select)return;
 const currentCost=$('#blankCost')?.value;
 const options=state.materials.map((m,i)=>`<option value="${i}">${esc(m.name)}</option>`).join('');
 select.innerHTML='<option value="__custom__">Custom / Manual Cost</option>'+options;
 const match=state.materials.findIndex(m=>m.name===selectedName);
 select.value=match>=0?String(match):'__custom__';
 if(preserveCost&&$('#blankCost'))$('#blankCost').value=currentCost;
}

function restorePricingInputs(project){
 const inputs=project.inputs||{};
 if($('#quantityPricingMode'))$('#quantityPricingMode').value=inputs.quantityPricingMode||'batch-job';
 populateProjectMaterialSelector(project.materialName||inputs.materialName||'',true);
 if($('#blankCost'))$('#blankCost').value=Number.isFinite(Number(inputs.blankCost))?inputs.blankCost:$('#blankCost').value;
 if($('#totalInk'))$('#totalInk').value=Number.isFinite(Number(inputs.totalInk))?inputs.totalInk:$('#totalInk').value;
 if($('#printMinutes'))$('#printMinutes').value=Number.isFinite(Number(inputs.printMinutes))?inputs.printMinutes:$('#printMinutes').value;
 if($('#laborMinutes'))$('#laborMinutes').value=Number.isFinite(Number(inputs.laborMinutes))?inputs.laborMinutes:$('#laborMinutes').value;
 if($('#setupMinutes'))$('#setupMinutes').value=Number.isFinite(Number(inputs.setupMinutes))?inputs.setupMinutes:0;
 if($('#packagingCost'))$('#packagingCost').value=Number.isFinite(Number(inputs.packagingCost))?inputs.packagingCost:$('#packagingCost').value;
 if($('#primerCost'))$('#primerCost').value=Number.isFinite(Number(inputs.primerCost))?inputs.primerCost:$('#primerCost').value;
 if($('#otherCost'))$('#otherCost').value=Number.isFinite(Number(inputs.otherCost))?inputs.otherCost:$('#otherCost').value;
 if($('#wastePercent'))$('#wastePercent').value=Number.isFinite(Number(inputs.wastePercent))?inputs.wastePercent:$('#wastePercent').value;
 if($('#profitMargin'))$('#profitMargin').value=Number.isFinite(Number(inputs.profitMargin))?inputs.profitMargin:$('#profitMargin').value;
 if($('#projectTax'))$('#projectTax').value=Number.isFinite(Number(inputs.salesTax))?inputs.salesTax:(Number(state.business.tax)||0);
 if($('#rounding'))$('#rounding').value=inputs.rounding||$('#rounding').value;
 if($('#useDetailedConsumables'))$('#useDetailedConsumables').checked=!!inputs.detailedConsumablesEnabled;
 populateProjectPhysicalPrinters(inputs.physicalPrinterId||'');
 renderProjectConsumableFields(inputs.consumableUsage||{});
 if($('#projectConsumableDetails'))$('#projectConsumableDetails').hidden=!inputs.detailedConsumablesEnabled;
 if($('#totalInk'))$('#totalInk').disabled=!!inputs.detailedConsumablesEnabled;

 // Only restore a manual quote when the user explicitly entered one.
 // Older projects did not record whether the quote was manual, so they reopen in automatic pricing mode.
 if($('#useManualPrice'))$('#useManualPrice').checked=!!inputs.manualPriceEnabled;
 if($('#manualPrice')){
  $('#manualPrice').value=inputs.manualPriceEnabled&&inputs.manualPrice!==''?inputs.manualPrice:'';
  $('#manualPrice').disabled=!$('#useManualPrice')?.checked;
 }
 updateQuantityPricingModeUI();
}

function updateQuantityPricingModeUI(){
 const perItem=$('#quantityPricingMode')?.value!=='batch-job';
 if($('#quantityModeDescription'))$('#quantityModeDescription').textContent=perItem?'Enter ink and production time for one item. The calculator multiplies them by quantity.':'Enter ink and production time once for the complete batch.';
 if($('#inkInputLabel'))$('#inkInputLabel').textContent=perItem?'Ink Used / Item (mL)':'Total Ink Used for Batch (mL)';
 if($('#printInputLabel'))$('#printInputLabel').textContent=perItem?'Print Minutes / Item':'Total Print Minutes for Batch';
 if($('#laborInputLabel'))$('#laborInputLabel').textContent=perItem?'Hands-On Minutes / Item':'Total Hands-On Minutes for Batch';
 if($('#manualPriceLabel'))$('#manualPriceLabel').textContent=perItem?'Manual Selling Price / Unit':'Manual Selling Price / Batch';
 if($('#quantityModeNote'))$('#quantityModeNote').innerHTML=perItem?'<strong>Per-item pricing:</strong> the complete one-item calculation repeats with quantity. One-time setup minutes are charged only once.':'<strong>Batch-job pricing:</strong> ink and production time are totals for the complete run and are not multiplied by quantity.';
 if($('#useDetailedConsumables')?.checked){const usage={};$$('.project-consumable-usage').forEach(field=>{usage[field.dataset.consumableId]=field.value});renderProjectConsumableFields(usage)}
}

window.editProject=id=>{
 const p=state.projects.find(x=>x.id===id);
 if(!p)return;
 editingId=id;
 if(p.printerFamily&&state.printerProfiles[p.printerFamily]){
  state.activePrinter.family=p.printerFamily;
  const fam=state.printerProfiles[p.printerFamily];
  state.activePrinter.edition=fam.editions[p.printerEdition]?p.printerEdition:Object.keys(fam.editions)[0];
  const profile=getActivePrinterProfile();state.activePrinter.workflow=profile.workflows[0];applyProfileRates(profile);loadRates();renderPrinterProfile();
 }
 resetForm();
 $('#projectPrinter').value=p.printer||activePrinterLabel();
 $('#projectName').value=p.name;
 populateProjectCustomerSelector(p.customerSnapshot||{name:p.customer||'Walk-in Customer',type:p.customerType||'',email:p.customerEmail||'',discount:Number(p.customerDiscount)||0});
 $('#quantity').value=p.qty;
 $('#projectStatus').value=p.status||'Draft';
 $('#projectNotes').value=p.notes||'';
 restorePricingInputs(p);
 calculate();
 navigate('calculator');
};

function populate(){
 renderGlobalLibraries();
 populateProjectMaterialSelector($('#projectMaterial option:checked')?.textContent||'',true);
 const currentCustomer=customerSnapshotFromSelection();
 populateProjectCustomerSelector(currentCustomer);
}

const fieldIds=['quantity','quantityPricingMode','blankCost','totalInk','printMinutes','laborMinutes','setupMinutes','packagingCost','primerCost','otherCost','wastePercent','profitMargin','projectTax','useManualPrice','manualPrice','rounding'];
fieldIds.forEach(id=>{
 const field=$('#'+id);
 if(field){
  field.addEventListener('input',calculate);
  field.addEventListener('change',calculate);
 }
});
if($('#quantityPricingMode'))$('#quantityPricingMode').addEventListener('change',updateQuantityPricingModeUI);
if($('#customerName'))$('#customerName').addEventListener('change',()=>renderProjectCustomerDetails(customerSnapshotFromSelection()));
if($('#projectMaterial'))$('#projectMaterial').addEventListener('change',()=>{
 const value=$('#projectMaterial').value;
 if(value!=='__custom__'){
  const material=state.materials[Number(value)];
  if(material)$('#blankCost').value=Number(material.cost)||0;
 }
 calculate();
});

if($('#useManualPrice'))$('#useManualPrice').addEventListener('change',()=>{
 const enabled=$('#useManualPrice').checked;
 $('#manualPrice').disabled=!enabled;
 if(!enabled)$('#manualPrice').value='';
 calculate();
});

// Delegated fallback: ensures calculator totals always refresh even if a field's
// direct listener is lost, replaced, or initialized before a cached page update.
document.addEventListener('input',event=>{
 const target=event.target;
 if(target&&fieldIds.includes(target.id))calculate();
});
document.addEventListener('change',event=>{
 const target=event.target;
 if(target&&fieldIds.includes(target.id))calculate();
});
function val(id){
 const field=$('#'+id);
 if(!field)return 0;
 const parsed=Number.parseFloat(field.value);
 return Number.isFinite(parsed)?parsed:0;
}

function applyPricingProfitStatus(profit,actualMargin,targetMargin,totalCost,customerPrice){
 const status=
  profit<0?'negative':
  actualMargin<targetMargin?'warning':
  'healthy';

 const valueClass={
  healthy:'profit-status-healthy',
  warning:'profit-status-warning',
  negative:'profit-status-negative'
 }[status];

 const cardClass={
  healthy:'profit-card-healthy',
  warning:'profit-card-warning',
  negative:'profit-card-negative'
 }[status];

 ['projectProfit','quoteProfit','quoteProfitPerUnit'].forEach(id=>{
  const element=$('#'+id);
  if(!element)return;
  element.classList.remove('positive','profit-status-value','profit-status-healthy','profit-status-warning','profit-status-negative');
  element.classList.add('profit-status-value',valueClass);
 });

 ['projectProfitCard','quoteProfitCard','quoteProfitPerUnitCard'].forEach(id=>{
  const card=$('#'+id);
  if(!card)return;
  card.classList.remove('profit-card-healthy','profit-card-warning','profit-card-negative');
  card.classList.add(cardClass);
 });

 const summary=document.querySelector('.quote-summary-card');
 if(summary){
  summary.classList.remove('profit-loss','profit-review');
  if(status==='negative')summary.classList.add('profit-loss');
  if(status==='warning')summary.classList.add('profit-review');
 }

 const alert=$('#profitabilityAlert');
 const alertTitle=$('#profitabilityAlertTitle');
 const alertText=$('#profitabilityAlertText');
 if(!alert||!alertTitle||!alertText)return;

 alert.classList.remove('warning','negative');

 if(status==='negative'){
  const breakEven=Math.max(0,totalCost-customerPrice);
  alert.classList.add('negative');
  alertTitle.textContent='Action Required — This project is losing money';
  alertText.textContent=`The customer quote is ${money(Math.abs(profit))} below production cost. Increase the quote by at least ${money(breakEven)} to break even, and more to earn your target margin.`;
 }else if(status==='warning'){
  const targetPrice=totalCost/(1-Math.min(.95,targetMargin/100));
  const increase=Math.max(0,targetPrice-customerPrice);
  alert.classList.add('warning');
  alertTitle.textContent='Review Pricing — Profit is below your target';
  alertText.textContent=`This project is profitable, but the ${actualMargin.toFixed(1)}% margin is below your ${targetMargin.toFixed(1)}% target. Consider increasing the quote by about ${money(increase)}.`;
 }else{
  alertTitle.textContent='Healthy Profit';
  alertText.textContent=`This project meets or exceeds your ${targetMargin.toFixed(1)}% target margin.`;
 }
}


function populateProjectPrinterModal(){
 const family=$('#projectPrinterFamily'),edition=$('#projectPrinterEdition');
 if(!family||!edition)return;

 const profiles=state.printerProfiles&&Object.keys(state.printerProfiles).length
  ?state.printerProfiles
  :defaults.printerProfiles;

 family.innerHTML=Object.entries(profiles).map(([key,value])=>{
  const label=value.family||value.name||key;
  return `<option value="${key}">${esc(label)}</option>`;
 }).join('');

 const activeFamily=profiles[state.activePrinter.family]
  ?state.activePrinter.family
  :Object.keys(profiles)[0];

 family.value=activeFamily;

 const refreshEditions=()=>{
  const fam=profiles[family.value]||profiles[Object.keys(profiles)[0]];
  if(!fam||!fam.editions){
   edition.innerHTML='<option value="">No editions available</option>';
   edition.disabled=true;
   return;
  }

  edition.disabled=false;
  edition.innerHTML=Object.entries(fam.editions).map(([key,value])=>
   `<option value="${key}">${esc(value.edition||value.name||key)}</option>`
  ).join('');

  const savedEdition=family.value===state.activePrinter.family
   ?state.activePrinter.edition
   :'';

  edition.value=fam.editions[savedEdition]
   ?savedEdition
   :Object.keys(fam.editions)[0];
 };

 family.onchange=refreshEditions;
 refreshEditions();
}
function openProjectPrinterModal(){populateProjectPrinterModal();$('#projectPrinterModal').hidden=false}
function applyProjectPrinterChange(){
 const family=$('#projectPrinterFamily').value;
 const edition=$('#projectPrinterEdition').value;
 const fam=state.printerProfiles[family];
 if(!fam||!fam.editions||!fam.editions[edition]){
  showToast('Please choose a valid printer family and edition.');
  return;
 }
 state.activePrinter.family=family;
 state.activePrinter.edition=edition;
 const profile=getActivePrinterProfile();
 state.activePrinter.workflow=profile.workflows[0];
 applyProfileRates(profile);
 loadRates();
 renderPrinterProfile();
 $('#projectPrinter').value=activePrinterLabel();
 populateProjectPhysicalPrinters();
 renderProjectConsumableFields({});
 calculate();
 renderDashboard();
 $('#projectPrinterModal').hidden=true;
 save(`Project printer changed to ${profile.name} ${profile.edition}`);
 selectInventoryForActiveProfile();
}

function getActivePrinterProfile(){const fam=state.printerProfiles[state.activePrinter.family]||state.printerProfiles['eufymake-e1'];return fam.editions[state.activePrinter.edition]||Object.values(fam.editions)[0]}
function activePrinterLabel(){const p=getActivePrinterProfile();return `${p.name} — ${p.edition}`}
function populatePrinterEditionOptions(){const fs=$('#printerFamily'),es=$('#printerEdition');if(!fs||!es)return;fs.innerHTML=Object.entries(state.printerProfiles).map(([key,family])=>`<option value="${esc(key)}">${esc(family.family||Object.values(family.editions)[0]?.name||key)}</option>`).join('');fs.value=state.printerProfiles[state.activePrinter.family]?state.activePrinter.family:Object.keys(state.printerProfiles)[0];const fam=state.printerProfiles[fs.value];es.innerHTML=Object.entries(fam.editions).map(([k,p])=>`<option value="${k}">${esc(p.edition)}</option>`).join('');es.value=fam.editions[state.activePrinter.edition]?state.activePrinter.edition:Object.keys(fam.editions)[0]}
function applyProfileRates(p){
 const r=p.rates,cartridge=p.cartridges||{};
 const channelRates=[r.cyan,r.magenta,r.yellow,r.black,r.white,r.gloss].map(Number).filter(Number.isFinite);
 const inkRate=Number(r.ink)||(channelRates.length?channelRates.reduce((a,b)=>a+b,0)/channelRates.length:state.rates.ink);
 state.printer={...state.printer,model:p.name,inkCartridgePrice:Number(cartridge.inkPrice)||state.printer.inkCartridgePrice,inkCartridgeCapacity:Number(cartridge.inkCapacity)||state.printer.inkCartridgeCapacity,cleaningCartridgePrice:Number(cartridge.cleaningPrice)||state.printer.cleaningCartridgePrice,cleaningCartridgeCapacity:Number(cartridge.cleaningCapacity)||state.printer.cleaningCartridgeCapacity,cleaning:r.cleaning,primerDefault:r.primer,serviceReserve:r.serviceReserve};
 state.rates={...state.rates,ink:inkRate,color:inkRate,white:inkRate,varnish:inkRate,machine:r.machine,electric:r.electric,maintenance:r.maintenance};
}
function switchPrinterProfile(f,e){state.activePrinter.family=f;state.activePrinter.edition=e;const p=getActivePrinterProfile();state.activePrinter.workflow=p.workflows[0];applyProfileRates(p);save(`Active printer changed to ${p.name} ${p.edition}`);loadRates();renderAll();selectInventoryForActiveProfile()}
function renderPrinterProfile(){
 const p=getActivePrinterProfile();populatePrinterEditionOptions();
 if($('#printerWorkflow')){$('#printerWorkflow').innerHTML=p.workflows.map(w=>`<option>${esc(w)}</option>`).join('');$('#printerWorkflow').value=state.activePrinter.workflow}
 if($('#activePrinterName'))$('#activePrinterName').textContent=p.name;
 if($('#activePrinterEdition'))$('#activePrinterEdition').textContent=p.edition;
 if($('#activePrinterCapabilities'))$('#activePrinterCapabilities').innerHTML=p.workflows.map(w=>`<span class="capability-chip">${esc(w)}</span>`).join('');
 const topBanner=$('#activePrinterBanner');if(topBanner){topBanner.classList.remove('eufymake','xtool');topBanner.classList.add(state.activePrinter.family==='xtool-o1'?'xtool':'eufymake')}
 if($('#activePrinterBannerMark'))$('#activePrinterBannerMark').textContent=state.activePrinter.family==='xtool-o1'?'xT':'E1';
 if($('#printerProfileCapabilities')){
  const technical=[['Launch status',p.launchStatus],['Best for',p.bestFor],['Materials',p.materials],['Working area',p.workingArea],['Print head',p.printHeads],['Resolution',p.resolution],['Ink paths',p.inkChannels],['Embossed height',p.embossedHeight],['Vision system',p.visionSystem],['Positioning accuracy',p.positioningAccuracy],['Automated maintenance',p.automatedMaintenance],['Supported systems',p.supportedOS],['Remote management',p.remoteManagement],['Dimensions',p.dimensions],['Weight',p.weight],['Safety & certifications',p.certifications],['Edition upgrade',p.upgradeNotice],['Specification source',p.officialSource]].filter(([,value])=>value);
  $('#printerProfileCapabilities').innerHTML=(technical.length?technical.map(([label,value])=>`<div><strong>${esc(label)}</strong><small>${esc(value)}</small></div>`):p.workflows.map(w=>`<div><strong>${esc(w)}</strong><small>Available in this edition</small></div>`)).join('');
 }
 if($('#printerProfileNote'))$('#printerProfileNote').textContent=p.note;
 if($('#printerCostStatus'))$('#printerCostStatus').innerHTML=`<strong>${esc(p.name)} — ${esc(p.edition)}</strong><span>${esc(p.note)}</span>`;
 if($('#activeInkCostHelpTitle'))$('#activeInkCostHelpTitle').textContent=state.activePrinter.family==='xtool-o1'?'xTool Omni planning values':'EufyMake E1 default';
 if($('#activeInkCostHelpText'))$('#activeInkCostHelpText').textContent=state.activePrinter.family==='xtool-o1'?'Confirmed retail prices are used for the UV Essential Set, DT Fabric Set, maintenance tanks, and primer wipes where applicable. Expansion-set pricing remains editable until confirmed.':'CMYKWG cartridges are priced equally, so the calculator only needs the total ink used for the complete job.';
 if($('#costPrinterBadge'))$('#costPrinterBadge').textContent=p.edition;
 if($('#projectPrinter'))$('#projectPrinter').value=activePrinterLabel();
 if($('#scPrinter'))$('#scPrinter').value=activePrinterLabel();
}
function clampNumber(value,min=0,max=Number.POSITIVE_INFINITY){
 const number=Number(value);
 return Math.min(max,Math.max(min,Number.isFinite(number)?number:0));
}
function roundTo(n,step){
 const safeNumber=clampNumber(n);
 const safeStep=clampNumber(step,.01)||.01;
 if(safeNumber===0)return 0;
 return Math.ceil((safeNumber-Number.EPSILON)/safeStep)*safeStep;
}
function calculateProjectPricing(inputs,rates){
 const q=Math.max(1,Math.round(clampNumber(inputs.quantity,1)));
 const quantityPricingMode=inputs.quantityPricingMode==='per-item'?'per-item':'batch-job';
 const multiplier=quantityPricingMode==='per-item'?q:1;
 const blankCost=clampNumber(inputs.blankCost);
 const totalInk=clampNumber(inputs.totalInk);
 const packagingCost=clampNumber(inputs.packagingCost);
 const laborMinutes=clampNumber(inputs.laborMinutes);
 const setupMinutes=clampNumber(inputs.setupMinutes);
 const printMinutes=clampNumber(inputs.printMinutes);
 const blanks=blankCost*q;
 const ink=(inputs.detailedConsumablesEnabled&&Number.isFinite(Number(inputs.detailedInkCost))?clampNumber(inputs.detailedInkCost):totalInk*clampNumber(rates.ink))*multiplier;
 const pack=packagingCost*q;
 const labor=(laborMinutes*multiplier+setupMinutes)/60*clampNumber(rates.labor);
 const machine=printMinutes*multiplier/60*clampNumber(rates.machine);
 const electric=printMinutes*multiplier/60*clampNumber(rates.electric);
 const overhead=(printMinutes*multiplier+laborMinutes*multiplier+setupMinutes)/60*clampNumber(rates.overhead);
 const serviceReserve=printMinutes*multiplier/60*clampNumber(rates.serviceReserve);
 const maintenance=clampNumber(rates.maintenance)*multiplier;
 const cleaning=clampNumber(rates.cleaning)*multiplier;
 const shipping=clampNumber(rates.shipping)*multiplier;
 const primer=clampNumber(inputs.primerCost)*multiplier;
 const other=clampNumber(inputs.otherCost)*multiplier;
 const base=blanks+ink+pack+labor+machine+electric+overhead+serviceReserve+maintenance+cleaning+shipping+primer+other;
 const wastePercent=clampNumber(inputs.wastePercent,0,100);
 const waste=base*wastePercent/100;
 const cost=base+waste;
 const targetMargin=clampNumber(inputs.profitMargin,0,95)/100;
 const roundingStep=clampNumber(inputs.rounding,.01);
 const recommended=quantityPricingMode==='per-item'?roundTo(cost/q/(1-targetMargin),roundingStep)*q:roundTo(cost/(1-targetMargin),roundingStep);
 const manualEnabled=!!inputs.manualPriceEnabled;
 const manualValue=clampNumber(inputs.manualPrice);
 const price=manualEnabled&&manualValue>0?(quantityPricingMode==='per-item'?manualValue*q:manualValue):recommended;
 const profit=price-cost;
 const margin=price?profit/price*100:0;
 const taxRate=clampNumber(inputs.salesTax,0,100);
 const taxAmount=price*taxRate/100;
 const customerTotal=price+taxAmount;
 return {q,qty:q,quantityPricingMode,multiplier,setupMinutes,blanks,ink,pack,labor,machine,electric,overhead,serviceReserve,maintenance,cleaning,shipping,primer,other,base,waste,cost,total:cost,price,priceBeforeTax:price,profit,margin,taxRate,taxAmount,customerTotal};
}
function calculate(){
 const inputs=capturePricingInputs();
 if(inputs.detailedConsumablesEnabled)updateProjectConsumableSummary();
 const appliedRates={...state.rates,overhead:state.business.overhead,shipping:state.business.shipping,cleaning:state.printer.cleaning,serviceReserve:state.printer.serviceReserve};
 const result=calculateProjectPricing(inputs,appliedRates);
 const {q,quantityPricingMode,setupMinutes,blanks,ink,pack,labor,machine,electric,overhead,serviceReserve,maintenance,cleaning,shipping,primer,other,waste,price,profit,taxAmount,customerTotal}=result;
 const total=result.cost,actual=result.margin,currentTax=result.taxRate;
 const manualEnabled=inputs.manualPriceEnabled;
 const inkRate=Number(state.rates.ink)||0;
 const targetMarginValue=clampNumber(inputs.profitMargin,0,95);
 const marginLabel=targetMarginValue.toFixed(1).replace(/\.0$/,'');
 const perItem=quantityPricingMode==='per-item';
 const inkLabel=inputs.detailedConsumablesEnabled?(perItem?`Detailed Consumables (${q} items)`:`Detailed Consumables (complete batch)`):(perItem?`Ink (${q} × ${clampNumber(inputs.totalInk)} mL/item × ${money(inkRate)}/mL)`:`Total Batch Ink (${clampNumber(inputs.totalInk)} mL × ${money(inkRate)}/mL)`);
 const laborLabel=setupMinutes>0?`Labor (includes ${setupMinutes} setup min)`:'Labor';
 const extraHeading=perItem?'REPEATED PER-ITEM COSTS':'FIXED JOB COSTS';
 $('#costBreakdown').innerHTML=`<div class="cost-group"><h4>MATERIALS</h4>${line(`Blanks (${q} × ${money(clampNumber(inputs.blankCost))})`,blanks)}${line(inkLabel,ink)}${line(`Packaging (${q} × ${money(clampNumber(inputs.packagingCost))})`,pack)}${line('Subtotal',blanks+ink+pack,true)}</div><div class="cost-group"><h4>PRODUCTION</h4>${line(laborLabel,labor)}${line('Machine Use',machine)}${line('Electricity',electric)}${line('Overhead',overhead)}${line('Service Reserve',serviceReserve)}${line('Subtotal',labor+machine+electric+overhead+serviceReserve,true)}</div><div class="cost-group"><h4>${extraHeading}</h4>${line('Maintenance',maintenance)}${line('Cleaning Allowance',cleaning)}${line('Primer / Pretreatment',primer)}${line('Shipping',shipping)}${line('Other Costs',other)}${line('Waste Allowance',waste)}${line('Subtotal',maintenance+cleaning+primer+shipping+other+waste,true)}</div><div class="cost-total"><span>Total Production Cost</span><strong>${money(total)}</strong></div><div class="cost-group"><h4>CUSTOMER QUOTE — TARGET MARGIN METHOD</h4>${line(`Quote Before Tax (${marginLabel}% target margin)`,price)}${line(`Sales Tax (${currentTax.toFixed(3).replace(/\.?0+$/,'')}%)`,taxAmount)}${line('Customer Quote — Amount Due',customerTotal,true)}</div>`;
 $('#recommendedPrice').textContent=money(customerTotal);
 if($('#manualPrice'))$('#manualPrice').disabled=!manualEnabled;
 $('#perUnitPrice').textContent=money(customerTotal/q)+' per unit including tax';
 $('#projectProfit').textContent=money(profit);$('#projectMargin').textContent=actual.toFixed(1)+'%';
 $('#quoteOrderTotal').textContent=money(customerTotal);
 $('#quoteUnitPrice').textContent=money(price/q);
 $('#quoteProductionCost').textContent=money(total);
 $('#quoteProfit').textContent=money(profit);
 $('#quoteMargin').textContent=actual.toFixed(1)+'%';
 $('#quoteSalesTax').textContent=money(taxAmount);
 $('#quoteProfitPerUnit').textContent=money(profit/q);
 $('#quoteQuantityLine').textContent=`${q} ${q===1?'item':'items'} at ${money(customerTotal/q)} each including tax`;
 $('#quoteGuidanceText').textContent=`Customer quote: ${money(customerTotal)} total (${money(price)} before tax + ${money(taxAmount)} sales tax at ${currentTax.toFixed(3).replace(/\.?0+$/,'')}%). Profit is calculated from the before-tax amount.`;
 applyPricingProfitStatus(profit,actual,targetMarginValue,total,price);
 return result;
}
function line(name,n,subtotal=false){return `<div class="cost-line ${subtotal?'subtotal':''}"><span>${name}</span><strong>${money(n)}</strong></div>`}
function resetForm(){if($('#projectPrinter'))$('#projectPrinter').value=activePrinterLabel();populateProjectMaterialSelector('',false);populateProjectCustomerSelector({name:'Walk-in Customer',type:'Walk-in',email:'',discount:0});$('#projectName').value='Untitled Project';$('#quantity').value=1;$('#quantityPricingMode').value='per-item';$('#projectStatus').value=state.preferences.defaultStatus||'Draft';$('#projectNotes').value='';$('#blankCost').value=0;$('#totalInk').value=.50;$('#totalInk').disabled=false;$('#printMinutes').value=16;$('#laborMinutes').value=12;$('#setupMinutes').value=0;$('#packagingCost').value=0;$('#primerCost').value=.35;$('#otherCost').value=0;$('#wastePercent').value=state.rates.waste;$('#profitMargin').value=state.rates.margin;$('#projectTax').value=Math.max(0,Number(state.business.tax)||0);if($('#useManualPrice'))$('#useManualPrice').checked=false;$('#manualPrice').value='';$('#manualPrice').disabled=true;$('#rounding').value=state.preferences.rounding||'1';if($('#useDetailedConsumables'))$('#useDetailedConsumables').checked=false;if($('#projectConsumableDetails'))$('#projectConsumableDetails').hidden=true;populateProjectPhysicalPrinters();renderProjectConsumableFields({});updateQuantityPricingModeUI();calculate()}
$('#resetFormBtn').onclick=()=>{editingId=null;resetForm()};
$('#demoImportBtn').onclick=()=>{$('#totalInk').value=4.13;$('#printMinutes').value=39.6;calculate();showToast('Sample estimate applied')};
$('#saveProjectBtn').onclick=()=>{
 const c=calculate();
 const existing=editingId?state.projects.find(p=>p.id===editingId):null;
 const customerSnapshot=customerSnapshotFromSelection();
 const project={
  id:editingId||Date.now(),
  projectType:existing?.projectType||'production',
  printer:activePrinterLabel(),
  printerFamily:state.activePrinter.family,
  printerEdition:state.activePrinter.edition,
  name:$('#projectName').value||'Untitled Project',
  customer:customerSnapshot.name||'Walk-in Customer',
  customerType:customerSnapshot.type||'',
  customerEmail:customerSnapshot.email||'',
  customerDiscount:Number(customerSnapshot.discount)||0,
  customerSnapshot:{...customerSnapshot},
  status:$('#projectStatus').value,
  notes:$('#projectNotes').value,
  materialName:$('#projectMaterial')?.value==='__custom__'?'':($('#projectMaterial option:checked')?.textContent||''),
  qty:c.qty,
  cost:c.cost,
  price:c.price,
  taxRate:c.taxRate,
  taxAmount:c.taxAmount,
  customerTotal:c.customerTotal,
  margin:c.margin,
  pricing:createPricingSnapshot(c),
  pricingRates:{ink:state.rates.ink,labor:state.rates.labor,machine:state.rates.machine,electric:state.rates.electric,maintenance:state.rates.maintenance,overhead:state.business.overhead,shipping:state.business.shipping,cleaning:state.printer.cleaning,serviceReserve:state.printer.serviceReserve},
  inputs:capturePricingInputs(),
  physicalPrinterId:capturePricingInputs().physicalPrinterId||existing?.physicalPrinterId||'',
  consumableUsage:capturePricingInputs().consumableUsage||existing?.consumableUsage||{},
  inventoryDeducted:!!existing?.inventoryDeducted,
  inventoryTransactionIds:existing?.inventoryTransactionIds||[],
  createdAt:existing?.createdAt||new Date().toISOString(),
  updatedAt:new Date().toISOString(),
  date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})
 };
 if(project.status==='Completed'&&project.inputs.detailedConsumablesEnabled&&!project.inventoryDeducted&&confirm('Complete this project and deduct its recorded consumables from the selected physical printer?'))deductProjectInventory(project);
 if(editingId){
  state.projects=state.projects.map(p=>p.id===editingId?project:p);
 }else{
  state.projects.push(project);
 }
 save(editingId?'Project estimate updated':'New project estimate saved');
 dashboardSelectedProjectId=project.id;
 editingId=null;
 renderAll();
 navigate('projects');
};

function updateCalculatedInkRate(){
 const price=Number($('#inkCartridgePrice')?.value)||0;
 const capacity=Math.max(1,Number($('#inkCartridgeCapacity')?.value)||1);
 if($('#rateInk'))$('#rateInk').value=(price/capacity).toFixed(4);
}

function loadRates(){
 const r=state.rates,b=state.business,p=state.printer,pr=state.preferences;
 $('#inkCartridgePrice').value=p.inkCartridgePrice;$('#inkCartridgeCapacity').value=p.inkCartridgeCapacity;$('#cleaningCartridgePrice').value=p.cleaningCartridgePrice;$('#cleaningCartridgeCapacity').value=p.cleaningCartridgeCapacity;$('#rateInk').value=(Number(r.ink)||0).toFixed(4);
 $('#rateMachine').value=r.machine;$('#rateElectric').value=r.electric;
 $('#rateMaintenance').value=r.maintenance;$('#rateCleaning').value=p.cleaning;$('#ratePrimerDefault').value=p.primerDefault;$('#rateServiceReserve').value=p.serviceReserve;
 if($('#printerProfileName'))$('#printerProfileName').value=p.profileName;
 $('#businessName').value=state.profile.business;$('#businessOwner').value=b.owner;$('#businessEmail').value=b.email;$('#businessPhone').value=b.phone;$('#businessWebsite').value=b.website;
 $('#rateLabor').value=r.labor;$('#rateOverhead').value=b.overhead;$('#rateWaste').value=r.waste;$('#rateMargin').value=r.margin;$('#rateTax').value=b.tax;$('#rateShipping').value=b.shipping;
 $('#quoteValidity').value=b.quoteValidity;$('#depositPercent').value=b.deposit;$('#defaultTerms').value=b.terms;
 if($('#prefWelcomeMode'))$('#prefWelcomeMode').value=pr.welcomeMode||'updates';$('#prefCurrency').value=state.profile.currency;$('#prefNumberFormat').value=pr.numberFormat;$('#prefAutosave').checked=pr.autosave;$('#prefLastCustomer').checked=pr.lastCustomer;$('#prefShowCosts').checked=pr.showCosts;$('#prefConfirmDelete').checked=pr.confirmDelete;$('#prefDefaultStatus').value=pr.defaultStatus;$('#prefRounding').value=pr.rounding;
}
async function saveGlobalWorkspace(){
 state.printer={...state.printer,model:getActivePrinterProfile().name,profileName:$('#printerProfileName').value,inkCartridgePrice:val('inkCartridgePrice'),inkCartridgeCapacity:Math.max(1,val('inkCartridgeCapacity')),cleaningCartridgePrice:val('cleaningCartridgePrice'),cleaningCartridgeCapacity:Math.max(1,val('cleaningCartridgeCapacity')),cleaning:val('rateCleaning'),primerDefault:val('ratePrimerDefault'),serviceReserve:val('rateServiceReserve')};
 const calculatedInkRate=state.printer.inkCartridgePrice/state.printer.inkCartridgeCapacity;state.rates={...state.rates,ink:calculatedInkRate,color:calculatedInkRate,white:calculatedInkRate,varnish:calculatedInkRate,labor:val('rateLabor'),machine:val('rateMachine'),electric:val('rateElectric'),maintenance:val('rateMaintenance'),waste:val('rateWaste'),margin:val('rateMargin')};
 state.profile.business=$('#businessName').value||'UV Project Calculator Pro';state.profile.currency=$('#prefCurrency').value;
 state.business={owner:$('#businessOwner').value,email:$('#businessEmail').value,phone:$('#businessPhone').value,website:$('#businessWebsite').value,overhead:val('rateOverhead'),tax:Math.max(0,val('rateTax')),shipping:val('rateShipping'),quoteValidity:$('#quoteValidity').value,deposit:val('depositPercent'),terms:$('#defaultTerms').value};
 state.preferences={...state.preferences,welcomeMode:$('#prefWelcomeMode').value,numberFormat:$('#prefNumberFormat').value,autosave:$('#prefAutosave').checked,lastCustomer:$('#prefLastCustomer').checked,showCosts:$('#prefShowCosts').checked,confirmDelete:$('#prefConfirmDelete').checked,defaultStatus:$('#prefDefaultStatus').value,rounding:$('#prefRounding').value};
 try{
  state.activities.unshift({icon:'✓',text:'Global setup updated',time:'Just now'});state.activities=state.activities.slice(0,8);
  await window.UVPCStorage.saveState(state);
  resetForm();renderAll();showToast(`Application settings saved — tax ${state.business.tax}%`);
 }catch(error){console.error(error);showToast('Application settings could not be saved')}
}
$('#saveGlobalWorkspaceBtn').onclick=saveGlobalWorkspace;



function openSettingsPanel(panelName){
 navigate('global');
 const target=document.querySelector(`.settings-tab[data-settings-panel="${panelName}"]`);
 if(target)target.click();
}

$$('.settings-tab').forEach(btn=>btn.onclick=()=>{
 $$('.settings-tab').forEach(b=>b.classList.toggle('active',b===btn));
 $$('.settings-panel').forEach(p=>p.classList.toggle('active',p.id==='settings-'+btn.dataset.settingsPanel));
});
let customerSortKey='name';
let customerSortDirection='asc';

function renderCustomersLibrary(){
 const body=$('#customerBody');
 if(!body)return;
 const query=($('#customerSearch')?.value||'').trim().toLowerCase();
 const customers=state.customers
  .map((customer,index)=>({customer,index}))
  .filter(({customer})=>[customer.name,customer.type,customer.email,customer.discount]
   .some(value=>String(value??'').toLowerCase().includes(query)))
  .sort((a,b)=>{
   const av=a.customer[customerSortKey]??'';
   const bv=b.customer[customerSortKey]??'';
   const comparison=customerSortKey==='discount'
    ? (Number(av)||0)-(Number(bv)||0)
    : String(av).localeCompare(String(bv),undefined,{sensitivity:'base',numeric:true});
   return customerSortDirection==='asc'?comparison:-comparison;
  });
 body.innerHTML=customers.map(({customer,index})=>`<tr>
  <td data-label="Customer Name"><strong>${esc(customer.name||'Unnamed Customer')}</strong></td>
  <td data-label="Customer Type">${esc(customer.type||'—')}</td>
  <td data-label="Email">${customer.email?`<a class="customer-email-link" href="mailto:${encodeURIComponent(customer.email)}">${esc(customer.email)}</a>`:'—'}</td>
  <td data-label="Discount">${Number(customer.discount||0).toFixed(2).replace(/\.00$/,'')}%</td>
  <td data-label="Actions"><div class="inline-actions"><button class="secondary small" onclick="editCustomer(${index})">Edit</button><button class="danger small" onclick="removeCustomer(${index})">Delete</button></div></td>
 </tr>`).join('')||'<tr><td colspan="5" class="empty-table-message">No customers match your search.</td></tr>';
 if($('#customerResultCount'))$('#customerResultCount').textContent=`${customers.length} of ${state.customers.length} customers`;
 $$('.table-sort[data-customer-sort]').forEach(button=>{
  const active=button.dataset.customerSort===customerSortKey;
  button.classList.toggle('active',active);
  button.setAttribute('aria-sort',active?(customerSortDirection==='asc'?'ascending':'descending'):'none');
  const indicator=button.querySelector('span');
  if(indicator)indicator.textContent=active?(customerSortDirection==='asc'?'↑':'↓'):'↕';
 });
}

function renderGlobalLibraries(){
 const mq=($('#libraryMaterialSearch')?.value||'').toLowerCase();
 const cat=$('#libraryMaterialCategory')?.value||'all';
 if($('#libraryMaterialCategory')){
  const cats=[...new Set(state.materials.map(m=>m.category))];
  const old=$('#libraryMaterialCategory').value;
  $('#libraryMaterialCategory').innerHTML='<option value="all">All categories</option>'+cats.map(c=>`<option>${esc(c)}</option>`).join('');
  $('#libraryMaterialCategory').value=cats.includes(old)?old:'all';
 }
 if($('#materialsBody')) $('#materialsBody').innerHTML=state.materials
  .map((m,index)=>({m,index}))
  .filter(({m})=>(m.name+' '+m.category+' '+(m.supplier||'')).toLowerCase().includes(mq)&&(cat==='all'||m.category===cat))
  .map(({m,index})=>`<tr><td>${esc(m.name)}</td><td>${esc(m.category)}</td><td>${esc(m.supplier||'—')}</td><td>${esc(m.sku||'—')}</td><td>${money(m.cost)}</td><td><div class="inline-actions"><button class="secondary small" onclick="editMaterial(${index})">Edit</button><button class="danger small" onclick="removeMaterial(${index})">Delete</button></div></td></tr>`).join('');
 renderCustomersLibrary();
}
if($('#libraryMaterialSearch'))$('#libraryMaterialSearch').oninput=renderGlobalLibraries;
if($('#libraryMaterialCategory'))$('#libraryMaterialCategory').onchange=renderGlobalLibraries;
if($('#customerSearch'))$('#customerSearch').oninput=renderCustomersLibrary;
$$('.table-sort[data-customer-sort]').forEach(button=>button.onclick=()=>{
 const key=button.dataset.customerSort;
 if(customerSortKey===key)customerSortDirection=customerSortDirection==='asc'?'desc':'asc';
 else{customerSortKey=key;customerSortDirection='asc'}
 renderCustomersLibrary();
});
let materialEditIndex=null;
let materialSaveCallback=null;
let materialDeleteIndex=null;
const materialModal=$('#materialModal');
const materialForm=$('#materialForm');
const closeMaterialModal=()=>{materialModal.hidden=true;materialEditIndex=null;materialSaveCallback=null;$('#materialFormError').hidden=true};
const openMaterialModal=({material=null,index=null,onSave=null}={})=>{
 materialEditIndex=index;
 materialSaveCallback=onSave;
 const editing=material!==null;
 $('#materialModalTitle').textContent=editing?'Edit Material':'Add Material';
 $('#materialModalDescription').textContent=editing?'Update this reusable Material Library record.':'Add a reusable material to your library for projects and scenarios.';
 $('#saveMaterialBtn').textContent=editing?'Save Changes':'Add Material';
 $('#materialNameInput').value=material?.name||'';
 $('#materialCategoryInput').value=material?.category||'';
 $('#materialCostInput').value=Number(material?.cost||0).toFixed(2);
 $('#materialSupplierInput').value=material?.supplier||'';
 $('#materialSkuInput').value=material?.sku||'';
 $('#materialNotesInput').value=material?.note||'';
 $('#materialFormError').hidden=true;
 materialModal.hidden=false;
 setTimeout(()=>$('#materialNameInput').focus(),0);
};
materialForm.onsubmit=e=>{
 e.preventDefault();
 const name=$('#materialNameInput').value.trim();
 const category=$('#materialCategoryInput').value.trim()||'Custom';
 const cost=Number($('#materialCostInput').value);
 const error=$('#materialFormError');
 if(!name){error.textContent='Enter a material name.';error.hidden=false;$('#materialNameInput').focus();return}
 if(!Number.isFinite(cost)||cost<0){error.textContent='Enter a valid unit cost of zero or greater.';error.hidden=false;$('#materialCostInput').focus();return}
 const previous=materialEditIndex===null?{}:state.materials[materialEditIndex]||{};
 const material={...previous,name,category,cost,supplier:$('#materialSupplierInput').value.trim(),sku:$('#materialSkuInput').value.trim(),note:$('#materialNotesInput').value.trim()};
 if(materialEditIndex===null)state.materials.push(material);else state.materials[materialEditIndex]=material;
 save(materialEditIndex===null?'Material added':'Material updated');
 const savedIndex=materialEditIndex===null?state.materials.length-1:materialEditIndex;
 const callback=materialSaveCallback;
 closeMaterialModal();
 renderAll();
 populateScenarioSelectors();
 if(callback)callback(material,savedIndex);
 else populateProjectMaterialSelector($('#projectMaterial option:checked')?.textContent||'',true);
};
$('#cancelMaterialBtn').onclick=closeMaterialModal;
materialModal.addEventListener('click',e=>{if(e.target===materialModal)closeMaterialModal()});
const addMaterialAction=()=>openMaterialModal();
if($('#addLibraryMaterialBtn'))$('#addLibraryMaterialBtn').onclick=addMaterialAction;
window.editMaterial=i=>openMaterialModal({material:state.materials[i],index:i});
window.removeMaterial=i=>{
 if(!state.preferences.confirmDelete){state.materials.splice(i,1);save('Material deleted');renderAll();populateScenarioSelectors();return}
 materialDeleteIndex=i;$('#deleteMaterialName').textContent=state.materials[i]?.name||'Selected material';$('#deleteMaterialModal').hidden=false;
};
const closeDeleteMaterialModal=()=>{$('#deleteMaterialModal').hidden=true;materialDeleteIndex=null};
$('#cancelDeleteMaterialBtn').onclick=closeDeleteMaterialModal;
$('#deleteMaterialModal').addEventListener('click',e=>{if(e.target===$('#deleteMaterialModal'))closeDeleteMaterialModal()});
$('#confirmDeleteMaterialBtn').onclick=()=>{
 if(materialDeleteIndex===null)return;
 state.materials.splice(materialDeleteIndex,1);save('Material deleted');closeDeleteMaterialModal();renderAll();populateScenarioSelectors();
};
let customerEditIndex=null;
let customerDeleteIndex=null;
const customerModal=$('#customerModal');
const customerForm=$('#customerForm');
const closeCustomerModal=()=>{customerModal.hidden=true;customerEditIndex=null;$('#customerFormError').hidden=true};
const openCustomerModal=({customer=null,index=null}={})=>{
 customerEditIndex=index;
 const editing=customer!==null;
 $('#customerModalTitle').textContent=editing?'Edit Customer':'Add Customer';
 $('#customerModalDescription').textContent=editing?'Update this Customers Library record.':'Add a reusable customer record for projects and quotes.';
 $('#saveCustomerBtn').textContent=editing?'Save Changes':'Add Customer';
 $('#customerNameInput').value=customer?.name||'';
 $('#customerTypeInput').value=customer?.type||'Retail';
 $('#customerDiscountInput').value=Number(customer?.discount||0);
 $('#customerEmailInput').value=customer?.email==='—'?'':customer?.email||'';
 $('#customerFormError').hidden=true;
 customerModal.hidden=false;
 setTimeout(()=>$('#customerNameInput').focus(),0);
};
customerForm.onsubmit=e=>{
 e.preventDefault();
 const name=$('#customerNameInput').value.trim();
 const type=$('#customerTypeInput').value.trim()||'Retail';
 const discount=Number($('#customerDiscountInput').value);
 const email=$('#customerEmailInput').value.trim();
 const error=$('#customerFormError');
 if(!name){error.textContent='Enter a customer name.';error.hidden=false;$('#customerNameInput').focus();return}
 if(!Number.isFinite(discount)||discount<0||discount>100){error.textContent='Enter a discount from 0 to 100 percent.';error.hidden=false;$('#customerDiscountInput').focus();return}
 const previous=customerEditIndex===null?{}:state.customers[customerEditIndex]||{};
 const customer={...previous,name,type,discount,email};
 if(customerEditIndex===null)state.customers.push(customer);else state.customers[customerEditIndex]=customer;
 save(customerEditIndex===null?'Customer added':'Customer updated');
 closeCustomerModal();renderAll();
};
$('#cancelCustomerBtn').onclick=closeCustomerModal;
customerModal.addEventListener('click',e=>{if(e.target===customerModal)closeCustomerModal()});
const addCustomerAction=()=>openCustomerModal();
if($('#addCustomerBtn'))$('#addCustomerBtn').onclick=addCustomerAction;
window.editCustomer=i=>openCustomerModal({customer:state.customers[i],index:i});
window.removeCustomer=i=>{
 if(!state.preferences.confirmDelete){state.customers.splice(i,1);save('Customer deleted');renderAll();return}
 customerDeleteIndex=i;$('#deleteCustomerName').textContent=state.customers[i]?.name||'Selected customer';$('#deleteCustomerModal').hidden=false;
};
const closeDeleteCustomerModal=()=>{$('#deleteCustomerModal').hidden=true;customerDeleteIndex=null};
$('#cancelDeleteCustomerBtn').onclick=closeDeleteCustomerModal;
$('#deleteCustomerModal').addEventListener('click',e=>{if(e.target===$('#deleteCustomerModal'))closeDeleteCustomerModal()});
$('#confirmDeleteCustomerBtn').onclick=()=>{
 if(customerDeleteIndex===null)return;
 state.customers.splice(customerDeleteIndex,1);save('Customer deleted');closeDeleteCustomerModal();renderAll();
};

function downloadJson(data,name){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
function markBackupCreated(){
 const now=new Date();
 localStorage.setItem('uvpc-last-backup-at',now.toISOString());
 localStorage.removeItem('uvpc-backup-reminder-dismissed-at');
 renderDashboardBackupStatus();
 return now;
}
function buildExportPayload(kind){
 const payload={format:'UVProjectCalculatorPro',backupSchema:1,appVersion:UVPC_APP_VERSION,build:UVPC_BUILD_NUMBER,version:'3.0',exportedAt:new Date().toISOString(),kind};
 if(kind==='all')payload.data=state;
 if(kind==='materials')payload.data=state.materials;
 if(kind==='customers')payload.data=state.customers;
 if(kind==='printer')payload.data={printer:state.printer,printerProfiles:state.printerProfiles,activePrinter:state.activePrinter,rates:state.rates};
 return payload;
}
function exportKind(kind,{markBackup=kind==='all'}={}){
 const payload=buildExportPayload(kind);
 const stamp=new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
 const filename=kind==='all'?`Universal_Project_Calculator_Complete_Backup_${stamp}.json`:`UV_Project_Calculator_${kind}_export.json`;
 downloadJson(payload,filename);
 if(markBackup){const now=markBackupCreated();if($('#lastBackupLabel'))$('#lastBackupLabel').textContent='Backup created '+now.toLocaleString();showToast('Complete backup created')}
 else showToast('Export created');
}
$$('[data-export-kind]').forEach(b=>b.onclick=()=>exportKind(b.dataset.exportKind));
$('#exportSettingsBtn').onclick=()=>exportKind('all');
$('#quickBackupBtn').onclick=()=>exportKind('all');

let pendingImportPayload=null;
function closeImportProtection(){if($('#importProtectionModal'))$('#importProtectionModal').hidden=true;pendingImportPayload=null;const input=$('#importSetupFile');if(input)input.value=''}
async function applyPendingImport(){
 const payload=pendingImportPayload;if(!payload)return;
 try{
  const kind=String(payload.kind||'').toLowerCase();
  if(kind==='all'){
   if(!payload.data||typeof payload.data!=='object'||Array.isArray(payload.data))throw new Error('Complete backup data is invalid.');
   state=payload.data;normalizeInventoryState();
  }else if(kind==='materials'){
   if(!Array.isArray(payload.data))throw new Error('Materials import must contain a materials list.');
   state.materials=payload.data.map(m=>({supplier:'',sku:'',note:'',...m,cost:Number(m.cost)||0}));
  }else if(kind==='customers'){
   if(!Array.isArray(payload.data))throw new Error('Customers import must contain a customers list.');
   state.customers=payload.data.map(c=>({type:'Retail',discount:0,email:'',...c,discount:Number(c.discount)||0}));
  }else if(kind==='printer'){
   if(!payload.data||typeof payload.data!=='object')throw new Error('Printer import data is invalid.');
   state.printer=payload.data.printer||state.printer;
   if(payload.data.printerProfiles)state.printerProfiles=payload.data.printerProfiles;
   if(payload.data.activePrinter)state.activePrinter=payload.data.activePrinter;
   if(payload.data.rates)state.rates=payload.data.rates;
  }else throw new Error(`Unsupported import type: ${payload.kind||'missing'}`);
  await window.UVPCStorage.saveState(state);
  closeImportProtection();
  location.reload();
 }catch(err){alert('Import failed: '+err.message);closeImportProtection()}
}
$('#importSetupFile').onchange=async e=>{
 const file=e.target.files[0];if(!file)return;
 try{
  const payload=JSON.parse(await file.text());
  if(payload.format!=='UVProjectCalculatorPro')throw new Error('Not a Universal Project Calculator export.');
  if(!payload.data)throw new Error('The selected file does not contain importable data.');
  pendingImportPayload=payload;
  $('#importProtectionModal').hidden=false;
 }catch(err){alert('Import failed: '+err.message);e.target.value=''}
};
if($('#cancelImportBtn'))$('#cancelImportBtn').onclick=closeImportProtection;
if($('#continueImportBtn'))$('#continueImportBtn').onclick=applyPendingImport;
if($('#backupBeforeImportBtn'))$('#backupBeforeImportBtn').onclick=()=>{exportKind('all');showToast('Current workspace backed up. You may now continue the import.')};

function initializeBackupProtection(){
 renderDashboardBackupStatus();
 const currentVersion=UVPC_APP_VERSION;
 const priorVersion=localStorage.getItem('uvpc-last-app-version');
 const storageNoticeDismissed=localStorage.getItem('uvpc-storage-notice-dismissed')==='true';
 const hasExistingSavedState=Boolean(window.__UVPC_INITIAL_STATE__);
 const showUpdateNotice=Boolean((priorVersion&&priorVersion!==currentVersion)||(!priorVersion&&hasExistingSavedState));
 const showStorageNotice=!priorVersion&&!hasExistingSavedState&&!storageNoticeDismissed;
 setTimeout(()=>{
  if(showUpdateNotice&&$('#updateBackupModal'))$('#updateBackupModal').hidden=false;
  else if(showStorageNotice&&state.profile?.setupComplete&&$('#localStorageNoticeModal'))$('#localStorageNoticeModal').hidden=false;
 },450);
 if(!showUpdateNotice&&!showStorageNotice)localStorage.setItem('uvpc-last-app-version',currentVersion);
}
function finishStorageNotice(openBackup){
 if($('#doNotShowStorageNotice')?.checked)localStorage.setItem('uvpc-storage-notice-dismissed','true');
 localStorage.setItem('uvpc-last-app-version',UVPC_APP_VERSION);
 $('#localStorageNoticeModal').hidden=true;
 if(openBackup)openSettingsPanel('transfer');
}
if($('#storageNoticeLaterBtn'))$('#storageNoticeLaterBtn').onclick=()=>finishStorageNotice(false);
if($('#storageNoticeBackupBtn'))$('#storageNoticeBackupBtn').onclick=()=>finishStorageNotice(true);
if($('#updateContinueBtn'))$('#updateContinueBtn').onclick=()=>{localStorage.setItem('uvpc-last-app-version',UVPC_APP_VERSION);$('#updateBackupModal').hidden=true};
if($('#updateBackupBtn'))$('#updateBackupBtn').onclick=()=>{exportKind('all');localStorage.setItem('uvpc-last-app-version',UVPC_APP_VERSION);$('#updateBackupModal').hidden=true};
if($('#dashboardBackupReminderBtn'))$('#dashboardBackupReminderBtn').onclick=()=>openSettingsPanel('transfer');
if($('#dashboardBackupReminderDismiss'))$('#dashboardBackupReminderDismiss').onclick=()=>{localStorage.setItem('uvpc-backup-reminder-dismissed-at',String(Date.now()));renderDashboardBackupStatus()};


function loadSampleBusinessData(){
 const confirmed=confirm('Load Sample Business Data? This replaces the current Customers Library, Material Library, and Projects lists. Export a backup first if you need to keep the existing records.');
 if(!confirmed)return;
 const now=new Date();
 const dateLabel=daysAgo=>new Date(now.getTime()-daysAgo*86400000).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
 const iso=daysAgo=>new Date(now.getTime()-daysAgo*86400000).toISOString();
 state.customers=[
  {name:'ABC Awards',type:'Business',discount:5,email:'orders@abcawards.example'},
  {name:'Smith Photography',type:'Repeat Customer',discount:5,email:'studio@smithphoto.example'},
  {name:'Local School',type:'Education',discount:8,email:'office@localschool.example'},
  {name:'Johnson Realty',type:'Business',discount:0,email:'closing@johnsonrealty.example'},
  {name:'Creative Signs',type:'Trade Partner',discount:10,email:'projects@creativesigns.example'}
 ];
 state.materials=[
  {name:'20oz White Tumbler',category:'Drinkware',cost:6.25,supplier:'Drinkware Supply Co.',sku:'TUM-20-WHT',note:'Gloss white stainless tumbler'},
  {name:'11oz Ceramic Mug',category:'Drinkware',cost:2.10,supplier:'Ceramic Blanks Co.',sku:'MUG-11-WHT',note:'White ceramic mug'},
  {name:'4-Inch Ceramic Coaster',category:'Ceramic',cost:.77,supplier:'Ceramic Blanks Co.',sku:'COA-4-RND',note:'Round gloss coaster'},
  {name:'MDF Plaque',category:'Awards',cost:4.80,supplier:'Awards Supply Co.',sku:'MDF-PLQ-8X10',note:'8 × 10 inch beveled plaque'},
  {name:'Acrylic Keychain',category:'Acrylic',cost:1.15,supplier:'Acrylic Supply Co.',sku:'KEY-ACR-CLR',note:'Clear acrylic keychain blank'},
  {name:'Phone Stand',category:'Acrylic',cost:3.25,supplier:'Acrylic Supply Co.',sku:'PHN-STAND-CLR',note:'Clear acrylic phone stand'},
  {name:'Gift Box',category:'Packaging',cost:1.40,supplier:'Packaging Supply Co.',sku:'BOX-GIFT-MED',note:'Medium presentation gift box'}
 ];
 const makeProject=(id,name,customer,status,qty,materialName,blankCost,packagingCost,totalInk,printMinutes,laborMinutes,taxRate,targetMargin,daysAgo,notes)=>{
  const inputs={quantity:qty,quantityPricingMode:'batch-job',setupMinutes:0,blankCost,totalInk,printMinutes,laborMinutes,packagingCost,primerCost:clampNumber(state.printer.primerDefault),otherCost:0,wastePercent:clampNumber(state.rates.waste,0,100),profitMargin:targetMargin,salesTax:taxRate,rounding:String(state.preferences.rounding||'1'),manualPrice:'',manualPriceEnabled:false};
  const pricingRates={ink:state.rates.ink,labor:state.rates.labor,machine:state.rates.machine,electric:state.rates.electric,maintenance:state.rates.maintenance,overhead:state.business.overhead,shipping:state.business.shipping,cleaning:state.printer.cleaning,serviceReserve:state.printer.serviceReserve};
  const calculated=calculateProjectPricing(inputs,pricingRates);
  const pricing=createPricingSnapshot(calculated);
  return {id,projectType:'production',name,customer,status,notes,qty,materialName,printer:activePrinterLabel(),printerFamily:state.activePrinter.family,printerEdition:state.activePrinter.edition,cost:pricing.cost,price:pricing.priceBeforeTax,taxRate:pricing.taxRate,taxAmount:pricing.taxAmount,customerTotal:pricing.customerTotal,profit:pricing.profit,margin:pricing.margin,pricing,pricingRates,inputs,createdAt:iso(daysAgo),updatedAt:iso(daysAgo),date:dateLabel(daysAgo)};
 };
 const baseId=Date.now();
 state.projects=[
  makeProject(baseId+1,'Employee Recognition Plaques','ABC Awards','Completed',25,'MDF Plaque',4.80,1.40,12.5,185,95,6.0,45,28,'Annual employee recognition order'),
  makeProject(baseId+2,'Ceramic Coaster Photo Sets','Smith Photography','Quoted',100,'4-Inch Ceramic Coaster',.77,.70,24,260,120,6.0,45,12,'Branded client gift coaster sets'),
  makeProject(baseId+3,'Closing Gift Tumblers','Johnson Realty','Approved',50,'20oz White Tumbler',6.25,1.40,31,310,150,6.0,48,8,'Personalized closing gifts'),
  makeProject(baseId+4,'Teacher Appreciation Mugs','Local School','In Production',36,'11oz Ceramic Mug',2.10,.80,18,220,110,0,42,3,'Teacher appreciation week order'),
  makeProject(baseId+5,'Acrylic QR Display Stands','Creative Signs','Draft',20,'Phone Stand',3.25,.45,9.2,140,75,6.0,45,1,'Countertop QR display concept')
 ];
 dashboardSelectedProjectId=state.projects[state.projects.length-1].id;
 save('Sample business data loaded');
 renderAll();
 populateScenarioSelectors();
 cloneScenarioFromSelected();
 navigate('dashboard');
 showToast('Sample business data loaded');
}
if($('#loadSampleBusinessDataBtn'))$('#loadSampleBusinessDataBtn').onclick=loadSampleBusinessData;

async function performFactoryReset(){
 try{
  await window.UVPCStorage.clearState();
  state=structuredClone(defaults);
  state.profile.setupComplete=false;
  state.projects=[];
  state.customers=[];
  state.materials=[];
  localStorage.removeItem('uvpc-last-backup-at');
  localStorage.removeItem('uvpc-backup-reminder-dismissed-at');
  localStorage.removeItem('uvpc-last-app-version');
  await window.UVPCStorage.saveState(state);
  $('#resetCompleteModal').hidden=false;
 }catch(error){console.error(error);alert('Factory reset failed: '+error.message)}
}
$('#restartAfterResetBtn').onclick=()=>{
 $('#resetCompleteModal').hidden=true;
 location.reload();
};

$$('[data-reset-kind]').forEach(b=>b.onclick=()=>{
 const kind=b.dataset.resetKind;
 const message=kind==='factory'
  ?'Factory reset the entire prototype? This removes all browser-saved projects, settings, customers, and materials.'
  :`Reset ${kind}? This cannot be undone unless you exported a backup.`;
 if(state.preferences.confirmDelete&&!confirm(message))return;
 if(kind==='factory'){performFactoryReset();return}
 if(kind==='printer'){state.printer=structuredClone(defaults.printer);state.rates={...state.rates,color:defaults.rates.color,white:defaults.rates.white,varnish:defaults.rates.varnish,machine:defaults.rates.machine,electric:defaults.rates.electric,maintenance:defaults.rates.maintenance}}
 if(kind==='business'){state.business=structuredClone(defaults.business);state.rates={...state.rates,labor:defaults.rates.labor,waste:defaults.rates.waste,margin:defaults.rates.margin}}
 if(kind==='materials')state.materials=structuredClone(defaults.materials);
 if(kind==='customers')state.customers=structuredClone(defaults.customers);
 if(kind==='projects')state.projects=[];
 save(`${kind} reset completed`);
 initializeBrandSplash();loadRates();resetForm();renderAll();initializeSupportPage();
 showToast(`${kind[0].toUpperCase()+kind.slice(1)} reset completed`);
});


const scIds=['scPricingMode','scProjectName','scCustomer','scStatus','scQuantity','scMaterial','scBlankCost','scPackaging','scShipping','scTotalInk','scPrintMinutes','scLaborMinutes','scSetupMinutes','scPrimer','scCleaning','scMaintenance','scOtherCost','scWaste','scInkRate','scLaborRate','scMachineRate','scElectricRate','scOverheadRate','scServiceReserveRate','scTargetMargin','scDiscount','scTax','scManualPrice','scDesiredProfit','scRounding','scBudget','scMinimumProfit'];
function populateScenarioSelectors(){
 if(!$('#scenarioProjectSelect'))return;
 const old=$('#scenarioProjectSelect').value;
 $('#scenarioProjectSelect').innerHTML=state.projects.map(p=>`<option value="${p.id}">${esc(p.name)} — ${esc(p.customer)}</option>`).join('');
 if(state.projects.some(p=>String(p.id)===old))$('#scenarioProjectSelect').value=old;
 $('#scMaterial').innerHTML=state.materials.map((m,i)=>`<option value="${i}">${esc(m.name)}</option>`).join('')+'<option value="__new__">---------- Add New Material... ----------</option>';
}
function projectToScenario(p){
 const inputs=p.inputs||{};
 const savedRates=p.pricingRates||{};
 const pricing=getProjectPricing(p);
 if(p.scenarioInputs){
  return {...structuredClone(p.scenarioInputs),sourceId:p.id,printer:p.printer||p.scenarioInputs.printer||activePrinterLabel(),name:p.name,customer:p.customer,status:p.status||'Draft'};
 }
 return {
  sourceId:p.id,printer:p.printer||activePrinterLabel(),name:p.name,customer:p.customer,status:p.status||'Draft',qty:Math.max(1,Math.round(clampNumber(p.qty??inputs.quantity,1))),
  materialIndex:Math.max(0,state.materials.findIndex(m=>m.name===(p.materialName||''))),
  materialName:p.materialName||'',
  blankCost:clampNumber(inputs.blankCost),packaging:clampNumber(inputs.packagingCost),shipping:clampNumber(savedRates.shipping??state.business.shipping),
  totalInk:clampNumber(inputs.totalInk),printMinutes:clampNumber(inputs.printMinutes),laborMinutes:clampNumber(inputs.laborMinutes),setupMinutes:0,
  primer:clampNumber(inputs.primerCost??state.printer.primerDefault),cleaning:clampNumber(savedRates.cleaning??state.printer.cleaning),maintenance:clampNumber(savedRates.maintenance??state.rates.maintenance),otherCost:clampNumber(inputs.otherCost),waste:clampNumber(inputs.wastePercent??state.rates.waste,0,100),
  inkRate:clampNumber(savedRates.ink??state.rates.ink),laborRate:clampNumber(savedRates.labor??state.rates.labor),machineRate:clampNumber(savedRates.machine??state.rates.machine),electricRate:clampNumber(savedRates.electric??state.rates.electric),overheadRate:clampNumber(savedRates.overhead??state.business.overhead),serviceReserveRate:clampNumber(savedRates.serviceReserve??state.printer.serviceReserve),
  pricingMode:inputs.manualPriceEnabled?'manual':'margin',targetMargin:clampNumber(inputs.profitMargin??state.rates.margin,0,95),discount:0,tax:clampNumber(inputs.salesTax??pricing.taxRate??state.business.tax,0,100),manualPrice:inputs.manualPriceEnabled?clampNumber(inputs.manualPrice??pricing.price):0,desiredProfit:0,
  rounding:String(inputs.rounding??state.preferences.rounding??'1'),budget:0,minimumProfit:0
 };
}
function writeScenario(s){
 $('#scPrinter').value=s.printer||activePrinterLabel();$('#scProjectName').value=s.name;$('#scCustomer').value=s.customer;$('#scStatus').value=s.status;$('#scQuantity').value=s.qty;
 $('#scMaterial').value=s.materialIndex;$('#scBlankCost').value=s.blankCost;$('#scPackaging').value=s.packaging;$('#scShipping').value=s.shipping;
 $('#scTotalInk').value=s.totalInk;$('#scPrintMinutes').value=s.printMinutes;$('#scLaborMinutes').value=s.laborMinutes;$('#scSetupMinutes').value=s.setupMinutes;
 $('#scPrimer').value=s.primer;$('#scCleaning').value=s.cleaning;$('#scMaintenance').value=s.maintenance;$('#scOtherCost').value=s.otherCost;$('#scWaste').value=s.waste;$('#scInkRate').value=s.inkRate;$('#scLaborRate').value=s.laborRate;$('#scMachineRate').value=s.machineRate;$('#scElectricRate').value=s.electricRate;$('#scOverheadRate').value=s.overheadRate;$('#scServiceReserveRate').value=s.serviceReserveRate;
 $('#scPricingMode').value=s.pricingMode||'margin';$('#scTargetMargin').value=s.targetMargin;$('#scDiscount').value=s.discount;$('#scTax').value=s.tax;$('#scManualPrice').value=s.manualPrice||'';$('#scDesiredProfit').value=s.desiredProfit||'';
 $('#scRounding').value=s.rounding;$('#scBudget').value=s.budget||'';$('#scMinimumProfit').value=s.minimumProfit||'';
}
function readScenario(){
 const n=id=>Number($('#'+id).value)||0;
 return {printer:$('#scPrinter').value||activePrinterLabel(),name:$('#scProjectName').value||'Scenario Project',customer:$('#scCustomer').value||'Walk-in Customer',status:$('#scStatus').value,qty:Math.max(1,Math.round(clampNumber(n('scQuantity'),1))),materialIndex:Number($('#scMaterial').value)||0,materialName:(state.materials[Number($('#scMaterial').value)||0]?.name||'Custom Material'),blankCost:clampNumber(n('scBlankCost')),packaging:clampNumber(n('scPackaging')),shipping:clampNumber(n('scShipping')),totalInk:clampNumber(n('scTotalInk')),printMinutes:clampNumber(n('scPrintMinutes')),laborMinutes:clampNumber(n('scLaborMinutes')),setupMinutes:clampNumber(n('scSetupMinutes')),primer:clampNumber(n('scPrimer')),cleaning:clampNumber(n('scCleaning')),maintenance:clampNumber(n('scMaintenance')),otherCost:clampNumber(n('scOtherCost')),waste:clampNumber(n('scWaste'),0,100),inkRate:clampNumber(n('scInkRate')),laborRate:clampNumber(n('scLaborRate')),machineRate:clampNumber(n('scMachineRate')),electricRate:clampNumber(n('scElectricRate')),overheadRate:clampNumber(n('scOverheadRate')),serviceReserveRate:clampNumber(n('scServiceReserveRate')),pricingMode:$('#scPricingMode').value,targetMargin:clampNumber(n('scTargetMargin'),0,95),discount:clampNumber(n('scDiscount'),0,100),tax:clampNumber(n('scTax'),0,100),manualPrice:clampNumber(n('scManualPrice')),desiredProfit:clampNumber(n('scDesiredProfit')),rounding:$('#scRounding').value,budget:clampNumber(n('scBudget')),minimumProfit:clampNumber(n('scMinimumProfit'))};
}
function calcScenario(s){
 const q=Math.max(1,Math.round(clampNumber(s.qty,1)));
 const materials=clampNumber(s.blankCost)*q+clampNumber(s.packaging)*q+clampNumber(s.shipping);
 const ink=clampNumber(s.totalInk)*clampNumber(s.inkRate);
 const labor=(s.laborMinutes+s.setupMinutes)/60*s.laborRate;
 const machine=s.printMinutes/60*s.machineRate;
 const electric=s.printMinutes/60*clampNumber(s.electricRate);
 const overhead=(s.printMinutes+s.laborMinutes+s.setupMinutes)/60*s.overheadRate;
 const serviceReserve=s.printMinutes/60*s.serviceReserveRate;
 const base=materials+ink+labor+machine+electric+overhead+serviceReserve+s.primer+s.cleaning+s.maintenance+s.otherCost;
 const waste=base*clampNumber(s.waste,0,100)/100,totalCost=base+waste;
 const targetPrice=roundTo(totalCost/(1-clampNumber(s.targetMargin,0,95)/100),clampNumber(s.rounding,.01));
 const desiredPrice=s.desiredProfit?roundTo(totalCost+s.desiredProfit,clampNumber(s.rounding,.01)):0;
 let orderPrice=targetPrice;
 if(s.pricingMode==='manual' && s.manualPrice>0) orderPrice=s.manualPrice;
 if(s.pricingMode==='profit' && s.desiredProfit>0) orderPrice=desiredPrice;
 orderPrice=orderPrice*(1-clampNumber(s.discount,0,100)/100);
 const profit=orderPrice-totalCost,margin=orderPrice?profit/orderPrice*100:0;
 return {materials,ink,labor,machine,electric,overhead,serviceReserve,waste,totalCost,targetPrice,desiredPrice,orderPrice,profit,margin,withTax:orderPrice*(1+clampNumber(s.tax,0,100)/100),unitPrice:orderPrice/q,profitPerItem:profit/q,profitPerHour:(s.laborMinutes+s.setupMinutes)?profit/((s.laborMinutes+s.setupMinutes)/60):profit,minimumPrice:roundTo(totalCost,clampNumber(s.rounding,.01)),wholesalePrice:roundTo(totalCost/(1-.30),clampNumber(s.rounding,.01))};
}
function cloneScenarioFromSelected(){
 if(!state.projects.length){showToast('Create a project first');return}
 const id=Number($('#scenarioProjectSelect').value)||state.projects[0].id,p=state.projects.find(x=>x.id===id)||state.projects[0];
 scenarioSourceId=p.id;scenarioOriginal=projectToScenario(p);writeScenario({...scenarioOriginal});$('#scenarioName').value='Scenario A';renderScenario();
}
function renderScenario(){
 if(!scenarioOriginal)return;
 const s=readScenario(),o=calcScenario(scenarioOriginal),c=calcScenario(s);
 const rows=[
  ['Order Total',o.orderPrice,c.orderPrice,'money'],['Unit Price',o.unitPrice,c.unitPrice,'money'],['Production Cost',o.totalCost,c.totalCost,'money'],
  ['Profit',o.profit,c.profit,'money'],['Margin',o.margin,c.margin,'percent'],['Quantity',scenarioOriginal.qty,s.qty,'number']
 ];
 $('#scenarioComparison').innerHTML='<div class="compare-row header"><span>Metric</span><span>Original</span><span>Scenario</span><span>Change</span></div>'+rows.map(([name,a,b,type])=>{
  const diff=b-a,fmt=v=>type==='money'?money(v):type==='percent'?v.toFixed(1)+'%':String(v),cls=diff>0?'delta-up':diff<0?'delta-down':'delta-neutral';
  return `<div class="compare-row"><strong>${name}</strong><span>${fmt(a)}</span><span>${fmt(b)}</span><span class="${cls}">${diff>0?'+':''}${type==='money'?money(diff):type==='percent'?diff.toFixed(1)+'%':diff}</span></div>`
 }).join('');
 $('#scRecommendedTotal').textContent=money(c.orderPrice);$('#scRecommendedUnit').textContent=money(c.unitPrice)+' per unit';$('#scTotalCost').textContent=money(c.totalCost);$('#scProfit').textContent=money(c.profit);$('#scMargin').textContent=c.margin.toFixed(1)+'%';$('#scProfitPerItem').textContent=money(c.profitPerItem);$('#scProfitPerHour').textContent=money(c.profitPerHour);$('#scWithTax').textContent=money(c.withTax);$('#scMinimumPrice').textContent=money(c.minimumPrice);$('#scTargetPrice').textContent=money(c.targetPrice);$('#scDesiredPrice').textContent=s.desiredProfit?money(c.desiredPrice):'—';$('#scWholesalePrice').textContent=money(c.wholesalePrice);
 const changes=[
  ['Quantity',scenarioOriginal.qty,s.qty,'items'],['Blank Cost',scenarioOriginal.blankCost,s.blankCost,'money'],['Labor Minutes',scenarioOriginal.laborMinutes,s.laborMinutes,'minutes'],['Total Job Ink',scenarioOriginal.totalInk,s.totalInk,'mL'],['Target Margin',scenarioOriginal.targetMargin,s.targetMargin,'%'],['Discount',scenarioOriginal.discount,s.discount,'%'],['Shipping',scenarioOriginal.shipping,s.shipping,'money']
 ].map(([name,a,b,u])=>({name,a,b,d:b-a,u})).filter(x=>Math.abs(x.d)>.0001).sort((a,b)=>Math.abs(b.d)-Math.abs(a.d)).slice(0,5);
 $('#changeExplanation').innerHTML=changes.length?changes.map(x=>`<div class="change-item"><div><strong>${x.name}</strong><small>${x.a} → ${x.b} ${x.u==='money'?'':x.u}</small></div><strong class="${x.d>0?'delta-up':'delta-down'}">${x.d>0?'+':''}${x.u==='money'?money(x.d):x.d.toFixed(2)+' '+x.u}</strong></div>`).join(''):'<p>No scenario changes yet. Adjust any value to compare it with the original.</p>';
 const modeText=s.pricingMode==='margin'?`Target Margin mode is active. The ${s.targetMargin.toFixed(1)}% margin is applied instantly.`:s.pricingMode==='manual'?`Manual Price mode is active. The order price is set directly to ${money(s.manualPrice)} before discount and tax.`:`Desired Profit mode is active. The price is calculated to produce ${money(s.desiredProfit)} profit before discount and tax.`;
 $('#pricingModeNote').textContent=modeText;
 const advisor=$('#budgetAdvisor');advisor.className='budget-advisor';
 if(s.budget){
  const gap=s.budget-c.withTax;
  if(gap>=0){advisor.classList.add('good');advisor.textContent=`This scenario fits the customer budget by ${money(gap)}.`}
  else{advisor.classList.add('bad');advisor.textContent=`This scenario exceeds the customer budget by ${money(Math.abs(gap))}. Consider reducing cost, margin, shipping, or discounting carefully.`}
 } else if(s.minimumProfit){
  const gap=c.profit-s.minimumProfit;
  if(gap>=0){advisor.classList.add('good');advisor.textContent=`This scenario exceeds the minimum profit goal by ${money(gap)}.`}
  else{advisor.classList.add('bad');advisor.textContent=`This scenario is short of the minimum profit goal by ${money(Math.abs(gap))}. A price of about ${money(c.totalCost+s.minimumProfit)} would meet it before tax.`}
 } else advisor.textContent='Enter a customer budget or profit goal to receive guidance.';
}
scIds.forEach(id=>{const el=$('#'+id);if(el)el.addEventListener('input',renderScenario)});
$('#scenarioProjectSelect').onchange=cloneScenarioFromSelected;$('#cloneCurrentProjectBtn').onclick=cloneScenarioFromSelected;
$('#scMaterial').onchange=()=>{
 const select=$('#scMaterial');
 if(select.value==='__new__'){
  const fallback=String(Math.max(0,scenarioOriginal?.materialIndex||0));
  openMaterialModal({onSave:(material,newIndex)=>{
   populateScenarioSelectors();
   select.value=String(newIndex);
   $('#scBlankCost').value=Number(material.cost)||0;
   if(scenarioOriginal){scenarioOriginal.materialIndex=newIndex;scenarioOriginal.materialName=material.name}
   renderScenario();
   showToast(`${material.name} added to Material Library`);
  }});
  select.value=fallback;
  return;
 }
 const m=state.materials[Number(select.value)||0];
 if(m){$('#scBlankCost').value=Number(m.cost)||0;if(scenarioOriginal){scenarioOriginal.materialIndex=Number(select.value)||0;scenarioOriginal.materialName=m.name}}
 renderScenario();
};
function scenarioProjectData(s,c){
 const pricing=createPricingSnapshot({cost:c.totalCost,priceBeforeTax:c.orderPrice,taxRate:s.tax,customerTotal:c.withTax,profit:c.profit,margin:c.margin});
 const inputs={quantity:s.qty,blankCost:s.blankCost,totalInk:s.totalInk,printMinutes:s.printMinutes,laborMinutes:s.laborMinutes+s.setupMinutes,packagingCost:s.packaging,primerCost:s.primer,otherCost:s.otherCost,wastePercent:s.waste,profitMargin:s.targetMargin,salesTax:s.tax,manualPriceEnabled:true,manualPrice:c.orderPrice,rounding:String(s.rounding)};
 const pricingRates={ink:s.inkRate,labor:s.laborRate,machine:s.machineRate,electric:s.electricRate,maintenance:s.maintenance,overhead:s.overheadRate,shipping:s.shipping,cleaning:s.cleaning,serviceReserve:s.serviceReserveRate};
 return {pricing,inputs,pricingRates,scenarioInputs:structuredClone(s)};
}
$('#saveScenarioBtn').onclick=()=>{
 if(!scenarioOriginal)return;
 const s=readScenario(),c=calcScenario(s),saved=scenarioProjectData(s,c),now=new Date();
 state.projects.push({id:Date.now(),projectType:'scenario',name:`${s.name} — ${$('#scenarioName').value||'Scenario'}`,customer:s.customer,status:s.status,notes:'Created in Scenario Builder',qty:s.qty,materialName:s.materialName,cost:saved.pricing.cost,price:saved.pricing.priceBeforeTax,taxRate:saved.pricing.taxRate,taxAmount:saved.pricing.taxAmount,customerTotal:saved.pricing.customerTotal,margin:saved.pricing.margin,...saved,createdAt:now.toISOString(),updatedAt:now.toISOString(),date:now.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})});
 save('Scenario saved as new project');renderAll();populateScenarioSelectors();showToast('Scenario saved as a new project');
};
$('#replaceOriginalBtn').onclick=()=>{
 if(!scenarioOriginal||!scenarioSourceId)return;
 if(state.preferences.confirmDelete&&!confirm('Replace the original project with this scenario?'))return;
 const s=readScenario(),c=calcScenario(s),saved=scenarioProjectData(s,c);
 state.projects=state.projects.map(p=>p.id===scenarioSourceId?{...p,name:s.name,customer:s.customer,status:s.status,qty:s.qty,materialName:s.materialName,cost:saved.pricing.cost,price:saved.pricing.priceBeforeTax,taxRate:saved.pricing.taxRate,taxAmount:saved.pricing.taxAmount,customerTotal:saved.pricing.customerTotal,margin:saved.pricing.margin,...saved,notes:'Updated from Scenario Builder',updatedAt:new Date().toISOString()}:p);
 save('Original project replaced from scenario');renderAll();populateScenarioSelectors();cloneScenarioFromSelected();
};


function renderReports(){const t=totals();$('#reportProjects').textContent=state.projects.length;$('#reportRevenue').textContent=money(t.revenue);$('#reportCost').textContent=money(t.cost);$('#reportProfit').textContent=money(t.profit);const values=state.projects.map(p=>({p,pricing:getProjectPricing(p)}));const max=Math.max(...values.map(x=>x.pricing.price),1);$('#barChart').innerHTML=values.slice(-8).map(({p,pricing})=>`<div class="bar-item"><div class="bar" style="height:${Math.max(8,pricing.price/max*240)}px"><span>${money(pricing.price)}</span></div>${esc(p.name.split(' ').slice(0,2).join(' '))}</div>`).join('')}
$('#exportCsvBtn').onclick=()=>{const rows=[['Project','Customer','Quantity','Production Cost','Quote Before Tax','Sales Tax Rate','Sales Tax','Customer Quote','Profit','Achieved Margin'],...state.projects.map(p=>{const pricing=getProjectPricing(p);return [p.name,p.customer,p.qty,pricing.cost.toFixed(2),pricing.priceBeforeTax.toFixed(2),pricing.taxRate.toFixed(3),pricing.taxAmount.toFixed(2),pricing.customerTotal.toFixed(2),pricing.profit.toFixed(2),pricing.margin.toFixed(1)]})];const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='UV_Project_Calculator_Projects.csv';a.click();URL.revokeObjectURL(a.href)};


let wizardStep=0;
function showWizard(force=false){
 wizardStep=0;updateWizard();
 $('#setupName').value=state.profile.name;$('#setupBusiness').value=state.profile.business;$('#setupCountry').value=state.profile.country;
 $('#setupLabor').value=state.rates.labor;$('#setupMachine').value=state.rates.machine;$('#setupWaste').value=state.rates.waste;$('#setupMargin').value=state.rates.margin;
 $('#welcomeModal').hidden=false;
}
function updateWizard(){
 $$('.wizard-page').forEach((p,i)=>p.classList.toggle('active',i===wizardStep));
 $$('[data-step-dot]').forEach((d,i)=>d.classList.toggle('active',i<=wizardStep));
 $('#wizardBack').disabled=false;$('#wizardBack').textContent=wizardStep===0?'Cancel':'Back';$('#wizardNext').textContent=wizardStep===2?'Finish Setup':'Continue';
}
$('#wizardBack').onclick=()=>{if(wizardStep===0){$('#welcomeModal').hidden=true;showToast('Guided setup closed');return}wizardStep=Math.max(0,wizardStep-1);updateWizard()};
$('#wizardNext').onclick=()=>{
 if(wizardStep<2){wizardStep++;updateWizard();return}
 state.profile={name:$('#setupName').value.trim()||'UV Printer Owner',business:$('#setupBusiness').value.trim()||'UV Project Calculator Pro',country:$('#setupCountry').value,currency:$('#setupCurrency').value.slice(0,3),setupComplete:true};
 state.rates.labor=Number($('#setupLabor').value)||27;state.rates.machine=Number($('#setupMachine').value)||5;state.rates.waste=Number($('#setupWaste').value)||5;state.rates.margin=Number($('#setupMargin').value)||45;
 if(document.querySelector('input[name="demoChoice"]:checked').value==='clean') state.projects=[];
 $('#welcomeModal').hidden=true;loadRates();resetForm();save('Guided setup completed');renderAll();
};
$('#openSetupBtn').onclick=()=>showWizard(true);$('#rerunSetupBtn').onclick=()=>{$('#accountMenu').hidden=true;showWizard(true)};
$('#accountBtn').onclick=e=>{e.stopPropagation();$('#accountMenu').hidden=!$('#accountMenu').hidden};
$('#accountSettingsBtn').onclick=()=>{$('#accountMenu').hidden=true;navigate('global')};
document.addEventListener('click',e=>{if(!$('#accountMenu').contains(e.target)&&e.target!==$('#accountBtn'))$('#accountMenu').hidden=true});

function renderAll(){populate();renderDashboard();renderProjects();renderReports();renderGlobalLibraries();populateScenarioSelectors();renderDashboardProjectSnapshot();renderSetupProfile();applyAppearanceState();renderPrinterProfile();renderInventory()}
loadRates();resetForm();renderAll();initializeConsolidatedSettings();initializeFeedbackCenter();initializePricingWorkspaceRecalculation();initializeBackupProtection();runTerminologyAudit();if(state.projects.length)cloneScenarioFromSelected();if(!state.profile.setupComplete)setTimeout(()=>showWizard(),250);


document.querySelectorAll('[data-settings-target]').forEach(button=>{
 button.addEventListener('click',()=>openSettingsPanel(button.dataset.settingsTarget));
});
document.querySelectorAll('[data-open-settings-panel]').forEach(button=>{
 button.addEventListener('click',()=>openSettingsPanel(button.dataset.openSettingsPanel));
});

if($('#printerFamily'))$('#printerFamily').addEventListener('change',e=>switchPrinterProfile(e.target.value,Object.keys(state.printerProfiles[e.target.value].editions)[0]));if($('#printerEdition'))$('#printerEdition').addEventListener('change',e=>switchPrinterProfile($('#printerFamily').value,e.target.value));if($('#printerWorkflow'))$('#printerWorkflow').addEventListener('change',e=>{state.activePrinter.workflow=e.target.value;save('Printer workflow updated');renderPrinterProfile()});if($('#changePrinterBtn'))$('#changePrinterBtn').addEventListener('click',()=>openSettingsPanel('printer'));
if($('#changeProjectPrinterBtn'))$('#changeProjectPrinterBtn').addEventListener('click',openProjectPrinterModal);if($('#cancelProjectPrinterBtn'))$('#cancelProjectPrinterBtn').addEventListener('click',()=>$('#projectPrinterModal').hidden=true);if($('#applyProjectPrinterBtn'))$('#applyProjectPrinterBtn').addEventListener('click',applyProjectPrinterChange);
window.addEventListener('uvpc-storage-ready',()=>{
 const label=document.querySelector('#storageStatusLabel');if(label)label.textContent='IndexedDB ready';
 const engine=document.querySelector('#storageEngineName');if(engine)engine.textContent='IndexedDB (Local)';
});



if($('#cancelEmailQuoteBtn'))$('#cancelEmailQuoteBtn').addEventListener('click',closeEmailQuoteModal);
if($('#openEmailQuoteBtn'))$('#openEmailQuoteBtn').addEventListener('click',sendEmailQuote);
if($('#emailQuoteModal'))$('#emailQuoteModal').addEventListener('click',event=>{if(event.target===$('#emailQuoteModal'))closeEmailQuoteModal()});

if($('#dashboardProjectSelect'))$('#dashboardProjectSelect').addEventListener('change',updateDashboardProjectSnapshot);
if($('#dashboardNewProjectBtn'))$('#dashboardNewProjectBtn').onclick=()=>{editingId=null;resetForm();navigate('calculator')};
if($('#dashboardActionNew'))$('#dashboardActionNew').onclick=()=>{editingId=null;resetForm();navigate('calculator')};
if($('#dashboardOpenProjectBtn'))$('#dashboardOpenProjectBtn').onclick=()=>{const p=getDashboardProject();if(p)editProject(p.id);else showToast('Create a project first')};
if($('#dashboardActionDuplicate'))$('#dashboardActionDuplicate').onclick=()=>{const p=getDashboardProject();if(!p){showToast('Create a project first');return}duplicateProject(p.id);dashboardSelectedProjectId=state.projects[state.projects.length-1].id;renderAll()};
if($('#dashboardActionScenario'))$('#dashboardActionScenario').onclick=()=>{const p=getDashboardProject();if(p){scenarioSourceId=p.id;populateScenarioSelectors();$('#scenarioProjectSelect').value=String(p.id);cloneScenarioFromSelected()}navigate('whatif')};
if($('#dashboardActionReports'))$('#dashboardActionReports').onclick=()=>navigate('reports');
if($('#dashboardChangePrinterBtn'))$('#dashboardChangePrinterBtn').onclick=()=>openSettingsPanel('printer');
if($('#dashboardBackupBtn'))$('#dashboardBackupBtn').onclick=()=>{openSettingsPanel('transfer')};

if($('#inkCartridgePrice'))$('#inkCartridgePrice').addEventListener('input',updateCalculatedInkRate);
if($('#inkCartridgeCapacity'))$('#inkCartridgeCapacity').addEventListener('input',updateCalculatedInkRate);
if($('#useDetailedConsumables'))$('#useDetailedConsumables').addEventListener('change',event=>{const enabled=event.target.checked;$('#projectConsumableDetails').hidden=!enabled;$('#totalInk').disabled=enabled;populateProjectPhysicalPrinters($('#projectPhysicalPrinter').value);renderProjectConsumableFields({});calculate()});
if($('#projectPhysicalPrinter'))$('#projectPhysicalPrinter').addEventListener('change',()=>{renderProjectConsumableFields({});calculate()});
if($('#inventoryPrinterSelect'))$('#inventoryPrinterSelect').addEventListener('change',changeInventoryPrinter);
if($('#matchingInventoryPrintersOnly'))$('#matchingInventoryPrintersOnly').addEventListener('change',event=>{if(event.target.checked)selectInventoryForActiveProfile();else renderInventory()});
if($('#addPhysicalPrinterBtn'))$('#addPhysicalPrinterBtn').addEventListener('click',addPhysicalPrinter);
if($('#addMatchingPrinterBtn'))$('#addMatchingPrinterBtn').addEventListener('click',addMatchingPhysicalPrinter);
if($('#addConsumableBtn'))$('#addConsumableBtn').addEventListener('click',addConsumable);
if($('#recordInventoryActionBtn'))$('#recordInventoryActionBtn').addEventListener('click',recordInventoryAction);
if($('#reconcileInventoryBtn'))$('#reconcileInventoryBtn').addEventListener('click',()=>{
 const printer=inventorySelectedPrinter();if(!printer)return;
 printer.consumables.forEach(item=>{const value=prompt(`Counted level for ${item.name} (${item.unit}):`,String(item.remaining));if(value!==null){const exact=clampNumber(value),change=exact-clampNumber(item.remaining);recordInventoryTransaction(printer,item,change,'Manual reconciliation',null,'reconcile')}});
 printer.lastReconciledAt=new Date().toISOString();save('Inventory reconciled');renderInventory();
});

document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('#emailQuoteModal').hidden)closeEmailQuoteModal();if(!$('#materialModal').hidden)closeMaterialModal();if(!$('#deleteMaterialModal').hidden)closeDeleteMaterialModal();}});
