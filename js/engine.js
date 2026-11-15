/* MOTEUR — antibiogramme → propositions hiérarchisées */
(function(){
const D = {}; (window.DRUGS||[]).forEach(d=>D[d.id]=d);
const G = {}; (window.GERMS||[]).forEach(g=>G[g.id]=g);
window.DRUG_BY_ID = D; window.GERM_BY_ID = G;

const SITES = [
 {id:'bact', l:'Bactériémie / fongémie'},
 {id:'pulm', l:'Pneumonie / PAVM'},
 {id:'uri',  l:'Urinaire (PNA, IU masculine, IUAS)'},
 {id:'snc',  l:'Méningite / ventriculite (DVE)'},
 {id:'abces',l:'Abcès cérébral', compat:'snc'},
 {id:'abdo', l:'Intra-abdominal'},
 {id:'peau', l:'Peau / tissus mous'},
 {id:'os',   l:'Os / articulation / matériel'},
 {id:'endo', l:'Endocardite'},
 {id:'kt',   l:'Infection liée au cathéter'}
];
window.SITES = SITES;
const siteCompat = s => (SITES.find(x=>x.id===s)||{}).compat || s;

/* ---------- normalisation (photo / saisie) ---------- */
const norm = s => (s||'').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9+ ]/g,' ').replace(/\s+/g,' ').trim();
function matchDrug(name){
  const n = norm(name); if(!n) return null;
  let best=null, bestLen=0;
  for(const d of window.DRUGS){
    const keys=[d.name, ...(d.alias||[])];
    for(const k of keys){
      const kn = norm(k);
      if(!kn) continue;
      if(n===kn){ return d.id; }
      if(kn.length>=4 && (n.includes(kn)) && kn.length>bestLen){ best=d.id; bestLen=kn.length; }
    }
  }
  // abréviations courtes exactes (≤3 lettres)
  if(!best){ for(const d of window.DRUGS){ for(const k of (d.alias||[])){ if(k.length<=3 && n===norm(k)) return d.id; } } }
  return best;
}
function matchGerm(name){
  const n = norm(name); if(!n) return null;
  let best=null, bestLen=0;
  for(const g of window.GERMS){
    for(const k of [g.name, ...(g.alias||[])]){
      const kn=norm(k); if(!kn) continue;
      if(n===kn) return g.id;
      if(kn.length>=5 && n.includes(kn) && kn.length>bestLen){best=g.id;bestLen=kn.length;}
      if(n.length>=5 && kn.includes(n) && n.length>bestLen){best=g.id;bestLen=n.length;}
    }
  }
  return best;
}
window.matchDrug = matchDrug; window.matchGerm = matchGerm;

/* ---------- résistances naturelles (EUCAST expected phenotypes, simplifié) ---------- */
const NAT = {
 staph:['aztreo','colistine','temo','metro'],
 pneumo:['amika','genta','tobra','colistine','aztreo','temo','metro'],
 strepto:['amika','genta','tobra','colistine','aztreo','temo','metro'],
 entero:['cefazoline','cefotax','ceftriax','ceftaz','cefepime','ceftolo','cazavi','cefiderocol','aztreo','temo','ertapeneme','clinda','cotrimox','colistine','metro','amika','tobra','fosfo'],
 cuti:['metro','amika','genta','tobra','colistine','aztreo'],
 listeria:['cefazoline','cefotax','ceftriax','ceftaz','cefepime','ceftaroline','aztreo','temo','fosfo','colistine'],
 nmen:['vanco','teico','colistine','cotrimox'],
 hinf:['cloxa'],
 atyp:['amox','amoxclav','peniG','cefotax','ceftriax','pipetazo','merope','imipeneme','vanco','amika','genta','tobra'],
 eb1:[],
 eb2:['amox','peniG'],
 eb3:['amox','amoxclav','peniG','cefazoline'],
 pseudo:['amox','amoxclav','peniG','cefazoline','cefotax','ceftriax','ertapeneme','temo','cotrimox','tigec','erava','doxy','vanco','teico','linez','dapto','clinda','metro'],
 acineto:['amox','amoxclav','peniG','cefazoline','cefotax','ceftriax','ertapeneme','aztreo','fosfo','temo','vanco','linez','dapto','metro'],
 steno:['merope','imipeneme','ertapeneme','amika','genta','tobra','amox','amoxclav','cefotax','ceftriax','pipetazo','temo','aztreo','fosfo','colistine'],
 anaer:['amika','genta','tobra','aztreo','temo','colistine','cotrimox']
};
const NAT_GERM = { pmirabilis:['colistine','tigec','erava','doxy'], morganella:['colistine','tigec','erava','doxy','amoxclav'], serratia:['colistine','doxy'],
  efaecium:[], ckrusei:['fluco'], mucor:['vorico','fluco','caspo','mica','anidula'], crypto:['caspo','mica','anidula'], asp:['fluco'], fusarium:['fluco','caspo','mica','anidula'], scedo:['fluco','caspo','mica','anidula'] };
const BL = ['peniG','amox','amoxclav','cloxa','pipetazo','temo','cefazoline','cefotax','ceftriax','ceftaz','cefepime','ceftaroline','ceftolo','cazavi','cefiderocol','merope','imipeneme','ertapeneme','imirele','merovabor','aztreo','aztavi'];
const PENI = ['peniG','amox','amoxclav','cloxa','pipetazo','temo'];

/* ---------- sensibilité attendue si non testé ---------- */
const EXPECT = {
 strepto:['peniG','amox','cefotax','ceftriax','vanco','linez'], listeria:['amox','cotrimox','genta'], cuti:['peniG','amox','ceftriax','vanco','linez'],
 nmen:['cefotax','ceftriax'], anaer:['metro','merope','imipeneme','pipetazo'], atyp:['levo','azithro','spira','doxy'],
 cand_s:['caspo','mica','anidula','amphoL','fluco','vorico'], cand_g:['caspo','mica','anidula','amphoL'], cand_p:['fluco','amphoL','caspo','mica','anidula'],
 cand_k:['caspo','mica','anidula','amphoL','vorico'], cand_a:['caspo','mica','anidula'], asp:['vorico','isavu','amphoL','posa'], muco:['amphoL','isavu','posa'],
 crypto:['amphoL','5fc','fluco'], pcp:['cotrimox'], nocardia:['linez','amika','cotrimox'], moule:['vorico','amphoL'], hsv:['aciclo','foscarnet'], vzv:['aciclo'], cmv:['ganci','foscarnet'], flu:['oselta'], covid:['remdesivir'], cdiff:['fidaxo','vanco','metro']
};

