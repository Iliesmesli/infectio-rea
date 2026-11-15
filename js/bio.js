/* Lecture et interprétation de résultats biologiques (LCS, liquides, NFS, biochimie, ECBU, prélèvements respiratoires).
   Les valeurs sont saisies ou transcrites depuis une photo ; l'interprétation est faite ici par des règles fixes (pas par l'IA). */
(function(){
const F = (id,l,u,h)=>({id,l,u,h});
const T = {
 lcs: {name:'LCS (ponction lombaire / DVE)', ico:'🧠', fields:[
   F('ctx','Contexte','', 'choix'),
   F('gb','Leucocytes LCS','/mm³'), F('pnn','Polynucléaires neutrophiles LCS','%'), F('gr','Hématies LCS','/mm³'),
   F('prot','Protéinorachie','g/L'), F('glu','Glycorachie','mmol/L'), F('glyc','Glycémie (simultanée)','mmol/L'), F('lact','Lactatorachie','mmol/L'),
   F('gbs','Leucocytes sanguins','G/L'), F('grs','Hématies sanguines','T/L'), F('gbPrev','Cell-index précédent (si connu)','')],
   refs:['nar25','spilf_mening18','idsa_vent17']},
 pleural: {name:'Liquide pleural', ico:'🫁', fields:[
   F('protP','Protides pleuraux','g/L'), F('protS','Protides sériques','g/L'), F('ldhP','LDH pleurales','UI/L'), F('ldhS','LDH sériques','UI/L'), F('ldhN','LDH : limite supérieure normale sérique','UI/L'),
   F('ph','pH pleural',''), F('glu','Glucose pleural','mmol/L'), F('gb','Leucocytes pleuraux','/mm³'), F('pnn','Polynucléaires','%'), F('pus','Aspect purulent / pus franc (1 = oui)',''), F('gram','Examen direct ou culture positif (1 = oui)','')],
   refs:['bts_pleural23']},
 ascite: {name:'Liquide d\'ascite', ico:'💧', fields:[
   F('gb','Leucocytes','/mm³'), F('pnn','Polynucléaires neutrophiles','%'), F('pnnAbs','PNN (valeur absolue, si donnée)','/mm³'),
   F('prot','Protides','g/L'), F('glu','Glucose','mmol/L'), F('ldh','LDH ascite','UI/L'), F('ldhN','LDH : limite supérieure normale sérique','UI/L'),
   F('alb','Albumine ascite','g/L'), F('albS','Albumine sérique','g/L'), F('poly','Culture polymicrobienne (1 = oui)','')],
   refs:['easl_ascite18']},
 artic: {name:'Liquide articulaire', ico:'🦴', fields:[
   F('gb','Leucocytes','/mm³'), F('pnn','Polynucléaires','%'), F('crist','Cristaux (1 = présents)',''), F('prothese','Articulation prothétique (1 = oui)',''), F('gram','Examen direct ou culture positif (1 = oui)','')],
   refs:['icm_pji18']},
 nfs: {name:'NFS / biochimie sanguine', ico:'🩸', fields:[
   F('gb','Leucocytes','G/L'), F('pnn','Polynucléaires neutrophiles','G/L'), F('lymph','Lymphocytes','G/L'), F('eos','Éosinophiles','G/L'),
   F('hb','Hémoglobine','g/dL'), F('plq','Plaquettes','G/L'), F('crp','CRP','mg/L'), F('pct','Procalcitonine','µg/L'), F('pctPrev','PCT au pic / précédente','µg/L'),
   F('lact','Lactates','mmol/L'), F('creat','Créatinine','µmol/L'), F('alb','Albumine','g/L')],
   refs:['prorata10','sfar_bl2019']},
 ecbu: {name:'ECBU', ico:'🧪', fields:[
   F('ctx','Contexte','', 'choix'),
   F('leuco','Leucocyturie','/mL'), F('bact','Bactériurie','UFC/mL'), F('germ','Germe (1 = E. coli ou S. saprophyticus)',''), F('nbGerm','Nombre d\'espèces','')],
   refs:['spilf_iuas15']},
 resp: {name:'Prélèvement respiratoire quantitatif', ico:'🌬', fields:[
   F('ctx','Type de prélèvement','', 'choix'), F('cfu','Culture','UFC/mL'), F('gramPos','Examen direct : bactéries présentes (1 = oui)',''), F('cellEpi','Cellules épithéliales > 1 % (AT) ou > 10/champ (1 = oui)','')],
   refs:['sfar_pavm17']}
};
const CTX = {
 lcs:[['comm','Communautaire / ponction lombaire'],['noso','Post-neurochirurgie / DVE / DVP (nosocomial)']],
 ecbu:[['nosonde','Sans sonde'],['sonde','Sur sonde vésicale']],
 resp:[['at','Aspiration trachéale (AT)'],['lba','LBA / mini-LBA'],['pdp','Prélèvement distal protégé / brosse']]
};
const num = v => (v===''||v==null||isNaN(+v)) ? null : +v;
const R = (lvl, txt, link) => ({lvl, txt, link});

function interp(type, v){
 const o=[]; const n = k => num(v[k]);
 if(type==='lcs'){
  const gb=n('gb'), pnn=n('pnn'), gr=n('gr'), prot=n('prot'), glu=n('glu'), glyc=n('glyc'), lact=n('lact'), gbs=n('gbs'), grs=n('grs');
  const ratio = (glu!=null && glyc) ? glu/glyc : null;
  if(ratio!=null) o.push(R(ratio<=0.4?'danger':ratio<0.5?'warn':'ok', `Rapport glycorachie/glycémie = <b>${ratio.toFixed(2)}</b>${ratio<=0.4?' (≤ 0,40 : hypoglycorachie franche)':ratio<0.5?' (abaissé)':' (normal ≥ 0,5–0,6)'}`));
  let ci=null;
  if(gb!=null && gr && gbs && grs){ ci = (gb/gr)/((gbs*1000)/(grs*1e6)); const exp = gr*(gbs*1000)/(grs*1e6);
   o.push(R('info', `Leucocytes attendus par la contamination sanguine ≈ <b>${Math.round(exp)}/mm³</b> ; <b>cell-index = ${ci.toFixed(1)}</b>${num(v.gbPrev)?` (précédent ${num(v.gbPrev)} → ${ci>num(v.gbPrev)*1.5?'<b>en augmentation</b>':'stable/en baisse'})`:''} — c'est sa cinétique qui compte (augmentation en faveur d'une infection).`)); }
  if(v.ctx==='noso'){
   let s=0; const crit=[];
   if(gb!=null && gb>=500){s++;crit.push('GB ≥ 500');} if(pnn!=null && pnn>=80){s++;crit.push('PNN ≥ 80 %');} if(ratio!=null && ratio<=0.4){s++;crit.push('glucose LCS/sang ≤ 0,40');} if(lact!=null && lact>=4){s++;crit.push('lactates ≥ 4');}
   o.push(R(s>=2?'danger':s===1?'warn':'ok', `<b>LCR score (protocole NAR) = ${s}/4</b>${crit.length?' ('+crit.join(', ')+')':''}`));
   const ciUp = ci!=null && num(v.gbPrev) && ci>num(v.gbPrev)*1.5;
   if(s>=2 || (lact!=null && lact>=4) || ciUp) o.push(R('danger','<b>Méningite/ventriculite nosocomiale probable</b> : discussion collégiale + avis référent → <b>ceftazidime (ou méropénème) + linézolide (ou vancomycine)</b>, changement de DVE dans les 48 h ; culture négative à J3 → arrêt de l\'anti-BGN ; à J5 → arrêt si méningite aseptique.','#p-ventri'));
   else o.push(R('ok','LCR score ≤ 1 et lactates < 4 : <b>pas d\'antibiothérapie spécifique</b> si un autre point d\'appel explique le tableau ; surveiller la cinétique (cell-index, lactates).','#p-ventri'));
  } else {
   const bact = (gb!=null && gb>=1000) || (pnn!=null && pnn>=50 && gb!=null && gb>=100) || (ratio!=null && ratio<=0.4) || (lact!=null && lact>=3.8) || (prot!=null && prot>=1);
   const lympho = gb!=null && gb>=5 && pnn!=null && pnn<50;
   if(gb!=null && gb<5 && !(lact>=3.8)) o.push(R('ok','LCS sans pléiocytose (&lt; 5/mm³) : méningite peu probable (prudence chez l\'immunodéprimé et en cas de ponction très précoce).'));
   else if(bact && !(lympho && ratio!=null && ratio>=0.5 && (lact==null||lact<3.8))) o.push(R('danger','<b>Profil de méningite bactérienne</b> (pléiocytose à PNN, hypoglycorachie, protéinorachie ≥ 1 g/L et/ou lactates ≥ 3,8 mmol/L) → <b>C3G forte dose + dexaméthasone</b> sans attendre (± amoxicilline si Listeria possible).','#p-mening'));
   else if(lympho && ratio!=null && ratio<0.5) o.push(R('warn','<b>Méningite lymphocytaire avec hypoglycorachie</b> : Listeria, tuberculose, cryptocoque (voire méningite bactérienne décapitée) → amoxicilline ± traitement antituberculeux, antigène cryptococcique.','#p-enceph'));
   else if(lympho) o.push(R('warn','<b>Méningite lymphocytaire normoglycorachique</b> : virale le plus souvent ; si troubles de conscience/signes encéphalitiques → <b>aciclovir</b> sans attendre la PCR HSV.','#p-enceph'));
  }
  if(gr!=null && gr>10000) o.push(R('info','LCS hémorragique : interpréter les leucocytes avec la correction/cell-index ; lactates moins fiables après HSA récente.'));
 }
 if(type==='pleural'){
  const rp = (n('protP')!=null && n('protS')) ? n('protP')/n('protS') : null, rl = (n('ldhP')!=null && n('ldhS')) ? n('ldhP')/n('ldhS') : null, ld23 = (n('ldhP')!=null && n('ldhN')) ? n('ldhP') > 2/3*n('ldhN') : null;
  const ex = [rp!=null&&rp>0.5?'protides P/S > 0,5':null, rl!=null&&rl>0.6?'LDH P/S > 0,6':null, ld23?'LDH pleurales > 2/3 de la normale sérique':null].filter(Boolean);
  if(rp!=null||rl!=null||ld23!=null) o.push(R(ex.length?'warn':'ok', ex.length?`<b>Exsudat</b> (critères de Light : ${ex.join(', ')})`:'<b>Transsudat</b> (aucun critère de Light) — chercher une cause mécanique (insuffisance cardiaque, cirrhose, hypoalbuminémie).'));
  else if(n('protP')!=null) o.push(R(n('protP')>30?'warn':'ok', n('protP')>30?'Protides > 30 g/L : en faveur d\'un exsudat (critères de Light à compléter).':'Protides < 30 g/L : en faveur d\'un transsudat (critères de Light à compléter).'));
  const comp = [n('ph')!=null&&n('ph')<7.2?'pH < 7,20':null, n('glu')!=null&&n('glu')<2.2?'glucose < 2,2 mmol/L':null, n('ldhP')!=null&&n('ldhP')>1000?'LDH > 1000 UI/L':null, num(v.pus)===1?'pus':null, num(v.gram)===1?'examen direct/culture positif':null].filter(Boolean);
  if(comp.length) o.push(R('danger',`<b>Épanchement parapneumonique compliqué / empyème</b> (${comp.join(', ')}) → <b>drainage thoracique</b> + antibiothérapie couvrant les anaérobies (amox-clav ; C3G + métronidazole) ; fibrinolytique + DNase intrapleurale si cloisonné ; chirurgie si échec.`,'#p-pac'));
  else if(n('ph')!=null && n('ph')<7.3) o.push(R('warn','pH 7,20–7,30 : surveillance rapprochée, ponction de contrôle ; drainage si aggravation.','#p-pac'));
  if(n('gb')!=null && n('pnn')!=null && n('pnn')<50 && ex.length) o.push(R('info','Exsudat lymphocytaire : tuberculose, néoplasie, lymphome → BK, cytologie, biopsie pleurale.'));
 }
 if(type==='ascite'){
  const pnn = n('pnnAbs')!=null ? n('pnnAbs') : (n('gb')!=null && n('pnn')!=null ? n('gb')*n('pnn')/100 : null);
  if(pnn!=null) o.push(R(pnn>=250?'danger':'ok', `PNN = <b>${Math.round(pnn)}/mm³</b> ${pnn>=250?'≥ 250 : <b>infection du liquide d\'ascite</b>':'&lt; 250 : pas d\'infection du liquide d\'ascite (si culture +, bactériascitie : reponctionner)'}`));
  const runyon = [n('prot')!=null&&n('prot')>10?'protides > 10 g/L':null, n('glu')!=null&&n('glu')<2.8?'glucose < 2,8 mmol/L':null, (n('ldh')!=null&&n('ldhN')&&n('ldh')>n('ldhN'))?'LDH > normale sérique':null].filter(Boolean);
  if(pnn!=null && pnn>=250 && (runyon.length>=2 || num(v.poly)===1)) o.push(R('danger',`<b>Péritonite secondaire suspectée</b> (critères de Runyon : ${runyon.join(', ')}${num(v.poly)===1?', culture polymicrobienne':''}) → <b>TDM abdominale</b> en urgence, avis chirurgical, antibiothérapie d\'IIA.`,'#p-iia'));
  else if(pnn!=null && pnn>=250) o.push(R('danger','Infection spontanée : <b>céfotaxime</b> (ou ceftriaxone ; pip-tazo/carbapénème si nosocomiale ou FdR de BMR) + <b>albumine 1,5 g/kg à J1 et 1 g/kg à J3</b> ; ponction de contrôle à 48 h (baisse des PNN ≥ 25 % attendue) ; prophylaxie secondaire.'));
  if(n('alb')!=null && n('albS')!=null){ const g=n('albS')-n('alb'); o.push(R('info',`Gradient albumine sérum-ascite = <b>${g.toFixed(1)} g/L</b> ${g>=11?'(≥ 11 : hypertension portale)':'(< 11 : cause non portale : carcinose, tuberculose, pancréatite…)'}`)); }
 }
 if(type==='artic'){
  const gb=n('gb'), pnn=n('pnn'), pr=num(v.prothese)===1;
  if(pr){ if((gb!=null&&gb>=3000)||(pnn!=null&&pnn>=80)) o.push(R('danger',`<b>Infection de prothèse probable</b> (seuils chroniques ICM 2018 : leucocytes &gt; 3000/mm³, PNN &gt; 80 % ; en post-opératoire précoce &lt; 6 sem : &gt; 10 000/mm³ et &gt; 90 %) → avis orthopédique, prélèvements per-opératoires multiples avant antibiotiques.`)); else if(gb!=null) o.push(R('ok','En dessous des seuils d\'infection de prothèse (à interpréter avec la CRP et le délai post-opératoire).')); }
  else if(gb!=null){ if(gb>=50000 || (gb>=20000 && pnn>=90)) o.push(R('danger','<b>Arthrite septique probable</b> (&gt; 50 000/mm³, PNN &gt; 90 %) → hémocultures, lavage articulaire (chirurgical/arthroscopique), antibiothérapie probabiliste anti-staphylococcique (céfazoline ; + anti-BGN si terrain).')); else if(gb>=2000) o.push(R('warn','Liquide inflammatoire (2 000–50 000/mm³) : arthrite septique non exclue (surtout si &gt; 20 000 ou immunodéprimé) ; microcristalline, inflammatoire.')); else o.push(R('ok','Liquide mécanique (&lt; 2 000/mm³).')); }
  if(num(v.crist)===1) o.push(R('info','Cristaux présents : n\'exclut pas une arthrite septique associée (culture).'));
  if(num(v.gram)===1) o.push(R('danger','Examen direct/culture positif : arthrite septique confirmée.'));
 }
 if(type==='nfs'){
  if(n('pnn')!=null){ if(n('pnn')<0.5) o.push(R('danger',`<b>Neutropénie profonde</b> (PNN ${n('pnn')} G/L) : tout sepsis = urgence → β-lactamine anti-Pseudomonas ± amikacine ± vancomycine (ECIL-4).`,'#p-immunodep')); else if(n('pnn')<1.5) o.push(R('warn','Neutropénie modérée (0,5–1,5 G/L).','#p-immunodep')); }
  if(n('lymph')!=null && n('lymph')<0.5) o.push(R('warn','Lymphopénie profonde (&lt; 0,5 G/L) : risque d\'infections opportunistes (pneumocystose, CMV, Nocardia, Listeria).','#p-immunodep'));
  if(n('eos')!=null && n('eos')>=0.5) o.push(R('warn','Hyperéosinophilie (≥ 0,5 G/L) : réaction médicamenteuse (DRESS — β-lactamines, vancomycine, sulfamides), parasitose (anguillulose avant corticoïdes !), insuffisance surrénale.'));
  if(n('plq')!=null && n('plq')<100) o.push(R('info','Thrombopénie : penser au linézolide (&gt; 10–14 j), à la vancomycine, au cotrimoxazole, aux β-lactamines ; CIVD du sepsis.'));
  if(n('gb')!=null && n('gb')>15) o.push(R('info','Hyperleucocytose &gt; 15 G/L : critère de gravité d\'une infection à C. difficile si diarrhée.','#p-cdi'));
  if(n('pct')!=null){ const p=n('pct'), pp=n('pctPrev'); let t=`PCT = <b>${p} µg/L</b>. `; let lvl='info';
   if(pp){ const d=(pp-p)/pp; t+=`Baisse de <b>${Math.round(d*100)} %</b> par rapport au pic. `; if(p<0.5 || d>=0.8){ t+='<b>Arrêt de l\'antibiothérapie à envisager</b> si évolution clinique favorable (stratégie PRORATA : PCT &lt; 0,5 µg/L ou baisse ≥ 80 %).'; lvl='ok'; } else t+='Poursuivre et réévaluer.'; }
   else t+= p>=2 ? 'Élevée : en faveur d\'une infection bactérienne systémique.' : p<0.25 ? 'Basse : infection bactérienne systémique peu probable (n\'exclut pas une infection localisée/débutante).' : 'Intermédiaire : interpréter selon la clinique et la cinétique.';
   o.push(R(lvl,t)); }
  if(n('lact')!=null && n('lact')>=2) o.push(R(n('lact')>=4?'danger':'warn',`Lactates ${n('lact')} mmol/L : ${n('lact')>=4?'hypoperfusion sévère':'hyperlactatémie'} — avec hypotension nécessitant des vasopresseurs = choc septique (Sepsis-3).`,'#p-choc'));
  if(n('creat')!=null) o.push(R('info',`Créatinine ${n('creat')} µmol/L : <a href="#" data-biocreat="${n('creat')}">reporter dans l'onglet Patient</a> pour adapter les posologies (clairance mesurée préférable en réanimation).`));
  if(n('alb')!=null && n('alb')<25) o.push(R('info','Hypoalbuminémie &lt; 25 g/L : augmentation de la fraction libre et du volume de distribution des molécules très liées (ceftriaxone, teicoplanine, ertapénem, céfazoline) → risque de sous-dosage ; STP.'));
 }
 if(type==='ecbu'){
  const le=n('leuco'), b=n('bact'), so=v.ctx==='sonde', ec=num(v.germ)===1, ng=n('nbGerm');
  if(so){ o.push(R('info','Sur sonde : la leucocyturie n\'a <b>pas de valeur diagnostique</b> ; ne traiter que si signes cliniques (fièvre sans autre cause, douleur sus-pubienne/lombaire) — pas de traitement d\'une colonisation.','#p-iu'));
   if(b!=null) o.push(R(b>=1e5?'warn':'ok', b>=1e5?'Bactériurie ≥ 10⁵ UFC/mL sur sonde : seuil retenu pour une IU associée aux soins si symptomatique → changer la sonde avant de débuter les antibiotiques.':'Bactériurie &lt; 10⁵ UFC/mL sur sonde : IU peu probable.','#p-iu')); }
  else { if(le!=null) o.push(R(le>=1e4?'warn':'ok', le>=1e4?'Leucocyturie ≥ 10⁴/mL : significative.':'Leucocyturie &lt; 10⁴/mL : IU peu probable (sauf neutropénie, prélèvement précoce).'));
   if(b!=null){ const s = ec?1e3:1e4; o.push(R(b>=s && (le==null||le>=1e4)?'warn':'ok', `Bactériurie ${b.toExponential(0)} UFC/mL (seuil ${ec?'10³ pour E. coli/S. saprophyticus':'10³ (homme) à 10⁴ UFC/mL selon le germe'}) : ${b>=s?'significative':'non significative'}.`,'#p-iu')); } }
  if(ng!=null && ng>=3) o.push(R('warn','≥ 3 espèces : contamination probable → refaire le prélèvement.'));
 }
 if(type==='resp'){
  const c=n('cfu'), t=v.ctx||'at', s = t==='at'?1e5:t==='lba'?1e4:1e3; const lab = t==='at'?'AT ≥ 10⁵ (10⁶ selon les équipes)':t==='lba'?'LBA ≥ 10⁴':'PDP/brosse ≥ 10³';
  if(c!=null) o.push(R(c>=s?'warn':'ok', `Culture ${c.toExponential(0)} UFC/mL — seuil ${lab} UFC/mL : ${c>=s?'<b>significative</b> → PAVM documentée si contexte clinico-radiologique compatible':'non significative (colonisation possible ; prélèvement sous antibiotique : seuil à interpréter avec prudence)'}.`,'#p-pavm'));
  if(num(v.cellEpi)===1) o.push(R('warn','Nombreuses cellules épithéliales : contamination salivaire, prélèvement peu interprétable.'));
  if(num(v.gramPos)===1) o.push(R('info','Examen direct positif : oriente l\'antibiothérapie probabiliste (Gram + en amas → anti-SARM si FdR ; BGN → anti-Pseudomonas).','#p-pavm'));
 }
 return o;
}
window.BIO = {T, CTX, interp, num};
})();
