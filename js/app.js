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
const GKEYS = Object.keys(GL).filter(k=>k.length>=2 && !NOANN.has(k)).sort((a,b)=>b.length-a.length);
const GSRC = ('(^|[^A-Za-zÀ-ÿ0-9\\-])(' + GKEYS.map(k=>k.replace(/[.*+?^${}()|[\]\\\/]/g,'\\$&')).join('|') + ')(?![A-Za-zÀ-ÿ0-9])');
const GRE = new RegExp(GSRC,'g'), GRE1 = new RegExp(GSRC);
function annotate(root){
 const skip = new Set(['SCRIPT','STYLE','INPUT','SELECT','OPTION','TEXTAREA','BUTTON','ABBR','SUMMARY']);
 const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode(n){ let p=n.parentNode; while(p && p!==root){ if(skip.has(p.nodeName)|| (p.classList&&p.classList.contains('noabbr'))) return NodeFilter.FILTER_REJECT; p=p.parentNode; } return GRE1.test(n.nodeValue)? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; }});
 const nodes=[]; let n; while((n=walker.nextNode())) nodes.push(n);
 nodes.forEach(t=>{ GRE.lastIndex=0; const frag=document.createDocumentFragment(); let last=0, m; const v=t.nodeValue;
   while((m=GRE.exec(v))){ const start=m.index+m[1].length; frag.append(v.slice(last,start)); const a=document.createElement('abbr'); a.textContent=m[2]; a.title=GL[m[2]]; a.dataset.g=m[2]; frag.append(a); last=start+m[2].length; }
   frag.append(v.slice(last)); t.parentNode.replaceChild(frag,t); });
}
function gpop(e){ const a=e.target.closest('abbr[data-g]'); const pop=$('#gpop'); if(!a){ if(!e.target.closest('#gpop')) pop.hidden=true; return; } e.preventDefault(); pop.innerHTML=`<b>${esc(a.dataset.g)}</b> : ${esc(GL[a.dataset.g])}`; pop.hidden=false; }