/* ---------- candidats hiérarchisés par groupe ---------- */
// d : molécules (toutes requises S/SFP sauf opt:true) ; when(ctx) ; sites : restrictions ; note
const C = (d,o={})=>Object.assign({d:Array.isArray(d)?d:[d]},o);
const RULES = {
 staph: ctx => ctx.ph.mr ? [
   C('vanco',{note:'Référence pour SARM/SCN méti-R (Css 20–25 mg/L). Toxicité rénale : éviter l\'association pip-tazo/aminosides.'}),
   C('dapto',{note:'Bactériémie/endocardite (10–12 mg/kg) ; JAMAIS pour une pneumonie.'}),
   C('linez',{note:'Pneumonie à SARM et SNC (diffusion LCS ≈ 70 %) ; bactériostatique : prudence en bactériémie isolée.'}),
   C('teico',{note:'Alternative à la vancomycine (moins néphrotoxique) — doses de charge, STP.'}),
   C('ceftaroline',{note:'Alternative/association (bactériémie réfractaire, pneumonie).'}),
   C(['cotrimox','rifam'],{note:'Association/relais (os, matériel, SNC) — rifampicine après négativation des hémocultures.'}),
   C(['levo','rifam'],{note:'Relais oral sur matériel (si S aux deux).'}),
   C('clinda',{note:'Relais oral peau/os (si S, vérifier résistance inductible).'})
 ] : [
   C('cloxa',{note:'Référence pour les SAMS (supérieure à la vancomycine). SNC : 200 mg/kg/j en continu.'}),
   C('cefazoline',{note:'Équivalente à la cloxacilline pour les bactériémies, mieux tolérée ; NON pour le SNC.'}),
   C(['cloxa','fosfo'],{note:'Méningite/ventriculite/abcès à SAMS : association discutée pour la diffusion (surcharge sodée !).', only:['snc','abces']}),
   C('cotrimox',{note:'Relais (os, peau, SNC en association) ; allergie.'}),
   C(['levo','rifam'],{note:'Relais oral sur matériel/os.'}),
   C('vanco',{note:'Uniquement si allergie grave aux β-lactamines (moins efficace sur SAMS).', allergy:true}),
   C('dapto',{note:'Allergie grave : bactériémie/endocardite (pas de pneumonie).', allergy:true}),
   C('clinda',{note:'Relais oral peau/os (si S).'}),
   C('amoxclav',{note:'Actif sur SAMS : intéressant pour couvrir une co-infection avec une seule molécule.', broad:true}),
   C('ceftriax',{note:'Actif sur SAMS (forte dose) : couverture unique possible si co-infection (pneumocoque, H. influenzae, entérobactérie S).', broad:true}),
   C('cefotax',{note:'Idem ceftriaxone.', broad:true}),
   C('pipetazo',{note:'Actif sur SAMS : couverture unique si co-infection à BGN S.', broad:true}),
   C('cefepime',{note:'Actif sur SAMS : couverture unique si co-infection à BGN S.', broad:true}),
   C('ertapeneme',{note:'Actif sur SAMS : couverture unique si co-infection à entérobactérie BLSE.', broad:true}),
   C('merope',{note:'Actif sur SAMS : uniquement si co-infection le justifiant.', broad:true})
 ],
 pneumo: ctx => [
   C('amox',{note:'Pneumonie : amoxicilline (forte dose) même si PSDP. SNC : seulement si CMI amox ≤ 0,5 mg/L (SPILF 2018).'}),
   C('cefotax',{note:'Méningite : 300 mg/kg/j (200 si CMI C3G ≤ 0,5).', prefer:['snc','abces']}),
   C('ceftriax',{note:'Méningite : 100 mg/kg/j (75 si CMI basse).', prefer:['snc','abces']}),
   C('peniG',{note:'Si CMI péni ≤ 0,06 mg/L.'}),
   C('levo',{note:'Allergie aux β-lactamines (pneumonie).'}),
   C('vanco',{note:'C3G-R ou allergie grave (+ rifampicine discutée pour le SNC).'}),
   C('linez',{note:'Alternative (SNC, pneumonie) en cas d\'allergie.'})
 ],
 strepto: ctx => [
   C('amox'), C('peniG'), C('ceftriax',{note:'Endocardite streptococcique : ceftriaxone 2 g/j possible (ESC 2023).'}),
   C(['amox','clinda'],{note:'DHBN/fasciite/choc toxique : clindamycine anti-toxinique associée.', only:['peau']}),
   C('vanco',{note:'Allergie grave.', allergy:true}), C('linez',{note:'Allergie grave (peau, pneumonie).', allergy:true}), C('levo',{note:'Allergie (hors endocardite).', allergy:true})
 ],
 entero: ctx => [
   C('amox',{note:'Molécule de référence (forte dose).'}),
   C(['amox','ceftriax'],{note:'Endocardite à E. faecalis : double β-lactamine (ESC 2023), y compris si HLR gentamicine.', only:['endo']}),
   C(['amox','genta'],{note:'Endocardite : si absence de résistance de haut niveau à la gentamicine (2 sem).', only:['endo']}),
   C('vanco',{note:'Si amoxicilline R ou allergie.'}),
   C('teico',{note:'Alternative à la vancomycine.'}),
   C('linez',{note:'ERV / allergie ; bactériostatique.'}),
   C('dapto',{note:'ERV : forte dose 10–12 mg/kg ± β-lactamine.'}),
   C('tigec',{note:'ERV — IIA uniquement.'}),
   C('erava',{note:'ERV — IIA uniquement (AMM IIA ; RFE SFAR 2026 : allergie aux β-lactamines).', only:['abdo']})
 ],
 cuti: ctx => [ C('peniG'), C('amox'), C('ceftriax'), C('vanco',{note:'Allergie.'}), C('linez'), C(['amox','rifam'],{note:'Matériel conservé.', only:['os','snc']}), C('clinda',{note:'Relais oral.'}), C('doxy',{note:'Relais oral.'}) ],
 listeria: ctx => [ C(['amox','genta'],{note:'Amoxicilline 200 mg/kg/j + gentamicine 5–7 premiers jours (SPILF 2018 ; bénéfice de l\'aminoside discuté).', opt2:true, prefer:['snc','abces','bact']}), C('amox'), C('cotrimox',{note:'Allergie aux pénicillines.'}), C('linez',{note:'Alternative (données limitées).'}) ],
 nmen: ctx => [ C('cefotax'), C('ceftriax'), C('amox',{note:'Relais possible si CMI basse.'}), C('peniG') ],
 hinf: ctx => [ C('amox',{note:'Si β-lactamase négative et non BLNAR.'}), C('amoxclav'), C('cefotax'), C('ceftriax'), C('levo',{note:'Allergie.'}) ],
 atyp: ctx => [ C('levo',{note:'Légionellose grave : 500 mg q12h.'}), C('azithro'), C('spira'), C('doxy') ],
 anaer: ctx => [ C('metro',{note:'Toujours en association avec un anti-aérobie si infection mixte.'}), C('amoxclav',{note:'Forte posologie pour les anaérobies.'}), C('pipetazo',{note:'Forte posologie.'}), C('merope',{note:'Forte posologie.'}), C('clinda',{note:'Résistances fréquentes (B. fragilis).'}), C('moxi') ],
 eb: ctx => {
   const ph=ctx.ph, L=[];
   const grave = ctx.grave;
   if(ph.carba){
     if(ph.carba==='KPC'){ L.push(C('cazavi',{note:'KPC : 1re intention (ESCMID 2022, IDSA 2024).'})); L.push(C('merovabor',{note:'KPC : alternative (disponibilité limitée).'})); L.push(C('imirele',{note:'KPC : alternative.'})); L.push(C('cefiderocol',{note:'Alternative/sauvetage.'})); }
     else if(ph.carba==='OXA48'){ L.push(C('cazavi',{note:'OXA-48 : 1re intention.'})); L.push(C('cefiderocol',{note:'Alternative.'})); }
     else if(ph.carba==='MBL'){ L.push(C('aztavi',{note:'MBL (NDM/VIM/IMP) : aztréonam-avibactam en 1re intention (IDSA 2024).'})); L.push(C(['cazavi','aztreo'],{note:'Alternative : ceftazidime-avibactam + aztréonam (co-administrés).', nosens:['aztreo']})); L.push(C('cefiderocol',{note:'Alternative.'})); }
     else { L.push(C('cazavi',{note:'Carbapénémase non typée : demander le typage (test immunochromatographique) — actif sur KPC/OXA-48.'})); L.push(C('aztavi',{note:'Actif y compris sur MBL.'})); L.push(C('cefiderocol')); }
     L.push(C(['colistine','amika'],{note:'Sauvetage, toujours en association, avis infectiologue.', salvage:true}));
     L.push(C('tigec',{note:'Sauvetage IIA/peau uniquement (forte dose).', salvage:true}));
     L.push(C('erava',{note:'Sauvetage IIA uniquement (actif sur KPC/OXA-48, pas sur MBL de façon fiable).', salvage:true, only:['abdo']}));
     L.push(C('fosfo',{note:'Association uniquement.', salvage:true, assocOnly:true}));
     // molécules non β-lactamines si S
     L.push(C('cipro')); L.push(C('levo')); L.push(C('cotrimox')); L.push(C('amika',{note:'IU uniquement en monothérapie.', uriMono:true}));
     return L;
   }
   if(!ph.blse && !ph.ampc){
     if(ctx.grp==='eb1') L.push(C('amox',{note:'Souche sauvage : amoxicilline.'}));
     L.push(C('amoxclav',{note:'Pénicillinase : amox-clav (hors SNC, hors forme grave).'}));
     if(ctx.grp!=='eb3'){ L.push(C('cefotax',{note:'C3G — préférer le céfotaxime (écologie).'})); L.push(C('ceftriax')); }
     else if(ctx.lowAmpC){ L.push(C('cefotax',{note:'Groupe 3 faiblement mutant (Serratia, Morganella, Providencia) : C3G utilisable si S, y compris en bactériémie (IDSA 2024) — surveiller l\'évolution.'})); L.push(C('ceftriax',{note:'Groupe 3 faiblement mutant : C3G utilisable si S.'})); }
     else { L.push(C('cefotax',{note:'Groupe 3 FORTEMENT mutant : risque de sélection d\'un mutant AmpC dérépréssé sous C3G même si S → réservé à la cystite ou à un patient stable avec source contrôlée (avis).', grvPen:true, ecPen:false, broad:true})); }
   }
   if(ctx.grp==='eb3' && !ph.blse) L.push(C('cefepime',{note: ctx.lowAmpC ? 'Groupe 3 faiblement mutant : alternative à la C3G.' : 'Groupe 3 fortement mutant : céfépime de référence si CMI ≤ 1 mg/L et absence de BLSE (HAS 2019, IDSA 2024) ; la dérépression peut augmenter la CMI du céfépime (E. cloacae ++) → contrôler l\'antibiogramme si échec.', top: !ctx.lowAmpC}));
   if(ph.ampc && ctx.grp!=='eb3' && !ph.blse) L.push(C('cefepime',{note:'Céphalosporinase hyperproduite : céfépime si CMI ≤ 1 mg/L.'}));
   L.push(C('cipro',{note:'Si S : excellente option urinaire/relais oral ; monothérapie déconseillée si SFP.'}));
   L.push(C('levo',{note:'Si S ; SNC possible.'}));
   L.push(C('cotrimox',{note:'Si S : IU, relais oral.'}));
   if(ph.blse || ph.ampc){
     L.push(C('temo',{note:'Alternative aux carbapénèmes — IU (HAS 2019). Pneumonie : seulement si CMI ≤ 4 mg/L, perfusion continue, patient stabilisé (Layios 2022). IIA : bonne diffusion biliaire/péritonéale, + métronidazole ; éviter si Enterobacter cloacae grave (Alanbari 2026). Échec hors IU lié à la gravité initiale (Mamona Kilu 2024).', pref:['uri'], grvPen:true, ecPen:true}));
     L.push(C('pipetazo',{note: ph.blse ? 'BLSE : uniquement si CMI ≤ 8 mg/L, sans gravité, source contrôlée/IU (HAS 2019 ; prudence en bactériémie — MERINO).' : 'AmpC : non fiable dans les infections graves (risque de sélection).', blseAlt:true, grvPen:true}));
     L.push(C('ertapeneme',{note:'BLSE non grave (patient non hypo-albuminémique).', grvPen:true}));
     L.push(C('merope',{note:'BLSE/AmpC grave (référence) ; SNC.', top:grave}));
     L.push(C('imipeneme',{note:'Alternative hors SNC/cérébrolésé.'}));
   } else {
     if(ctx.grp==='eb3' && !ctx.lowAmpC) L.push(C('pipetazo',{note:'Groupe 3 fortement mutant : risque de sélection de mutants dérépréssés (moindre qu\'avec les C3G) → éviter dans les infections graves (IDSA 2024) ; acceptable si patient stable (protocole NAR).', grvPen:true}));
     else L.push(C('pipetazo',{note:'Si S (élargissement non nécessaire si C3G S).', broad:true}));
     L.push(C('merope',{note:'Non justifié si molécule à spectre plus étroit active.', broad:true}));
   }
   L.push(C('amika',{note:'IU : monothérapie possible ; ailleurs association 1–3 j (choc septique).', uriMono:true}));
   if(ph.blse) { L.push(C('ceftolo',{note:'Réserve (préférer carbapénème).', broad:true})); L.push(C('cazavi',{note:'Réserve (préférer carbapénème).', broad:true})); }
   return L;
 },
 pseudo: ctx => [
   C('ceftaz',{note:'Forte posologie, perfusion prolongée/continue (SFAR/SFPT 2019).'}),
   C('cefepime',{note:'Forte posologie ; STP (neurotoxicité).'}),
   C('pipetazo',{note:'Forte posologie (4 g q6h en 3 h ou continu) ; pas pour le SNC.'}),
   C('aztreo',{note:'Allergie grave aux β-lactamines ; forte posologie.'}),
   C('cipro',{note:'IU, relais oral, os (forte posologie) ; monothérapie si S (pas SFP).'}),
   C('levo',{note:'Forte posologie (500 mg q12h).'}),
   C('merope',{note:'Si résistance aux précédents ; SNC.'}),
   C('imipeneme',{note:'Hors SNC.'}),
   C('ceftolo',{note:'DTR-PA : 1re intention (IDSA 2024).', dtr:true}),
   C('cazavi',{note:'DTR-PA.', dtr:true}),
   C('imirele',{note:'DTR-PA.', dtr:true}),
   C('cefiderocol',{note:'DTR-PA/MBL : réserve.', dtr:true}),
   C(['colistine','amika'],{note:'Sauvetage, association.', salvage:true}),
   C('amika',{note:'IU en monothérapie ; sinon association courte.', uriMono:true}), C('tobra',{note:'IU en monothérapie ; sinon association courte.', uriMono:true})
 ],
 acineto: ctx => [
   C('imipeneme',{note:'Forte posologie (1 g q6h) ; hors SNC.'}), C('merope',{note:'Forte posologie (2 g q8h, 3 h) ; SNC.'}),
   C('cotrimox',{note:'Si S.'}), C('levo',{note:'Si S (forte posologie).'}), C('amika',{note:'IU ; association.', uriMono:true}),
   C(['cefiderocol','colistine'],{note:'CRAB : association (IDSA 2024 ; sulbactam-durlobactam non disponible en France) — avis infectiologue.', salvage:true}),
   C(['colistine','merope'],{note:'CRAB : association colistine + méropénème forte dose si CMI ≤ 8.', salvage:true, nosens:['merope']}),
   C('tigec',{note:'Sauvetage IIA/peau (forte dose) ; pas en bactériémie.', salvage:true}),
   C('erava',{note:'Sauvetage IIA uniquement ; pas en bactériémie.', salvage:true, only:['abdo']})
 ],
 steno: ctx => [
   C('cotrimox',{note:'Référence (TMP 15 mg/kg/j).'}), C('levo',{note:'Forte posologie.'}),
   C(['cotrimox','levo'],{note:'Infection grave : association de 2 molécules actives (IDSA 2024).', only:['bact','pulm','snc','abces','endo']}),
   C('cefiderocol'), C('aztavi',{note:'Aztréonam-avibactam (ou CAZ-AVI + aztréonam).'}), C('tigec',{note:'Pas de concentration critique ; sauvetage.', salvage:true})
 ],
 cand_s: ctx => [ C('caspo',{note:'Échinocandine 1re intention ; ⚠ pas de membrane AN69/oXiris sous EERc.', fung:true}), C('mica',{fung:true}), C('anidula',{fung:true}), C('fluco',{note:'Désescalade à J5–7 si S et stable ; 1re intention pour SNC, urines, œil.'}), C('amphoL',{note:'Alternative ; SNC (+ flucytosine).'}), C(['amphoL','5fc'],{note:'SNC/endocardite/endophtalmie.', only:['snc','abces','endo']}), C('vorico') ],
 cand_g: ctx => [ C('caspo',{note:'⚠ pas de membrane AN69/oXiris sous EERc.'}), C('mica'), C('anidula'), C('amphoL'), C('fluco',{note:'Seulement si S (SDD) : 800 mg/j, après stabilisation.'}), C('vorico') ],
 cand_p: ctx => [ C('fluco',{note:'Préféré si S (CMI échinocandines plus élevées).'}), C('caspo'), C('mica'), C('anidula'), C('amphoL') ],
 cand_k: ctx => [ C('caspo'), C('mica'), C('anidula'), C('vorico',{note:'Relais oral.'}), C('amphoL') ],
 cand_a: ctx => [ C('caspo',{note:'Avis CNRMA ; isolement.'}), C('mica'), C('anidula'), C('amphoL') ],
 asp: ctx => [ C('vorico',{note:'STP indispensable.'}), C('isavu',{note:'Mieux tolérée, moins d\'interactions.'}), C('amphoL',{note:'Si azole-R / CI.'}), C('posa') ],
 muco: ctx => [ C('amphoL',{note:'5 mg/kg/j (10 si cérébral) + chirurgie.'}), C('isavu',{note:'Relais/alternative.'}), C('posa',{note:'Relais.'}) ],
 crypto: ctx => [ C(['amphoL','5fc'],{note:'Induction ≥ 2 sem.'}), C('fluco',{note:'Consolidation/entretien.'}) ],
 pcp: ctx => [ C('cotrimox',{note:'15–20 mg/kg/j de TMP, 21 j.'}) ],
 nocardia: ctx => [ C(['cotrimox','imipeneme','amika'],{note:'Forme grave, disséminée ou cérébrale : trithérapie (amikacine peu diffusible dans le SNC).', only:['snc','abces','bact'], top:true}), C(['cotrimox','linez'],{note:'Forme grave : association avec bonne diffusion cérébrale.'}), C('cotrimox',{note:'Pierre angulaire : 15 mg/kg/j de TMP en forme grave ; monothérapie si forme cutanée/pulmonaire non grave.'}), C('linez',{note:'Sensibilité quasi constante ; toxicité au long cours.'}), C('imipeneme',{note:'Selon espèce (N. otitidiscaviarum R).'}), C('amika',{note:'Toujours en association.', assocOnly:true}), C('ceftriax',{note:'Si S (N. farcinica souvent R).'}), C('moxi',{note:'Relais oral selon CMI.'}) ],
 moule: ctx => [ C('vorico',{note:'1re intention (Scedosporium ; Fusarium) — STP ; + terbinafine si Lomentospora prolificans.'}), C('amphoL',{note:'Fusarium : alternative/association initiale.'}), C('isavu',{note:'Selon CMI.'}), C('posa',{note:'Selon CMI.'}) ],
 hsv: ctx => [ C('aciclo'), C('foscarnet',{note:'Si résistance.'}) ], vzv: ctx => [ C('aciclo') ],
 cmv: ctx => [ C('ganci'), C('foscarnet',{note:'Résistance UL97 / myélotoxicité.'}) ],
 flu: ctx => [ C('oselta') ], covid: ctx => [ C('remdesivir',{note:'Patient sous O₂ non ventilé.'}) ],
 cdiff: ctx => [ C('fidaxo'), C('vanco',{note:'Voie ORALE 125 mg q6h.'}) ]
};
const GRP_RULE = g => (['eb1','eb2','eb3'].includes(g)?'eb':g);

