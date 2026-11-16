/* INTERFACE */
(function(){
const $ = (s,el=document)=>el.querySelector(s), $$=(s,el=document)=>[...el.querySelectorAll(s)];
const D = window.DRUG_BY_ID, G = window.GERM_BY_ID, R = window.REFS;
const esc = s => (s==null?'':String(s)).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const TTL = 12*3600*1000; // données patient/antibiogramme effacées automatiquement après 12 h sans modification
const store = { get(k,d){ try{ const v=localStorage.getItem('infectio_'+k); if(!v) return d; const o=JSON.parse(v); if(!o||o.__t===undefined||Date.now()-o.__t>TTL){ localStorage.removeItem('infectio_'+k); return d; } return o.v; }catch(e){ return d; } },
 set(k,v){ try{ localStorage.setItem('infectio_'+k, JSON.stringify({__t:Date.now(), v})); }catch(e){} },
 wipe(){ try{ Object.keys(localStorage).filter(k=>k.startsWith('infectio_')).forEach(k=>localStorage.removeItem(k)); }catch(e){} } };

/* ---------- état ---------- */
let P = store.get('patient', {age:'',sex:'M',weight:'',height:'',creat:'',ucr:'',uvol:'',uhours:24,crclManual:'',eer:'none',effluent:'',grave:false,allergy:'none',neuro:true,valproate:false,nimodipine:false});
let AB = store.get('abg', {sites:['bact'], isolates:[]});
window.__PAT=P;
const saveP=()=>{store.set('patient',P); window.__PAT=P; renderPatientChip();};
const saveAB=()=>store.set('abg',AB);

/* ---------- glossaire : acronymes annotés ---------- */
const GL = window.GLOSS||{};
const NOANN = new Set(['Se','Sp']);
const FT = window.FDR_TERMS||{};
const GKEYS = [...new Set([...Object.keys(GL).filter(k=>k.length>=2 && !NOANN.has(k)), ...Object.keys(FT)])].sort((a,b)=>b.length-a.length);
const GSRC = ('(^|[^A-Za-zÀ-ÿ0-9\\-])(' + GKEYS.map(k=>k.replace(/[.*+?^${}()|[\]\\\/]/g,'\\$&')).join('|') + ')(?![A-Za-zÀ-ÿ0-9])');
const GRE = new RegExp(GSRC,'g'), GRE1 = new RegExp(GSRC);
function annotate(root){
 const skip = new Set(['SCRIPT','STYLE','INPUT','SELECT','OPTION','TEXTAREA','BUTTON','ABBR','SUMMARY','A']);
 const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode(n){ let p=n.parentNode; while(p && p!==root){ if(skip.has(p.nodeName)|| (p.classList&&p.classList.contains('noabbr'))) return NodeFilter.FILTER_REJECT; p=p.parentNode; } return GRE1.test(n.nodeValue)? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; }});
 const nodes=[]; let n; while((n=walker.nextNode())) nodes.push(n);
 nodes.forEach(t=>{ GRE.lastIndex=0; const frag=document.createDocumentFragment(); let last=0, m; const v=t.nodeValue;
   while((m=GRE.exec(v))){ const start=m.index+m[1].length; frag.append(v.slice(last,start)); const a=document.createElement('abbr'); a.textContent=m[2]; const inF=!!(t.parentNode.closest&&t.parentNode.closest('.fdrbox,summary,h2,h3,.tile b')); if(!GL[m[2]] && inF){ frag.append(m[2]); last=start+m[2].length; continue; } if(GL[m[2]]) a.title=GL[m[2]]; a.dataset.g=m[2]; if(FT[m[2]] && !inF){ a.dataset.f=FT[m[2]]; a.className='fdr'; } frag.append(a); last=start+m[2].length; }
   frag.append(v.slice(last)); const w=document.createElement('x-g'); w.append(frag); t.parentNode.replaceChild(w,t); });
}
/* ---------- liens automatiques vers les recommandations citées dans le texte (ex. « SPILF 2016 », « RFE SFAR 2026 ») ---------- */
const RORGS='SFAR|SPILF|SRLF|SF2H|HCSP|HAS|ANSM|ESCMID|ESC|IDSA|ECIL|ECMM|EORTC|SSC|SPLF|SFPT|SFPC|CA-SFM|EUCAST|ESICM|CORRUSS|DGS|BTS|EASL|WSES|SCCM|CPIC|NIH|AFU|GPIP|SFD|ASHP|ECDC|OMS|ePOPI|MSGERC|ISHAM|ASM|GFRUP|SFMU|AFC|ADARPEF|PIDS|SIDP|ISAP|ACCP|SIS-E|EMA|MHRA|AEPEI|ERS';
const RLRE=new RegExp('(^|[^A-Za-z0-9])((?:RFE |Recos? )?(?:'+RORGS+')(?:-\\d)?(?:/(?:'+RORGS+'|[A-Z][A-Za-z0-9-]+))*(?: \\(avec [A-Z]+\\))?,? (?:(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre) )?((?:19|20)\\d{2})(?:/(?:19|20)\\d{2})?)(?![0-9])','g');
const RL_ALIAS={'ePOPI 2025':'epopi','HAS 2019':'has_carba19','SFAR/SRLF 2017':'sfar_pavm17fr','CA-SFM 2025':'casfm25','SF2H 2025':'sf2h_resp_faq25','SFAR 2015':'sfar_iia15','SPILF 2015':'spilf_iuas15','SPILF 2021':'spilf_durees21','SPILF 2025':'spilf_perf25','SRLF 2020':'srlf_kt20'};
function rlOrgs(tok){ return tok.replace(/^(RFE|Recos?) /,'').replace(/\(avec ([A-Z]+)\)/,'/$1').replace(/,? ((janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre) )?(19|20)\d{2}(\/(19|20)\d{2})?$/,'').split('/').map(x=>x.trim()).filter(Boolean); }
function refFor(tok,onPage){
 const t=tok.replace(/^(RFE|Recos?) /,''); const y=(t.match(/(19|20)\d{2}/)||[])[0];
 const orgs=rlOrgs(tok);
 const norm=x=>x.toLowerCase().replace(/[\s,()]+/g,' ').trim();
 let best=[],bs=0;
 for(const [k,v] of Object.entries(R)){ const seg=(v.s||'').split(' — ')[0]; if(!y||!(seg.includes(y)||(!/(19|20)\d{2}/.test(seg)&&(v.s||'').includes(y)))) continue;
   const hay=seg+' | '+(v.soc||''); if(!orgs.every(o=>new RegExp('(^|[^A-Za-z0-9])'+o.replace(/[-]/g,'\\-')+'($|[^A-Za-z0-9])','i').test(hay))) continue;
   const sc=(norm(seg)===norm(t)?4:0)+(onPage.has(k)?2:0)+1; if(sc>bs){bs=sc;best=[k];} else if(sc===bs) best.push(k); }
 if(best.length===1) return best[0];
 if(RL_ALIAS[t]) return RL_ALIAS[t];
 return null;
}
window.__RL_MISS=window.__RL_MISS||{};
const RLRE2=new RegExp('(^|[^A-Za-z0-9/-])((?:'+RORGS+')(?:/(?:'+RORGS+'))*)(?![A-Za-z0-9/-])','g');
function refForOrgs(tok,onPage){ const orgs=tok.split('/'); const c=[...onPage].filter(k=>{ const v=R[k]; if(!v) return false; const hay=(v.s||'').split(' — ')[0]+' | '+(v.soc||''); return orgs.every(o=>new RegExp('(^|[^A-Za-z0-9])'+o.replace(/[-]/g,'\\-')+'($|[^A-Za-z0-9])','i').test(hay)); }); if(c.length===1) return c[0]; if(orgs.length<2) return null; const g=Object.keys(R).filter(k=>{ const v=R[k]; const hay=(v.s||'').split(' — ')[0]+' | '+(v.soc||''); return orgs.every(o=>new RegExp('(^|[^A-Za-z0-9])'+o.replace(/[-]/g,'\\-')+'($|[^A-Za-z0-9])','i').test(hay)); }); return g.length===1?g[0]:null; }
function linkRecos(root){ linkRecos1(root); linkOrgs(root); }
function linkOrgs(root){
 const byUrl={}; for(const [k,v] of Object.entries(R)) byUrl[v.u]=k;
 const onPage=new Set([...root.querySelectorAll('a.ref')].map(a=>byUrl[a.getAttribute('href')]).filter(Boolean));
 const skip=new Set(['SCRIPT','STYLE','INPUT','SELECT','OPTION','TEXTAREA','BUTTON','A','TITLE','H2','H3','SUMMARY']);
 const re1=new RegExp(RLRE2.source);
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){ let p=n.parentNode; while(p&&p!==root){ if(skip.has(p.nodeName)||(p.classList&&(p.classList.contains('noabbr')||p.classList.contains('refs')))) return NodeFilter.FILTER_REJECT; p=p.parentNode; } return re1.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT; }});
 const nodes=[]; let n; while((n=walker.nextNode())) nodes.push(n);
 nodes.forEach(t=>{ const v=t.nodeValue; RLRE2.lastIndex=0; let m,last=0,did=false; const frag=document.createDocumentFragment();
  while((m=RLRE2.exec(v))){ const tok=m[2]; const k=refForOrgs(tok,onPage); if(!k) continue; const st=m.index+m[1].length; frag.append(v.slice(last,st)); const a=document.createElement('a'); a.className='recolink noabbr'; a.href=R[k].u; a.target='_blank'; a.rel='noopener'; a.title=R[k].t+' — '+R[k].s; a.textContent=tok; frag.append(a); last=st+tok.length; did=true; }
  if(did){ frag.append(v.slice(last)); t.parentNode.replaceChild(frag,t); } });
}
function linkRecos1(root){
 const byUrl={}; for(const [k,v] of Object.entries(R)) byUrl[v.u]=k;
 const onPage=new Set([...root.querySelectorAll('a.ref')].map(a=>byUrl[a.getAttribute('href')]).filter(Boolean));
 const skip=new Set(['SCRIPT','STYLE','INPUT','SELECT','OPTION','TEXTAREA','BUTTON','A','TITLE']);
 const re1=new RegExp(RLRE.source);
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){ let p=n.parentNode; while(p&&p!==root){ if(skip.has(p.nodeName)) return NodeFilter.FILTER_REJECT; p=p.parentNode; } return re1.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT; }});
 const nodes=[]; let n; while((n=walker.nextNode())) nodes.push(n);
 nodes.forEach(t=>{ const v=t.nodeValue; RLRE.lastIndex=0; let m,last=0,did=false; const frag=document.createDocumentFragment();
  while((m=RLRE.exec(v))){ const tok=m[2]; const st=m.index+m[1].length; const mk=(txt,k)=>{ const a=document.createElement('a'); a.className='recolink noabbr'; a.href=R[k].u; a.target='_blank'; a.rel='noopener'; a.title=R[k].t+' — '+R[k].s; a.textContent=txt; return a; };
   const k=refFor(tok,onPage);
   if(k){ frag.append(v.slice(last,st)); frag.append(mk(tok,k)); last=st+tok.length; did=true; continue; }
   const orgs=rlOrgs(tok), y=m[3];
   if(orgs.length>1){ const ks=orgs.map(o=>refFor(o+' '+y,onPage)); if(ks.some(Boolean)){ frag.append(v.slice(last,st)); const pre=(tok.match(/^(RFE|Recos?) /)||[''])[0]; if(pre) frag.append(pre);
     orgs.forEach((o,i)=>{ if(i) frag.append('/'); const isLast=i===orgs.length-1; const txt=isLast? tok.slice(tok.lastIndexOf(o)) : o; frag.append(ks[i]? mk(txt,ks[i]) : txt); });
     last=st+tok.length; did=true; continue; } }
   window.__RL_MISS[tok]=(window.__RL_MISS[tok]||0)+1; }
  if(did){ frag.append(v.slice(last)); t.parentNode.replaceChild(frag,t); } });
}
function gpop(e){ const pop=$('#gpop'); if(e.target.closest('#gpop .popx') || e.target.closest('#gpop a')){ pop.hidden=true; if(e.target.closest('.popx')) return; } const a=e.target.closest('abbr[data-g]'); if(!a){ if(!e.target.closest('#gpop')) pop.hidden=true; return; } e.preventDefault(); pop.innerHTML=(GL[a.dataset.g]?`<b>${esc(a.dataset.g)}</b> : ${esc(GL[a.dataset.g])}`:'')+(a.dataset.f?fdrHTML(a.dataset.f,true):'')+'<button type="button" class="popx" aria-label="Fermer">✕</button>'; pop.hidden=false; pop.scrollTop=0; }
function fdrHTML(k,inPop){ const F=(window.FDR||{})[k]; if(!F) return ''; return `<div class="fdrbox"><div class="fdrt">⚑ ${F.t}</div>${F.blocks.map(b=>`<div class="fdrb"><div class="fdrc">${b.ctx}${b.s==='NAR'?' <span class="tag tnar">NAR</span>':(R[b.s]?` <a class="ref ${R[b.s].lvl}" href="${esc(R[b.s].u)}" target="_blank" rel="noopener">${esc(R[b.s].s.split(' — ')[0].replace(/\s*\(.*?\)/g,'').slice(0,30))}</a>`:'')}</div><ul>${b.items.map(i=>`<li>${i}</li>`).join('')}</ul>${b.note?`<div class="muted small">${b.note}</div>`:''}</div>`).join('')}${inPop?`<div class="fdrl">${F.germ?`<a href="#g-${F.germ}">Fiche germe →</a> · `:''}<a href="#hygiene:fdr">Tous les FdR (Hygiène) →</a></div>`:''}</div>`; }

/* ---------- références ---------- */
function refChips(ids){ if(!ids||!ids.length) return ''; return '<div class="refs">'+ids.filter(i=>R[i]).map(i=>`<a class="ref ${R[i].lvl}" href="${esc(R[i].u)}" target="_blank" rel="noopener" title="${esc(R[i].t)}">${esc(R[i].s.split(' — ')[0].replace(/\s*\(.*?\)/g,'').slice(0,34))}</a>`).join('')+'</div>'; }
function recoRefs(ids){ return (ids||[]).filter(k=>R[k]&&k!=='nar25'&&k!=='gpr'&&!/essai|étude|méta|revue|cohorte|^pk|ecr|in vitro|modèle|lettre|audit|^ma$|cas/i.test(R[k].soc||'')); }
function refList(ids){ return '<ol class="reflist">'+ids.filter(i=>R[i]).map(i=>`<li><a href="${esc(R[i].u)}" target="_blank" rel="noopener">${esc(R[i].t)}</a> — <span class="muted">${esc(R[i].s)}</span></li>`).join('')+'</ol>'; }

/* ---------- patient ---------- */
function patientSummary(){
 const W = weights(P), c = effCrcl(P), b = band(P);
 const parts=[];
 if(W.tbw) parts.push(`${W.tbw} kg${W.bmi?` · IMC ${W.bmi}`:''}${W.obese?' <b class="warn">obèse</b>':''}`);
 if(P.eer==='crrt') parts.push('<b>EER continue</b>'+(P.effluent?` ${P.effluent} mL/kg/h`:''));
 else if(P.eer==='ihd') parts.push('<b>HDI</b>');
 else if(c) parts.push(`ClCr ${c} mL/min${b==='arc'?' <b class="warn">ARC</b>':''}`);
 if(P.grave) parts.push('<b class="danger">choc</b>');
 if(P.allergy!=='none') parts.push('<b class="warn">allergie '+(P.allergy==='severe'?'grave β-lact.':'pénicillines')+'</b>');
 return parts.length? parts.join(' · ') : 'Renseigner le patient';
}
function renderPatientChip(){ const el=$('#patchip'); if(el) el.innerHTML = '👤 '+patientSummary(); }