/* ---------- références ---------- */
function refChips(ids){ if(!ids||!ids.length) return ''; return '<div class="refs">'+ids.filter(i=>R[i]).map(i=>`<a class="ref ${R[i].lvl}" href="${esc(R[i].u)}" target="_blank" rel="noopener" title="${esc(R[i].t)}">${esc(R[i].s.split(' — ')[0].replace(/\s*\(.*?\)/g,'').slice(0,34))}</a>`).join('')+'</div>'; }
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
function doseBlock(d, regKey, extras=true){
 const b = band(P);
 const ob = window.OBESE[d.id]; const W=weights(P);
 const reg = (d.dose && (d.dose[regKey]||d.dose.std)) || '';
 const calcLine = window.calcDose(d.id, regKey, P);
 let html = `<div class="dose"><div><span class="tag ${regKey==='std'&&d.dose.high?'tstd':''}">${regKey==='snc'?'Dose méningée / SNC':regKey==='high'?'Posologie de départ en réanimation (forte posologie)':(d.dose.high?'Posologie standard — désescalade possible (souche S, patient stabilisé, hors SNC)':'Posologie')}</span> ${esc(reg)}</div>`;
 if(calcLine) html += `<div class="calc">🧮 ${esc(calcLine)}</div>`;
 if(b && d.renal && d.renal[b]) html += `<div><span class="tag t2">${esc(BAND_L[b])}</span> ${esc(d.renal[b])}</div>`;
 else if(!b) html += `<div class="muted">Renseigner la fonction rénale / l'EER dans l'onglet Patient pour l'adaptation.</div>`;
 if(P.eer==='crrt' && +P.effluent>35) html += `<div class="warn">Dose d'effluent > 35 mL/kg/h : viser le haut de fourchette, STP.</div>`;
 if(W.obese && ob) html += `<div><span class="tag t3">Obésité (IMC ${W.bmi})</span> ${esc(ob.t)}</div>`;
 if(extras && d.admin) html += `<div class="admin"><b>Administration</b> : ${esc(d.admin.dil)} · ${esc(d.admin.duree)} · stabilité ${d.admin.stab}</div>`;
 if(extras && d.tdm && d.tdm!=='—') html += `<div class="admin"><b>STP</b> : ${esc(d.tdm)} <a href="#pkpd">→ cibles PK/PD & prélèvements</a></div>`;
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
  ${Object.entries(groups).map(([cls,ds])=>`<h3 class="grp">${esc(cls)}</h3><div class="tiles">${ds.map(d=>`<a class="tile" href="#m-${d.id}"><b>${esc(d.name)}</b><span>${(()=>{const t=(d.dose&&(d.dose.high||d.dose.std))||''; return esc(t.slice(0,90))+(t.length>90?'…':'');})()}</span></a>`).join('')}</div>`).join('') || '<p class="muted">Aucun résultat.</p>'}
 </section>`;
}
function viewMolecule(id){
 const d=D[id]; if(!d) return '<p>Introuvable.</p>';
 const regs = ['high','snc','std'].filter(k=>(d.dose||{})[k]);
 const siteTxt = d.site? Object.entries(d.site).map(([k,v])=>`<span class="pill ${v}">${esc((window.SITES.find(s=>s.id===k)||{l:k}).l)}</span>`).join(' '):'';
 return `<section class="card"><a class="back" href="#molecules">← Anti-infectieux</a>
 <h2>${esc(d.name)} <small class="muted">${esc(d.cls)}</small></h2>
 <div class="patbox"><h3>Pour le patient actuel <small class="muted">(${patientSummary()})</small></h3>
  ${regs.map(k=>doseBlock(d,k,false)).join('')}
  <div class="admin"><b>Administration</b> : ${esc(d.admin.dil)} · ${esc(d.admin.duree)} · stabilité ${d.admin.stab}</div>
  ${d.tdm&&d.tdm!=='—'?`<div class="admin"><b>STP</b> : ${esc(d.tdm)} <a href="#pkpd">→ cibles PK/PD & prélèvements</a></div>`:''}
  ${d.dose&&d.dose.po?`<div class="dose"><span class="tag">Voie orale</span> ${esc(d.dose.po)}</div>`:''}
  ${d.dose&&d.dose.other?`<div class="dose">${esc(d.dose.other)}</div>`:''}
 </div>
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
  <dt>Adaptation rénale / EER</dt><dd><table class="tbl">${Object.entries(d.renal).map(([k,v])=>`<tr class="${band(P)===k?'cur':''}"><th>${esc(BAND_L[k])}</th><td>${esc(v)}</td></tr>`).join('')}</table></dd>
  <dt>Obésité</dt><dd>${esc((window.OBESE[d.id]||{}).t||'—')} ${window.OBESE[d.id]?`<span class="muted">(poids de dosage : ${({TBW:'poids total',ABW:'poids ajusté',IBW:'poids idéal',fixed:'dose fixe'})[window.OBESE[d.id].wt]})</span>`:''}</dd>
  <dt>STP</dt><dd>${esc(d.tdm)}</dd>
  <dt>Diffusion LCS</dt><dd>${esc(d.lcr)}</dd>
  <dt>Sites (moteur)</dt><dd>${siteTxt}</dd>
 </dl>
 <h3>Références</h3>${refList([...d.refs, ...(window.OBESE[d.id]?['abxbmi','martson25']:[])])}
 </section>`;
}

/* ---------- GERMES ---------- */
let germQ='';
function viewGerms(){
 const list = window.GERMS.filter(g=>!germQ || (g.name+' '+g.cat+' '+(g.alias||[]).join(' ')).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').includes(germQ));
 const groups={}; list.forEach(g=>{(groups[g.cat]=groups[g.cat]||[]).push(g);});
 return `<section class="card"><div class="toolbar"><input type="search" id="germq" placeholder="Filtrer les germes…" value="${esc(germQ)}"></div>
 ${Object.entries(groups).map(([c,gs])=>`<h3 class="grp">${esc(c)}</h3><div class="tiles">${gs.map(g=>`<a class="tile" href="#g-${g.id}"><b>${esc(g.name)}</b><span>${esc(g.epi).slice(0,100)}…</span></a>`).join('')}</div>`).join('')}</section>`;
}
function viewGerm(id){
 const g=G[id]; if(!g) return '<p>Introuvable.</p>';
 return `<section class="card"><a class="back" href="#germes">← Germes</a><h2>${esc(g.name)} <small class="muted">${esc(g.cat)}</small></h2>
 <dl class="fiche"><dt>Épidémiologie</dt><dd>${g.epi}</dd><dt>Résistances naturelles</dt><dd>${g.nat}</dd><dt>Mécanismes de résistance acquise</dt><dd>${g.mech}</dd><dt>Traitement</dt><dd>${g.ttt}</dd><dt>À savoir</dt><dd>${g.tips}</dd>
 ${g.ast&&g.ast.length?`<dt>Molécules liées</dt><dd>${g.ast.map(a=>D[a]?`<a class="pill ok" href="#m-${a}">${esc(D[a].name)}</a>`:'').join(' ')}</dd>`:''}</dl>
 <p><button class="btn" data-newiso="${g.id}">➕ Utiliser ce germe dans l'antibiogramme</button></p>
 <h3>Références</h3>${refList(g.refs)}</section>`;
}

/* ---------- PATHOLOGIES ---------- */
function viewPathos(){
 const groups={}; window.PATHO.forEach(p=>{(groups[p.cat]=groups[p.cat]||[]).push(p);});
 return `<section class="card">${Object.entries(groups).map(([c,ps])=>`<h3 class="grp">${esc(c)}</h3><div class="tiles">${ps.map(p=>`<a class="tile" href="#p-${p.id}"><b>${esc(p.name)}</b><span>${esc(p.duree).replace(/<[^>]+>/g,'').slice(0,90)}</span></a>`).join('')}</div>`).join('')}</section>`;
}
function viewPatho(id){
 const p=window.PATHO.find(x=>x.id===id); if(!p) return '<p>Introuvable.</p>';
 return `<section class="card"><a class="back" href="#pathologies">← Pathologies</a><h2>${esc(p.name)}</h2>
 ${p.div && p.div!=='—'?`<div class="diverg"><b>⚖ Concordance / divergences entre recommandations</b><br>${p.div}</div>`:''}
 <dl class="fiche"><dt>Épidémiologie / germes</dt><dd>${p.epi}</dd><dt>Sémiologie / définitions</dt><dd>${p.semio}</dd><dt>Examens</dt><dd>${p.diag}</dd><dt>Traitement probabiliste</dt><dd>${p.proba}</dd><dt>Traitement documenté</dt><dd>${p.doc}</dd><dt>Durée</dt><dd>${p.duree}</dd></dl>
 <p><button class="btn" data-site="${p.site}">➕ Sélectionner ce site dans l'antibiogramme</button></p>
 <h3>Références</h3>${refList(p.refs)}</section>`;
}

/* ---------- EXAMENS ---------- */
function viewExams(){
 const groups={}; window.EXAMS.forEach(e=>{(groups[e.cat]=groups[e.cat]||[]).push(e);});
 return `<section class="card">${Object.entries(groups).map(([c,es])=>`<h3 class="grp">${esc(c)}</h3><div class="tiles">${es.map(e=>`<a class="tile" href="#e-${e.id}"><b>${esc(e.name)}</b><span>${esc(e.princ).slice(0,90)}…</span></a>`).join('')}</div>`).join('')}</section>`;
}
function viewExam(id){
 const e=window.EXAMS.find(x=>x.id===id); if(!e) return '<p>Introuvable.</p>';
 return `<section class="card"><a class="back" href="#examens">← Examens</a><h2>${esc(e.name)}</h2>
 <dl class="fiche"><dt>Principe</dt><dd>${e.princ}</dd><dt>Performances (Se, Sp, VPP, VPN, seuils)</dt><dd>${e.perf}</dd><dt>Faux positifs</dt><dd>${e.fp}</dd><dt>Faux négatifs</dt><dd>${e.fn}</dd><dt>Utilisation pratique</dt><dd>${e.usage}</dd></dl>
 <h3>Références</h3>${refList(e.refs)}</section>`;
}

/* ---------- PK/PD & STP ---------- */
function viewPKPD(){
 const row=(a)=>`<tr>${a.map(x=>`<td>${x}</td>`).join('')}</tr>`;
 return `<section class="card"><h2>Principes PK/PD et suivi thérapeutique pharmacologique (STP) en réanimation</h2>
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
  <li><b>Perfusion prolongée (3–4 h) ou continue</b> des β-lactamines (après dose de charge en 30 min) : recommandée chez les patients les plus graves, en cas de CMI élevée et d'infection respiratoire basse (SFAR/SFPT 2019) ; vérifier la stabilité de chaque molécule (SPILF 2025 : méropénème ≤ 8 h, amoxicilline ≤ 12 h en NaCl, imipénème et amox-clav non adaptés).</li>
  <li><b>Aminosides</b> : dose unique journalière en 30 min.</li>
  <li><b>Vancomycine</b> : continu après dose de charge (atteinte plus rapide des cibles, moins de néphrotoxicité).</li>
 </ul>

 <h3>6. Quand demander un STP ?</h3>
 <p>Hyperclairance, EER/ECMO, obésité, CMI élevée ou BGN non fermentant, infection du SNC/endocardite/os, échec clinique, toxicité suspectée (neurologique : céfépime, pipéracilline, méropénème, imipénème), molécule à marge étroite (aminosides, vancomycine, linézolide, voriconazole).</p>
 ${refChips(['sfar_bl2019','doses25','spilf_perf25','ansm_amino11','vanco20','colis19','goutelle23','abxbmi'])}
 </section>`;
}
/* ---------- RÉFÉRENCES ---------- */
function viewRefs(){
 const by={FR:[],EU:[],US:[]}; Object.entries(R).forEach(([k,r])=>by[r.lvl].push([k,r]));
 const sec=(t,a)=>`<h3 class="grp">${t}</h3><ol class="reflist">${a.map(([k,r])=>`<li><a href="${esc(r.u)}" target="_blank" rel="noopener">${esc(r.t)}</a> — <span class="muted">${esc(r.s)}</span></li>`).join('')}</ol>`;
 return `<section class="card"><h2>Références</h2>
 <div class="note">Hiérarchie appliquée : recommandations françaises en priorité (en cas de divergence, <b>SFAR/SRLF privilégiée</b> et divergence signalée), puis européennes, puis américaines. ePOPI (CMIT) et GPR servent de référentiels thérapeutiques complémentaires (abonnement). Posologies de base : annexe SPILF/SFPT/CA-SFM 2025 ; adaptation rénale : RCP/GPR ; obésité : abxbmi.</div>
 ${sec('Françaises',by.FR)}${sec('Européennes / internationales',by.EU)}${sec('Américaines',by.US)}</section>
 <section class="card noabbr" id="glossaire"><h2>Glossaire des acronymes</h2><p class="muted small">Dans toute l'application, les acronymes soulignés en pointillés affichent leur signification au survol ou au toucher.</p><dl class="gloss">${Object.keys(GL).sort((a,b)=>a.localeCompare(b,'fr',{sensitivity:'base'})).map(k=>`<dt>${esc(k)}</dt><dd>${esc(GL[k])}</dd>`).join('')}</dl></section>`;
}