/* ---------- durées ---------- */
function duration(site, germ, ctx){
 const g=germ.grp, id=germ.id;
 const fung = g.startsWith('cand');
 if(g==='nocardia') return '≈ 6 mois (≥ 12 mois si atteinte cérébrale, disséminée ou immunodépression persistante)';
 if(g==='moule') return 'Prolongée (semaines à mois) jusqu\'à résolution et restauration immunitaire';
 switch(siteCompat(site)==='snc' && site!=='abces' ? 'snc' : site){
  case 'bact': if(id==='saureus') return '≥ 14 j après la 1re hémoculture négative si non compliquée ; 4–6 sem si compliquée'; if(id==='scn') return '3–7 j (après retrait du matériel)'; if(fung) return '14 j après la 1re hémoculture négative'; if(g==='pseudo'||g==='acineto') return '7–14 j (7 j si source contrôlée et évolution rapide)'; return '7 j (bactériémie non compliquée, source contrôlée)';
  case 'pulm': if(g==='atyp') return 'Légionellose 8–14 j (21 j si immunodéprimé)'; if(g==='pneumo'||g==='hinf'||g==='strepto') return '5–7 j'; if(g==='asp') return '≥ 6–12 sem'; if(g==='pcp') return '21 j'; if(g==='flu') return '5 j'; return '7 j (PAVM — SFAR/SRLF 2017), y compris BGN non fermentants si évolution favorable';
  case 'uri': return 'PNA : 7 j (FQ/C3G), 10 j (autres) ; IU masculine : 14 j ; cystite associée aux soins 5–7 j' + (fung?' ; candidurie : 14 j si symptomatique':'');
  case 'snc': { const m={pneumo:'10 j (7 j si évolution rapidement favorable)', nmen:'5 j', hinf:'7 j', listeria:'21 j', strepto:'14–21 j (S. agalactiae)', eb1:'21 j', eb2:'21 j', eb3:'21 j', pseudo:'10–14 j (21 j proposés) après stérilisation du LCS', acineto:'10–14 j (21 j proposés) après stérilisation', staph: (id==='saureus'?'10–14 j (S. aureus) après stérilisation':'10–14 j (SCN : 10 j si LCS peu anormal)'), cuti:'10–14 j', hsv:'14–21 j', vzv:'10–14 j', crypto:'Induction ≥ 2 sem puis consolidation 8 sem'}; const nar = (g==='staph') ? ' — méningite nosocomiale (protocole NAR) : 14 j après changement/ablation de la DVE' : (['eb1','eb2','eb3','pseudo','acineto','steno'].includes(g) ? ' — méningite nosocomiale (protocole NAR) : 21 j après changement/ablation de la DVE' : ''); return (m[g]||'Selon germe et évolution (avis)') + nar + ' — retrait/changement du matériel de dérivation.'; }
  case 'abces': return '6 sem (4 sem si exérèse complète) — ESCMID 2024';
  case 'abdo': if(fung) return 'Antifongique : 8 j si contrôle rapide de la source, évolution favorable et absence de candidémie (RFE SFAR 2026 R2.3.1) ; sinon selon évolution (14 j après hémocultures négatives si candidémie)'; return 'Source contrôlée — IIA communautaire compliquée : 4 j (y compris sepsis, drainage percutané/endoscopique) ; appendicite compliquée : 2 j ; associée aux soins sans sepsis : 4 j ; associée aux soins avec sepsis/choc ou complication post-opératoire : 8 j (au-delà : discussion multidisciplinaire) — RFE SFAR 2026';
  case 'peau': return '7–14 j selon chirurgie/évolution';
  case 'os': return '6 sem (12 sem si matériel conservé)';
  case 'endo': return '4–6 sem (valve native/prothèse)';
  case 'kt': { if(id==='saureus') return '≥ 14 j après retrait'; if(id==='scn') return '3–7 j après retrait (abstention possible si retrait et patient stable)'; if(fung) return '14 j après hémocultures négatives'; if(g==='pseudo') return '7–10 j après retrait'; return '7 j après retrait'; }
 }
 return '—';
}