function viewPatient(){
 const W=weights(P), m=crclMeasured(P);
 const cgT=cockcroft(P,W.tbw), cgA=W.abw?cockcroft(P,W.abw):null, cgL=W.lbw?cockcroft(P,W.lbw):null, cgI=W.ibw?cockcroft(P,W.ibw):null;
 const b=band(P);
 return `<section class="card"><h2>Patient — paramètres utilisés pour les posologies</h2>
 <p class="muted small">🔒 Ces paramètres et les isolats saisis restent uniquement dans ce navigateur (stockage local, aucune photo conservée) et sont <b>effacés automatiquement après 12 h sans modification</b>. <button class="btn ghost" id="wipeall">Effacer maintenant toutes les données</button></p>
 <p class="muted">Stockés uniquement dans ce navigateur. Aucune donnée nominative n'est nécessaire.</p>
 <div class="grid3">
  <label>Âge (ans)<input type="number" data-p="age" value="${esc(P.age)}"></label>
  <label>Sexe<select data-p="sex"><option value="M" ${P.sex==='M'?'selected':''}>Homme</option><option value="F" ${P.sex==='F'?'selected':''}>Femme</option></select></label>
  <label>Poids réel (kg)<input type="number" data-p="weight" value="${esc(P.weight)}"></label>
  <label>Taille (cm)<input type="number" data-p="height" value="${esc(P.height)}"></label>
  <label>Créatininémie (µmol/L)<input type="number" data-p="creat" value="${esc(P.creat)}"></label>
  <label>ClCr imposée (mL/min)<input type="number" data-p="crclManual" value="${esc(P.crclManual)}" placeholder="optionnel"></label>
 </div>
 <h3>Clairance urinaire mesurée (recommandée en réanimation — SFAR/SFPT 2019)</h3>
 <div class="grid3">
  <label>Créatinine urinaire (mmol/L)<input type="number" data-p="ucr" value="${esc(P.ucr)}"></label>
  <label>Volume urinaire (mL)<input type="number" data-p="uvol" value="${esc(P.uvol)}"></label>
  <label>Durée du recueil (h)<input type="number" data-p="uhours" value="${esc(P.uhours)}"></label>
 </div>
 <h3>Épuration extrarénale</h3>
 <div class="grid3">
  <label>Modalité<select data-p="eer"><option value="none" ${P.eer==='none'?'selected':''}>Aucune</option><option value="crrt" ${P.eer==='crrt'?'selected':''}>EER continue (CVVH/CVVHDF)</option><option value="ihd" ${P.eer==='ihd'?'selected':''}>Hémodialyse intermittente</option></select></label>
  <label>Dose d'effluent (mL/kg/h)<input type="number" data-p="effluent" value="${esc(P.effluent)}" placeholder="25–35"></label>
 </div>
 <h3>Contexte</h3>
 <div class="grid3">
  <label class="chk"><input type="checkbox" data-p="grave" ${P.grave?'checked':''}> Choc septique / infection grave</label>
  <label>Allergie<select data-p="allergy"><option value="none" ${P.allergy==='none'?'selected':''}>Aucune connue</option><option value="peni" ${P.allergy==='peni'?'selected':''}>Pénicillines (non grave)</option><option value="severe" ${P.allergy==='severe'?'selected':''}>β-lactamines — grave (IgE/SCAR)</option></select></label>
  <label class="chk"><input type="checkbox" data-p="neuro" ${P.neuro?'checked':''}> Patient cérébrolésé</label>
  <label class="chk"><input type="checkbox" data-p="valproate" ${P.valproate?'checked':''}> Sous acide valproïque</label>
  <label class="chk"><input type="checkbox" data-p="nimodipine" ${P.nimodipine?'checked':''}> Sous nimodipine</label>
  <label class="chk"><input type="checkbox" data-p="stdOk" ${P.stdOk?'checked':''}> Autoriser la posologie standard (souche S, patient stabilisé, hors SNC/BGN non fermentant)</label>
 </div>
 <h3>Résultats</h3>
 <div class="kv">
  <div><span>IMC</span><b>${W.bmi||'—'}</b></div>
  <div><span>Poids idéal (Devine)</span><b>${W.ibw||'—'} kg</b></div>
  <div><span>Poids ajusté (PI + 0,4 × excès)</span><b>${W.abw||'—'} kg</b></div>
  <div><span>Poids maigre (Janmahasatian)</span><b>${W.lbw||'—'} kg</b></div>
  <div><span>Cockcroft (poids réel)</span><b>${cgT??'—'} mL/min</b></div>
  <div><span>Cockcroft (poids ajusté)</span><b>${cgA??'—'} mL/min</b></div>
  <div><span>Cockcroft (poids maigre)</span><b>${cgL??'—'} mL/min</b></div>
  <div><span>Cockcroft (poids idéal)</span><b>${cgI??'—'} mL/min</b></div>
  <div><span>ClCr mesurée (U×V/P)</span><b>${m??'—'} mL/min</b></div>
  <div class="hl"><span>ClCr retenue</span><b>${effCrcl(P)??'—'} mL/min</b></div>
  <div class="hl"><span>Bande posologique</span><b>${b?BAND_L[b]:'—'}</b></div>
 </div>
 <div class="note">Priorité : ClCr imposée > ClCr mesurée > Cockcroft-Gault (poids ajusté si IMC ≥ 30, sinon poids réel). Hyperclairance si ≥ 130 mL/min : fréquente chez le cérébrolésé jeune (HSA, TC) → risque de sous-dosage. Ne pas réduire les β-lactamines pendant les 24 premières heures (SFAR/SFPT 2019). Obésité : poids de dosage par molécule d'après abxbmi / Märtson 2025.</div>
 ${refChips(['sfar_bl2019','abxbmi','goutelle23','martson25','meng23','gpr'])}
 </section>`;
}
function bindPatient(root){
 $('#wipeall',root) && ($('#wipeall',root).onclick=()=>{ store.wipe(); location.reload(); });
 $$('[data-p]',root).forEach(el=>{
  el.addEventListener(el.type==='checkbox'?'change':'input', ()=>{
   const k=el.dataset.p; P[k] = el.type==='checkbox'? el.checked : el.value; saveP();
   if(el.tagName==='SELECT' || el.type==='checkbox') render(); else { clearTimeout(bindPatient.t); bindPatient.t=setTimeout(()=>{ const y=window.scrollY; const f=document.activeElement && document.activeElement.dataset.p; render(); window.scrollTo(0,y); if(f){ const n=$(`[data-p="${f}"]`); if(n){ n.focus(); const v=n.value; if(n.setSelectionRange && n.type==='text') n.setSelectionRange(v.length,v.length);} } }, 700); }
  });
 });
}

/* ---------- carte posologie patient pour une molécule ---------- */
function narLine(d, regKey){
 const N=(window.NARP||{})[d.id]; if(!N) return '';
 const b=band(P); let t='', lab='';
 if(regKey==='snc'){ if(!N.snc) return ''; t=N.snc; lab='doses méningées'; }
 else if(regKey==='std' && d.dose && d.dose.high) return '';
 else if(b==='arc'){ t=N.arc||N.n; lab='hyperclairance > 150 mL/min'; }
 else if(b==='crrt' || b==='ihd'){ t=(N.n||'')+(N.seuil&&/CVVHF|HDI/.test(N.seuil)?' — '+N.seuil:''); lab='EER : posologie de la fonction rénale normale'+(b==='ihd'?' (à vérifier pour l\'HDI avec GPR)':''); }
 else if(b==='m'||b==='s'||b==='es'){ t=(N.n||'')+(N.seuil?` — seuil d'adaptation ${N.seuil} : pleine dose pendant 24 h puis adaptation selon GPR (ligne « Recommandations » ci-dessous)`:''); lab='insuffisance rénale'; }
 else { t=N.n||''; lab='fonction rénale normale'; }
 if(!t) return '';
 return `<div class="narline"><span class="tag tnar">🏥 Protocole NAR</span> <span class="muted">(${lab})</span> ${esc(t)}</div>`;
}
function narBox(d){
 const N=(window.NARP||{})[d.id]; if(!N) return '';
 const r=(l,v)=>v?`<tr><th>${l}</th><td>${esc(v)}</td></tr>`:'';
 return `<div class="narbox"><h3>🏥 Protocole du service (NAR 2025) — prioritaire</h3><table class="tbl">${r('Fonction rénale normale / EER',N.n)}${r('Hyperclairance > 150 mL/min',N.arc)}${r('Insuffisance rénale',N.seuil?'Seuil d\'adaptation : '+N.seuil:'')}${r('Doses méningées',N.snc)}${r('Concentration max.',N.cmax)}${r('Stabilité',N.stab)}${r('Précisions',N.admin)}</table>${N.diff?`<div class="narfiff"><b>Écart avec les recommandations</b> : ${esc(N.diff)}${refChips(recoRefs(d.refs))}</div>`:''}</div>`;
}
function doseBlock(d, regKey, extras=true){
 const b = band(P);
 const ob = window.OBESE[d.id]; const W=weights(P);
 const reg = (d.dose && (d.dose[regKey]||d.dose.std)) || '';
 const calcLine = window.calcDose(d.id, regKey, P);
 let html = `<div class="dose">${narLine(d,regKey)}${(window.NARP||{})[d.id]?'<div class="recolab">Recommandations / RCP :</div>':''}<div><span class="tag ${regKey==='std'&&d.dose.high?'tstd':''}">${regKey==='snc'?'Dose méningée / SNC':regKey==='high'?'Posologie de départ en réanimation (forte posologie)':(d.dose.high?'Posologie standard — désescalade possible (souche S, patient stabilisé, hors SNC)':'Posologie')}</span> ${/<b>|<br>|<i>/.test(reg)? fmtText(reg) : esc(reg)}</div>`;
 if(calcLine) html += `<div class="calc">🧮 ${esc(calcLine)}</div>`;
 if(b && d.renal && d.renal[b]) html += `<div><span class="tag t2">${esc(BAND_L[b])}</span> ${/<b>|<br>/.test(d.renal[b])? fmtText(d.renal[b]) : esc(d.renal[b])}</div>`;
 else if(!b) html += `<div class="muted">Renseigner la fonction rénale / l'EER dans l'onglet Patient pour l'adaptation.</div>`;
 if(P.eer==='crrt' && +P.effluent>35) html += `<div class="warn">Dose d'effluent > 35 mL/kg/h : viser le haut de fourchette, STP.</div>`;
 if(W.obese && ob) html += `<div><span class="tag t3">Obésité (IMC ${W.bmi})</span> ${esc(ob.t)}</div>`;
 if(extras && d.admin) html += `<div class="admin"><b>Administration</b> : ${esc(d.admin.dil)} · ${esc(d.admin.duree)} · stabilité ${d.admin.stab}</div>`;
 if(extras && d.tdm && d.tdm!=='—') html += `<div class="admin"><b>STP</b> : ${esc(d.tdm)} <a href="#pharmaco">→ cibles PK/PD & prélèvements</a></div>`;
 return html+'</div>';
}