/* ---------- ANTIBIOGRAMME ---------- */
let SAMPLE = null, sampleImages=false;
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
 <div class="photo ${SAMPLE?'':'off'}">
   <label class="btn primary">📷 Photographier / importer un ou plusieurs antibiogrammes<input type="file" id="photo" accept="image/*" capture="environment" multiple hidden></label>
   <span class="warn small">🔒 Cadrer uniquement le tableau de l'antibiogramme : aucun nom, IPP ni date de naissance sur la photo.</span><span id="photomsg" class="muted">${SAMPLE? 'Lecture automatique par Claude — vérifiez toujours la transcription.' : 'Lecture photo disponible lorsque l\'application est ouverte dans Claude (autorisation demandée au 1er usage). Saisie manuelle ci-dessous.'}</span>
 </div>
 <div id="isos">${AB.isolates.map((iso,i)=>`<div class="iso"><div class="isohead"><b>Isolat ${i+1}</b>${iso.src?` <span class="muted small">${esc(iso.src)}</span>`:''}<select data-germ="${i}">${germOptions(iso.germ)}</select><button class="x" data-del="${i}" title="Supprimer">✕</button></div>${iso.raw?`<div class="muted small">Lu sur la photo : « ${esc(iso.raw)} »</div>`:''}${phenoUI(iso,i)}${astGrid(iso,i)}</div>`).join('')}</div>
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
  html += `<div class="isores comb"><h4>Infection pluri-microbienne — couverture de tous les isolats</h4>`;
  if(comb.common.length) html += '<ol>'+comb.common.slice(0,4).map(c=>`<li><b>${esc(c.k.split('+').map(x=>D[x].name).join(' + '))}</b> — active sur tous les isolats</li>`).join('')+'</ol>';
  else html += `<p>Aucune molécule unique ne couvre tous les isolats : associer les 1res options — <b>${esc(comb.tops.map(o=>o.c.d.map(x=>D[x].name).join(' + ')).filter((v,i,a)=>a.indexOf(v)===i).join(' ⊕ '))}</b> (vérifier redondances et interactions).</p>`;
  html += '</div>';
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
 const ph=$('#photo',root); if(ph) ph.onchange=()=>readPhotos([...ph.files]);
}
function keepScroll(fn){ const y=window.scrollY; fn(); window.scrollTo(0,y); }