/* ---------- patient / posologie ---------- */
function weights(p){
 const h=+p.height||0, w=+p.weight||0, male=p.sex!=='F';
 if(!w) return {tbw:0};
 let ibw = h? (male?50:45.5)+0.91*(h-152.4) : w; if(ibw>w) ibw=w;
 const abw = ibw+0.4*(w-ibw);
 const bmi = h? w/((h/100)**2) : 0;
 const lbw = h? (male? 9270*w/(6680+216*bmi) : 9270*w/(8780+244*bmi)) : w;
 return {tbw:w, ibw:Math.round(ibw*10)/10, abw:Math.round(abw*10)/10, lbw:Math.round(lbw*10)/10, bmi:Math.round(bmi*10)/10, obese: bmi>=30};
}
function cockcroft(p, wkg){
 const age=+p.age, cr=+p.creat; if(!age||!cr||!wkg) return null;
 const k = p.sex==='F'?1.04:1.23; return Math.round(k*(140-age)*wkg/cr);
}
function crclMeasured(p){ const u=+p.ucr, v=+p.uvol, h=+p.uhours||24, s=+p.creat; if(!u||!v||!s) return null; return Math.round((u*1000)*(v)/(s)/(h*60)); } // U (mmol/L)→µmol/L ; V mL ; S µmol/L
window.weights=weights; window.cockcroft=cockcroft; window.crclMeasured=crclMeasured;