/* ---------- MOLÉCULES ---------- */
let molFilter = {type:'all', q:''};
function viewMolecules(){
 const list = window.DRUGS.filter(d=>(molFilter.type==='all'||d.type===molFilter.type) && (!molFilter.q || (d.name+' '+d.cls+' '+(d.alias||[]).join(' ')).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').includes(molFilter.q)));
 const groups={}; list.forEach(d=>{(groups[d.cls]=groups[d.cls]||[]).push(d);});
 return `<section class="card"><div class="toolbar">
  <div class="seg">${[['all','Tous'],['ab','Antibactériens'],['af','Antifongiques'],['av','Antiviraux']].map(([k,l])=>`<button class="${molFilter.type===k?'on':''}" data-molt="${k}">${l}</button>`).join('')}</div>
  <input type="search" id="molq" placeholder="Filtrer (nom, classe, abréviation)…" value="${esc(molFilter.q)}"></div>
  <div class="transv"><b>Fiches transversales</b> : <a href="#pharmaco-atx">🧪 Antitoxiniques</a> · <a href="#pharmaco-tox">⚠️ Toxicités & surveillance (encéphalopathie aux β-lactamines…)</a> · <a href="#pharmaco">📈 PK/PD & STP</a></div>
  ${Object.entries(groups).map(([cls,ds])=>`<h3 class="grp">${esc(cls)}</h3><div class="tiles">${ds.map(d=>`<a class="tile" href="#m-${d.id}"><b>${esc(d.name)}</b><span>${(()=>{const t=(d.dose&&(d.dose.high||d.dose.std))||''; return esc(t.slice(0,90))+(t.length>90?'…':'');})()}</span></a>`).join('')}</div>`).join('') || '<p class="muted">Aucun résultat.</p>'}
 </section>`;
}

function survHTML(id){
 const S=(window.SURV||{})[id]; if(!S||!S.length) return '';
 return `<details class="sec" id="s-surv" open><summary><span class="ico">🩺</span>Surveillance / particularités</summary><div class="secbody"><div class="survlist">${S.map(x=>`<div class="survit"><div class="survq">${x.q}${x.s==='NAR'?' <span class="tag tnar">NAR</span>':''}</div><div class="survf"><b>Quand</b> : ${x.f}</div><div class="survw"><b>Pourquoi</b> : ${x.w}${/neurolog/i.test(x.q)?' <a href="#pharmaco-tox:neurotox">→ chapitre encéphalopathie</a>':''}</div>${x.s!=='NAR'&&R[x.s]?`<div class="survs"><a class="ref ${R[x.s].lvl}" href="${esc(R[x.s].u)}" target="_blank" rel="noopener">${esc(R[x.s].s.split(' — ')[0].replace(/\s*\(.*?\)/g,'').slice(0,40))}</a></div>`:''}</div>`).join('')}</div><p class="muted small">« Non fixée par le RCP » : le RCP demande la surveillance sans en préciser le rythme.</p></div></details>`;
}
function viewMolecule(id){
 window.__SITES=[]; window.__GERM="";
 const d=D[id]; if(!d) return '<p>Introuvable.</p>';
 const regs = ['high','snc','std'].filter(k=>(d.dose||{})[k]);
 const siteTxt = d.site? Object.entries(d.site).map(([k,v])=>`<span class="pill ${v}">${esc((window.SITES.find(s=>s.id===k)||{l:k}).l)}</span>`).join(' '):'';
 return `<section class="card"><a class="back" href="#molecules">← Anti-infectieux</a>
 <h2>${esc(d.name)} <small class="muted">${esc(d.cls)}</small></h2>
 ${narBox(d)}
 <div class="patbox"><h3>Pour le patient actuel <small class="muted">(${patientSummary()})</small></h3>
  ${regs.map(k=>doseBlock(d,k,false)).join('')}
  <div class="admin"><b>Administration</b> : ${esc(d.admin.dil)} · ${esc(d.admin.duree)} · stabilité ${d.admin.stab}</div>
  ${d.tdm&&d.tdm!=='—'?`<div class="admin"><b>STP</b> : ${esc(d.tdm)} <a href="#pharmaco">→ cibles PK/PD & prélèvements</a></div>`:''}
  ${d.dose&&d.dose.po?`<div class="dose"><span class="tag">Voie orale</span> ${esc(d.dose.po)}</div>`:''}
  ${d.dose&&d.dose.other?`<div class="dose">${esc(d.dose.other)}</div>`:''}
 </div>
 ${['cloxa','cefazoline'].includes(d.id)?'<div class="admin"><b>Cloxacilline ou céfazoline ?</b> <a href="#pharmaco-tox:cfzclox">→ essais CloCeBa et SNAP (efficacité, néphrotoxicité)</a></div>':''}
 ${['clinda','linez','rifam'].includes(d.id)?'<div class="admin"><b>Antitoxinique</b> : <a href="#pharmaco-atx">→ puissance comparée et schémas</a></div>':''}
 ${survHTML(d.id)}
 <dl class="fiche">
  <dt>Formes</dt><dd>${d.forms}</dd>
  <dt>PK/PD</dt><dd>${d.pkpd}</dd>
  <dt>Spectre</dt><dd>${d.spectre}</dd>
  <dt>Indications privilégiées</dt><dd>${d.indic}</dd>
  <dt>Contre-indications</dt><dd>${d.ci}</dd>
  <dt>Effets indésirables</dt><dd>${d.ei}</dd>
  <dt>Précautions</dt><dd>${d.prec}</dd>
  <dt>Interactions</dt><dd>${d.inter}</dd>
  <dt>Administration</dt><dd>Soluté : ${esc(d.admin.dil)}<br>Mode/durée : ${esc(d.admin.duree)}<br>Stabilité : ${d.admin.stab}</dd>
  <dt>Adaptation rénale / EER</dt><dd><table class="tbl">${Object.entries(d.renal).map(([k,v])=>`<tr class="${band(P)===k?'cur':''}"><th>${esc(BAND_L[k])}</th><td>${/<b>|<br>/.test(v)? fmtText(v) : esc(v)}</td></tr>`).join('')}</table></dd>
  <dt>Obésité</dt><dd>${esc((window.OBESE[d.id]||{}).t||'—')} ${window.OBESE[d.id]?`<span class="muted">(poids de dosage : ${({TBW:'poids total',ABW:'poids ajusté',IBW:'poids idéal',fixed:'dose fixe'})[window.OBESE[d.id].wt]})</span>`:''}</dd>
  <dt>STP</dt><dd>${esc(d.tdm)}</dd>
  <dt>Diffusion LCS</dt><dd>${esc(d.lcr)}</dd>
  <dt>Sites (moteur)</dt><dd>${siteTxt}</dd>
 </dl>
 <h3>Références</h3>${refList([...new Set([...((window.NARP||{})[d.id]?['nar25']:[]), ...d.refs.filter(x=>x!=='nar25'), ...(window.OBESE[d.id]?['abxbmi','martson25']:[]), ...(((window.SURV||{})[d.id])||[]).map(x=>x.s).filter(x=>x!=='NAR')])])}
 </section>`;
}

/* ---------- GERMES ---------- */
let germQ='';
function viewGerms(){
 const list = window.GERMS.filter(g=>!germQ || (g.name+' '+g.cat+' '+(g.alias||[]).join(' ')).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').includes(germQ));
 const groups={}; list.forEach(g=>{(groups[g.cat]=groups[g.cat]||[]).push(g);});
 return `<section class="card"><div class="toolbar"><input type="search" id="germq" placeholder="Filtrer les germes…" value="${esc(germQ)}"><a class="btn" href="#pays">🌍 Risque BMR par pays</a></div>
 ${Object.entries(groups).map(([c,gs])=>`<h3 class="grp">${esc(c)}</h3><div class="tiles">${gs.map(g=>`<a class="tile" href="#g-${g.id}"><b>${esc(g.name)}</b><span>${esc(g.epi).slice(0,100)}…</span></a>`).join('')}</div>`).join('')}</section>`;
}
const HLAB = {'1':['1re intention','h1'],'2':['Alternative','h2'],'A':['Allergie β-lactamines','hA'],'R':['Dernier recours','hR'],'X':['À éviter','hX']};
function hierHTML(id){
 const H=(window.HIER||{})[id]; if(!H) return '';
 return H.map(b=>`<div class="hier"><div class="hier-s">${b.s}</div>${b.t.map(([k,txt])=>`<div class="hrow"><span class="hlab ${HLAB[k][1]}">${HLAB[k][0]}</span><span class="htxt">${txt}</span></div>`).join('')}</div>`).join('')
  + '<p class="muted" style="margin:6px 0 0">Ordre indicatif : toujours confronter à l\'antibiogramme, au site (diffusion), au terrain et à la fonction rénale. Doses détaillées : fiche de chaque molécule.</p>';
}
function viewGerm(id){
 const g=G[id]; if(!g) return '<p>Introuvable.</p>';
 return `<section class="card"><a class="back" href="#germes">← Germes</a><h2>${esc(g.name)} <small class="muted">${esc(g.cat)}</small></h2>
 ${secs([
  {id:'s-hier', ico:'🏆', t:'Traitement hiérarchisé', raw:true, html:hierHTML(g.id), open:true},
  ...(['saureus','strepA'].includes(g.id)?[{id:'s-atx', ico:'🧪', t:'Formes toxiniques', raw:true, html:'<p>Choc toxique, DHBN, pneumonie nécrosante à S. aureus PVL : voir la fiche <a href="#pharmaco-atx">Antibiothérapie antitoxinique (puissance comparée)</a>.</p>', open:true}]:[]),
  {id:'s-fr', ico:'📊', t:'Résistances en France (%)', raw:true, html:epiTable(((window.EPIFR||{}).germ||{})[g.id],'Antibiotique (% résistant)')+(((window.EPIFR||{}).germ||{})[g.id]?'<p class="muted small">% de souches résistantes sauf mention ; sources françaises (EARS-Net France = hémocultures/LCS ; REA-REZO = infections acquises en réanimation ; PRIMO = ville/Ehpad). L\'écologie locale prime.</p>':'')},
  {id:'s-ttt', ico:'💊', t:(window.HIER&&window.HIER[g.id])?'Commentaires thérapeutiques':'Traitement', html:g.ttt, open:!(window.HIER&&window.HIER[g.id])},
  {id:'s-tips', ico:'💡', t:'À savoir', html:g.tips, open:true},
  {id:'s-nat', ico:'🛡', t:'Résistances naturelles', html:g.nat},
  {id:'s-mech', ico:'🧬', t:'Mécanismes de résistance acquise', html:g.mech},
  {id:'s-epi', ico:'🦠', t:'Épidémiologie', html:g.epi},
  {id:'s-mol', ico:'🔗', t:'Molécules liées', raw:true, html:(g.ast||[]).map(x=>D[x]?`<a class="pill ok" href="#m-${x}">${esc(D[x].name)}</a>`:'').join(' ')}
 ])}
 <p><button class="btn" data-newiso="${g.id}">➕ Utiliser ce germe dans l'antibiogramme</button></p>
 <h3>Références</h3>${refList([...new Set([...(g.refs||[]), ...((((window.EPIFR||{}).germ||{})[g.id])||[]).map(b=>b.ref).filter(Boolean)])])}</section>`;
}



/* ---------- épidémiologie française et mesures associées ---------- */
function epiTable(blocks, pct){
 if(!blocks||!blocks.length) return '';
 return blocks.map(b=>{
  const mx=Math.max(1,...(b.rows||[]).map(r=>parseFloat(String(r[1]).replace(',','.'))||0)); const rows=(b.rows||[]).map(r=>{ const v=parseFloat(String(r[1]).replace(',','.'))||0; return `<tr><td data-label="">${r[0]}</td><td class="num" data-label="%"><span class="bar"><i style="width:${Math.round(100*v/mx)}%"></i></span>${r[1]} %${r[2]?` <small class="muted">(${r[2]})</small>`:''}</td></tr>`; }).join('');
  const fam=b.fam?`<div class="famrow">${b.fam.map(f=>`<span class="tagg">${f[0]} ${f[1]} %</span>`).join('')}</div>`:'';
  const ref=b.ref&&R[b.ref]?` <a class="ref ${R[b.ref].lvl}" href="${esc(R[b.ref].u)}" target="_blank" rel="noopener">${esc(R[b.ref].s.split(' — ')[0].replace(/\s*\(.*?\)/g,'').slice(0,40))}</a>`:'';
  return `<div class="epiblk"><div class="epit">${b.t}${ref}</div>${rows?`<table class="epitab"><thead><tr><th>${pct}</th><th>%</th></tr></thead><tbody>${rows}</tbody></table>`:''}${fam}${b.note?`<p class="muted small">${b.note}</p>`:''}</div>`;
 }).join('');
}
function annexHTML(id){
 const A=(window.ANNEXE||{})[id]; if(!A) return '';
 return A.map(b=>`<div class="annex"><div class="sub">${b.t}</div><ul class="pts">${b.items.map(x=>`<li>${x}</li>`).join('')}</ul>${refChips(b.refs)}</div>`).join('');
}

/* ---------- mise en forme lisible des fiches ---------- */
function lbl(s){
 let m=s.match(/^<b>([^<]{2,90})<\/b>\s*:\s*([\s\S]*)$/); if(m) return `<span class="lbl">${m[1]}</span>${m[2]}`;
 m=s.match(/^([^<:]{3,70})\s:\s([\s\S]+)$/); if(m) return `<span class="lbl">${m[1]}</span>${m[2]}`;
 return s;
}
function fmtText(t){
 const lines=t.split(/<br\s*\/?>/i).map(s=>s.trim()).filter(Boolean);
 let out='', list=null, lt=null;
 const close=()=>{ if(list){ out+=`<${lt} class="pts">${list.join('')}</${lt}>`; list=null; lt=null; } };
 for(const ln of lines){
  let m;
  if((m=ln.match(/^[•·]\s*([\s\S]*)$/))){ if(lt!=='ul') close(); lt='ul'; list=list||[]; list.push('<li>'+lbl(m[1])+'</li>'); continue; }
  if((m=ln.match(/^(\d+)\.\s+([\s\S]*)$/))){ if(lt!=='ol') close(); lt='ol'; list=list||[]; list.push('<li>'+lbl(m[2])+'</li>'); continue; }
  close();
  if((m=ln.match(/^<b>([^<]{2,140})<\/b>\s*:?\s*$/))){ out+=`<div class="sub">${m[1]}</div>`; continue; }
  if((m=ln.match(/^<b>([^<]{2,90})<\/b>\s*[:—]\s*([\s\S]+)$/))){ out+=`<div class="sub">${m[1]}</div><p>${m[2]}</p>`; continue; }
  const parts=splitLong(ln);
  if(parts){ out+='<ul class="pts auto">'+parts.map(x=>'<li>'+lbl(x)+'</li>').join('')+'</ul>'; continue; }
  out+=`<p>${ln}</p>`;
 }
 close(); return out;
}
/* découpe des paragraphes longs en puces : séparateurs « ; » et « . » + majuscule, hors parenthèses/balises/abréviations */
const NOSPLIT=/(?:^|[\s(])(?:[A-Za-z]|cf|ex|p|vs|env|spp|sp|al|min|max|mg|kg|h|j|sem|Dr|Pr|St|etc)$/;
function splitLong(ln){
 const plain=ln.replace(/<[^>]+>/g,''); if(plain.length<260) return null;
 const segs=[]; let depth=0, tag=false, cur='';
 for(let i=0;i<ln.length;i++){
  const c=ln[i]; cur+=c;
  if(c==='<'){tag=true;continue;} if(c==='>'){tag=false;continue;} if(tag) continue;
  if(c==='('||c==='[') depth++; else if((c===')'||c===']')&&depth>0) depth--;
  if(depth) continue;
  if(c===';' && ln[i+1]===' '){ segs.push(cur.slice(0,-1)); cur=''; i++; continue; }
  if(c==='.' && ln[i+1]===' '){ const nx=ln.slice(i+2).replace(/^(<[^>]+>)+/,''); const prev=cur.slice(0,-1).replace(/<[^>]+>/g,'');
    if(/^[A-ZÀ-ÖØ-Þ0-9«⚠]/.test(nx) && !NOSPLIT.test(prev) && !/\d$/.test(prev)){ segs.push(cur.slice(0,-1)); cur=''; i++; continue; } }
 }
 if(cur.trim()) segs.push(cur);
 const out=segs.map(x=>x.trim()).filter(x=>x.replace(/<[^>]+>/g,'').trim().length>0);
 if(out.length<3) return null;
 // rééquilibrer les balises <b>/<i> ouvertes sur plusieurs segments
 return out.map(x=>{ for(const t of ['b','i']){ const o=(x.match(new RegExp('<'+t+'>','g'))||[]).length, cl=(x.match(new RegExp('</'+t+'>','g'))||[]).length; if(o>cl) x+='</'+t+'>'.repeat(o-cl); if(cl>o) x='<'+t+'>'.repeat(cl-o)+x; } return x; });
}
function fmt(h){
 if(!h || h==='—') return '';
 return String(h).split(/(<table[\s\S]*?<\/table>)/).map(p=>p.startsWith('<table')?p:fmtText(p)).join('');
}
function secs(list){
 const L=list.filter(s=>s.html && s.html!=='—');
 const nav=`<nav class="jump">${L.map(s=>`<button type="button" data-jump="${s.id}">${s.ico} ${s.t}</button>`).join('')}<button type="button" data-togall>⇕ Tout ouvrir/fermer</button></nav>`;
 return nav + L.map(s=>`<details class="sec" id="${s.id}"${s.open?' open':''}><summary><span class="ico">${s.ico}</span>${s.t}</summary><div class="secbody">${s.raw?s.html:fmt(s.html)}</div></details>`).join('');
}
document.addEventListener('click', e=>{
 const j=e.target.closest('[data-jump]'); if(j){ const d=document.getElementById(j.dataset.jump); if(d){ d.open=true; d.scrollIntoView({behavior:'smooth', block:'start'}); } return; }
 const t=e.target.closest('[data-togall]'); if(t){ const all=[...document.querySelectorAll('details.sec')]; const open=!all.every(d=>d.open); all.forEach(d=>d.open=open); }
});



/* ---------- RÉSULTATS BIOLOGIQUES (lecture photo + interprétation par règles) ---------- */
let BIOS = store.get('bio', {type:'lcs', v:{}});
const saveBIO = ()=>store.set('bio', BIOS);
const BIOPH = {msg:'', thumbs:[]};
function viewBIO(){
 const B=window.BIO, T=B.T[BIOS.type]||B.T.lcs;
 const chips = Object.entries(B.T).map(([k,t])=>`<button type="button" class="chip ${k===BIOS.type?'on':''}" data-biot="${k}">${t.ico} ${esc(t.name)}</button>`).join('');
 const field = f => f.h==='choix' ? `<label class="span2"><span>${esc(f.l)}</span><select data-biov="${f.id}">${(B.CTX[BIOS.type]||[]).map(([k,l])=>`<option value="${k}" ${BIOS.v[f.id]===k?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`
   : `<label><span>${esc(f.l)}${f.u?` <small class="muted">(${esc(f.u)})</small>`:''}</span><input type="number" step="any" inputmode="decimal" data-biov="${f.id}" value="${esc(BIOS.v[f.id]??'')}"></label>`;
 const res = B.interp(BIOS.type, BIOS.v);
 const lv = {danger:'dangerbox', warn:'warnbox', ok:'okbox', info:'note'};
 return `<section class="card"><h2>Lecture de résultats biologiques</h2>
 <p class="muted small">Photographiez un compte rendu (LCS, liquide pleural, ascite, articulaire, NFS/biochimie, ECBU, prélèvement respiratoire) ou saisissez les valeurs : Claude se contente de <b>transcrire</b> les valeurs (à vérifier), l'<b>interprétation</b> est faite par des règles fixes issues des recommandations, avec renvoi vers la fiche dédiée.</p>
 <div class="photo">
   <button type="button" class="btn primary" data-photo="cam" data-target="bio">📷 Prendre une photo</button>
   <button type="button" class="btn" data-photo="lib" data-target="bio">🖼 Photothèque / fichiers</button>
   <span class="warn small">🔒 Cadrer uniquement les résultats : aucun nom, IPP ni date de naissance.</span>
   <div id="biothumbs" class="thumbs">${BIOPH.thumbs.map(u=>`<img src="${u}" alt="photo">`).join('')}</div>
   <span id="biomsg" class="muted">${BIOPH.msg||''}</span>
 </div>
 <h3>1. Type de prélèvement</h3><div class="chips">${chips}</div>
 <h3>2. Interprétation</h3>
 ${res.length? res.map(r=>`<div class="${lv[r.lvl]||'note'}">${r.txt}${r.link?` <a href="${r.link}">→ fiche dédiée</a>`:''}</div>`).join('') : '<p class="muted">Renseignez des valeurs (photo ou saisie ci-dessous) pour obtenir une interprétation.</p>'}
 <h3>3. Valeurs <small class="muted">(vérifier ; laisser vide si non disponible)</small></h3>
 <div class="biogrid">${T.fields.map(field).join('')}</div>
 <p><button type="button" class="btn ghost" id="bioclear">Effacer les valeurs</button></p>
 <p class="muted small">Aide à l'interprétation : ne remplace pas l'analyse clinique ni l'avis du biologiste.</p>
 <h3>Références</h3>${refList(T.refs)}</section>`;
}
function bindBIO(root){
 $$('[data-biot]',root).forEach(b=>b.onclick=()=>{ BIOS={type:b.dataset.biot, v:{}}; saveBIO(); render(); });
 $$('[data-biov]',root).forEach(i=>{ const ev = i.tagName==='SELECT'?'onchange':'onchange'; i[ev]=()=>{ BIOS.v[i.dataset.biov]= i.value; saveBIO(); keepScroll(render); }; });
 const c=$('#bioclear',root); if(c) c.onclick=()=>{ BIOS.v={}; BIOPH.msg=''; saveBIO(); render(); };
 $$('[data-biocreat]',root).forEach(l=>l.onclick=e=>{ e.preventDefault(); P.creat=+l.dataset.biocreat; saveP(); location.hash='#patient'; });
}
function bioMsg(h){ BIOPH.msg=h; const m=document.getElementById('biomsg'); if(m) m.innerHTML=h; }
async function readBio(files){
 if(!files.length) return;
 BIOPH.thumbs.forEach(u=>{ try{URL.revokeObjectURL(u);}catch(e){} });
 BIOPH.thumbs = files.map(f=>{ try{ return URL.createObjectURL(f); }catch(e){ return ''; } }).filter(Boolean);
 const th=document.getElementById('biothumbs'); if(th) th.innerHTML=BIOPH.thumbs.map(u=>`<img src="${u}" alt="photo">`).join('');
 if(!SAMPLE && window.claude && window.claude.use){ try{ SAMPLE = await window.claude.use('sample'); }catch(e){} }
 if(!SAMPLE) return readBioLocal(files);
 bioMsg('<span class="spin"></span> Lecture par Claude… (ne pas quitter la page)');
 try{
  const B=window.BIO; const spec = Object.entries(B.T).map(([k,t])=>`- ${k} (${t.name}) : ${t.fields.filter(f=>f.h!=='choix').map(f=>`${f.id} = ${f.l}${f.u?' en '+f.u:''}`).join(' ; ')}`).join('\n');
  const prompt = `Tu transcris un compte rendu de biologie médicale française photographié. Ne fais AUCUNE interprétation clinique.
Identifie le type de prélèvement parmi : lcs, pleural, ascite, artic, nfs, ecbu, resp. Puis renvoie UNIQUEMENT un objet JSON :
{"type":"...","ctx":"comm|noso|nosonde|sonde|at|lba|pdp|null","values":{"<id>":nombre,...},"notes":"remarques éventuelles"}
Champs attendus par type (identifiant = libellé, unité cible) :
${spec}
Règles : convertis dans l'unité cible (glucose g/L × 5,55 = mmol/L ; mg/dL × 0,0555 = mmol/L ; leucocytes en /mm³ = /µL ; G/L = 10⁹/L ; T/L = 10¹²/L ; UFC/mL en nombre, ex. 10^5 → 100000 ; pourcentages en nombre). Pour les champs oui/non, mets 1 si présent, sinon omets. N'invente aucune valeur absente ; omets les champs non trouvés. Pour lcs, ctx = "noso" si DVE/post-opératoire mentionné, sinon "comm". Pour ecbu, ctx = "sonde" si sonde mentionnée. Pour resp, ctx = at, lba ou pdp.`;
  const blobs = await Promise.all(files.map(shrink));
  let out; try{ out = await SAMPLE.json(prompt, {images:blobs, modelTier:'complex'}); }
  catch(e){ const r = await SAMPLE(prompt, {images:blobs, modelTier:'complex'}); const t=(r&&r.text)||''; out = JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}')+1)); }
  if(!out || !B.T[out.type]) { bioMsg('Type de prélèvement non reconnu : choisissez-le et saisissez les valeurs.'); return; }
  const v={}; Object.entries(out.values||{}).forEach(([k,x])=>{ if(B.T[out.type].fields.some(f=>f.id===k) && x!=null && !isNaN(+x)) v[k]=String(+x); });
  if(out.ctx && (B.CTX[out.type]||[]).some(([k])=>k===out.ctx)) v.ctx=out.ctx;
  BIOS={type:out.type, v}; saveBIO();
  BIOPH.msg = `✅ ${Object.keys(v).length} valeur(s) transcrite(s) (${esc(B.T[out.type].name)}) — <b>vérifiez chaque valeur</b>.${out.notes?' <span class="muted">'+esc(out.notes)+'</span>':''}`;
  render();
 }catch(e){ return readBioLocal(files); }
}
async function readBioLocal(files){
 if(!window.OCR){ bioMsg('Module de lecture absent : saisir manuellement.'); return; }
 bioMsg('<span class="spin"></span> Lecture sur le téléphone (la photo ne quitte pas l\'appareil)…');
 try{
  const B=window.BIO;
  const text = await window.OCR.recognize(files, m=>bioMsg('<span class="spin"></span> '+esc(m)));
  const out = window.OCR.parseBio(text, BIOS.type);
  const v={}; Object.entries(out.values||{}).forEach(([k,x])=>{ if(B.T[out.type].fields.some(f=>f.id===k) && x!=null && !isNaN(+x)) v[k]=String(+x); });
  if(out.ctx && (B.CTX[out.type]||[]).some(([k])=>k===out.ctx)) v.ctx=out.ctx;
  const n=Object.keys(v).filter(k=>k!=='ctx').length;
  if(n){ BIOS={type:out.type, v}; saveBIO(); }
  BIOPH.msg = (n? `✅ Lecture sur l'appareil : ${n} valeur(s) (${esc(B.T[out.type].name)}). <b>Vérifiez le type de prélèvement, chaque valeur et son unité</b>, et complétez si besoin.`
    : 'Lecture sur l\'appareil : aucune valeur reconnue. Choisir le type de prélèvement et saisir les valeurs (ou reprendre une photo nette, à plat, cadrée sur les résultats).') + OCRTXT(text);
  render();
 }catch(e){ bioMsg('Échec de la lecture sur l\'appareil ('+esc(String((e&&e.message)||e))+'). Saisir les valeurs ci-dessous.'); }
}

/* ---------- ANTIBIOPROPHYLAXIE ---------- */
const norm = s => String(s||'').replace(/<[^>]+>/g,'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
function viewABP(){
 const A=window.ABP||{gen:'',specs:[]};
 const NO = /^Pas d'antibioprophylaxie/;
 const row = r => `<div class="abprow${NO.test(r.a)?' none':''}" data-txt="${esc(norm(r.p+' '+r.a+' '+r.al))}">
   <div class="abpproc">${r.p}</div>
   <div class="abpline"><span class="k">💉</span><span>${NO.test(r.a)?`<span class="pill">${r.a.replace(/^Pas d'antibioprophylaxie/,"Pas d'antibioprophylaxie")}</span>`:`<b>${r.a}</b>`}</span></div>
   ${r.r&&r.r!=='—'?`<div class="abpline"><span class="k">↻</span><span>Réinjection : ${r.r}</span></div>`:''}
   ${r.al&&r.al!=='—'?`<div class="abpline"><span class="k">⚠</span><span>Allergie : ${r.al}</span></div>`:''}
 </div>`;
 return `<section class="card"><h2>Antibioprophylaxie en chirurgie et médecine interventionnelle (adultes)</h2>
 <p class="muted small">RFE SFAR/SPILF 2024 (V2.0 du 22/05/2024) — ${A.specs.reduce((n,s)=>n+s.rows.length,0)} situations. Tapez un geste (ex. « DVE », « craniotomie », « gastrostomie », « césarienne »).</p>
 <input id="abpq" class="search-in" type="search" placeholder="Rechercher un geste, une spécialité, une molécule…" autocomplete="off">
 <details class="sec" id="abp-gen"><summary><span class="ico">📘</span>Principes généraux, doses, obésité, BLSE, allergie</summary><div class="secbody">${fmt(A.gen)}</div></details>
 ${A.specs.map((s,i)=>`<details class="sec abpspec" id="abp-${i}"><summary><span class="ico">🔪</span>${esc(s.s)} <span class="muted small" style="font-weight:400">(${s.rows.length})</span></summary><div class="secbody">${s.rows.map(row).join('')}</div></details>`).join('')}
 <p id="abpnone" class="muted" hidden>Aucun geste trouvé — vérifier l'orthographe ou consulter la RFE.</p>
 <h3>Référence</h3>${refList(['sfar_abp24'])}</section>`;
}
function bindABP(root){
 const q=$('#abpq',root); if(!q) return;
 q.oninput=()=>{ const v=norm(q.value).trim(); let any=false;
  $$('.abpspec',root).forEach(d=>{ let n=0; $$('.abprow',d).forEach(r=>{ const ok=!v || r.dataset.txt.includes(v) || norm(d.querySelector('summary').textContent).includes(v); r.hidden=!ok; if(ok) n++; });
   d.hidden = v && !n; if(v) d.open = n>0 && n<40; else d.open=false; if(n) any=true; });
  $('#abpnone',root).hidden = any || !v; };
}

/* ---------- PATHOLOGIES ---------- */
function viewPathos(){
 const groups={}; window.PATHO.forEach(p=>{(groups[p.cat]=groups[p.cat]||[]).push(p);});
 return `<section class="card">${Object.entries(groups).map(([c,ps])=>`<h3 class="grp">${esc(c)}</h3><div class="tiles">${ps.map(p=>`<a class="tile" href="#p-${p.id}"><b>${esc(p.name)}</b><span>${esc(String(p.duree).replace(/<[^>]+>/g,'').slice(0,90))}</span></a>`).join('')}</div>`).join('')}</section>`;
}
function viewPatho(id){
 const p=window.PATHO.find(x=>x.id===id); if(!p) return '<p>Introuvable.</p>';
 return `<section class="card"><a class="back" href="#pathologies">← Pathologies</a><h2>${esc(p.name)}</h2>
 ${p.div && p.div!=='—'?`<button type="button" class="badge-div" data-jump="s-div">⚖ Concordance / divergences entre recommandations</button>`:''}
 ${secs([
  ...(((window.NARPATHO||{})[p.id])? [{id:'s-nar', ico:'🏥', t:'Protocole du service (NAR 2025) — prioritaire', raw:true, html:`<div class="narbox">${fmtText(window.NARPATHO[p.id].html)}${window.NARPATHO[p.id].diff?`<div class="narfiff"><b>Écart avec les recommandations</b> : ${window.NARPATHO[p.id].diff}${refChips(recoRefs(p.refs))}</div>`:''}</div>`, open:true}] : []),
  {id:'s-proba', ico:'💊', t:(window.NARPATHO||{})[p.id]?'Recommandations — traitement probabiliste':'Traitement probabiliste', html:p.proba, open:!((window.NARPATHO||{})[p.id])},
  {id:'s-doc', ico:'🎯', t:'Traitement documenté / adaptation', html:p.doc},
  {id:'s-duree', ico:'⏱', t:'Durée', html:p.duree, open:true},
  {id:'s-annexe', ico:'🧩', t:'Mesures associées (hors anti-infectieux)', raw:true, html:annexHTML(p.id), open:true},
  {id:'s-diag', ico:'🔬', t:'Diagnostic / examens', html:p.diag},
  {id:'s-semio', ico:'🩺', t:'Clinique / définitions', html:p.semio},
  {id:'s-epi', ico:'🦠', t:'Épidémiologie / germes', html:p.epi},
  {id:'s-fr', ico:'📊', t:'Germes en France (%)', raw:true, html:epiTable(((window.EPIFR||{}).patho||{})[p.id],'Micro-organisme')},
  {id:'s-div', ico:'⚖', t:'Recommandations : concordance / divergences', html:p.div}
 ])}
 <p><button class="btn" data-site="${p.site}">➕ Sélectionner ce site dans l'antibiogramme</button></p>
 <h3>Références</h3>${refList([...new Set([...((window.NARPATHO||{})[p.id]?['nar25']:[]), ...p.refs.filter(x=>x!=='nar25'), ...((window.ANNEXE||{})[p.id]||[]).flatMap(b=>b.refs||[]), ...((((window.EPIFR||{}).patho||{})[p.id])||[]).map(b=>b.ref).filter(Boolean)])])}</section>`;
}

/* ---------- EXAMENS ---------- */
function viewExams(){
 const groups={}; window.EXAMS.forEach(e=>{(groups[e.cat]=groups[e.cat]||[]).push(e);});
 return `<section class="card">${Object.entries(groups).map(([c,es])=>`<h3 class="grp">${esc(c)}</h3><div class="tiles">${es.map(e=>`<a class="tile" href="#e-${e.id}"><b>${esc(e.name)}</b><span>${esc(e.princ).slice(0,90)}…</span></a>`).join('')}</div>`).join('')}</section>`;
}
function viewExam(id){
 const e=window.EXAMS.find(x=>x.id===id); if(!e) return '<p>Introuvable.</p>';
 return `<section class="card"><a class="back" href="#examens">← Examens</a><h2>${esc(e.name)}</h2>
 ${secs([
  {id:'s-usage', ico:'🎯', t:'Utilisation pratique / indications', html:e.usage, open:true},
  {id:'s-perf', ico:'📊', t:'Performances (Se, Sp, VPP, VPN, seuils)', html:e.perf, open:true},
  {id:'s-princ', ico:'🔬', t:'Principe', html:e.princ},
  {id:'s-fp', ico:'➕', t:'Faux positifs', html:e.fp},
  {id:'s-fn', ico:'➖', t:'Faux négatifs', html:e.fn}
 ])}
 <h3>Références</h3>${refList(e.refs)}</section>`;
}

/* ---------- PK/PD & STP ---------- */
function viewPKPD(){ return pharmaShell('pkpd', pkpdInner()); }
function pkpdInner(){
 const row=(a)=>`<tr>${a.map(x=>`<td>${x}</td>`).join('')}</tr>`;
 return `<h2>Principes PK/PD et suivi thérapeutique pharmacologique (STP) en réanimation</h2>
 <div class="note"><b>Message clé (SFAR/SFPT 2019)</b> : pour les β-lactamines chez le patient de réanimation, viser une <b>concentration libre ≥ 4 à 8 × la CMI pendant 100 % de l'intervalle</b> (fC<sub>min</sub> ou fC<sub>ss</sub> ≥ 4–8 × CMI), au moyen d'une <b>dose de charge</b>, de la <b>forte posologie</b>, d'une <b>perfusion prolongée ou continue</b> et d'un <b>STP</b>. Les tableaux CA-SFM/SPILF (« forte posologie ») visent seulement 100 % fT > CMI : en réanimation, l'app privilégie la cible SFAR et propose la forte posologie par défaut.</div>

 <h3>1. Pourquoi 4 à 8 × CMI ?</h3>
 <ul>
  <li>L'effet bactéricide des β-lactamines est maximal (plateau) pour des concentrations ≈ 4–5 × CMI ; au-delà, peu de gain, mais la toxicité augmente (neurotoxicité au-delà de ≈ 8–10 × CMI pour certaines molécules).</li>
  <li>Compenser la diffusion tissulaire incomplète (poumon, LCS, os) : la concentration plasmatique libre surestime la concentration au site.</li>
  <li>Limiter la sélection de mutants résistants (fenêtre de sélection) et l'effet inoculum.</li>
  <li>En réanimation, la variabilité PK est majeure (cf. §4) : une cible haute laisse une marge de sécurité contre le sous-dosage.</li>
 </ul>
 <p class="small muted">CMI à utiliser : la CMI mesurée de la souche si disponible ; à défaut (probabiliste), la concentration critique EUCAST/CA-SFM ou l'ECOFF du germe suspecté (approche « pire cas »).</p>

 <h3>2. Indices PK/PD et cibles par classe</h3>
 <table class="tbl"><tr><th>Classe</th><th>Indice prédictif</th><th>Cible d'efficacité</th><th>Prélèvement / toxicité</th></tr>
 ${row(['β-lactamines (pénicillines, céphalosporines, carbapénèmes, monobactames)','Temps-dépendant : %fT > CMI','Réanimation (SFAR/SFPT) : <b>fC ≥ 4–8 × CMI sur 100 % de l\'intervalle</b> (classiquement 40–70 % fT > CMI selon la classe)','Intermittent : C<sub>min</sub> (juste avant la dose suivante). Continu : C<sub>ss</sub> (à tout moment après l\'état d\'équilibre, ≈ 24 h ; plus tôt avec dose de charge). Toxicité indicative : céfépime C<sub>min</sub> > ≈ 20 mg/L ; pipéracilline > ≈ 150 mg/L ; méropénème C<sub>min</sub> > ≈ 45–60 mg/L.'])}
 ${row(['Aminosides','Concentration-dépendant : C<sub>max</sub>/CMI (et AUC/CMI)','C<sub>max</sub>/CMI ≥ 8–10 (amikacine 60–80 mg/L ; gentamicine/tobramycine 30–40 mg/L)','Pic 30 min après la fin d\'une perfusion de 30 min ; C<sub>min</sub> avant réinjection : amikacine < 2,5 mg/L, genta/tobra < 0,5 mg/L (ANSM 2011). Dosage du pic dès la 1re injection en réanimation.'])}
 ${row(['Vancomycine','AUC<sub>24</sub>/CMI','AUC 400–600 (CMI ≤ 1) ; continu : C<sub>ss</sub> 20–25 mg/L','C<sub>ss</sub> à H24 en continu ; AUC par 2 points (pic + résiduel) ou bayésien en intermittent ; néphrotoxicité si AUC > 600–700.'])}
 ${row(['Téicoplanine','AUC/CMI','C<sub>min</sub> 20–30 mg/L (30–40 pour endocardite/os)','C<sub>min</sub> à J3–J5 (demi-vie longue).'])}
 ${row(['Fluoroquinolones','AUC<sub>24</sub>/CMI et C<sub>max</sub>/CMI','AUC/CMI > 125 (BGN), > 30–50 (pneumocoque) ; C<sub>max</sub>/CMI > 8–12','Peu dosées en routine.'])}
 ${row(['Daptomycine','AUC/CMI, C<sub>max</sub>/CMI','AUC/CMI élevée (doses 8–12 mg/kg)','C<sub>min</sub> < 24,3 mg/L (toxicité musculaire).'])}
 ${row(['Linézolide','AUC/CMI (80–120) et %T > CMI (≥ 85 %)','C<sub>min</sub> 2–7 mg/L','Myélotoxicité si C<sub>min</sub> > 7–8 mg/L.'])}
 ${row(['Colistine','AUC/CMI (fAUC)','C<sub>ss</sub> moyenne ≈ 2 mg/L','Néphrotoxicité au-delà ; centres experts.'])}
 ${row(['Fluconazole','AUC/CMI','AUC/CMI > 100 (Candida)','Rarement dosé.'])}
 ${row(['Voriconazole / posaconazole / isavuconazole','AUC/CMI','Vorico C<sub>min</sub> 1–5,5 mg/L ; posa > 1 mg/L (traitement) ; isavu ≈ 2–4 mg/L','C<sub>min</sub> à J3–J5 (vorico) puis hebdomadaire ; à J5–J7 (posa/isavu).'])}
 ${row(['Échinocandines','C<sub>max</sub>/CMI, AUC/CMI','—','Non dosées en routine.'])}
 ${row(['Amphotéricine B','C<sub>max</sub>/CMI','—','Non dosée.'])}
 ${row(['Flucytosine','T > CMI','Pic 30–80 mg/L','Toxicité > 100 mg/L.'])}
 </table>

 <h3>3. Adapter la dose à partir d'un dosage</h3>
 <ul>
  <li><b>Pharmacocinétique linéaire (β-lactamines, vancomycine en continu)</b> : nouvelle dose ≈ dose actuelle × (cible / concentration mesurée). Ex. pipéracilline en continu 16 g/24 h, C<sub>ss</sub> 40 mg/L pour une cible 64 mg/L (4 × CMI 16) → ≈ 25 g/24 h (vérifier la dose maximale/tolérance, avis pharmacologue).</li>
  <li><b>Aminosides</b> : pic insuffisant → augmenter la dose unitaire ; C<sub>min</sub> trop élevée → espacer l'intervalle (ne pas diminuer la dose).</li>
  <li>Recontrôler 24–48 h après chaque modification et à chaque changement de fonction rénale/EER.</li>
  <li>Les logiciels bayésiens (centres) permettent d'estimer l'AUC et d'individualiser plus finement.</li>
 </ul>

 <h3>4. Sources de variabilité PK en réanimation</h3>
 <ul>
  <li><b>↑ Volume de distribution</b> (remplissage, fuite capillaire, œdèmes, ECMO, drainage) → la <b>dose de charge</b> dépend du Vd, <b>pas</b> de la fonction rénale : jamais réduite.</li>
  <li><b>Hyperclairance</b> (ClCr ≥ 130 mL/min) : fréquente chez le jeune cérébrolésé (HSA, TC), polytraumatisé, brûlé → sous-dosage des molécules à élimination rénale. Mesurer la ClCr urinaire.</li>
  <li><b>Hypoalbuminémie</b> : ↑ fraction libre et clairance des molécules très liées (ceftriaxone, ertapénème, cloxacilline, céfazoline, téicoplanine, daptomycine).</li>
  <li><b>IRA</b> : souvent transitoire → ne pas réduire les β-lactamines durant les 24 premières heures (SFAR/SFPT 2019).</li>
  <li><b>EER</b> : clairance extracorporelle dépendant du débit d'effluent, de la membrane (adsorption : ex. caspofungine/AN69), du coefficient de tamisage → STP.</li>
  <li><b>Obésité</b> : poids de dosage spécifique par molécule (onglet Patient ; abxbmi).</li>
 </ul>

 <h3>5. Modes d'administration</h3>
 <ul>
  <li><b>Perfusion prolongée (3–4 h) ou continue</b> des β-lactamines (après dose de charge en 30 min) : recommandée chez les patients les plus graves, en cas de CMI élevée et d'infection respiratoire basse (SFAR/SFPT 2019) ; vérifier la stabilité de chaque molécule (SPILF/SFPC 2025 : méropénème ≤ 8 h, amoxicilline ≤ 12 h en NaCl, imipénème et amox-clav non adaptés).</li>
  <li><b>Aminosides</b> : dose unique journalière en 30 min.</li>
  <li><b>Vancomycine</b> : continu après dose de charge (atteinte plus rapide des cibles, moins de néphrotoxicité).</li>
 </ul>

 <h3>6. Quand demander un STP ?</h3>
 <p>Hyperclairance, EER/ECMO, obésité, CMI élevée ou BGN non fermentant, infection du SNC/endocardite/os, échec clinique, toxicité suspectée (neurologique : céfépime, pipéracilline, méropénème, imipénème), molécule à marge étroite (aminosides, vancomycine, linézolide, voriconazole).</p>
 ${refChips(['sfar_bl2019','doses25','spilf_perf25','ansm_amino11','vanco20','colis19','goutelle23','abxbmi'])}`;
}

/* ---------- PHARMACO : sous-onglets ---------- */
const PHARMA_SUB=[['pkpd','PK/PD & STP','#pharmaco'],['tox','Toxicités & surveillance','#pharmaco-tox'],['atx','Antitoxiniques','#pharmaco-atx']];
function pharmaShell(cur, inner){
 return `<section class="card"><div class="seg wrap subtabs">${PHARMA_SUB.map(([k,l,h])=>`<a class="${k===cur?'on':''}" href="${h}">${l}</a>`).join('')}</div>${inner}</section>`;
}
function viewTox(){
 const S=window.SURV||{};
 const idx=window.DRUGS.filter(d=>S[d.id]).map(d=>`<tr><td><a href="#m-${d.id}:s-surv">${esc(d.name)}</a></td><td>${S[d.id].map(x=>x.q.replace(/<[^>]+>/g,'')).join(' · ')}</td></tr>`).join('');
 return pharmaShell('tox', `<h2>Toxicités des anti-infectieux et surveillance</h2>
 <div class="transv"><b>Sommaire</b> : <a href="#pharmaco-tox:neurotox">1. Encéphalopathie β-lactamines</a> · <a href="#pharmaco-tox:nephro">2. Néphrotoxicité (vanco + pip-tazo ; cloxa vs céfazoline)</a> · <a href="#pharmaco-tox:lzdmyelo">3. Linézolide</a> · <a href="#pharmaco-tox:amino">4. Aminosides</a> · <a href="#pharmaco-tox:polymyx">5. Polymyxines</a> · <a href="#pharmaco-tox:interneuro">6. Interactions neuroréa</a> · <a href="#pharmaco-tox:seuils">7. Seuils</a> · <a href="#pharmaco-tox:survidx">8. Index surveillance</a></div>
 <h3 id="neurotox">1. Encéphalopathie (neurotoxicité) aux β-lactamines</h3>
 <div class="narbox"><b>Protocole NAR</b> : céfépime à dose méningée → <b>dosage systématique à 48 h ± EEG</b> ; PAVM tardive : céfépime possible « en faisant attention au risque d'encéphalopathie ».</div>
 <p><b>Mécanisme</b> : antagonisme GABA-A dépendant de la concentration (céfépime : passage de la barrière hémato-encéphalique).</p>
 <p><b>Présentation</b> (revue systématique des neurotoxicités du céfépime) :</p>
 <ul class="pts">
  <li>Toujours une altération de l'état mental : baisse de vigilance (47 %), myoclonies (42 %), confusion (42 %).</li>
  <li>EEG anormal chez tous les patients explorés : ondes triphasiques (40 %), pointes focales (39 %), <b>état de mal non convulsif (25 %)</b>, état de mal myoclonique (7 %).</li>
  <li>Début médian <b>4 jours</b> après l'introduction ; <b>résolution médiane en 2 jours</b> après l'intervention.</li>
  <li>48 % des patients étaient surdosés pour leur fonction rénale, mais <b>26 % ont fait une neurotoxicité malgré une posologie adaptée</b>.</li>
  <li>Diagnostic difficile en réanimation : symptômes variés et fréquents chez ces patients (a fortiori chez le cérébrolésé).</li>
 </ul>
 <p><b>Facteur de risque principal</b> : <b>insuffisance rénale</b>, surtout si la dose n'est pas réduite.</p>
 <p><b>Concentrations associées à la neurotoxicité</b> (résiduelles, études observationnelles) :</p>
 <table class="tbl"><tr><th>Molécule</th><th>Seuil associé</th><th>Source</th></tr>
 <tr><td>Céfépime</td><td>Cmin ≥ 22 mg/L : 50 % de probabilité de neurotoxicité</td><td>Lamoth 2010 (neutropéniques fébriles, IR légère)</td></tr>
 <tr><td>Céfépime</td><td>Cmin > 20 mg/L ; Css > 60 mg/L (perfusion continue)</td><td>Revue STP 2024</td></tr>
 <tr><td>Pipéracilline</td><td>Cmin > 361,4 mg/L : 50 % de risque</td><td>Imani 2017</td></tr>
 <tr><td>Méropénème</td><td>Cmin > 64,2 mg/L : 50 % de risque</td><td>Imani 2017</td></tr>
 <tr><td>Flucloxacilline (≈ cloxacilline)</td><td>Cmin > 125,1 mg/L : 50 % de risque</td><td>Imani 2017</td></tr></table>
 <p><b>Conduite à tenir</b> :</p>
 <ul class="pts">
  <li>Évoquer le diagnostic devant toute dégradation neurologique inexpliquée sous β-lactamine (vigilance, myoclonies, crises) : <b>dosage (STP) et EEG</b>.</li>
  <li>Interventions rapportées : <b>arrêt ou changement de molécule</b>, réduction de dose, <b>antiépileptique</b> (benzodiazépine) si état de mal, <b>hémodialyse</b> (céfépime) dans les formes graves avec insuffisance rénale.</li>
  <li>Prévention : adapter à la fonction rénale (y compris à la récupération d'une IRA), STP chez les patients à risque (SFAR/SFPT 2019 : STP en cas de toxicité suspectée).</li>
  <li>Imipénème : abaisse le seuil épileptogène (RCP) ; méropénème, céfépime, ceftazidime, pipéracilline et imipénème sont listés parmi les molécules justifiant un STP pour toxicité neurologique (sous-onglet PK/PD & STP, section 6).</li>
 </ul>
 ${refChips(['nar25','payne17','lamoth10','imani17','ckj_tdm24','sfar_bl2019'])}


 <h3 id="nephro">2. Néphrotoxicité</h3>
 <p><b>2a. Vancomycine + pipéracilline-tazobactam</b></p>
 <ul class="pts">
  <li><b>Méta-analyse (≈ 24 800 patients)</b> : IRA chez 22,2 % sous vancomycine + pip-tazo contre 12,9 % sous comparateurs (nombre de patients à traiter pour un effet néfaste : 11). OR 3,40 contre vancomycine seule ; OR 2,68 contre vancomycine + céfépime ou carbapénème.</li>
  <li><b>Chez les patients de réanimation</b> (sous-analyse, 968 patients) : pas de différence significative contre vancomycine + céfépime/carbapénème (OR 1,43 ; IC 95 % 0,83–2,47).</li>
  <li><b>Essai randomisé ACORN</b> (2 511 adultes, céfépime contre pip-tazo, 2023) : pas de différence sur l'IRA stade 3 ou le décès à J14, mais <b>plus de dysfonction neurologique sous céfépime</b> — argument à peser en neuroréanimation.</li>
  <li>Pratique : surveiller la créatinine et la vancocinémie (cibles du service), limiter la durée de l'association (désescalade à 48–72 h).</li>
 </ul>
 ${refChips(['luther18','acorn23','nar25'])}
 <p id="cfzclox"><b>2b. Cloxacilline contre céfazoline (bactériémie à SAMS)</b></p>
 <p class="muted">Chiffres présentés dans l'ordre <b>céfazoline contre pénicilline M</b> (cloxacilline ou flucloxacilline).</p>
 <table class="tbl"><tr><th></th><th>CloCeBa (France, Lancet 2025)</th><th>SNAP, volet SAMS (NEJM 2026)</th></tr>
 <tr><td>Schéma</td><td>Randomisé ouvert, non-infériorité, 21 centres, 292 patients</td><td>Plateforme adaptative internationale, 1 341 patients, arrêt anticipé (non-infériorité atteinte)</td></tr>
 <tr><td>Doses</td><td>Céfazoline 25–50 mg/kg/8 h (≤ 6 g/j) ; cloxacilline 25–50 mg/kg/4–6 h (8–12 g/j) ; molécule randomisée imposée les 7 premiers jours</td><td>Céfazoline 2 g/8 h (2 g/6 h si réanimation, endocardite ou SNC) ; flucloxacilline 2 g/6 h (2 g/4 h forte dose) ; cloxacilline 2 g/4 h</td></tr>
 <tr><td>Efficacité</td><td>Succès à J90 (composite) : <b>75 % contre 74 %</b> → non-infériorité</td><td>Mortalité J90 : <b>15,0 % contre 17,0 %</b> (ORa 0,81) → non-infériorité (probabilité 99,2 %), supériorité probable (89,8 %) mais non démontrée</td></tr>
 <tr><td>IRA</td><td><b>1/134 contre 15/128 à J7</b> ; 4/111 contre 19/99 en fin de traitement</td><td><b>13,9 % contre 19,6 % à J14</b> (ORa 0,67) ; stade 3 : 1,8 % contre 2,9 %</td></tr>
 <tr><td>Autres</td><td>Événements indésirables graves à J7 : 14 contre 30</td><td>Arrêt pour effet indésirable : <b>1,6 % contre 9,1 %</b> ; nouvelle EER à J90 : 2,5 % contre 4,1 % (non significatif)</td></tr>
 <tr><td>Exclusions / limites</td><td>Exclus : AVC < 1 mois, abcès cérébral, méningite ; implant endovasculaire ; matériel infecté. Peu de formes graves (Pitt médian 0)</td><td>Infections du SNC : 0,5 % des patients (aucune conclusion) ; réanimation à l'inclusion ≈ 11 % (pas d'analyse dédiée) ; dialysés exclus ; endocardites : 104 patients, effectif insuffisant</td></tr></table>
 <ul class="pts">
  <li><b>Recommandations</b> : endocardite à SAMS sur valve native, « céfazoline ou cloxacilline » 4–6 semaines (ESC 2023 ; SPILF/AEPEI 2025).</li>
  <li><b>En résumé</b> : efficacité comparable et <b>nettement moins d'IRA et d'arrêts pour intolérance sous céfazoline</b>.</li>
  <li><b>Mécanisme côté pénicilline M</b> : néphrite interstitielle immuno-allergique (RCP) ; effet dose (CloCeBa : 8–12 g/j).</li>
  <li><b>Effet inoculum (β-lactamase de type A)</b> : question non tranchée. Dans CloCeBa, échecs microbiologiques 10 % contre 5 % dans ce sous-groupe (non significatif) ; dans SNAP, analyses non encore publiées. Endocardites et foyers profonds restent peu représentés.</li>
  <li><b>Système nerveux central</b> : <b>pas de données</b> dans ces deux essais (exclus ou trop peu nombreux). La SPILF 2016 indique une <b>diffusion faible dans le LCR</b> et ne propose pas la céfazoline dans les infections du SNC (avis spécialisé recommandé) ; le protocole NAR prévoit pourtant une dose méningée (8–12 g/j IVSE) — écart à trancher avec l'équipe.</li>
  <li><b>Pénicilline G (souche péni-S)</b> : dans SNAP (Lancet 2026), moins d'IRA qu'avec la (fluclo)xacilline (11 % contre 22 %), mortalité J90 14 % contre 21 % (non-infériorité).</li>
  <li><b>Pratique en neuroréa</b> (hors SNC) : la céfazoline est une option à privilégier chez le patient à risque rénal (IRA, néphrotoxiques associés : produits de contraste, aminosides, vancomycine) ; garder la cloxacilline pour l'infection du SNC. Surveillance de la céfazoline : TP hebdomadaire (NAR).</li>
 </ul>
 ${refChips(['cloceba25','snap_cfz26','snap_peni26','spilf_penim16','esc_ei23','spilf_aepei25','nar25'])}
 <h3 id="lzdmyelo">3. Myélotoxicité du linézolide</h3>
 <ul class="pts">
  <li>Surveillance : <b>NFS 2 fois par semaine</b> (protocole NAR) ; RCP : 1 fois par semaine pour tous, plus étroite si cytopénie préexistante, insuffisance rénale sévère ou traitement > 10–14 jours.</li>
  <li><b>Concentrations</b> : une résiduelle > 7–8 mg/L est régulièrement associée à la thrombopénie ; cible de résiduelle proposée <b>2–8 mg/L</b>.</li>
  <li>Facteurs de risque indépendants dans une cohorte : <b>durée ≥ 10 jours</b> et <b>résiduelle > 8 mg/L</b>, les résiduelles élevées étant liées à l'insuffisance rénale.</li>
  <li>Au-delà de 28 jours : neuropathie optique et périphérique (surveillance de la vision, RCP).</li>
 </ul>
 ${refChips(['nar25','rcp_linez','crass19','lzd_front24'])}
 <h3 id="amino">4. Aminosides : néphro- et ototoxicité</h3>
 <ul class="pts">
  <li><b>Dose unique journalière</b> en perfusion de 30 min, durée <b>≤ 5 jours</b>, arrêt le plus souvent après 48–72 h (ANSM 2011).</li>
  <li>Les risques de toxicité rénale et auditive <b>augmentent fortement au-delà de 5–7 jours</b> (ANSM 2011).</li>
  <li>Résiduelle : si traitement > 5 jours (dosage après 48 h) ou insuffisance rénale (RCP gentamicine). Cibles du service : voir les fiches amikacine et gentamicine.</li>
  <li><b>Prédisposition génétique</b> : les variants mitochondriaux MT-RNR1 (m.1555A>G, m.1095T>C, m.1494C>T) exposent à une surdité après une seule dose. Recommandation CPIC 2022 : éviter les aminosides chez les porteurs connus, sauf si la gravité de l'infection l'emporte et en l'absence d'alternative. Rechercher un antécédent familial de surdité après aminoside.</li>
 </ul>
 ${refChips(['ansm_amino11','ansm_amino_ville11','rcp_genta','cpic_rnr1'])}
 <h3 id="polymyx">5. Polymyxines (colistine)</h3>
 <ul class="pts">
  <li>Néphrotoxicité dépendante de l'exposition : au-delà de la cible de concentration moyenne à l'équilibre (≈ 2 mg/L), <b>l'incidence et la sévérité de l'IRA augmentent</b> ; ces expositions sont considérées comme les maximales tolérables (consensus international 2019).</li>
  <li>La polymyxine B a une moindre néphrotoxicité potentielle (même consensus).</li>
  <li>Surveillance : fonction rénale au début puis régulièrement (RCP) ; neurotoxicité (paresthésies, blocage neuromusculaire, apnée).</li>
 </ul>
 ${refChips(['colis19','rcp_colis'])}
 <h3 id="interneuro">6. Interactions critiques en neuroréanimation</h3>
 <table class="tbl"><tr><th>Anti-infectieux</th><th>Interaction</th><th>Conséquence / conduite</th></tr>
 <tr><td>Carbapénèmes (méropénème, imipénème, ertapénème)</td><td>Acide valproïque</td><td>Chute rapide et durable de la valproatémie → crises : association déconseillée, changer d'antiépileptique ou d'antibiotique.</td></tr>
 <tr><td>Rifampicine</td><td>Nimodipine (contre-indiquée), antiépileptiques, AVK/AOD, voriconazole (contre-indiqué)</td><td>Inducteur puissant ; l'induction persiste ≈ 2 semaines après l'arrêt.</td></tr>
 <tr><td>Linézolide</td><td>ISRS, IRSNa, opioïdes sérotoninergiques</td><td>Syndrome sérotoninergique (effet IMAO faible) : surveillance étroite si l'association est inévitable.</td></tr>
 <tr><td>Imipénème, fluoroquinolones, céfépime</td><td>Lésion cérébrale, épilepsie</td><td>Abaissement du seuil épileptogène / neurotoxicité : préférer d'autres molécules si possible.</td></tr>
 <tr><td>Voriconazole, fluconazole, posaconazole</td><td>Substrats du CYP3A4 (nimodipine, midazolam, tacrolimus…)</td><td>Inhibition enzymatique : majoration des concentrations ; adapter et doser.</td></tr></table>
 ${refChips(['bdpm','rcp_linez'])}
 <h3 id="seuils">7. Seuils de concentration associés à une toxicité (autres classes)</h3>
 <table class="tbl"><tr><th>Molécule</th><th>Toxicité</th><th>Seuil rapporté</th></tr>
 <tr><td>Amikacine</td><td>Ototoxicité</td><td>Cmin > 5 mg/L</td></tr>
 <tr><td>Gentamicine, tobramycine</td><td>Ototoxicité</td><td>Cmin > 1 mg/L</td></tr>
 <tr><td>Linézolide</td><td>Neurotoxicité</td><td>Cmin > 2 mg/L et traitement > 4 semaines</td></tr>
 <tr><td>Colistine</td><td>Néphrotoxicité</td><td>Cmin > 2,4 mg/L</td></tr>
 <tr><td>Cotrimoxazole</td><td>Toxicité générale</td><td>Sulfaméthoxazole > 150 mg/L</td></tr></table>
 <p class="muted small">Seuils issus d'une revue (Clin Kidney J 2024, tableau 2). Pour les aminosides, le protocole NAR et l'ANSM retiennent des cibles de vallée plus basses avant réinjection (amikacine < 2,5 mg/L ; gentamicine < 0,5 mg/L) : voir les fiches molécules.</p>
 ${refChips(['ckj_tdm24','ansm_amino11'])}
 <h3 id="survidx">8. Surveillance par molécule (index)</h3>
 <p class="muted small">Détail (quand, pourquoi, source) dans la rubrique « Surveillance / particularités » de chaque fiche.</p>
 <table class="tbl"><tr><th>Molécule</th><th>À surveiller</th></tr>${idx}</table>`);
}
function viewATX(){
 const A=window.ANTITOX; if(!A) return pharmaShell('atx','<p>—</p>');
 return pharmaShell('atx', `<h2>Antibiothérapie antitoxinique — puissance comparée</h2>
 <p class="muted small">Choc toxique, DHBN/fasciite nécrosante, pneumonie nécrosante à S. aureus PVL, gangrène gazeuse.</p>
 ${secs([
  {id:'a-ind', ico:'🎯', t:'Indications et principe', html:A.epi, open:true},
  {id:'a-tab', ico:'📊', t:'Puissance antitoxinique par molécule', html:A.diag, open:true},
  {id:'a-sch', ico:'💊', t:'Schémas', html:A.proba, open:true},
  {id:'a-arr', ico:'⏱', t:'Durée et arrêt', html:A.doc+'<br>'+A.duree, open:true}
 ])}
 <p>Fiches : <a href="#m-clinda">Clindamycine</a> · <a href="#m-linez">Linézolide</a> · <a href="#p-dhbn">DHBN</a> · <a href="#g-strepA">Streptocoque A</a> · <a href="#g-saureus">S. aureus</a></p>
 <h3>Références</h3>${refList(A.refs)}`);
}

/* ---------- RÉFÉRENCES ---------- */
function viewRefs(){
 const by={FR:[],EU:[],US:[]}; Object.entries(R).forEach(([k,r])=>(by[r.lvl]||by.EU).push([k,r]));
 const sec=(t,a)=>`<h3 class="grp">${t}</h3><ol class="reflist">${a.map(([k,r])=>`<li><a href="${esc(r.u)}" target="_blank" rel="noopener">${esc(r.t)}</a> — <span class="muted">${esc(r.s)}</span></li>`).join('')}</ol>`;
 return `<section class="card"><h2>Références</h2>
 <div class="note">Hiérarchie appliquée : recommandations françaises en priorité (en cas de divergence, <b>SFAR/SRLF privilégiée</b> et divergence signalée), puis européennes, puis américaines. ePOPI (CMIT) et GPR servent de référentiels thérapeutiques complémentaires (abonnement). Posologies de base : annexe SPILF/SFPT/CA-SFM 2025 ; adaptation rénale : RCP/GPR ; obésité : abxbmi.</div>
 ${sec('Françaises',by.FR)}${sec('Européennes / internationales',by.EU)}${sec('Américaines',by.US)}</section>
 <section class="card noabbr" id="glossaire"><h2>Glossaire des acronymes</h2><p class="muted small">Dans toute l'application, les acronymes soulignés en pointillés affichent leur signification au survol ou au toucher.</p><dl class="gloss">${Object.keys(GL).sort((a,b)=>a.localeCompare(b,'fr',{sensitivity:'base'})).map(k=>`<dt>${esc(k)}</dt><dd>${esc(GL[k])}</dd>`).join('')}</dl></section>`;
}

/* ---------- ANTIBIOGRAMME ---------- */
const APP_VERSION='1.21';
let SAMPLE = null, sampleImages=false;
const PHOTO = {msg:'', thumbs:[]}; let PHOTO_TARGET='abg';
function photoMsg(h){ PHOTO.msg=h; const m=document.getElementById('photomsg'); if(m) m.innerHTML=h; }
function germOptions(sel){
 const groups={}; window.GERMS.forEach(g=>{(groups[g.cat]=groups[g.cat]||[]).push(g);});
 return '<option value="">— Choisir le germe —</option>'+Object.entries(groups).map(([c,gs])=>`<optgroup label="${esc(c)}">${gs.map(g=>`<option value="${g.id}" ${sel===g.id?'selected':''}>${esc(g.name)}</option>`).join('')}</optgroup>`).join('');
}
function phenoUI(iso, i){
 const g=G[iso.germ]; if(!g) return '';
 const ph=iso.ph||{};
 if(g.grp==='staph') return `<div class="pheno"><label class="chk"><input type="checkbox" data-ph="${i}:mr" ${ph.mr?'checked':''}> Méticillino-résistant (SARM / SCN méti-R)</label></div>`;
 if(['eb1','eb2','eb3'].includes(g.grp)) return `<div class="pheno">
   <label class="chk"><input type="checkbox" data-ph="${i}:blse" ${ph.blse?'checked':''}> BLSE</label>
   <label class="chk"><input type="checkbox" data-ph="${i}:ampc" ${ph.ampc?'checked':''}> Céphalosporinase hyperproduite</label>
   <label>Carbapénémase <select data-phs="${i}:carba"><option value="">Non</option>${['KPC','OXA48','MBL','NT'].map(x=>`<option value="${x}" ${ph.carba===x?'selected':''}>${({KPC:'KPC',OXA48:'OXA-48',MBL:'Métallo (NDM/VIM/IMP)',NT:'Non typée'})[x]}</option>`).join('')}</select></label></div>`;
 return '';
}
function astGrid(iso,i){
 const g=G[iso.germ]; if(!g) return '';
 const ids = Array.from(new Set([...(g.ast||[]), ...Object.keys(iso.ast||{})])).filter(x=>D[x]);
 if(!ids.length) return '<p class="muted">Pas d\'antibiogramme pertinent pour ce germe : propositions selon la sensibilité attendue.</p>';
 const nat = (window.ENGINE_INFO.NAT[g.grp]||[]).concat(window.ENGINE_INFO.NAT_GERM[g.id]||[]);
 return `<div class="astgrid">${ids.map(id=>{ const v=(iso.ast||{})[id]||''; const n=nat.includes(id);
   return `<div class="astrow ${n?'nat':''}"><span title="${esc(D[id].name)}">${esc(D[id].name)}${n?' <small>(R nat.)</small>':''}</span><div class="seg sm">${['S','SFP','R',''].map(x=>`<button class="${v===x?'on v'+(x||'0'):''}" data-ast="${i}:${id}:${x}">${x||'—'}</button>`).join('')}</div></div>`; }).join('')}</div>
   <div class="addab"><select data-addab="${i}"><option value="">+ ajouter une molécule testée…</option>${window.DRUGS.filter(d=>!ids.includes(d.id)).map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join('')}</select></div>`;
}
function viewABG(){
 const sites = window.SITES.map(s=>`<button class="chip ${AB.sites.includes(s.id)?'on':''}" data-tsite="${s.id}">${esc(s.l)}</button>`).join('');
 return `<section class="card">
 <h2>Antibiogramme → propositions thérapeutiques</h2>
 <div class="note small">Aide à la décision : propositions hiérarchisées selon les recommandations (FR > EU > US), à confronter au contexte clinique, aux protocoles locaux et à l'avis infectiologique/pharmacologique. Patient : ${patientSummary()} — <a href="#patient">modifier</a>.</div>
 <h3>1. Site(s) infecté(s) <small class="muted">(plusieurs possibles)</small></h3><div class="chips">${sites}</div>
 <h3>2. Antibiogramme(s)</h3>
 <div class="photo">
   <button type="button" class="btn primary" data-photo="cam">📷 Prendre une photo</button>
   <button type="button" class="btn" data-photo="lib">🖼 Photothèque / fichiers (plusieurs possibles)</button>
   <span class="warn small">🔒 Cadrer uniquement le tableau de l'antibiogramme : aucun nom, IPP ni date de naissance sur la photo.</span>
   <div id="thumbs" class="thumbs">${PHOTO.thumbs.map(u=>`<img src="${u}" alt="photo">`).join('')}</div>
   <span id="photomsg" class="muted">${PHOTO.msg || (SAMPLE? 'Lecture automatique par Claude — vérifiez toujours la transcription.' : 'Lecture automatique directement sur le téléphone (aucun compte, la photo ne quitte pas l\'appareil ; 1er usage : ≈ 5 Mo à télécharger). Vérifiez toujours la transcription.')}</span>
 </div>
 <div id="isos">${AB.isolates.map((iso,i)=>`<div class="iso"><div class="isohead"><b>Isolat ${i+1}</b>${iso.src?` <span class="muted small">${esc(({photo:'📷 lu par Claude',ocr:'📷 lu sur l\'appareil'})[iso.src]||iso.src)}</span>`:''}<select data-germ="${i}">${germOptions(iso.germ)}</select><button class="x" data-del="${i}" title="Supprimer">✕</button></div>${iso.raw?`<div class="muted small">Lu sur la photo : « ${esc(iso.raw)} »</div>`:''}${phenoUI(iso,i)}${astGrid(iso,i)}</div>`).join('')}</div>
 <p><button class="btn" id="addiso">➕ Ajouter un isolat (saisie manuelle)</button> ${AB.isolates.length?'<button class="btn ghost" id="clearabg">Tout effacer</button>':''}</p>
 <h3>3. Propositions</h3>
 <div id="results">${renderResults()}</div>
 </section>`;
}
function optionCard(o, rank, sites, germ, iso){
 const names = o.c.d.map(x=>D[x].name).join(' + ');
 const statuses = o.st.map(s=>`<span class="pill s${s.s||'0'}">${esc(D[s.id].name)} : ${s.s==='E'?'non testé (attendu S)':s.s||'non testé'}${s.why&&s.s!=='E'?' — '+esc(s.why):''}</span>`).join(' ');
 const issues = o.siteIssues.filter(x=>x.v!=='ok').map(x=>`<span class="pill caution">${esc(D[x.x].name)} / ${esc(window.SITES.find(s=>s.id===x.s).l)} : ${x.v==='assoc'?'à associer (monothérapie réservée à l\'IU)':'diffusion/efficacité limitée'}</span>`).join(' ');
 const doses = o.c.d.map(x=>{ const d=D[x]; const st=(o.st.find(s=>s.id===x)||{}).s; const rk=window.regimenFor(d, st, sites, germ.grp, {grave:P.grave}); return `<div class="drugdose"><a href="#m-${x}"><b>${esc(d.name)}</b></a>${doseBlock(d, rk)}</div>`; }).join('');
 const refs = Array.from(new Set(o.c.d.flatMap(x=>D[x].refs.slice(0,3))));
 return `<details class="opt ${rank===1?'best':''}" ${rank<=2?'open':''}><summary><span class="rank">${rank}</span> <b>${esc(names)}</b>${o.c.salvage?' <span class="pill danger">sauvetage</span>':''}${o.c.broad?' <span class="pill caution">spectre large</span>':''}</summary>
  ${o.c.note?`<div class="rationale">${esc(o.c.note)}</div>`:''}
  <div>${statuses}</div>${issues?`<div>${issues}</div>`:''}
  ${o.warns.length?`<div class="warnbox">${o.warns.map(esc).join('<br>')}</div>`:''}
  ${doses}${refChips(refs)}</details>`;
}
function renderResults(){
 if(!AB.isolates.length) return '<p class="muted">Ajoutez un isolat (photo ou saisie).</p>';
 if(!AB.sites.length) return '<p class="warn">Sélectionnez au moins un site.</p>';
 const res = AB.isolates.map(iso=> iso.germ? window.evaluate(iso, AB.sites, P) : null);
 let html='';
 const globalNotes = [];
 globalNotes.push('Posologies : la forte posologie est proposée par défaut en réanimation (cible fC 4–8 × CMI, SFAR/SFPT 2019) ; la posologie standard n\'est proposée qu\'en désescalade si vous l\'autorisez dans l\'onglet Patient.');
 if(P.grave) globalNotes.push('Choc septique : 1re dose pleine sans adaptation rénale ; pas de réduction des β-lactamines pendant 24 h ; perfusion prolongée/continue après dose de charge (SFAR/SFPT 2019) ; aminoside 1–3 j associé pour les BGN (HAS 2019).');
 if(!band(P)) globalNotes.push('Fonction rénale non renseignée : posologies affichées pour fonction rénale normale.');
 if(AB.sites.some(s=>s==='snc'||s==='abces')) globalNotes.push('SNC : doses méningées, privilégier les molécules à bonne diffusion ; voie intraventriculaire possible en cas d\'échec/BGN multi-R (IDSA 2017) — cf. fiche « Ventriculite ».');
 if(AB.sites.includes('abdo')) globalNotes.push('Intra-abdominal (RFE SFAR 2026) : contrôle de la source prioritaire ; toujours associer le métronidazole aux molécules sans activité anti-anaérobie (céphalosporines, FQ, aztréonam) ; IIA associée aux soins en choc sous céfépime-métronidazole : ajouter linézolide, vancomycine ou teicoplanine (entérocoques) ; antifongique si levures à l\'examen direct ou ≥ 3 critères du Peritonitis score — cf. fiche « Infection intra-abdominale ».');
 if(globalNotes.length) html += `<div class="note">${globalNotes.map(esc).join('<br>')}</div>`;
 res.forEach((r,i)=>{
  const iso=AB.isolates[i];
  if(!r){ html+=`<div class="isores"><h4>Isolat ${i+1}</h4><p class="muted">Choisir le germe.</p></div>`; return; }
  if(r.error){ html+=`<div class="isores"><h4>Isolat ${i+1}</h4><p class="warn">${esc(r.error)}</p></div>`; return; }
  const durs = AB.sites.map(s=>`<li><b>${esc(window.SITES.find(x=>x.id===s).l)}</b> : ${esc(window.durationFor(s, r.germ, r.ctx))}</li>`).join('');
  const top = r.options.slice(0,4), more = r.options.slice(4);
  html += `<div class="isores"><h4>Isolat ${i+1} — ${esc(r.germ.name)}</h4>
   ${r.options.length? top.map((o,k)=>optionCard(o,k+1,AB.sites,r.germ,iso)).join('') : '<p class="warn">Aucune option satisfaisant tous les critères : avis infectiologique (voir options écartées).</p>'}
   ${more.length?`<details class="more"><summary>${more.length} autre(s) option(s)</summary>${more.map((o,k)=>optionCard(o,k+5,AB.sites,r.germ,iso)).join('')}</details>`:''}
   <div class="dur"><b>Durées indicatives</b> (retenir la plus longue si plusieurs sites) :<ul>${durs}</ul>${refChips(['spilf_durees21','sfar_pavm17','sfar_iia15','idsa_vent17','escmid_abces24'])}</div>
   ${r.excluded.length?`<details class="excl"><summary>Options écartées (${r.excluded.length})</summary><ul>${r.excluded.map(e=>`<li><b>${esc(e.c.d.map(x=>D[x].name).join(' + '))}</b> — ${esc(e.why)}</li>`).join('')}</ul></details>`:''}
   <p class="small"><a href="#g-${r.germ.id}">Fiche germe : ${esc(r.germ.name)}</a></p></div>`;
 });
 const comb = window.combineIsolates(res.filter(Boolean), AB.sites);
 if(comb){
  let box = `<div class="isores comb"><h4>🎯 Infection pluri-microbienne — schéma couvrant tous les isolats (à privilégier)</h4>`;
  const best = comb.common.filter(c=>!c.salv);
  if(best.length){
   const c0=best[0], ids=c0.k.split('+');
   box += `<div class="okbox"><b>${esc(ids.map(x=>D[x].name).join(' + '))}</b> — ${c0.nd===1?'<b>une seule molécule</b> active sur ':'active sur '}tous les isolats (${c0.opts.map((o,i)=>`isolat ${i+1} : ${o.st.map(s=>s.s==='E'?'attendu S':s.s).join('/')}`).join(' ; ')}).</div>`;
   box += ids.map(x=>{ const d=D[x]; const worst = c0.opts.some(o=>(o.st.find(s=>s.id===x)||{}).s==='SFP')?'SFP':'S'; const rk=window.regimenFor(d, worst, AB.sites, (res.find(Boolean)||{}).germ?.grp, {grave:P.grave}); return `<div class="drugdose"><a href="#m-${x}"><b>${esc(d.name)}</b></a>${doseBlock(d, rk)}</div>`; }).join('');
   if(best.length>1) box += `<p class="small">Autres schémas communs : ${best.slice(1,4).map(c=>esc(c.k.split('+').map(x=>D[x].name).join(' + '))).join(' ; ')}.</p>`;
  } else {
   box += `<p>Aucune molécule ne couvre efficacement tous les isolats : associer les 1res options — <b>${esc(comb.tops.map(o=>o.c.d.map(x=>D[x].name).join(' + ')).filter((v,i,a)=>a.indexOf(v)===i).join(' ⊕ '))}</b> (vérifier redondances et interactions).</p>`;
  }
  html = box + '</div>' + html;
 }
 return html;
}
function bindABG(root){
 $$('[data-tsite]',root).forEach(b=>b.onclick=()=>{ const s=b.dataset.tsite; AB.sites = AB.sites.includes(s)? AB.sites.filter(x=>x!==s) : [...AB.sites,s]; saveAB(); render(); });
 $('#addiso',root) && ($('#addiso',root).onclick=()=>{ AB.isolates.push({germ:'',ast:{},ph:{}}); saveAB(); render(); });
 $('#clearabg',root) && ($('#clearabg',root).onclick=()=>{ AB.isolates=[]; saveAB(); render(); });
 $$('[data-germ]',root).forEach(s=>s.onchange=()=>{ const i=+s.dataset.germ; AB.isolates[i].germ=s.value; saveAB(); render(); });
 $$('[data-del]',root).forEach(b=>b.onclick=()=>{ AB.isolates.splice(+b.dataset.del,1); saveAB(); render(); });
 $$('[data-ast]',root).forEach(b=>b.onclick=()=>{ const [i,id,v]=b.dataset.ast.split(':'); const a=AB.isolates[+i].ast||(AB.isolates[+i].ast={}); if(v) a[id]=v; else delete a[id]; if(id==='cloxa' && G[AB.isolates[+i].germ] && G[AB.isolates[+i].germ].grp==='staph'){ AB.isolates[+i].ph=AB.isolates[+i].ph||{}; AB.isolates[+i].ph.mr = (v==='R'); } saveAB(); keepScroll(render); });
 $$('[data-ph]',root).forEach(c=>c.onchange=()=>{ const [i,k]=c.dataset.ph.split(':'); (AB.isolates[+i].ph=AB.isolates[+i].ph||{})[k]=c.checked; saveAB(); keepScroll(render); });
 $$('[data-phs]',root).forEach(c=>c.onchange=()=>{ const [i,k]=c.dataset.phs.split(':'); (AB.isolates[+i].ph=AB.isolates[+i].ph||{})[k]=c.value||null; saveAB(); keepScroll(render); });
 $$('[data-addab]',root).forEach(s=>s.onchange=()=>{ if(!s.value) return; const i=+s.dataset.addab; (AB.isolates[i].ast=AB.isolates[i].ast||{})[s.value]='S'; saveAB(); keepScroll(render); });
}
function keepScroll(fn){ const y=window.scrollY; fn(); window.scrollTo(0,y); }

/* ---------- mise à jour (écran d'accueil iPhone : cache agressif) ---------- */
function hardReload(v){ const u=location.pathname+'?v='+(v||Date.now())+location.hash; location.replace(u); }
function checkUpdate(){
 if(location.protocol==='file:') { const f0=document.getElementById('forceupd'); if(f0) f0.onclick=e=>{e.preventDefault(); hardReload();}; return; }
 const f=document.getElementById('forceupd'); if(f) f.onclick=e=>{ e.preventDefault(); hardReload(); };
 try{ fetch('version.json?ts='+Date.now(), {cache:'no-store'}).then(r=>r.ok?r.json():null).then(j=>{
   if(!j || !j.v || j.v===APP_VERSION) return;
   const b=document.createElement('div'); b.id='updbar'; b.innerHTML=`<span>Nouvelle version ${j.v} disponible</span><button type="button">Mettre à jour</button>`;
   b.querySelector('button').onclick=()=>hardReload(j.v); document.body.appendChild(b);
 }).catch(()=>{}); }catch(e){}
}
/* ---------- lecture photo via Claude ---------- */
function setupPhotoInputs(){
 // entrées <input type=file> permanentes, hors de la zone re-rendue : un re-rendu pendant que l'appareil photo est ouvert ne fait plus perdre la photo
 const mk=(id, cap, multi)=>{ let i=document.getElementById(id); if(i) return i; i=document.createElement('input'); i.type='file'; i.id=id; i.accept='image/*'; if(cap) i.setAttribute('capture','environment'); if(multi) i.multiple=true;
  i.style.cssText='position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0'; document.body.appendChild(i);
  i.addEventListener('change', ()=>{ const f=[...(i.files||[])]; if(f.length) (PHOTO_TARGET==='bio'?readBio:readPhotos)(f); i.value=''; }); return i; };
 const cam=mk('camIn',true,false), lib=mk('libIn',false,true);
 document.addEventListener('click', e=>{ const b=e.target.closest('[data-photo]'); if(!b) return; e.preventDefault(); PHOTO_TARGET=b.dataset.target||'abg'; (b.dataset.photo==='cam'?cam:lib).click(); });
}
async function shrink(file){
 try{ const img = await createImageBitmap(file); const max=1800; const s=Math.min(1, max/Math.max(img.width,img.height));
  const c=document.createElement('canvas'); c.width=Math.round(img.width*s); c.height=Math.round(img.height*s); c.getContext('2d').drawImage(img,0,0,c.width,c.height);
  return await new Promise(r=>c.toBlob(r,'image/jpeg',0.85)); }catch(e){ return file; }
}
async function readPhotos(files){
 if(!files.length) return;
 PHOTO.thumbs.forEach(u=>{ try{URL.revokeObjectURL(u);}catch(e){} });
 PHOTO.thumbs = files.map(f=>{ try{ return URL.createObjectURL(f); }catch(e){ return ''; } }).filter(Boolean);
 const th=document.getElementById('thumbs'); if(th) th.innerHTML=PHOTO.thumbs.map(u=>`<img src="${u}" alt="photo">`).join('');
 photoMsg('✅ '+files.length+' photo(s) reçue(s).');
 if(!SAMPLE && window.claude && window.claude.use){ try{ SAMPLE = await window.claude.use('sample'); }catch(e){} }
 if(!SAMPLE) return readPhotosLocal(files);
 photoMsg('<span class="spin"></span> Lecture de '+files.length+' image(s) par Claude… (ne pas quitter la page)');
 try{
  const lim = SAMPLE.limits? await SAMPLE.limits() : {images:true};
  if(!lim || !lim.images) return readPhotosLocal(files);
  const blobs = await Promise.all(files.map(shrink));
  const drugList = window.DRUGS.map(d=>`${d.id}=${d.name}`).join('; ');
  const germList = window.GERMS.map(g=>`${g.id}=${g.name}`).join('; ');
  const prompt = `Tu es un assistant de microbiologie. Les images ci-jointes sont des photos d'un ou plusieurs antibiogrammes (ou antifongigrammes) de laboratoire français (CA-SFM/EUCAST). Transcris fidèlement CHAQUE isolat (une même photo peut contenir plusieurs germes).
Réponds UNIQUEMENT par un objet JSON valide de la forme :
{"isolates":[{"organism":"nom tel qu'écrit","germ_id":"id de la liste ou null","specimen":"prélèvement si indiqué","phenotype":{"mr":bool|null,"blse":bool|null,"ampc":bool|null,"carba":"KPC"|"OXA48"|"MBL"|"NT"|null},"results":[{"antibiotic":"nom tel qu'écrit","drug_id":"id de la liste ou null","sir":"S"|"SFP"|"R","mic":"valeur ou null"}],"comments":"commentaires du laboratoire"}]}
Règles : "I" ou "sensible à forte posologie/forte exposition" → "SFP". Oxacilline/céfoxitine R chez un staphylocoque → mr=true. Mentions BLSE, céphalosporinase hyperproduite, carbapénémase (KPC, OXA-48, NDM/VIM/IMP→MBL) → phenotype. "Gentamicine haut niveau" → drug_id "genta". C3G non précisée : utiliser "cefotax" pour céfotaxime et "ceftriax" pour ceftriaxone. N'invente aucune valeur absente ; si illisible, omets la ligne.
Liste des germes (id=nom) : ${germList}
Liste des molécules (id=nom) : ${drugList}`;
  let out;
  try{ out = await SAMPLE.json(prompt, {images:blobs, modelTier:'complex'}); }
  catch(e){ const r = await SAMPLE(prompt, {images:blobs, modelTier:'complex'}); const t=(r&&r.text)||''; out = JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}')+1)); }
  const n = addIsolates((out && out.isolates)||[], 'photo');
  PHOTO.msg = n? `✅ ${n} isolat(s) transcrit(s) par Claude — <b>vérifiez chaque ligne avant d'utiliser les propositions</b>.` : 'Aucun isolat reconnu : réessayer avec une photo plus nette (bien à plat, sans reflet) ou saisir manuellement.';
  saveAB(); render();
 }catch(e){
  if(e && e.code==='not_granted'){ photoMsg('Autorisation Claude refusée : lecture sur l\'appareil à la place…'); }
  return readPhotosLocal(files);
 }
}
function addIsolates(isos, src){
 let n=0;
 isos.forEach(x=>{
  const gid = (x.germ_id && G[x.germ_id])? x.germ_id : window.matchGerm(x.organism||'');
  const ast={}; (x.results||[]).forEach(r=>{ const id=(r.drug_id && D[r.drug_id])? r.drug_id : window.matchDrug(r.antibiotic||''); if(id && ['S','SFP','R','I'].includes(r.sir)) ast[id] = r.sir==='I'?'SFP':r.sir; });
  const ph = x.phenotype||{}; if(ast.cloxa && ph.mr==null) ph.mr = ast.cloxa==='R';
  if(!gid && !Object.keys(ast).length) return;
  AB.isolates.push({germ:gid||'', ast, ph:{mr:!!ph.mr, blse:!!ph.blse, ampc:!!ph.ampc, carba:ph.carba||null}, raw:(x.organism||'')+(x.specimen?' — '+x.specimen:'')+(x.comments?' — '+x.comments:''), src});
  n++;
 });
 return n;
}
const OCRTXT = s => s? `<details class="ocrtxt"><summary>Texte lu sur la photo</summary><pre>${esc(s.slice(0,6000))}</pre></details>` : '';
async function readPhotosLocal(files){
 if(!window.OCR){ photoMsg('Module de lecture absent : saisir manuellement.'); return; }
 photoMsg('<span class="spin"></span> Lecture sur le téléphone (la photo ne quitte pas l\'appareil)…');
 try{
  let text = await window.OCR.recognize(files, m=>photoMsg('<span class="spin"></span> '+esc(m)), '6');
  let r = window.OCR.parseABG(text);
  for(const [psm,rot] of [['4',0],['3',0],['6',90],['6',270],['11',0]]){ // mises en page atypiques / photo tournée : on garde la meilleure lecture
   if(r.nres>=4) break;
   const t2 = await window.OCR.recognize(files, m=>photoMsg('<span class="spin"></span> Nouvelle tentative (mise en page ou orientation différente)… '+esc(m)), psm, rot);
   const r2 = window.OCR.parseABG(t2); if(r2.nres>r.nres){ r=r2; text=t2; }
  }
  const n = addIsolates(r.isolates, 'ocr');
  const nres = r.isolates.reduce((a,x)=>a+x.results.length,0);
  PHOTO.msg = (n? `✅ Lecture sur l'appareil : ${n} isolat(s), ${nres} résultat(s) reconnu(s)${r.ambig?` — ${r.ambig} ligne(s) non attribuée(s)`:''}. <b>Vérifiez chaque ligne et complétez</b> (germe, phénotype, molécules manquantes).`
    : 'Lecture sur l\'appareil : aucun résultat reconnu. Photo bien à plat, nette, cadrée sur le tableau, sans reflet — ou saisie manuelle ci-dessous.')
    + (n && !nres ? ' <b>Germe reconnu mais aucun résultat S/R lu</b> : ouvrir « Texte lu sur la photo » pour voir ce que le téléphone a lu (format de compte rendu non prévu ?).' : '') + OCRTXT(text);
  saveAB(); render();
 }catch(e){ photoMsg('Échec de la lecture sur l\'appareil ('+esc(String((e&&e.message)||e))+'). Saisie manuelle ci-dessous.'); }
}


/* ---------- RISQUE BMR PAR PAYS ---------- */
let PAYSX = 'hosp';
const LVCLS = ['muted','lv1','lv2','lv3','lv4'];
const lvBadge = (n) => `<span class="lvb ${LVCLS[n||0]}">${esc(window.PAYS.LV[n||0])}</span>`;
const SITU = [['hosp','Hospitalisé ≥ 24 h dans ce pays (12 derniers mois)'],['rapat','Rapatriement sanitaire / transfert direct d\'un hôpital de ce pays'],['sejour','Voyage ou séjour < 3 mois, sans hospitalisation'],['resid','Réside dans ce pays, sans hospitalisation']];
function paysRegles(){
 return `<details class="sec" open><summary><span class="ico">📘</span>Règles générales — valables pour tous les pays et toutes les situations</summary><div class="secbody">
 <h4>1. Qui dépister à l'admission ? (HCSP 2019)</h4>
 <table><tr><th>Situation</th><th>Conduite</th></tr>
 <tr><td>Hospitalisation ≥ 24 h à l'étranger dans les 12 derniers mois</td><td><b>Dépistage BHRe systématique, quel que soit le pays</b> + chambre seule et précautions complémentaires contact jusqu'aux résultats.</td></tr>
 <tr><td>Rapatriement sanitaire / transfert direct</td><td>Idem, avec <b>précautions spécifiques BHRe d'emblée</b> (organisation selon l'EOH).</td></tr>
 <tr><td>Séjour ou résidence à l'étranger dans les 3 derniers mois, sans hospitalisation</td><td><b>Analyse de risque</b> : pays (voir la fiche du pays), durée, antibiotiques, soins ou diarrhée sur place → dépistage si risque.</td></tr>
 <tr><td>Antécédent de portage BHRe ; contact d'un porteur</td><td>Dépistage et précautions selon la procédure EOH.</td></tr></table>
 <h4>2. Comment ?</h4>
 <ul class="fl"><li>Écouvillon <b>rectal</b> : EPC + ERG (culture ± PCR rapide des carbapénémases et de vanA/vanB).</li><li>SARM : écouvillon nasal (± périnée, plaies) selon la politique locale.</li><li>A. baumannii et <i>C. auris</i> : pas dans le dépistage BHRe standard ; à demander avec l'EOH si le pays est à risque (sites cutanés, gorge, aspiration trachéale ; aisselles + aines pour <i>C. auris</i>).</li><li>Prévenir l'EOH dès l'entrée ; levée des précautions après un dépistage négatif selon la procédure locale.</li></ul>
 <h4>3. Antibiothérapie probabiliste (sepsis grave / choc après séjour ou hospitalisation à l'étranger)</h4>
 <table><tr><th>Bactérie suspectée</th><th>Option</th></tr>
 <tr><td>Entérobactérie BLSE</td><td>Carbapénème</td></tr>
 <tr><td>EPC OXA-48</td><td>Ceftazidime-avibactam</td></tr>
 <tr><td>EPC KPC</td><td>Ceftazidime-avibactam, méropénème-vaborbactam, imipénème-relebactam</td></tr>
 <tr><td>EPC à métallo-β-lactamase (NDM, VIM, IMP)</td><td>Ceftazidime-avibactam + aztréonam (ou aztréonam-avibactam), céfidérocol</td></tr>
 <tr><td>A. baumannii résistant aux carbapénèmes</td><td>Ampicilline-sulbactam forte dose (référence SPILF/ePOPI) ; si grave, associé à colistine, tigécycline ou méropénème (CMI < 8) ; céfidérocol en dernier recours</td></tr>
 <tr><td>SARM</td><td>Linézolide (poumon), daptomycine ou vancomycine (bactériémie)</td></tr>
 <tr><td>ERG</td><td>Linézolide, daptomycine 10–12 mg/kg</td></tr>
 <tr><td><i>C. auris</i></td><td>Échinocandine</td></tr></table>
 <ul class="fl"><li>Couverture des EPC probabiliste : <b>seulement en cas de choc</b> avec hospitalisation récente en pays à risque, avec l'infectiologue, en attendant le dépistage (PCR rapide).</li><li>Après un simple voyage en zone tropicale, environ la moitié des voyageurs acquièrent une entérobactérie BLSE (≈ 70 % au retour d'Asie), portage le plus souvent < 3 mois (VOYAG-R).</li><li>Désescalade dès les résultats du dépistage et des prélèvements.</li></ul>
 <p class="muted">Le HCSP ne publie volontairement pas de liste de pays. Les niveaux par pays de cette application sont indicatifs (ECDC/OMS 2023–2024, OMS GLASS, Santé publique France, littérature).</p>
 </div></details>`;
}
function viewPaysList(){
 const P=window.PAYS; const q=(window.__paysQ||'');
 const list = q? P.find(q) : P.list;
 return `<section class="card"><h2>🌍 BMR / BHRe et séjour à l'étranger</h2>
 ${paysRegles()}
 <h3>Préconisations par pays</h3>
 <div class="toolbar"><input type="search" id="paysq" placeholder="Pays (ex. Maroc, Inde, Grèce…)" value="${esc(q)}"></div>
 <div class="tiles" id="paystiles">${paysTiles(list)}</div>
 ${refChips(['hcsp_bhre19','ecdc_who_amr23','ecdc_atlas','who_glass','spf_epc16','spf_bhre22','ruppe15','ecdc_cauris'])}</section>`;
}
function paysTiles(list){ const P=window.PAYS; return list.map(c=>`<a class="tile" href="#c-${c.id}"><b>${esc(c.name)}</b><span>EPC ${esc(P.LV[c.c])} · BLSE ${esc(P.LV[c.b])} · A. baumannii ${esc(P.LV[c.a])}</span></a>`).join('')||'<span class="muted">Aucun pays trouvé.</span>'; }
function epcRegimen(ct){
 const t=(ct||'').toUpperCase();
 if(/NDM|VIM|IMP/.test(t)) return 'ceftazidime-avibactam + aztréonam (ou aztréonam-avibactam), ou céfidérocol : seules options actives sur les NDM/VIM, fréquentes ici'+(/OXA|KPC/.test(t)?', et actives aussi sur OXA-48/KPC':'');
 if(/KPC/.test(t)) return 'ceftazidime-avibactam (ou méropénème-vaborbactam, imipénème-relebactam)';
 if(/OXA/.test(t)) return 'ceftazidime-avibactam';
 return 'selon l\'enzyme (PCR rapide)';
}
function paysCAT(c){
 const x=PAYSX, dom=!!c.dom, hosp = x==='hosp'||x==='rapat';
 const D=[], PR=[], T=[]; // dépistage, précautions, traitement
 const G = '<span class="tagg">règle générale</span>', S = '<span class="tags">propre à ce pays</span>';
 if(dom){
  D.push(`Territoire français : pas de dépistage au titre de l'étranger ; politique de l'établissement${c.b>=3?' (BLSE fréquentes : dépistage BMR souvent pratiqué)':''}. ${S}`);
 } else if(hosp){
  D.push(`<b>OUI, dépistage BHRe systématique</b> (écouvillon rectal : EPC + ERG). ${G}`);
  if(c.a>=3) D.push(`<b>Ajouter la recherche d'A. baumannii</b> résistant aux carbapénèmes (cutané, gorge, aspiration trachéale) — risque ${lvBadge(c.a)} ici. ${S}`);
  if(c.k>=2) D.push(`<b>Ajouter le dépistage de <i>C. auris</i></b> (aisselles + aines) — circule dans ce pays. ${S}`);
  if(c.m>=3) D.push(`Dépistage SARM (nez) conseillé — risque ${lvBadge(c.m)} ici. ${S}`);
  PR.push(`<b>Chambre seule + précautions complémentaires contact dès l'entrée</b>, jusqu'aux résultats ; prévenir l'EOH. ${G}`);
  if(x==='rapat') PR.push(`Rapatriement / transfert direct : <b>précautions spécifiques BHRe d'emblée</b>. ${G}`);
 } else {
  if(c.c>=3) { D.push(`<b>Dépistage BHRe conseillé</b> (écouvillon rectal) : risque EPC ${lvBadge(c.c)} dans ce pays, a fortiori si antibiotiques, soins ou diarrhée sur place, ou séjour long. ${S}`); PR.push(`Précautions contact jusqu'au résultat, selon l'EOH. ${G}`); }
  else D.push(`<b>Pas de dépistage BHRe systématique</b> : risque EPC ${lvBadge(c.c)} dans ce pays ; à discuter seulement si antibiotiques ou soins sur place. ${S}`);
  if(c.b>=4) D.push(`Portage digestif de BLSE probable dans les 3 mois suivant le séjour (BLSE ${lvBadge(c.b)} ici). ${S}`);
  if(!PR.length) PR.push(`Précautions standard. ${G}`);
 }
 // traitement probabiliste individualisé
 if(c.b>=3) T.push(`<b>Couvrir les BLSE</b> (carbapénème) si sepsis grave ou choc — BLSE ${lvBadge(c.b)} ici. ${S}`);
 if(c.c>=3 && (hosp || x==='resid')) T.push(`<b>Si choc septique</b> : discuter avec l'infectiologue une couverture des EPC en attendant le dépistage — enzymes dominantes ici : <b>${esc(c.ct)}</b> → ${epcRegimen(c.ct)}. ${S}`);
 if(c.a>=4 && hosp) T.push(`Pneumonie / bactériémie nosocomiale chez un patient ventilé, brûlé ou blessé : penser à <b>A. baumannii</b> résistant aux carbapénèmes → ampicilline-sulbactam forte dose + colistine ou tigécycline (SPILF/ePOPI), avis spécialisé. <a href="#g-abaum">→ fiche</a> ${S}`);
 if(c.m>=3) T.push(`<b>Ajouter un anti-SARM</b> si pneumonie nécrosante ou bactériémie à cocci Gram + : linézolide (poumon), daptomycine/vancomycine (bactériémie). <a href="#g-saureus">→ fiche</a> ${S}`);
 if(c.v>=3 && hosp) T.push(`Infection grave à entérocoque : penser à l'<b>ERG</b> → linézolide ou daptomycine 10–12 mg/kg. <a href="#g-efaecium">→ fiche</a> ${S}`);
 if(c.k>=2 && hosp) T.push(`Candidémie : <b>échinocandine</b> (C. auris souvent résistant au fluconazole). <a href="#g-cauris">→ fiche</a> ${S}`);
 if(!T.length) T.push(`Pas de modification liée à ce pays : écologie locale et facteurs de risque individuels. ${S}`);
 return {D,PR,T};
}
function viewPays(id){
 const P=window.PAYS, c=P.byId(id); if(!c) return '<p>Pays introuvable.</p>';
 const ov=P.overall(c), {D,PR,T}=paysCAT(c);
 const row=(l,n,extra)=>`<tr><td>${l}${extra?`<br><span class="muted">${extra}</span>`:''}</td><td>${lvBadge(n)}</td></tr>`;
 const ul=a=>'<ul class="fl">'+a.map(x=>`<li>${x}</li>`).join('')+'</ul>';
 const sl=(SITU.find(s=>s[0]===PAYSX)||SITU[0])[1];
 return `<section class="card"><a href="#pays" class="muted">← Règles générales et autres pays</a>
 <h2>🌍 ${esc(c.name)} ${lvBadge(ov)}</h2>
 ${c.n?`<div class="dangerbox">${esc(c.n)}</div>`:''}${c.lim?'<div class="note">Données de surveillance limitées : niveaux estimés à partir de la région et des cas importés.</div>':''}
 <details class="sec"><summary><span class="ico">📊</span>Niveaux de résistance dans ce pays</summary><div class="secbody"><table><tr><th>Bactérie</th><th>Niveau</th></tr>
 ${row('Entérobactéries productrices de carbapénémases (EPC)',c.c,esc(c.ct||''))}
 ${row('Entérobactéries BLSE / C3G-R',c.b)}
 ${row('<i>A. baumannii</i> résistant aux carbapénèmes',c.a)}
 ${row('SARM',c.m)}
 ${row('<i>E. faecium</i> résistant aux glycopeptides (ERG)',c.v)}
 ${row('<i>Candida auris</i>',c.k,['','cas sporadiques','épidémies','transmission étendue'][c.k||0])}
 </table></div></details>
 <h3>1. Votre patient</h3>
 <div class="seg wrap">${SITU.map(([k,l])=>`<button class="${PAYSX===k?'on':''}" data-paysx="${k}">${l}</button>`).join('')}</div>
 <div class="okbox cat-pays"><b>2. Conduite à tenir — ${esc(c.name)}, ${esc(sl.toLowerCase())}</b>
 <h4>Dépistage</h4>${ul(D)}
 <h4>Précautions d'hygiène</h4>${ul(PR)}
 <h4>Antibiothérapie probabiliste (sepsis grave / choc)</h4>${ul(T)}
 <p class="muted" style="margin:6px 0 0">Désescalade dès les résultats du dépistage et des prélèvements. Avis EOH / infectiologue.</p></div>
 <p><a href="#pays">📘 Toutes les règles générales (tous pays, toutes situations) →</a></p>
 ${refChips(['hcsp_bhre19','ecdc_who_amr23','ecdc_atlas','who_glass','spf_epc16','ruppe15','ecdc_cauris'])}</section>`;
}


/* ---------- HYGIÈNE & SIGNALEMENT ---------- */
let MSOQ='';
function msoRows(q){
 const n=s=>(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/<[^>]+>/g,'');
 const L=window.HYG.mso.filter(r=>!q || n(r[0]+' '+r[3]).includes(n(q)));
 return L.map(([m,u,rea,act])=>`<div class="abprow${rea?' msorea':''}"><div class="abp-p">${m} ${u?'<span class="lvb lv4">intervention urgente</span>':'<span class="lvb muted">surveillance seule</span>'}${rea?' <span class="lvb lv2">fréquent en réa</span>':''}</div>${act?`<div class="abp-a">${act}</div>`:''}</div>`).join('') || '<p class="muted">Aucune maladie trouvée.</p>';
}
function viewHygiene(){
 const H=window.HYG;
 const tbl = `<table class="tbl stack"><tr><th>Micro-organisme / situation</th><th>Précautions</th><th>Levée / durée</th><th>Remarques</th></tr>${H.table.map(r=> r[1]===''? `<tr class="grprow"><td colspan="4">${r[0]}</td></tr>` : `<tr><td data-l="Micro-organisme">${r[0]}</td><td data-l="Précautions">${r[1]}</td><td data-l="Levée">${r[2]}</td><td data-l="Remarques">${r[3]||''}</td></tr>`).join('')}</table>`;
 return `<section class="card"><h2>🧼 Hygiène & signalement</h2>
 ${secs([
  {id:'h-iso', ico:'🚪', t:'Isolements : niveaux de précautions', html:H.niveaux, open:true},
  {id:'h-tab', ico:'📋', t:'Isolement selon le micro-organisme', raw:true, html:`<div class="tblwrap">${tbl}</div>`, open:true},
  {id:'h-bhre', ico:'🌍', t:'BMR / BHRe, dépistage et séjour à l\'étranger', raw:true, html:`<p>Règles générales (HCSP 2019 : dépistage BHRe de tout patient hospitalisé ≥ 24 h à l'étranger dans l'année, précautions jusqu'aux résultats) et préconisations par pays et par situation :</p><p><a class="btn" href="#pays">🌍 BMR/BHRe par pays</a> <a class="btn" href="#e-depistage">🧪 Dépistage BMR/BHRe</a></p>`},
  {id:'fdr', ico:'⚑', t:'Facteurs de risque de BMR / BHRe (et autres germes à couvrir)', raw:true, html:`<p class="muted small">Les mêmes listes s\'affichent en touchant SARM, BLSE, P. aeruginosa, BHRe ou candidose (repérés par ⚑) dans les fiches.</p>${['bhre','blse','sarm','pyo','candida'].map(k=>fdrHTML(k,false)+((window.FDR[k]||{}).germ?`<p class="small"><a href="#g-${window.FDR[k].germ}">Fiche germe →</a></p>`:'')).join('')}`, open:true},
  {id:'h-mso', ico:'📣', t:'Maladies à signalement obligatoire (MSO, ex-MDO)', raw:true, html:`<div class="narbox">${fmtText(H.msoHow)}</div><div class="toolbar"><input type="search" id="msoq" placeholder="Filtrer (ex. méningocoque, légionellose…)" value="${esc(MSOQ)}"></div><div id="msolist">${msoRows(MSOQ)}</div>`, open:true},
  {id:'h-ias', ico:'🏥', t:'Signalement des infections associées aux soins (e-SIN), cas groupés, AES', html:H.ias}
 ])}
 <h3>Références</h3>${refList(['sf2h_ps17','sf2h_pcc09','sf2h_resp24','sf2h_resp_faq25','hcsp_bhre19','nar25','spf_mso26','ars_na_mdo','dgs_iim18','corruss_iim25','spilf_recos','sfar_pavm17','spilf_pac25','has_carba19'])}</section>`;
}
/* ---------- VACCINS ---------- */
function viewVaccins(){
 return `<section class="card"><h2>💉 Vaccins utiles en réanimation</h2>
 <p class="muted">Situations fréquentes en (neuro)réanimation. Vérifier les antécédents vaccinaux (carnet, Mon espace santé) et le calendrier en vigueur ; les vaccins inertes ne sont pas contre-indiqués par l'hospitalisation en réanimation.</p>
 ${secs(window.VAC.map(v=>({id:v.id, ico:v.ico, t:v.t, html:v.html, raw:true, open:!!v.open})))}
 <h3>Références</h3>${refList(['calvac26','hcsp_immuno14','has_vih25','sfar_abp24','corruss_iim25'])}</section>`;
}

/* ---------- recherche globale ---------- */
function searchAll(q){
 q = q.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); if(q.length<2) return '';
 const m = s => (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').includes(q);
 const r=[];
 const KW=[['isolement precautions contact gouttelettes air respiratoire ffp2 masque hygiene eoh','#hygiene','🧼 Hygiène : isolements et précautions'],
  ['mdo mso declaration signalement obligatoire ars point focal cerfa','#hygiene','📣 Maladies à signalement obligatoire (MSO/MDO) — ARS Nouvelle-Aquitaine'],
  ['esin e-sin ias cas groupes aes accident exposition','#hygiene','🏥 Signalement des IAS (e-SIN), AES'],
  ['cloxacilline céfazoline cefazoline cloceba snap néphrotoxicité sams','#pharmaco-tox:cfzclox','⚖️ Cloxacilline vs céfazoline (CloCeBa, SNAP)'],
  ['antitoxinique antitoxine toxine pvl choc toxique clindamycine','#pharmaco-atx','🧪 Antibiothérapie antitoxinique (Pharmaco)'],
  ['encephalopathie neurotoxicite toxicite convulsion myoclonie cefepime surveillance','#pharmaco-tox','⚠️ Toxicités & surveillance des anti-infectieux (Pharmaco)'],
  ['pkpd pharmacocinetique stp dosage cible cmi','#pharmaco','📈 PK/PD & STP (Pharmaco)'],
  ['vaccin vaccination splenectomie asplenie breche implant cochleaire tetanos rage zona shingrix prevenar pneumocoque meningocoque eculizumab ravulizumab anti-complement','#vaccins','💉 Vaccins utiles en réanimation']];
 const nq=q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 KW.forEach(([k,h,l])=>{ if(nq.length>=3 && k.split(' ').some(w=>w.startsWith(nq)||nq.startsWith(w)&&w.length>=4)) r.push(`<a href="${h}">${l}</a>`); });
 if(window.PAYS) window.PAYS.find(q).slice(0,4).forEach(c=>r.push(`<a href="#c-${c.id}">🌍 <b>${esc(c.name)}</b> — risque BMR/BHRe : ${esc(window.PAYS.LV[window.PAYS.overall(c)])}${c.c>=3?' (EPC '+esc(c.ct)+')':''}</a>`));
 window.DRUGS.forEach(d=>{ if(m(d.name)||m(d.cls)||(d.alias||[]).some(m)) r.push(`<a href="#m-${d.id}">💊 ${esc(d.name)}</a>`); });
 window.GERMS.forEach(g=>{ if(m(g.name)||(g.alias||[]).some(m)) r.push(`<a href="#g-${g.id}">🦠 ${esc(g.name)}</a>`); });
 window.PATHO.forEach(p=>{ if(m(p.name)||m(p.cat)) r.push(`<a href="#p-${p.id}">🩺 ${esc(p.name)}</a>`); });
 window.EXAMS.forEach(e=>{ if(m(e.name)) r.push(`<a href="#e-${e.id}">🔬 ${esc(e.name)}</a>`); });
 (window.ABP?window.ABP.specs:[]).forEach(s=>s.rows.forEach(x=>{ if(m(x.p.replace(/<[^>]+>/g,''))) r.push(`<a href="#antibioprophylaxie">🛡 ABP — ${esc(x.p.replace(/<[^>]+>/g,''))}</a>`); }));
 const GLMAP={CRAB:'g-abaum',ABRI:'g-abaum',ABRC:'g-abaum',SARM:'g-saureus',MRSA:'g-saureus',SAMS:'g-saureus',ERV:'g-efaecium',ERG:'g-efaecium',VRE:'g-efaecium',EPC:'g-kpneu',CPE:'g-kpneu',KPC:'g-kpneu',NDM:'g-kpneu',MBL:'g-kpneu','OXA-48':'g-kpneu',BHRe:'pays',BMR:'pays',DTR:'g-paeru','DTR-PA':'g-paeru',CRE:'g-kpneu',PARC:'g-paeru',ICD:'g-cdiff',PCP:'g-pcp',PVL:'g-saureus'};
 Object.keys(GL).forEach(k=>{ if(m(k)||m(GL[k])){ const t=GLMAP[k]; r.push(t? `<a href="#${t}">🦠 <b>${esc(k)}</b> — ${esc(GL[k])} → fiche</a>` : `<a href="#references">🔤 <b>${esc(k)}</b> — ${esc(GL[k])}</a>`); } });
 return r.slice(0,16).join('') || '<span class="muted">Aucun résultat</span>';
}

/* ---------- routage ---------- */
const TABS = [['antibiogramme','Antibiogramme'],['molecules','Anti-infectieux'],['pharmaco','Pharmaco'],['germes','Germes'],['pathologies','Pathologies'],['examens','Examens'],['bio','Résultats bio 📷'],['antibioprophylaxie','Antibioprophylaxie'],['hygiene','Hygiène & signalement'],['vaccins','Vaccins'],['patient','Patient'],['references','Références']];
function route(){ return (location.hash||'#antibiogramme').slice(1); }
function render(){
 let r = route(); const main=$('#main'); let anchor=''; if(r.includes(':')){ [r,anchor]=r.split(':'); }
 if(r==='pkpd') r='pharmaco'; if(r==='p-antitox') r='pharmaco-atx';
 let html='', tab=r;
 if(r.startsWith('m-')){ html=viewMolecule(r.slice(2)); tab='molecules'; }
 else if(r.startsWith('g-')){ html=viewGerm(r.slice(2)); tab='germes'; }
 else if(r.startsWith('p-')){ html=viewPatho(r.slice(2)); tab='pathologies'; }
 else if(r.startsWith('e-')){ html=viewExam(r.slice(2)); tab='examens'; }
 else if(r.startsWith('c-')){ html=viewPays(r.slice(2)); tab='hygiene'; }
 else if(r==='pays'){ html=viewPaysList(); tab='hygiene'; }
 else if(r==='hygiene'){ html=viewHygiene(); }
 else if(r==='vaccins'){ html=viewVaccins(); }
 else if(r==='pharmaco'){ html=viewPKPD(); }
 else if(r==='pharmaco-tox'){ html=viewTox(); tab='pharmaco'; }
 else if(r==='pharmaco-atx'){ html=viewATX(); tab='pharmaco'; }
 else html = ({antibiogramme:viewABG, molecules:viewMolecules, pkpd:viewPKPD, germes:viewGerms, pathologies:viewPathos, examens:viewExams, antibioprophylaxie:viewABP, bio:viewBIO, patient:viewPatient, references:viewRefs}[r]||viewABG)();
 $$('#tabs a').forEach(a=>a.classList.toggle('on', a.getAttribute('href')==='#'+tab));
 main.innerHTML = html; { const gp=$('#gpop'); if(gp) gp.hidden=true; }
 main.querySelectorAll('table').forEach(t=>{
   if(!t.parentElement.classList.contains('tblwrap')){ const w=document.createElement('div'); w.className='tblwrap'; t.parentNode.insertBefore(w,t); w.appendChild(t); }
   const rows=[...t.rows]; if(!rows.length) return; const head=[...rows[0].cells];
   if(head.length>=3 && head.every(c=>c.tagName==='TH')){ t.classList.add('stack'); rows.slice(1).forEach(r=>[...r.cells].forEach((c,i)=>{ if(i>0 && head[i]) c.setAttribute('data-label', head[i].textContent.trim()); })); }
 });
 linkRecos(main); annotate(main);
 bindPatient(main); bindABG(main); bindABP(main); bindBIO(main);
 $$('[data-molt]',main).forEach(b=>b.onclick=()=>{ molFilter.type=b.dataset.molt; render(); });
 $$('[data-paysx]',main).forEach(b=>b.onclick=()=>{ PAYSX=b.dataset.paysx; render(); });
 { const mq=$('#msoq'); if(mq) mq.oninput=()=>{ MSOQ=mq.value; const l=$('#msolist'); if(l) l.innerHTML=msoRows(MSOQ); }; }
 { const pq=$('#paysq'); if(pq) pq.oninput=()=>{ window.__paysQ=pq.value; const t=$('#paystiles'); if(t) t.innerHTML=paysTiles(pq.value? window.PAYS.find(pq.value) : window.PAYS.list); }; }
 const mq=$('#molq',main); if(mq){ mq.oninput=()=>{ molFilter.q=mq.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); const pos=mq.selectionStart; render(); const n=$('#molq'); n.focus(); n.setSelectionRange(pos,pos); }; }
 const gq=$('#germq',main); if(gq){ gq.oninput=()=>{ germQ=gq.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); const pos=gq.selectionStart; render(); const n=$('#germq'); n.focus(); n.setSelectionRange(pos,pos); }; }
 $$('[data-newiso]',main).forEach(b=>b.onclick=()=>{ AB.isolates.push({germ:b.dataset.newiso, ast:{}, ph:{}}); saveAB(); location.hash='#antibiogramme'; });
 $$('[data-site]',main).forEach(b=>b.onclick=()=>{ const s=b.dataset.site; if(!AB.sites.includes(s)) AB.sites.push(s); saveAB(); location.hash='#antibiogramme'; });
 renderPatientChip();
 if(anchor){ const el=document.getElementById(anchor); if(el){ if(el.tagName==='DETAILS') el.open=true; setTimeout(()=>el.scrollIntoView({block:'start'}),30); } }
}
function init(){
 $('#tabs').innerHTML = TABS.map(([k,l])=>`<a href="#${k}">${l}</a>`).join('');
 const q=$('#q'), res=$('#qres');
 q.oninput=()=>{ res.innerHTML=searchAll(q.value); res.hidden=!q.value; };
 res.onclick=()=>{ res.hidden=true; q.value=''; };
 q.onkeydown=e=>{ if(e.key==='Enter'){ const a=res.querySelector('a'); if(a){ e.preventDefault(); location.hash=a.getAttribute('href'); res.hidden=true; q.value=''; q.blur(); } } };
 document.addEventListener('click',e=>{ if(!e.target.closest('.search')) res.hidden=true; });
 $('#patchip').onclick=()=>location.hash='#patient';
 document.addEventListener('click', gpop);
 window.addEventListener('hashchange', ()=>{ render(); window.scrollTo(0,0); });
 render();
 setupPhotoInputs();
 checkUpdate();
 try{ if(window.claude && window.claude.use){ window.claude.use('sample').then(s=>{ SAMPLE=s; if(s && s.limits) s.limits().then(l=>{sampleImages=!!(l&&l.images);}).catch(()=>{}); if(route()==='antibiogramme') keepScroll(render); }).catch(()=>{}); } }catch(e){}
}
document.addEventListener('DOMContentLoaded', init);
})();