/* ---------- lecture photo via Claude ---------- */
async function shrink(file){
 try{ const img = await createImageBitmap(file); const max=1800; const s=Math.min(1, max/Math.max(img.width,img.height));
  const c=document.createElement('canvas'); c.width=Math.round(img.width*s); c.height=Math.round(img.height*s); c.getContext('2d').drawImage(img,0,0,c.width,c.height);
  return await new Promise(r=>c.toBlob(r,'image/jpeg',0.85)); }catch(e){ return file; }
}
async function readPhotos(files){
 const msg=$('#photomsg'); if(!files.length) return;
 if(!SAMPLE){ msg.textContent='Lecture photo indisponible ici : saisir manuellement.'; return; }
 msg.innerHTML='<span class="spin"></span> Lecture de '+files.length+' image(s) par Claude…';
 try{
  const lim = SAMPLE.limits? await SAMPLE.limits() : {images:true};
  if(!lim || !lim.images){ msg.textContent='Les images ne sont pas disponibles pour cette page.'; return; }
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
  const isos = (out && out.isolates)||[];
  let n=0;
  isos.forEach(x=>{
   const gid = (x.germ_id && G[x.germ_id])? x.germ_id : window.matchGerm(x.organism||'');
   const ast={}; (x.results||[]).forEach(r=>{ const id=(r.drug_id && D[r.drug_id])? r.drug_id : window.matchDrug(r.antibiotic||''); if(id && ['S','SFP','R','I'].includes(r.sir)) ast[id] = r.sir==='I'?'SFP':r.sir; });
   const ph = x.phenotype||{}; if(ast.cloxa && ph.mr==null) ph.mr = ast.cloxa==='R';
   AB.isolates.push({germ:gid||'', ast, ph:{mr:!!ph.mr, blse:!!ph.blse, ampc:!!ph.ampc, carba:ph.carba||null}, raw:(x.organism||'')+(x.specimen?' — '+x.specimen:'')+(x.comments?' — '+x.comments:''), src:'photo'});
   n++;
  });
  saveAB(); render();
  const m2=$('#photomsg'); if(m2) m2.innerHTML = n? `✅ ${n} isolat(s) transcrit(s) — <b>vérifiez chaque ligne avant d'utiliser les propositions</b>.` : 'Aucun isolat reconnu : réessayer avec une photo plus nette ou saisir manuellement.';
 }catch(e){
  const m2=$('#photomsg'); if(m2) m2.textContent = e && e.code==='not_granted' ? 'Autorisation refusée : saisie manuelle.' : e && e.code==='rate_limited' ? 'Trop de requêtes : réessayer dans un instant.' : 'Échec de la lecture : saisir manuellement ('+((e&&e.message)||e)+').';
 }
}

