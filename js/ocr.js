/* LECTURE PHOTO SUR L'APPAREIL (sans Claude) — Tesseract.js (OCR local, WebAssembly)
   L'image n'est jamais envoyée : la reconnaissance tourne dans le navigateur.
   Fichiers servis depuis ./ocr/ (≈ 5 Mo téléchargés au 1er usage, puis mis en cache). */
(function(){
const N = s => (s||'').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const NW = s => N(s).replace(/\$/g,' s ').replace(/[^a-z0-9+%<>=.,/ ]/g,' ').replace(/\s+/g,' ').trim();

/* ---------- moteur OCR ---------- */
let W=null, loading=null, CUR=null;
function base(){ return new URL('ocr/', location.href).href; }
function loadScript(src){ return new Promise((ok,ko)=>{ if(window.Tesseract) return ok(); const s=document.createElement('script'); s.src=src; s.onload=()=>ok(); s.onerror=()=>ko(new Error('module de lecture introuvable (connexion requise au 1er usage)')); document.head.appendChild(s); }); }
async function getWorker(){
 if(W) return W;
 if(!loading) loading = (async()=>{
  await loadScript(base()+'tesseract.min.js?v=5');
  const w = await window.Tesseract.createWorker('fra', 1, { workerPath: base()+'worker.min.js', corePath: base(), langPath: base(), gzip:true,
    logger: m=>{ if(CUR) try{ CUR(m); }catch(e){} } });
  await w.setParameters({ tessedit_pageseg_mode:'6', preserve_interword_spaces:'1' });
  W = w; return w;
 })().catch(e=>{ loading=null; throw e; });
 return loading;
}
/* prétraitement : orientation EXIF respectée, niveaux de gris, redressement (deskew),
   2 variantes : 'g' = gris contrasté ; 'n' = fond normalisé (supprime moiré d'écran, reflets, éclairage inégal) */
async function loadImg(file){
 const url = URL.createObjectURL(file);
 try{ return await new Promise((ok,ko)=>{ const i=new Image(); i.onload=()=>ok(i); i.onerror=ko; i.src=url; }); }
 finally{ setTimeout(()=>URL.revokeObjectURL(url), 30000); }
}
function grayOf(img, W){
 const w0=img.naturalWidth||img.width, h0=img.naturalHeight||img.height; const s=Math.max(0.3, Math.min(3, W/Math.max(w0,1)));
 const c=document.createElement('canvas'); c.width=Math.round(w0*s); c.height=Math.round(h0*s);
 const x=c.getContext('2d'); x.imageSmoothingQuality='high'; x.drawImage(img,0,0,c.width,c.height);
 const d=x.getImageData(0,0,c.width,c.height).data; const g=new Float32Array(c.width*c.height); let sum=0;
 for(let i=0,j=0;i<d.length;i+=4,j++){ g[j]=d[i]*0.299+d[i+1]*0.587+d[i+2]*0.114; sum+=g[j]; }
 if(sum/g.length<100) for(let j=0;j<g.length;j++) g[j]=255-g[j]; // écran en mode sombre
 return {g, w:c.width, h:c.height};
}
function boxBlur(src, w, h, r){ // flou de boîte séparable (r en px)
 if(r<1) return src; const tmp=new Float32Array(w*h), out=new Float32Array(w*h), k=2*r+1;
 for(let y=0;y<h;y++){ let acc=0; const o=y*w; for(let x=-r;x<=r;x++) acc+=src[o+Math.min(w-1,Math.max(0,x))];
  for(let x=0;x<w;x++){ tmp[o+x]=acc/k; acc+=src[o+Math.min(w-1,x+r+1)]-src[o+Math.max(0,x-r)]; } }
 for(let x=0;x<w;x++){ let acc=0; for(let y=-r;y<=r;y++) acc+=tmp[Math.min(h-1,Math.max(0,y))*w+x];
  for(let y=0;y<h;y++){ out[y*w+x]=acc/k; acc+=tmp[Math.min(h-1,y+r+1)*w+x]-tmp[Math.max(0,y-r)*w+x]; } }
 return out;
}
function maxFilter(src, w, h, r){ // dilatation (max) séparable : estime le fond clair
 const tmp=new Float32Array(w*h), out=new Float32Array(w*h);
 for(let y=0;y<h;y++){ const o=y*w; for(let x=0;x<w;x++){ let m=0; const a=Math.max(0,x-r), b=Math.min(w-1,x+r); for(let i=a;i<=b;i++) if(src[o+i]>m) m=src[o+i]; tmp[o+x]=m; } }
 for(let x=0;x<w;x++){ for(let y=0;y<h;y++){ let m=0; const a=Math.max(0,y-r), b=Math.min(h-1,y+r); for(let i=a;i<=b;i++){ const v=tmp[i*w+x]; if(v>m) m=v; } out[y*w+x]=m; } }
 return out;
}
function skewAngle(G){ // angle (degrés) maximisant la netteté des lignes de texte (profil de projection)
 // points de contour vertical (|dI/dx| fort) : traits des caractères, insensibles aux bandes horizontales de moiré
 const S=Math.min(1, 1000/G.w), w=Math.round(G.w*S), h=Math.round(G.h*S); const pts=[]; const st=Math.max(1,Math.round(1/S));
 for(let y=0;y<h;y++){ const o=Math.min(G.h-1,Math.round(y/S))*G.w; for(let x=1;x<w-1;x++){ const xi=Math.round(x/S); if(xi+st>=G.w||xi-st<0) continue; const d=Math.abs(G.g[o+xi+st]-G.g[o+xi-st]); if(d>40) pts.push(x-w/2, y); } }
 if(pts.length<200) return 0;
 const score=a=>{ const t=Math.tan(a*Math.PI/180), H=new Float32Array(h*2+10); for(let k=0;k<pts.length;k+=2){ const r=Math.round(pts[k+1]-pts[k]*t)+h/2|0; if(r>=0&&r<H.length) H[r]++; } let s2=0; for(const v of H) s2+=v*v; return s2; };
 let best=0, bs=-1; for(let a=-12;a<=12;a+=0.5){ const v=score(a); if(v>bs){bs=v; best=a;} }
 let fine=best; for(let a=best-0.5;a<=best+0.5;a+=0.1){ const v=score(a); if(v>bs){bs=v; fine=a;} }
 return Math.abs(fine)<0.3?0:fine;
}
function toCanvas(arr, w, h){ const c=document.createElement('canvas'); c.width=w; c.height=h; const x=c.getContext('2d'); const im=x.createImageData(w,h);
 for(let j=0,i=0;j<arr.length;j++,i+=4){ const v=arr[j]<0?0:arr[j]>255?255:arr[j]; im.data[i]=im.data[i+1]=im.data[i+2]=v; im.data[i+3]=255; } x.putImageData(im,0,0); return c; }
function rotateCanvas(c, deg){ if(!deg) return c; const t=deg*Math.PI/180, W=Math.round(Math.abs(c.width*Math.cos(t))+Math.abs(c.height*Math.sin(t))), H=Math.round(Math.abs(c.width*Math.sin(t))+Math.abs(c.height*Math.cos(t)));
 const r=document.createElement('canvas'); r.width=W; r.height=H; const y=r.getContext('2d'); y.fillStyle='#fff'; y.fillRect(0,0,W,H); y.translate(W/2,H/2); y.rotate(t); y.drawImage(c,-c.width/2,-c.height/2); return r; }
function maxFilterH(src, w, h, r){ const out=new Float32Array(w*h); for(let y=0;y<h;y++){ const o=y*w; for(let x=0;x<w;x++){ let m=0; const a=Math.max(0,x-r), b=Math.min(w-1,x+r); for(let i=a;i<=b;i+=2) if(src[o+i]>m) m=src[o+i]; out[o+x]=m; } } return out; }
function boxBlurH(src, w, h, r){ const out=new Float32Array(w*h), k=2*r+1; for(let y=0;y<h;y++){ const o=y*w; let acc=0; for(let x=-r;x<=r;x++) acc+=src[o+Math.min(w-1,Math.max(0,x))]; for(let x=0;x<w;x++){ out[o+x]=acc/k; acc+=src[o+Math.min(w-1,x+r+1)]-src[o+Math.max(0,x-r)]; } } return out; }
function stretch(g){ let mn=255,mx=0; for(let j=0;j<g.length;j+=7){ if(g[j]<mn) mn=g[j]; if(g[j]>mx) mx=g[j]; } const k = mx-mn>40 ? 255/(mx-mn) : 1; const out=new Float32Array(g.length); for(let j=0;j<g.length;j++) out[j]=(g[j]-mn)*k; return out; }
async function prep(file, rot, mode){
 const img = await loadImg(file);
 const w0=img.naturalWidth||img.width; // garder la résolution native (texte petit sur les photos de 12 Mpx), bornée pour la mémoire et le temps
 let G = grayOf(img, Math.max(mode==='n'?2600:2000, Math.min(w0, 3600)));
 let g = stretch(G.g);
 // 1) redressement (sur le gris)
 const sk = skewAngle({g, w:G.w, h:G.h}) || 0;
 const turn = -sk + (rot||0);
 if(turn){ const c=rotateCanvas(toCanvas(g, G.w, G.h), turn); const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data; const n=new Float32Array(c.width*c.height); for(let i=0,j=0;i<d.length;i+=4,j++) n[j]=d[i]; G={g:n, w:c.width, h:c.height}; g=n; }
 const {w,h}=G;
 // 2) fond normalisé : division par le fond de chaque ligne (max horizontal) → supprime les bandes de moiré, reflets, éclairage inégal
 if(mode==='n'){
  const rh=Math.max(20, Math.round(w/40));
  const sm = boxBlur(g, w, h, Math.max(1, Math.round(w/1500)));
  const bg = boxBlurH(maxFilterH(sm, w, h, rh), w, h, rh);
  // zones sombres hors document (bord de l'écran, bureau) → blanc ; sinon division par le fond
  const BG=boxBlur(bg, w, h, Math.max(4, Math.round(w/150)));
  const n=new Float32Array(w*h); for(let j=0;j<n.length;j++) n[j]= BG[j]<70 ? 255 : Math.min(255, 255*sm[j]/Math.max(25,bg[j]));
  g = stretch(n);
 }
 return toCanvas(g, w, h);
}
function confText(d, cmin){ // texte reconstruit ligne par ligne ; nombres lus avec une confiance faible masqués
 if(!d || !d.lines || !d.lines.length) return (d&&d.text)||'';
 return d.lines.map(L=>(L.words||[]).map(w=> (/\d/.test(w.text) && w.confidence<cmin) ? '¿' : w.text).join('   ')).join('\n');
}
async function recognize(files, onProgress, psm, rot, mode, cmin){
 const n=files.length; let done=0;
 CUR = m=>{ if(!onProgress) return;
   if(m.status==='recognizing text') onProgress(`Lecture de l'image ${done+1}/${n}… ${Math.round((m.progress||0)*100)} %`);
   else if(/load|initializ/.test(m.status||'')) onProgress(`Préparation du module de lecture (1er usage : téléchargement ≈ 5 Mo)… ${m.progress?Math.round(m.progress*100)+' %':''}`); };
 onProgress && onProgress('Préparation du module de lecture…');
 const w = await getWorker(); const texts=[];
 await w.setParameters({ tessedit_pageseg_mode: psm||'6' });
 for(const f of files){ const cv = await prep(f, rot||0, mode||'g'); const r = await w.recognize(cv); texts.push(cmin? confText(r&&r.data, cmin) : ((r && r.data && r.data.text)||'')); done++; }
 CUR=null; return texts.join('\n');
}
/* biologie : plusieurs passes (prétraitements et mises en page) ; pour chaque champ, valeur retenue par vote entre passes */
async function recognizeBio(files, onProgress, fallback){
 const passes=[['g','6','standard'],['n','6','fond normalisé : écran, moiré, reflets'],['n','4','colonnes'],['g','4','colonnes, sans normalisation']];
 const runs=[];
 for(let i=0;i<passes.length;i++){
  const [mode,psm,lab]=passes[i];
  if(i===3 && runs.some(r=>Object.keys(r.out.values).length>=3)) break;
  const text = await recognize(files, m=>onProgress&&onProgress(`Passe ${i+1}/${passes.length} (${lab}) — ${m}`), psm, 0, mode, 45);
  runs.push({text, out:parseBio(text, fallback)});
 }
 // type : majoritaire (pondéré par le nombre de valeurs)
 const tw={}; runs.forEach(r=>tw[r.out.type]=(tw[r.out.type]||0)+1+Object.keys(r.out.values).length);
 const type=Object.entries(tw).sort((a,b)=>b[1]-a[1])[0][0];
 const same=runs.filter(r=>r.out.type===type);
 const fields=new Set(); same.forEach(r=>Object.keys(r.out.values).forEach(k=>fields.add(k)));
 const values={};
 fields.forEach(k=>{ const c={}; same.forEach((r,i)=>{ const v=r.out.values[k]; if(v!=null){ const key=String(v); c[key]=(c[key]||0)+1+(i===1?0.1:0); } });
  // virgule perdue (98 lu au lieu de 9,8) : on regroupe avec la valeur décimale lue ailleurs
  Object.keys(c).forEach(a=>{ Object.keys(c).forEach(b=>{ if(a!==b && c[a] && c[b] && /[.]/.test(b) && Math.abs(+a - +b*10)<1e-6 && a.replace('.','')===b.replace('.','').replace(/^0+/,'')){ c[b]+=c[a]; delete c[a]; } }); });
  const PLAUS={gbs:[0.1,80],grs:[0.5,9],hb:[2,25],prot:[0,30],glu:[0,40],glyc:[0,60]};
  let ent=Object.entries(c).sort((a,b)=>b[1]-a[1]);
  if(PLAUS[k]){ const ok=ent.filter(([v])=>+v>=PLAUS[k][0]&&+v<=PLAUS[k][1]); if(ok.length) ent=ok; else { const f=ent.find(([v])=>+v/10>=PLAUS[k][0]&&+v/10<=PLAUS[k][1]); if(f) ent=[[String(+f[0]/10),1]]; else ent=[]; } }
  if(ent.length) values[k]=+ent[0][0]; });
 const ctx=(same.find(r=>r.out.ctx)||{out:{}}).out.ctx||null;
 const top=same.slice().sort((a,b)=>Object.keys(b.out.values).length-Object.keys(a.out.values).length)[0];
 return {text:top.text, out:{type, ctx, values}, pass:runs.length+' passes'};
}

/* ---------- correction orthographique des mots (distance d'édition) ---------- */
const EXTRA = `amoxicilline acide clavulanique ticarcilline piperacilline tazobactam temocilline cefalotine cefoxitine cefuroxime cefixime cefotaxime ceftriaxone ceftazidime avibactam cefepime ceftolozane ceftaroline ceftobiprole cefiderocol aztreonam ertapeneme imipeneme meropeneme relebactam vaborbactam
gentamicine tobramycine amikacine kanamycine streptomycine ciprofloxacine levofloxacine ofloxacine moxifloxacine norfloxacine nalidixique trimethoprime sulfamethoxazole cotrimoxazole fosfomycine nitrofurantoine colistine tigecycline eravacycline penicilline benzylpenicilline oxacilline cloxacilline methicilline
erythromycine azithromycine clarithromycine spiramycine clindamycine lincomycine pristinamycine linezolide tedizolide vancomycine teicoplanine daptomycine dalbavancine tetracycline doxycycline minocycline rifampicine fusidique mupirocine mecillinam pivmecillinam metronidazole
fluconazole voriconazole posaconazole isavuconazole caspofungine micafungine anidulafungine amphotericine flucytosine
sensible sensibles resistant resistante resistants intermediaire posologie exposition augmentee haut niveau carbapenemase cephalosporinase penicillinase betalactamase spectre etendu hyperproduite
leucocytes polynucleaires neutrophiles lymphocytes eosinophiles monocytes hematies erythrocytes plaquettes hemoglobine proteines protides proteinorachie glycorachie glycemie glucose lactates lactate procalcitonine creatinine albumine leucocyturie bacteriurie cristaux pleural ascite articulaire synovial cephalo rachidien
aspiration tracheale lavage bronchoalveolaire brosse prelevement distal protege culture elements nuclees serique plasma nombreux presence absence especes polymicrobien numeration formule hematocrite souche antibiogramme
methicillino`;
let DICT=null;
function dict(){
 if(DICT) return DICT;
 const s=new Set(EXTRA.split(/\s+/));
 const add = t => NW(t).split(' ').forEach(w=>{ if(w.length>=5 && /^[a-z]+$/.test(w)) s.add(w); });
 (window.DRUGS||[]).forEach(d=>[d.name,...(d.alias||[])].forEach(add));
 (window.GERMS||[]).forEach(g=>[g.name,...(g.alias||[])].forEach(add));
 DICT={set:s, list:[...s]}; return DICT;
}
function lev(a,b,max){
 if(Math.abs(a.length-b.length)>max) return max+1;
 let prev=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){ const cur=[i]; let best=i;
  for(let j=1;j<=b.length;j++){ cur[j]=Math.min(prev[j]+1, cur[j-1]+1, prev[j-1]+(a[i-1]===b[j-1]?0:1)); if(cur[j]<best) best=cur[j]; }
  if(best>max) return max+1; prev=cur; }
 return prev[b.length];
}
function fixWord(w){
 if(w.length<5 || !/^[a-z]+$/.test(w)) return w;
 const D=dict(); if(D.set.has(w)) return w;
 const max = w.length>=9?2:1; let best=w, bd=max+1;
 for(const c of D.list){ const d=lev(w,c,max); if(d<bd){ bd=d; best=c; if(d===1 && max===1) break; } }
 return bd<=max? best : w;
}
const clean = line => NW(line).replace(/\b0(?=[a-z])/g,'o').split(' ').map(w=>{
  if(/^[a-z]*[01l|][a-z]*$/.test(w) && /[a-z]{3}/.test(w)) w=w.replace(/1|\|/g,'l').replace(/0/g,'o'); // l/1, o/0
  return fixWord(w); }).join(' ');

/* ---------- libellés d'antibiotiques (CA-SFM) → identifiants ---------- */
const LABELS = [
 [/amoxicilline (\+ |et |\/ )?(acide |ac )?clavulan|amox.{0,4}clav|augmentin/,'amoxclav'],
 [/piperacilline.{0,6}tazo|pip.{0,3}tazo|tazocil/,'pipetazo'],
 [/ticarcilline|^piperacilline$|^piperacilline\b(?!.*tazo)/,null],
 [/ceftazidime.{0,8}avibac|zavicefta/,'cazavi'],
 [/ceftolozane|zerbaxa/,'ceftolo'],
 [/imipeneme.{0,14}relebac|recarbrio/,'imirele'],
 [/meropeneme.{0,8}vaborbac|vaborem/,'merovabor'],
 [/aztreonam.{0,8}avibac|emblaveo/,'aztavi'],
 [/cefoxitine/,'_fox'],
 [/oxacilline|methicilline|cloxacilline/,'cloxa'],
 [/cefalotine|cefalexine|cefadroxil|cefixime|cefuroxime|cefpodoxime|cefamandole|ceftobiprole/,null],
 [/levofloxacine/,'levo'], [/\bofloxacine|norfloxacine|pefloxacine|nalidixique/,null],
 [/trimethoprime.{0,6}sulfa|sulfamethoxazole|cotrimoxazole|bactrim|\bsxt\b/,'cotrimox'], [/\btrimethoprime\b/,null],
 [/erythromycine|clarithromycine|lincomycine|pristinamycine|quinupristine|kanamycine|streptomycine|minocycline|mecillinam|nitrofurantoine|fusidique|mupirocine|tedizolide|dalbavancine|oritavancine|chloramphenicol|tetracycline.{0,4}(tigec)/,null],
 [/fosfomycine.{0,12}(trometamol|orale|per os)/,null],
 [/tetracycline|doxycycline/,'doxy'],
 [/benzylpenicilline|penicilline g|\bpeni g\b|^penicilline$|^penicilline\b/,'peniG'],
 [/amphotericine/,'amphoL'], [/flucytosine|fluorocytosine|\b5 ?fc\b/,'5fc']
];
const ABBR = {amx:'amox',amc:'amoxclav',tic:null,tcc:null,pip:null,tzp:'pipetazo',ptz:'pipetazo',tem:'temo',cf:null,cfz:'cefazoline',fox:'_fox',cxm:null,ctx:'cefotax',cro:'ceftriax',caz:'ceftaz',fep:'cefepime',cza:'cazavi',czt:'ceftolo',fdc:'cefiderocol',atm:'aztreo',etp:'ertapeneme',ipm:'imipeneme',imp:'imipeneme',mem:'merope',mer:'merope',imr:'imirele',mev:'merovabor',amk:'amika',ak:'amika',gen:'genta',gm:'genta',tob:'tobra',tm:'tobra',cip:'cipro',lvx:'levo',lev:'levo',ofx:null,mxf:'moxi',nal:null,sxt:'cotrimox',fos:'fosfo',ft:null,nit:null,cst:'colistine',col:'colistine',cs:'colistine',tgc:'tigec',pen:'peniG',oxa:'cloxa',ox:'cloxa',ery:null,cli:'clinda',cd:'clinda',da:'clinda',lnz:'linez',lzd:'linez',van:'vanco',va:'vanco',tec:'teico',dap:'dapto',tet:'doxy',te:'doxy',dox:'doxy',rif:'rifam',ra:'rifam',rfa:'rifam',fa:null,mup:null,cpt:'ceftaroline',mtz:'metro',flu:'fluco',vrc:'vorico',vor:'vorico',pos:'posa',isa:'isavu',csf:'caspo',cas:'caspo',mcf:'mica',and:'anidula',amb:'amphoL',fc:'5fc'};
function drugOf(part){
 const t=part.trim(); const w0=t.split(' ')[0];
 if(w0.length>=2 && w0.length<=3 && w0 in ABBR && t.split(' ').length<=2) return ABBR[w0];
 if(t.length<4) return undefined;
 for(const [re,id] of LABELS) if(re.test(t)) return id;   // null = libellé reconnu mais non géré
 const id = window.matchDrug ? window.matchDrug(t) : null; return id||undefined;
}

/* ---------- germes ---------- */
let GK=null;
function germKeys(){ if(GK) return GK; GK=[]; (window.GERMS||[]).forEach(g=>[g.name,...(g.alias||[])].forEach(k=>{ const n=NW(k).replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim(); if(n.length>=5 || /^[a-z] [a-z]{4,}/.test(n)) GK.push([n,g.id]); })); GK.sort((a,b)=>b[0].length-a[0].length); return GK; }
function findGerms(t){
 const s=' '+t.replace(/[^a-z ]/g,' ').replace(/\s+/g,' ')+' ', hits=[];
 for(const [k,id] of germKeys()){ let i=s.indexOf(' '+k+' '); while(i>=0){ const a=i, b=i+k.length+1; if(!hits.some(h=>a<h.b && b>h.a)) hits.push({a,b,id,k}); i=s.indexOf(' '+k+' ', i+1); } }
 return hits.sort((x,y)=>x.a-y.a);
}
function phenoOf(t, ph){
 let hit=false;
 if(/\bblse\b|beta ?lactamase a spectre (etendu|elargi)|\besbl\b/.test(t)){ ph.blse=true; hit=true; }
 if(/cephalosporinase (hyper|de haut niveau|haut niveau|deprimee)|ampc (hyper|deprim)/.test(t)){ ph.ampc=true; hit=true; }
 if(/\bkpc\b/.test(t)){ ph.carba='KPC'; hit=true; }
 else if(/oxa ?48|oxa ?181|oxa ?244/.test(t)){ ph.carba='OXA48'; hit=true; }
 else if(/\bndm\b|\bvim\b|\bimp\b|metallo/.test(t)){ ph.carba='MBL'; hit=true; }
 else if(/carbapenemase/.test(t) && !/(absence|pas de|non detect|negati)/.test(t)){ ph.carba=ph.carba||'NT'; hit=true; }
 if(/\bsarm\b|\bmrsa\b|resistant(e|s)? a la methicilline|methicillino ?resistant|\bmeti ?r\b|meca (positif|detecte)/.test(t)){ ph.mr=true; hit=true; }
 return hit;
}

/* ---------- antibiogramme : texte → isolats ---------- */
const SFPRE = /(sensible )?(a |avec )?(forte|haute) (posologie|exposition|dose)|(sensible )?(a |avec )?exposition (augmentee|forte)|sensible fp\b|\bsfp\b|\bs fp\b/g;
function sirTokens(rest){
 let t=' '+rest+' ';
 t=t.replace(SFPRE,' sfp ').replace(/\b(resistant(e|s|es)?|resistance)\b/g,' r ').replace(/\b(sensibles?|susceptible)\b/g,' s ').replace(/\b(intermediaires?|intermediate)\b/g,' i ');
 const w=t.trim().split(/\s+/).map(x=>x.replace(/^[.,:;]+|[.,:;*]+$/g,'')).map(x=>/^(s|\$)(s|5|\$)?$/.test(x)?'s':/^rr?$/.test(x)?'r':/^(sfp|s\*|sp)$/.test(x)?'sfp':x); let tok=w.filter(x=>x==='s'||x==='r'||x==='i'||x==='sfp');
 if(tok.some(x=>x!=='i')) tok=tok.filter(x=>x!=='i');
 if(!tok.length && w[w.length-1]==='5' && w.length>=1) tok=['s']; // « S » lu « 5 »
 return tok.map(x=>x==='sfp'?'SFP':x==='i'?'SFP':x.toUpperCase());
}
const GPOS = new Set(['saureus','scn','spneumo','strepA','strepOral','efaecalis','efaecium','cuti','listeria','nocardia']);
const GPOS_D = new Set(['_fox','vanco','teico','dapto','linez','cloxa','clinda','rifam','ceftaroline','peniG','spira','azithro']);
const GNEG_D = new Set(['colistine','temo','aztreo','aztavi','ceftaz','cazavi','ceftolo','cefiderocol','ertapeneme','imirele','merovabor','pipetazo','cefepime','cipro','tigec','erava']);
const gram = id => !id? null : GPOS.has(id)?'p' : (/^(c[a-z]+|asp|mucor|fusarium|scedo|crypto|pcp)$/.test(id) && !/^(cfreundii|cdiff|cuti)$/.test(id))? null : 'n';
function parseABG(text){
 const lines = (text||'').split(/\n/).map(l=>l.trim()).filter(Boolean);
 const isos=[]; let cur=null, cols=null, colPos=null, ambig=0, used=0; const pend=[], orphan=[];
 // colonnes : position (en caractères, espaces conservés) de chaque S/R par rapport aux en-têtes de germes
 const placeByPos = (raw, did, tok)=>{
  const rn=N(raw).replace(/\$/g,'s'); const re=/(^|\s)(s|r|i|sfp|ss|rr|s5)(?=\s|$)/g; const pos=[]; let m;
  while((m=re.exec(rn))) pos.push(m.index+m[1].length);
  const p=pos.slice(-tok.length); if(p.length!==tok.length) return false;
  const idx=p.map(x=>{ let b=0, bd=1e9; colPos.forEach((c,i)=>{ const d=Math.abs(c-x); if(d<bd){bd=d;b=i;} }); return b; });
  if(new Set(idx).size!==idx.length) return false;
  idx.forEach((ci,k)=>cols[ci].res[did]=tok[k]); return true; };
 const newIso = (gid,label)=>{ const o={germ_id:gid||'', organism:label||'', res:{}, ph:{}}; isos.push(o); return o; };
 for(const raw of lines){
  const t = clean(raw).replace(/(\d)(s|r|i|sfp)\b/g,'$1 $2').replace(/([<>=])\s+(?=\d)/g,'$1'); if(!t) continue;
  // séparation libellé / résultats : tout ce qui précède le 1er nombre ou le 1er jeton S/I/R
  const words=t.split(' '); let cut=words.length;
  for(let i=0;i<words.length;i++){ const x=words[i]; if(i>0 && (/^[<>=]*\d/.test(x) || /^(s|r|i|sfp|ss|rr|s5)$/.test(x) || /^(sensible|resistant|resistante|intermediaire)s?$/.test(x))){ cut=i; break; } }
  const part=words.slice(0,cut).join(' '), rest=words.slice(cut).join(' ');
  const did = drugOf(part);
  if(did!==undefined){
   const tok=sirTokens(rest);
   if(!tok.length){ pend.push(did); continue; } if(did===null) continue; used++;
   if(cols && cols.length>1){
    if(tok.length===cols.length) cols.forEach((o,i)=>o.res[did]=tok[i]);
    else if(tok.length<cols.length && colPos && placeByPos(raw, did, tok)) {}
    else if(tok.length===1){ // une seule valeur : attribuer à l'isolat pour lequel la molécule est pertinente (Gram)
     const g = GPOS_D.has(did)?'p': GNEG_D.has(did)?'n':null; let c = g? cols.filter(o=>gram(o.germ_id)===g) : [];
     if(c.length!==1){ const E=window.ENGINE_INFO, GB=window.GERM_BY_ID||{}; // sinon : exclure les germes naturellement résistants
      if(E && GB) c = cols.filter(o=>{ const gm=GB[o.germ_id]; if(!gm) return true; const nat=(E.NAT[gm.grp]||[]).concat(E.NAT_GERM[gm.id]||[]); return !nat.includes(did); }); }
     if(c.length===1) c[0].res[did]=tok[0]; else ambig++;
    } else ambig++;
   } else if(tok.length>=2 && isos.length>=tok.length){ // germes listés au-dessus (« 1 : E. coli / 2 : … ») puis tableau en colonnes
    cols = isos.slice(-tok.length); colPos=null; cols.forEach((o,i)=>o.res[did]=tok[i]);
   } else { if(!cur) cur=newIso('',''); cur.res[did]=tok[0]; }
   continue;
  }
  { // ligne de résultats seuls (libellé et résultat sur des lignes/blocs différents)
   const ws=t.split(' ').filter(x=>!/^[<>=]*\d/.test(x));
   const tk=sirTokens(t);
   if(tk.length && ws.length && ws.every(x=>/^(s|r|i|sfp|ss|rr|s5|sensible|resistant|resistante|intermediaire|forte|posologie|exposition|a|fp|mg|l|mg\/l)$/.test(x))){
    orphan.push(...tk); continue; }
  }
  const gs=findGerms(t);
  if(gs.length>=2){ // en-tête de colonnes : plusieurs germes sur une ligne
   const uniq=[]; gs.forEach(h=>{ if(!uniq.length || uniq[uniq.length-1].id!==h.id || true) uniq.push(h); });
   cols = uniq.map(h=>{ const ex=isos.find(o=>o.germ_id===h.id && !Object.keys(o.res).length); return ex || newIso(h.id, h.k); });
   { const rn=N(raw); colPos = uniq.map(h=>{ const w=h.k.split(' ')[0]; const i=rn.indexOf(w); return i<0? null : i + h.k.length/2; }); if(colPos.some(x=>x==null)) colPos=null; }
   cur = cols[cols.length-1]; phenoOf(t, cur.ph); continue;
  }
  if(gs.length===1){
   const id=gs[0].id;
   if(cur && !cur.germ_id){ cur.germ_id=id; cur.organism=raw; }
   else if(!(cur && cur.germ_id===id && !Object.keys(cur.res).length)) cur=newIso(id, raw);
   cols=null; colPos=null; phenoOf(t, cur.ph); continue;
  }
  if(cur) phenoOf(t, cur.ph); else { const ph={}; if(phenoOf(t,ph)){ cur=newIso('',''); cur.ph=ph; } }
 }
 // libellés et résultats lus dans des blocs séparés : appariement dans l'ordre si les nombres concordent
 if(pend.length && orphan.length){
  const tgt = cur || newIso('','');
  const k = Math.min(pend.length, orphan.length);
  if(Math.abs(pend.length-orphan.length)<=1) for(let i=0;i<k;i++){ if(pend[i] && tgt.res[pend[i]]==null){ tgt.res[pend[i]]=orphan[i]; used++; } }
  else ambig += Math.max(pend.length, orphan.length);
 }
 // fusion : même germe dont une occurrence est vide (titre « Culture » puis « Antibiogramme »)
 for(let i=isos.length-1;i>=0;i--){ const o=isos[i]; if(Object.keys(o.res).length) continue;
  const twin=isos.find((p,j)=>j!==i && p.germ_id && p.germ_id===o.germ_id);
  if(twin){ Object.assign(twin.ph, o.ph); isos.splice(i,1); } }
 const out = isos.filter(o=>Object.keys(o.res).length || o.germ_id).map(o=>{
  const staph = /^(saureus|scn)$/.test(o.germ_id);
  if(o.res._fox){ if(staph && !o.res.cloxa) o.res.cloxa=o.res._fox; if(staph && o.res._fox==='R') o.ph.mr=true; delete o.res._fox; }
  if(staph && o.res.cloxa==='R') o.ph.mr=true;
  return { organism:o.organism, germ_id:o.germ_id||null, phenotype:{mr:o.ph.mr??null, blse:o.ph.blse??null, ampc:o.ph.ampc??null, carba:o.ph.carba||null},
   results:Object.entries(o.res).map(([drug_id,sir])=>({drug_id, sir})) };
 });
 return {isolates:out, ambig, lines:used, nres:out.reduce((a,x)=>a+x.results.length,0)};
}

/* ---------- biologie : texte → valeurs ---------- */
const NUM = /([<>]=?|≤|≥)?\s*(\d+(?:[.,]\d+)?)/g;
function nums(s){ const r=[]; let m; NUM.lastIndex=0; while((m=NUM.exec(s))){ const v=parseFloat(m[2].replace(',','.')); r.push({v, raw:m[0], after:s.slice(m.index+m[0].length, m.index+m[0].length+14), i:m.index}); } return r; }
function pow10(s){ // 10^5, 10e5, 10*5, « 105 » (exposant perdu), 1.10^5, 100000
 const m = s.match(/(\d+(?:[.,]\d+)?)?\s*(?:x|\*|×|\.)?\s*10\s*(?:\^|e|exp|\*\*|°)?\s*([3-9])\b/);
 if(m){ const a=m[1]?parseFloat(m[1].replace(',','.')):1; return (a>0&&a<10?a:1)*Math.pow(10,+m[2]); }
 const n=nums(s); if(!n.length) return null; const v=n[0].v;
 if(v>=103 && v<=109 && Number.isInteger(v)) return Math.pow(10, v-100);
 return v;
}
const BIOK = {
 lcs: [['gbs',/(leucocyt|globules blancs).{0,12}(sang|serique|plasma)/],['grs',/(hematies|globules rouges).{0,12}(sang|serique)/],['glyc',/glycemie|glucose.{0,8}(sang|plasma|serique)/,'glu'],
       ['gb',/leucocyt|elements( nuclees)?|cellules( nucleees)?|globules blancs/,'cell'],['pnn',/polynucleaires?( neutrophiles?)?|neutrophiles|\bpnn\b/,'pct'],['gr',/hematies|globules rouges|erythrocytes/,'cell'],
       ['prot',/proteinorachie|\b(?:pr)?oteines?|protides?/,'prot'],['glu',/glycorachie|glucose/,'glu'],['lact',/lactat/,'lact']],
 pleural:[['protS',/(protides?|proteines?).{0,14}(sang|serique|plasma)/,'prot'],['ldhS',/ldh.{0,14}(sang|serique|plasma)/],['protP',/protides?|proteines?/,'prot'],['ldhP',/\bldh\b|lacticodeshydrogenase|lactate deshydrogenase/],
       ['ph',/\bph\b/],['glu',/glucose|glycopleurie/,'glu'],['gb',/leucocyt|elements|cellules|globules blancs/,'cell'],['pnn',/polynucleaires?|neutrophiles|\bpnn\b/,'pct']],
 ascite:[['albS',/albumine.{0,14}(sang|serique|plasma)/],['alb',/albumine/],['prot',/protides?|proteines?/,'prot'],['glu',/glucose/,'glu'],['ldh',/\bldh\b|lactate deshydrogenase/],
       ['pnn',/polynucleaires?( neutrophiles?)?|neutrophiles|\bpnn\b/,'pnnasc'],['gb',/leucocyt|elements|cellules|globules blancs/,'cell']],
 artic:[['pnn',/polynucleaires?|neutrophiles|\bpnn\b/,'pct'],['gb',/leucocyt|elements|cellules|globules blancs/,'cell'],['crist',/cristau|cristal/,'yes']],
 nfs:[['pnn',/polynucleaires? neutrophiles|neutrophiles|\bpnn\b/,'giga'],['lymph',/lymphocytes/,'giga'],['eos',/eosinophiles/,'giga'],['gb',/leucocytes|globules blancs/,'giga'],
      ['hb',/hemoglobine/,'hb'],['plq',/plaquettes/,'plq'],['pct',/procalcitonine|\bpct\b/],['crp',/\bcrp\b|proteine c reactive/],['lact',/lactat/,'lact'],['creat',/creatinine/,'creat'],['alb',/albumine/]],
 ecbu:[['leuco',/leucocyt/,'leucou'],['bact',/bacteri|culture|\bufc\b|numeration/,'pow'],['nbGerm',/(\d) (especes|germes)|polymicrobien/,'nb']],
 resp:[['cfu',/\bufc\b|culture|numeration|\bcfu\b/,'pow']]
};
const TYPEK = { lcs:/\blcr\b|\blcs\b|cephalo ?rachidien|cerebro ?spinal|ponction lombaire|derivation ventriculaire|\bdve\b|\bdvp\b|glycorachie|proteinorachie|lactatorachie/g,
 pleural:/pleur/g, ascite:/ascite|peritone/g, artic:/articulaire|synovial|arthrocentese/g,
 ecbu:/\becbu\b|urine|leucocyturie|bacteriurie|cytobacteriologique des urines/g,
 resp:/aspiration (tracheale|bronchique|endotracheale)|lavage broncho|\blba\b|brosse|\bpdp\b|distal protege|expectoration/g,
 nfs:/hemoglobine|plaquettes|numeration formule|hematocrite|procalcitonine|\bcrp\b|creatinine/g };
const UNITRE=/^\s*(giga|tera|g ?\/ ?l|g ?\/ ?dl|mg|mmol|mol|umol|\/mm|mm3|\/l|t ?\/ ?l|10|%|ui|ufc|\/ul)/;
function pick(field, kind, s, ctxType, lineUnit){
 const n=nums(s); if(!n.length && kind!=='yes' && kind!=='pow') return null;
 const u = x => { const a=N(x.after); return UNITRE.test(a)||!lineUnit ? a : ' '+lineUnit; };
 const first = n[0];
 switch(kind){
  case 'yes': return /(absence|absents?|pas de|negati|aucun)/.test(s)?null:(/(presence|presents?|urate|pyrophosphate|calcium|positi|nombreux|rares)/.test(s)?1:null);
  case 'pow': return pow10(s);
  case 'nb': { const m=s.match(/(\d) (especes|germes)/); return m?+m[1]:(/polymicrobien/.test(s)?3:null); }
  case 'pct': { const p=n.find(x=>/^\s*%/.test(x.after)); return p?p.v:first.v<=100?first.v:null; }
  case 'pnnasc': { const p=n.find(x=>/^\s*%/.test(x.after)); if(p) return {pnn:p.v}; return {pnnAbs:first.v}; }
  case 'cell': { const a=u(first); if(/^\s*(g\/l|giga|10 ?9|x ?10 ?9)/.test(a)) return first.v*1000; if(/^\s*(\/l|t\/l|10 ?12)/.test(a) && field==='gr') return first.v*1e6; return first.v; }
  case 'giga': { const g=n.find(x=>/^\s*(g\/l|giga|10 ?9|x ?10)/.test(u(x))); if(g) return g.v; const m=n.find(x=>/^\s*(\/mm3|\/mm|\/µl|\/ul|mm3)/.test(u(x))); if(m) return m.v/1000;
     const nonpct=n.filter(x=>!/^\s*%/.test(x.after)); return nonpct.length? (nonpct[0].v>300? nonpct[0].v/1000 : nonpct[0].v) : (field==='pnn'||field==='lymph'||field==='eos'? {pct:first.v} : null); }
  case 'glu': { const a=u(first); if(/^\s*g\/l/.test(a)) return +(first.v*5.55).toFixed(2); if(/^\s*mg\/dl/.test(a)) return +(first.v*0.0555).toFixed(2); if(/^\s*mg\/l/.test(a)) return +(first.v*0.00555).toFixed(2); return first.v; }
  case 'prot': { const a=u(first); if(/^\s*mg\/l/.test(a)) return first.v/1000; if(/^\s*mg\/dl/.test(a)) return first.v/100; return first.v; }
  case 'lact': { const a=u(first); if(/^\s*mg\/dl/.test(a)) return +(first.v*0.111).toFixed(2); if(/^\s*mg\/l/.test(a)) return +(first.v*0.0111).toFixed(2); return first.v; }
  case 'hb': { const a=u(first); if(/^\s*g\/l/.test(a) || first.v>25) return first.v/10; return first.v; }
  case 'plq': return first.v>2000? first.v/1000 : first.v;
  case 'creat': { const a=u(first); if(/^\s*mg\/l/.test(a)) return Math.round(first.v*8.84); if(/^\s*mg\/dl/.test(a)) return Math.round(first.v*88.4); return first.v; }
  case 'leucou': { const a=u(first); if(/^\s*(\/mm3|\/µl|\/ul|mm3)/.test(a)) return first.v*1000; return pow10(s.slice(first.i)); }
  default: return first.v;
 }
}
/* lignes de tableau de laboratoire : unité de la ligne, intervalles de référence retirés (0,15-0,45 ; 430-7…), unités à chiffres retirées (/mm3, 10^9/L) */
const LUNIT=/(giga ?\/ ?l|tera ?\/ ?l|g ?\/ ?dl|mg ?\/ ?dl|mg ?\/ ?l|mmol ?\/ ?l|mol ?\/ ?l|g ?\/ ?l|t ?\/ ?l|\/ ?mm ?3|\bmm3|\/ ?[uµ]l|10 ?[\^*]? ?9 ?\/ ?l|10 ?[\^*]? ?12 ?\/ ?l)/;
function bioLine(raw){
 let r=raw.replace(/(\d)\s?[;:](\d)/g,'$1,$2').replace(/(?<![\d.,])(\d{1,3})[ \u00a0\u202f](\d{3})(?![\d]|[.,]\d)/g,'$1$2'); // 50 000 → 50000
 const lu=(N(r).match(LUNIT)||[])[0]||'';
 let unit = /giga|10 ?[\^*]? ?9/.test(lu)?'giga/l' : /tera|10 ?[\^*]? ?12|^t/.test(lu)?'tera/l' : /mm ?3|[uµ]l/.test(lu)?'/mm3' : lu.replace(/\s/g,'');
 r = r.replace(/[\[(]?\s*\d+(?:[.,]\d+)?\s*[-–—]\s*(?:\d+(?:[.,]\d+)?|\.{2,}|…)?(?:\.{2,}|…)?\s*[\])]?/g,' ')
      .replace(/[\/|\[]?\s?[il]?mm\s?[3³]\b|\/\s?[uµ]l\b|(?:x\s?)?10\s?[\^*eE]?\s?(?:9|12)\s?\/\s?l\b/gi,' ');
 return {raw, t:clean(r), unit, hasNum:/\d/.test(r)};
}
function parseBio(text, fallback){
 const lines=(text||'').split(/\n/).map(l=>l.trim()).filter(Boolean).map(bioLine);
 const all=lines.map(l=>l.t).join(' \n ');
 let type=null, best=0; for(const [k,re] of Object.entries(TYPEK)){ const c=(all.match(re)||[]).length*(k==='nfs'?0.6:1); if(c>best){best=c; type=k;} }
 if(!type) type=fallback||'nfs';
 const v={}, pct={}; let blood=false;
 for(const L of lines){
  if(!L.hasNum){ if(/\bsang|sanguin|plasma|serum\b/.test(L.t)) blood=true; else if(/\blcr\b|\blcs\b|cephalo|rachidien|liquide|ponction/.test(L.t)) blood=false; }
  for(let [id,re,kind] of BIOK[type]){
   const m=L.t.match(re); if(!m) continue;
   if(type==='lcs'){ if(id==='gb' && (blood||L.unit==='giga/l')){ id='gbs'; kind=undefined; } else if(id==='gr' && (blood||L.unit==='tera/l')){ id='grs'; kind=undefined; } else if(id==='glu' && blood){ id='glyc'; } }
   if(v[id]!=null) continue;
   const tail = L.t.slice(m.index+m[0].length).replace(/^[^0-9<>]*/,'');
   const r = pick(id, kind, kind==='yes'?L.t:tail, type, L.unit);
   if(r==null) { continue; }
   if(typeof r==='object'){ if(r.pnn!=null) v.pnn=r.pnn; if(r.pnnAbs!=null) v.pnnAbs=r.pnnAbs; if(r.pct!=null) pct[id]=r.pct; }
   else if(!isNaN(r)) v[id]=+(+r).toPrecision(4);
   break; // un champ par ligne
  }
 }
 if(type==='nfs' && v.gb) Object.entries(pct).forEach(([k,p])=>{ if(v[k]==null) v[k]=+(v.gb*p/100).toFixed(2); });
 let ctx=null;
 if(type==='resp') ctx = /lavage|\blba\b/.test(all)?'lba': /brosse|\bpdp\b|distal protege|telescop/.test(all)?'pdp': /aspiration/.test(all)?'at':null;
 if(type==='ecbu') ctx = /sonde/.test(all)?'sonde':null;
 if(type==='lcs') ctx = /\bdve\b|\bdvp\b|derivation|neurochir/.test(all)?'noso':null;
 return {type, ctx, values:v};
}

window.OCR = { recognize, recognizeBio, parseABG, parseBio, _clean:clean, _prep:prep };
})();