function effCrcl(p){
 if(p.crclManual) return +p.crclManual;
 const m=crclMeasured(p); if(m) return m;
 const W=weights(p); const wk = W.obese? W.abw : W.tbw; return cockcroft(p,wk);
}
function band(p){
 if(p.eer==='crrt') return 'crrt'; if(p.eer==='ihd') return 'ihd';
 const c=effCrcl(p); if(c==null||isNaN(c)) return null;
 if(c>=130) return 'arc'; if(c>=50) return 'n'; if(c>=30) return 'm'; if(c>=10) return 's'; return 'es';
}
const BAND_L = {arc:'Hyperclairance (ClCr ≥ 130)', n:'ClCr 50–129', m:'ClCr 30–49', s:'ClCr 10–29', es:'ClCr < 10 (non dialysé)', crrt:'EER continue', ihd:'Hémodialyse intermittente'};
window.effCrcl=effCrcl; window.band=band; window.BAND_L=BAND_L;

const r50 = x=>Math.round(x/50)*50, r10=x=>Math.round(x/10)*10;
function dosingWeight(drugId, p){
 const W=weights(p); if(!W.tbw) return null;
 const ob = window.OBESE[drugId];
 if(W.obese && ob){ if(ob.wt==='ABW') return {w:W.abw,l:'poids ajusté'}; if(ob.wt==='IBW') return {w:W.ibw,l:'poids idéal'}; }
 return {w:W.tbw,l:'poids total'};
}
/* calculs chiffrés pour les molécules dosées au poids */
function calc(drugId, regKey, p){
 const dw = dosingWeight(drugId,p); if(!dw) return '';
 const w=dw.w, L=` (${dw.l} ${w} kg)`;
 const W=weights(p);
 switch(drugId){
  case 'vanco': {
    const tw = W.tbw; const dc = Math.min(3000, r50((W.obese?22.5:27.5)*tw));
    const c = effCrcl(p); let maint='';
    if(p.eer==='crrt') maint = '≈ 1–1,5 g/24 h en continu, ajuster à la Css';
    else if(p.eer==='ihd') maint='500–1000 mg après chaque séance selon taux pré-dialyse';
    else if(c){ const clv=(0.689*Math.min(c,200)+3.66)*1.44; const lo=r50(20*clv), hi=r50(25*clv); maint=`${lo}–${hi} mg/24 h en continu (cible Css 20–25 mg/L, Matzke, ClCr ${c})`; }
    return `DC ≈ ${dc} mg (poids total ${tw} kg) puis ${maint||'selon ClCr'}`;}
  case 'amika': return `${r50(25*w)}–${r50(30*w)} mg DUJ${L}`;
  case 'genta': case 'tobra': return `${r10(5*w)}–${r10(7*w)} mg DUJ${L}`;
  case 'amox': return regKey==='snc'? `${(200*w/1000).toFixed(1)} g/24 h${L}` : regKey==='high'? `${(100*w/1000).toFixed(1)}–${Math.min(12,(200*w/1000)).toFixed(1)} g/24 h${L}` : `${(50*w/1000).toFixed(1)}–${(100*w/1000).toFixed(1)} g/24 h${L}`;
  case 'cloxa': return regKey==='snc'? `${Math.min(12,200*w/1000).toFixed(1)} g/24 h${L}` : `${(100*w/1000).toFixed(1)}–${Math.min(12,200*w/1000).toFixed(1)} g/24 h${L}`;
  case 'cefazoline': return `${Math.min(8,80*w/1000).toFixed(1)}–${Math.min(8,100*w/1000).toFixed(1)} g/24 h${L}`;
  case 'cefotax': return regKey==='snc'? `${Math.min(24,300*w/1000).toFixed(1)} g/24 h${L}` : '';
  case 'ceftriax': return regKey==='snc'? `${(75*w/1000).toFixed(1)}–${(100*w/1000).toFixed(1)} g/24 h en 1–2 inj.${L}` : '';
  case 'aciclo': return `${r50(10*w)} mg q8h${L}`;
  case 'cotrimox': return regKey==='high'||regKey==='snc' ? `TMP ${r10(15*w)} mg/24 h (≈ ${Math.round(15*w/80)} amp. 400/80 par 24 h)${L}` : '';
  case 'fluco': return `DC ${Math.min(1600,r50(12*w))} mg puis ${Math.min(800,r50(6*w))} mg/j${L}`;
  case 'vorico': return `IV : ${r10(6*w)} mg q12h × 2 puis ${r10(4*w)} mg q12h${L}`;
  case 'amphoL': return `${r10(3*w)} mg/j (3 mg/kg) — ${r10(5*w)} mg/j (5 mg/kg)${L}`;
  case 'dapto': return `${r50(8*w)}–${r50(12*w)} mg q24h${L}`;
  case 'teico': return `${r50(12*w)} mg q12h × 3–5 puis ${r50(12*w)} mg q24h${L}`;
  case 'ganci': return `${r10(5*w)} mg q12h (induction)${L}`;
  case '5fc': return `${r50(25*w)} mg q6h${L}`;
  case 'rifam': return `${Math.min(1200,r50(10*w))} mg q12–24h${L}`;
  case 'linez': return '';
 }
 return '';
}
window.calcDose = calc;