/* ---------- recherche globale ---------- */
function searchAll(q){
 q = q.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); if(q.length<2) return '';
 const m = s => (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').includes(q);
 const r=[];
 window.DRUGS.forEach(d=>{ if(m(d.name)||m(d.cls)||(d.alias||[]).some(m)) r.push(`<a href="#m-${d.id}">💊 ${esc(d.name)}</a>`); });
 window.GERMS.forEach(g=>{ if(m(g.name)||(g.alias||[]).some(m)) r.push(`<a href="#g-${g.id}">🦠 ${esc(g.name)}</a>`); });
 window.PATHO.forEach(p=>{ if(m(p.name)||m(p.cat)) r.push(`<a href="#p-${p.id}">🩺 ${esc(p.name)}</a>`); });
 window.EXAMS.forEach(e=>{ if(m(e.name)) r.push(`<a href="#e-${e.id}">🔬 ${esc(e.name)}</a>`); });
 Object.keys(GL).forEach(k=>{ if(m(k)||m(GL[k])) r.push(`<a href="#references">🔤 <b>${esc(k)}</b> — ${esc(GL[k])}</a>`); });
 return r.slice(0,16).join('') || '<span class="muted">Aucun résultat</span>';
}

/* ---------- routage ---------- */
const TABS = [['antibiogramme','Antibiogramme'],['molecules','Anti-infectieux'],['pkpd','PK/PD & STP'],['germes','Germes'],['pathologies','Pathologies'],['examens','Examens'],['patient','Patient'],['references','Références']];
function route(){ return (location.hash||'#antibiogramme').slice(1); }
function render(){
 const r = route(); const main=$('#main');
 let html='', tab=r;
 if(r.startsWith('m-')){ html=viewMolecule(r.slice(2)); tab='molecules'; }
 else if(r.startsWith('g-')){ html=viewGerm(r.slice(2)); tab='germes'; }
 else if(r.startsWith('p-')){ html=viewPatho(r.slice(2)); tab='pathologies'; }
 else if(r.startsWith('e-')){ html=viewExam(r.slice(2)); tab='examens'; }
 else html = ({antibiogramme:viewABG, molecules:viewMolecules, pkpd:viewPKPD, germes:viewGerms, pathologies:viewPathos, examens:viewExams, patient:viewPatient, references:viewRefs}[r]||viewABG)();
 $$('#tabs a').forEach(a=>a.classList.toggle('on', a.getAttribute('href')==='#'+tab));
 main.innerHTML = html;
 main.querySelectorAll('table').forEach(t=>{
   if(!t.parentElement.classList.contains('tblwrap')){ const w=document.createElement('div'); w.className='tblwrap'; t.parentNode.insertBefore(w,t); w.appendChild(t); }
   const rows=[...t.rows]; if(!rows.length) return; const head=[...rows[0].cells];
   if(head.length>=3 && head.every(c=>c.tagName==='TH')){ t.classList.add('stack'); rows.slice(1).forEach(r=>[...r.cells].forEach((c,i)=>{ if(i>0 && head[i]) c.setAttribute('data-label', head[i].textContent.trim()); })); }
 });
 annotate(main);
 bindPatient(main); bindABG(main);
 $$('[data-molt]',main).forEach(b=>b.onclick=()=>{ molFilter.type=b.dataset.molt; render(); });
 const mq=$('#molq',main); if(mq){ mq.oninput=()=>{ molFilter.q=mq.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); const pos=mq.selectionStart; render(); const n=$('#molq'); n.focus(); n.setSelectionRange(pos,pos); }; }
 const gq=$('#germq',main); if(gq){ gq.oninput=()=>{ germQ=gq.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); const pos=gq.selectionStart; render(); const n=$('#germq'); n.focus(); n.setSelectionRange(pos,pos); }; }
 $$('[data-newiso]',main).forEach(b=>b.onclick=()=>{ AB.isolates.push({germ:b.dataset.newiso, ast:{}, ph:{}}); saveAB(); location.hash='#antibiogramme'; });
 $$('[data-site]',main).forEach(b=>b.onclick=()=>{ const s=b.dataset.site; if(!AB.sites.includes(s)) AB.sites.push(s); saveAB(); location.hash='#antibiogramme'; });
 renderPatientChip();
}
function init(){
 $('#tabs').innerHTML = TABS.map(([k,l])=>`<a href="#${k}">${l}</a>`).join('');
 const q=$('#q'), res=$('#qres');
 q.oninput=()=>{ res.innerHTML=searchAll(q.value); res.hidden=!q.value; };
 res.onclick=()=>{ res.hidden=true; q.value=''; };
 document.addEventListener('click',e=>{ if(!e.target.closest('.search')) res.hidden=true; });
 $('#patchip').onclick=()=>location.hash='#patient';
 document.addEventListener('click', gpop);
 window.addEventListener('hashchange', ()=>{ render(); window.scrollTo(0,0); });
 render();
 try{ if(window.claude && window.claude.use){ window.claude.use('sample').then(s=>{ SAMPLE=s; if(s && s.limits) s.limits().then(l=>{sampleImages=!!(l&&l.images);}).catch(()=>{}); if(route()==='antibiogramme') keepScroll(render); }).catch(()=>{}); } }catch(e){}
}
document.addEventListener('DOMContentLoaded', init);
})();