function regimenFor(drug, ast, sites, grp, ctx){
 const hasSnc = sites.some(s=>siteCompat(s)==='snc');
 if(hasSnc && drug.dose.snc) return 'snc';
 if(!drug.dose.high) return 'std';
 // Réanimation : posologie de départ = forte posologie (SFAR/SFPT 2019 : cible fC 4–8 × CMI).
 // Exceptions : molécules dont la « forte posologie » est réservée à des germes/situations précis.
 const special = {tigec:['eb1','eb2','eb3','acineto','steno'], cotrimox:['steno'], levo:null, cipro:null};
 if(drug.id in special && special[drug.id] && !special[drug.id].includes(grp)) return 'std';
 const P = window.__PAT || {};
 if(P.stdOk && ast==='S' && !P.grave && !hasSnc && !(grp==='pseudo'||grp==='acineto')) return 'std';
 return 'high';
}
window.regimenFor = regimenFor;

/* ---------- évaluation d'un isolat ---------- */
function astStatus(drugId, iso, germ){
 const raw = (iso.ast||{})[drugId];
 const nat = (NAT[germ.grp]||[]).concat(NAT_GERM[germ.id]||[]);
 if(nat.includes(drugId)) return {s:'R', why:'résistance naturelle'};
 // inférences
 const ph = iso.ph||{};
 if(germ.grp==='staph'){
   if(ph.mr && BL.includes(drugId) && drugId!=='ceftaroline') return {s:'R', why:'méticillino-résistance (toutes β-lactamines sauf ceftaroline)'};
   if(!ph.mr && ['cefazoline','amoxclav'].includes(drugId) && !raw) return {s:'S', why:'déduit de la sensibilité à l\'oxacilline'};
   if(!ph.mr && ((iso.ast||{}).cloxa==='S' || ph.mr===false) && ['cefotax','ceftriax','cefepime','pipetazo','ertapeneme','merope','imipeneme','ceftaroline'].includes(drugId) && !raw) return {s:'S', why:'déduit (SAMS : sensible aux β-lactamines stables vis-à-vis de la pénicillinase)'};
   if(!ph.mr && drugId==='cloxa' && !raw) return {s:'S', why:'oxacilline/céfoxitine S'};
 }
 if(['eb1','eb2','eb3'].includes(germ.grp)){
   if(ph.blse && ['cefotax','ceftriax','ceftaz','cefepime','aztreo','amox','amoxclav','cefazoline'].includes(drugId)) return {s:'R', why:'BLSE : à considérer comme non fiable'};
   if(ph.ampc && ['cefotax','ceftriax','ceftaz','amoxclav','amox','cefazoline'].includes(drugId) && raw!=='S') return {s:'R', why:'céphalosporinase hyperproduite'};
 }
 if(raw==='I') return {s:'SFP'};
 if(raw) return {s:raw};
 const exp = EXPECT[germ.grp]||[];
 if(exp.includes(drugId)) return {s:'E', why:'non testé — sensibilité attendue'};
 return {s:'', why:'non testé'};
}
window.astStatus = astStatus;

const SITE_PREF = {
 linez:{pulm:-35, snc:-25, abces:-25, bact:25, endo:45, kt:15, os:5},
 vanco:{pulm:15},
 teico:{pulm:20, snc:40, abces:40},
 tigec:{bact:80, pulm:40, endo:80},
 erava:{bact:80, pulm:60},
 colistine:{pulm:20},
 amika:{pulm:15, snc:30}, genta:{pulm:15, snc:30}, tobra:{pulm:15, snc:30},
 temo:{pulm:25},
 ertapeneme:{snc:40},
 cotrimox:{pulm:10},
 dapto:{endo:-5, bact:-5, snc:40, abces:40}
};
function evaluate(iso, sites, pat, opts={}){
 const germ = G[iso.germ]; if(!germ) return {error:'Germe non reconnu'};
 const ph = iso.ph||{};
 if(germ.grp==='staph' && ph.mr==null){ const o=(iso.ast||{}).cloxa; ph.mr = (o==='R'); }
 const ctx = {grp:germ.grp, ph, grave:!!pat.grave, lowAmpC:germ.ampc==='faible'};
 const rf = RULES[GRP_RULE(germ.grp)]; if(!rf) return {germ, options:[], notes:['Pas de règle de traitement pour ce germe.']};
 const cands = rf(ctx);
 const out=[], excluded=[];
 cands.forEach((c,idx)=>{
   if(c.only && !sites.some(s=>c.only.includes(s))) return;
   // allergie
   const allergy = pat.allergy||'none';
   const bls = c.d.filter(x=>BL.includes(x));
   if(allergy==='severe' && bls.some(x=>x!=='aztreo' && x!=='aztavi')){ excluded.push({c, why:'allergie grave aux β-lactamines'}); return; }
   if(allergy==='peni' && bls.some(x=>PENI.includes(x))){ excluded.push({c, why:'allergie aux pénicillines'}); return; }
   if(c.allergy && allergy==='none') return; // option réservée à l'allergie
   // sensibilité
   const st = c.d.map(x=>({id:x, ...astStatus(x,iso,germ)}));
   const need = c.d.filter((x,i)=>!(c.opt2 && i>0) && !(c.nosens||[]).includes(x));
   const bad = st.filter(s=>need.includes(s.id) && !(s.s==='S'||s.s==='SFP'||s.s==='E'));
   if(bad.length){ if(bad.every(b=>b.s==='')) excluded.push({c, why:'non testé : '+bad.map(b=>D[b.id].name).join(', ')}); else excluded.push({c, why:bad.map(b=>`${D[b.id].name} : ${b.s==='R'?'R':'non testé'}${b.why?' ('+b.why+')':''}`).join(' ; ')}); return; }
   // compatibilité sites
   const siteIssues=[]; let blocked=false;
   sites.forEach(s=>{
     const sc = siteCompat(s);
     c.d.forEach(x=>{ const v=(D[x].site||{})[sc]; if(v==='no'){ if(!(c.d.length>1 && c.d.some(y=>y!==x && (D[y].site||{})[sc]==='ok'))) { blocked=true; siteIssues.push({x,s,v}); } else siteIssues.push({x,s,v:'caution'}); } else if(v==='caution') siteIssues.push({x,s,v}); });
   });
   if(c.uriMono && !(sites.length===1 && sites[0]==='uri')){ siteIssues.push({x:c.d[0],s:sites.find(s=>s!=='uri')||sites[0],v:'assoc'}); }
   if(blocked){ excluded.push({c, why:'inadapté au site : '+siteIssues.filter(i=>i.v==='no').map(i=>`${D[i.x].name} / ${SITES.find(z=>z.id===i.s).l}`).join(', ')}); return; }
   let score = idx*10 + siteIssues.filter(i=>i.v==='caution').length*15 + (c.salvage?200:0) + (c.broad?60:0) + (c.assocOnly?300:0) + (c.uriMono && !(sites.length===1&&sites[0]==='uri')?250:0);
   if(c.prefer && sites.some(s=>c.prefer.includes(s))) score -= 25;
   if(c.pref && sites.every(s=>c.pref.includes(s))) score -= 15;
   if(c.pref && !sites.every(s=>c.pref.includes(s))) score += 40;
   if(c.grvPen && pat.grave) score += 120;
   if(c.top) score -= 200;
   // préférences de site (diffusion, bactéricidie) : ex. linézolide préféré à la vancomycine dans la pneumonie à SARM
   c.d.forEach(x=>{ const sp=SITE_PREF[x]; if(sp) sites.forEach(s=>{ const k=sp[s]!=null?s:siteCompat(s); if(sp[k]) score += sp[k]; }); });
   if(c.ecPen && germ.id==='ecloacae' && sites.includes('abdo')) score += 150;
   if(c.dtr && st.every(s=>s.s==='S'||s.s==='SFP') && out.some(o=>!o.c.dtr && !o.c.salvage)) score += 80;
   if(st.some(s=>s.s==='SFP')) score += 5;
   if(st.some(s=>s.s==='E')) score += 3;
   // neuro
   const warns=[];
   if(pat.valproate && c.d.some(x=>['merope','imipeneme','ertapeneme','imirele','merovabor'].includes(x))) { warns.push('⚠ Acide valproïque : association déconseillée (chute de la valproatémie)'); score+=50; }
   if(pat.nimodipine && c.d.includes('rifam')) { warns.push('⚠ Nimodipine : contre-indiquée avec la rifampicine'); score+=200; }
   if(pat.neuro && c.d.includes('imipeneme')) { warns.push('⚠ Cérébrolésé : imipénème pro-convulsivant'); score+=40; }
   if(pat.neuro && c.d.includes('cefepime')) warns.push('Céfépime : neurotoxicité — STP, EEG si trouble de conscience');
   if(pat.neuro && c.d.some(x=>['cipro','levo','moxi'].includes(x))) warns.push('FQ : abaissement du seuil épileptogène');
   if(pat.eer==='crrt' && c.d.includes('caspo')) warns.push('⚠ EERc : pas de membrane AN69/AN69-ST/oXiris avec la caspofungine (ANSM 2025)');
   if(c.d.includes('fosfo') && pat.neuro) warns.push('Fosfomycine : charge sodée (hypernatrémie)');
   out.push({c, st, siteIssues, score, warns});
 });
 out.sort((a,b)=>a.score-b.score);
 return {germ, options:out, excluded, ctx};
}
window.evaluate = evaluate;

/* combinaison de plusieurs isolats */
function combine(results, sites){
 const valid = results.filter(r=>r && r.options && r.options.length);
 if(valid.length<2) return null;
 const maps = valid.map(r=>{ const m={}; r.options.forEach(o=>{ const k=o.c.d.slice().sort().join('+'); if(m[k]==null || o.score<m[k].score) m[k]=o; }); return m; });
 const keys = Object.keys(maps[0]).filter(k=>maps.every(m=>m[k]));
 const common = keys.map(k=>{ const opts=maps.map(m=>m[k]); const nd=k.split('+').length; const salv=opts.some(o=>o.c.salvage||o.c.assocOnly);
   return {k, opts, nd, salv, score: opts.reduce((a,o)=>a+o.score,0)/opts.length + (nd-1)*40 + (salv?300:0)}; })
  .sort((a,b)=>a.score-b.score);
 const tops = valid.map(r=>r.options[0]);
 return {common, tops};
}
window.combineIsolates = combine;
window.durationFor = duration;
window.ENGINE_INFO = {NAT, NAT_GERM, EXPECT};
})();
