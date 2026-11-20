/* FACTEURS DE RISQUE DE GERMES À COUVRIR (affichés en touchant le nom du germe dans les textes, et listés dans Hygiène).
   FDR[clé] = {t, germ (id fiche), blocks:[{ctx, items:[…], s:'NAR'|refId}]} ; FDR_TERMS : terme du texte → clé. */
window.FDR = {
 sarm: {t:'Facteurs de risque de SARM', germ:'saureus', blocks:[
  {ctx:'Pneumopathie acquise en réanimation — protocole NAR (ajouter le linézolide si ≥ 1)', s:'NAR', items:['Colonisation récente à SARM','Dialyse chronique','Lésion cutanée chronique']},
  {ctx:'PAVM — FdR de BMR (SFAR/SRLF 2017)', s:'sfar_pavm17', items:['Antibiothérapie dans les 90 jours','Hospitalisation ≥ 5 jours','Colonisation connue','Écologie locale']}
 ]},
 pyo: {t:'Facteurs de risque de Pseudomonas aeruginosa', germ:'paeru', blocks:[
  {ctx:'Pneumopathie acquise en réanimation — protocole NAR (couvrir P. aeruginosa)', s:'NAR', items:['Pneumopathie tardive (> 5 j)','Antibiothérapie dans les 90 jours','Dialyse']},
  {ctx:'PAC (SPILF/SPLF 2025)', s:'spilf_pac25', items:['Dilatation des bronches','Mucoviscidose','Exacerbation de BPCO colonisée à P. aeruginosa']},
  {ctx:'PAVM — FdR de BMR (SFAR/SRLF 2017)', s:'sfar_pavm17', items:['Antibiothérapie dans les 90 jours','Hospitalisation ≥ 5 jours','Colonisation connue','Écologie locale']}
 ]},
 blse: {t:'Facteurs de risque d\'entérobactérie BLSE', germ:'ecoli', blocks:[
  {ctx:'Protocole NAR (pneumopathie) : carbapénème seulement si', s:'NAR', items:['Portage de BLSE connu <b>et</b> signes de gravité (choc, immunodépression)']},
  {ctx:'Infections urinaires (SPILF 2015, actualisation 2018)', s:'spilf_recos', items:['Antécédent de colonisation ou d\'IU à E-BLSE < 6 mois','Amoxicilline-acide clavulanique, C2G, C3G ou fluoroquinolone < 6 mois','Voyage récent en zone d\'endémie','Hospitalisation < 3 mois','Vie en long séjour'], note:'Le référentiel national d\'urologie (LiSA 2024) retient 3 mois pour la colonisation et les antibiotiques.'},
  {ctx:'IIA communautaire (RFE SFAR 2026, Tableau 1)', s:'sfar_iia26', items:['Infection ou colonisation à BLSE < 6 mois','Amoxicilline-acide clavulanique, C2G/C3G ou fluoroquinolone dans les 6 mois','Voyage en zone d\'endémie < 3 mois','EHPAD/SLD avec dispositif invasif permanent (sonde urinaire, gastrostomie)','Prévalence locale élevée'], note:'Choc septique avec ≥ 1 FdR : carbapénème selon la prévalence locale (R1.2.5).'},
  {ctx:'Carbapénème probabiliste (HAS 2019 ; RFE SFAR IIA 2026)', s:'has_carba19', items:['Colonisation ou infection à BLSE documentée (< 3 mois HAS ; < 6 mois SFAR, R1.2.3) + gravité']}
 ]},
 bhre: {t:'Facteurs de risque de BHRe (EPC, ERG) — patients à dépister à l\'admission', germ:'', blocks:[
  {ctx:'HCSP 2019', s:'hcsp_bhre19', items:['Hospitalisation ≥ 24 h à l\'étranger dans les 12 derniers mois (dont rapatriement sanitaire) — y compris dialyse à l\'étranger','Séjour à l\'étranger < 3 mois sans hospitalisation : selon analyse de risque (durée, pays, antibiotiques, modalités du voyage)','Patient contact à risque élevé réhospitalisé','Porteur connu réhospitalisé'], note:'Isolement (précautions spécifiques BHRe) et écouvillonnage rectal dès l\'admission : voir Hygiène.'}
 ]},
 candida: {t:'Facteurs de risque de candidose invasive', germ:'calbicans', blocks:[
  {ctx:'Protocole NAR', s:'NAR', items:['Antibiothérapie préalable ; accès vasculaires ; ventilation invasive ; réanimation > 7 j ; nutrition parentérale exclusive','Colonisation fongique ; chirurgie abdominale récente ; insuffisance rénale ; hémodialyse','Score APACHE II > 20 ; hémopathie maligne, cancer solide, neutropénie ; corticothérapie prolongée, immunosuppresseurs, chimiothérapie'], note:'Candida score ≥ 2,5 (NPE exclusive 1, colonisation 1, sepsis sévère 2, chirurgie à l\'admission 1) ou Peritonitis score ≥ 3 → mannane/anti-mannane + β-D-glucane.'}
 ]}
,
 bmr: {t:'Facteurs de risque de BMR (bactéries multirésistantes)', germ:'', blocks:[
  {ctx:'IIA associée aux soins (RFE SFAR 2026, Tableau 1)', s:'sfar_iia26', items:['C3G ou fluoroquinolone dans les 3 mois','Portage < 3 mois d\'une BLSE ou d\'un P. aeruginosa ceftazidime-R (tout site)','Hospitalisation à l\'étranger dans les 12 mois','EHPAD/SLD avec dispositif invasif permanent (sonde urinaire, gastrostomie)','Échec d\'un traitement par C3G, fluoroquinolone ou pipéracilline-tazobactam','Récidive < 15 j d\'une infection traitée ≥ 3 j par pipéracilline-tazobactam'], note:'Imipénème ou méropénème si ≥ 2 FdR, ou ≥ 1 FdR avec sepsis/choc (R1.2.10).'},
  {ctx:'PAVM (SFAR/SRLF 2017)', s:'sfar_pavm17', items:['Antibiothérapie dans les 90 jours','Hospitalisation ≥ 5 jours','Colonisation connue','Écologie locale']}
 ]},
 enteroR: {t:'Facteurs de risque d\'entérocoque ampicilline-R (E. faecium)', germ:'efaecium', blocks:[
  {ctx:'IIA (RFE SFAR 2026, Tableau 1)', s:'sfar_iia26', items:['Origine hépatobiliaire suspectée','Transplantation hépatique, immunodépression','Patient déjà sous antibiotiques ou C3G préalable'], note:'Choc septique sous céfépime-métronidazole, ou sous pip-tazo avec FdR : ajouter linézolide, vancomycine ou teicoplanine (R1.2.8–R1.2.9).'}
 ]},
 flucoR: {t:'Facteurs de risque de Candida fluconazole-R', germ:'cglabrata', blocks:[
  {ctx:'IIA (RFE SFAR 2026, Tableau 4)', s:'sfar_iia26', items:['Exposition récente aux azolés','Écologie hospitalière','Insuffisance rénale chronique','Neutropénie','Tumeur solide'], note:'Espèces naturellement résistantes ou de sensibilité diminuée : N. glabratus (C. glabrata), P. kudriavzevii (C. krusei), C. auris… → échinocandine.'}
 ]},
 listeria: {t:'Terrain à risque de listériose', germ:'listeria', blocks:[
  {ctx:'Méningite : ajouter l\'amoxicilline en probabiliste (fiche Listeria)', s:'spilf_mening18', items:['Sujet âgé','Immunodépression (corticoïdes, cancer)','Grossesse','Cirrhose'], note:'Signes de rhombencéphalite : ajouter l\'amoxicilline quel que soit le terrain.'}
 ]},
 periscore: {t:'Peritonitis score (Dupont 2003) — risque de péritonite à Candida', germ:'calbicans', blocks:[
  {ctx:'1 point par critère ; antifongique si ≥ 3 (RFE SFAR 2026, R1.2.13 — IIA communautaire avec sepsis/choc ou associée aux soins)', s:'sfar_iia26', items:['Défaillance hémodynamique','Sexe féminin','Chirurgie (origine) sus-mésocolique','Antibiothérapie > 48 h'], note:'Levures à l\'examen direct du liquide péritonéal : traiter quel que soit le score. Échinocandine si complication post-opératoire ou FdR de souche fluconazole-R, sinon fluconazole.'},
  {ctx:'Protocole NAR', s:'NAR', items:['Sepsis malgré ≥ 48 h d\'antibiotiques + FdR, et Peritonitis score ≥ 3 (ou Candida score ≥ 2,5) → mannane/anti-mannane + β-D-glucane']}
 ]},
 ei: {t:'Terrain à risque d\'endocardite infectieuse', germ:'', blocks:[
  {ctx:'Fiche Endocardite infectieuse (ESC 2023)', s:'esc_ei23', items:['Prothèse valvulaire / TAVI','Antécédent d\'endocardite','Cardiopathie congénitale','Toxicomanie IV','Stimulateur cardiaque / DAI','Hémodialyse, cathéters']}
 ]},
 pss: {t:'Score de Pittsburgh (gravité d\'une perforation œsophagienne, 0–18)', germ:'', blocks:[
  {ctx:'1 point', s:'schweigert16', items:['Âge > 75 ans','Tachycardie > 100/min','Leucocytes > 10 G/L','Épanchement pleural']},
  {ctx:'2 points', items:['Fièvre > 38,5 °C','Fuite non contenue (scanner ou opacification)','Détresse respiratoire (FR > 30/min, besoins croissants en O2 ou ventilation mécanique)','Délai diagnostique > 24 h']},
  {ctx:'3 points', items:['Cancer de l\'œsophage','Hypotension'], note:'Strates : ≤ 2 faible, 3–5 intermédiaire, > 5 élevé ; morbidité, recours à la chirurgie et mortalité augmentent avec la strate (validation multicentrique, Schweigert 2016). Aide à la décision, ne remplace pas l\'avis chirurgical.'}
 ]},
 candscore: {t:'Candida score (León 2006)', germ:'calbicans', blocks:[
  {ctx:'Protocole NAR — seuil ≥ 2,5', s:'NAR', items:['Nutrition parentérale exclusive : 1','Colonisation fongique : 1','Sepsis sévère : 2','Chirurgie à l\'admission : 1'], note:'Score ≥ 2,5 (ou Peritonitis score ≥ 3) chez un patient en sepsis malgré ≥ 48 h d\'antibiotiques → mannane/anti-mannane + β-D-glucane.'}
 ]}
};
window.FDR_TERMS = {'SARM':'sarm','anti-SARM':'sarm','P. aeruginosa':'pyo','Pseudomonas aeruginosa':'pyo','anti-Pseudomonas':'pyo','BLSE':'blse','E-BLSE':'blse','EBLSE':'blse','BHRe':'bhre','EPC':'bhre','ERG':'bhre','candidose':'candida','candidose invasive':'candida','Peritonitis score':'periscore','score péritonite':'periscore','Candida score':'candscore','score de Pittsburgh':'pss','Score de Pittsburgh':'pss'};
/* « FdR » dans le texte : la liste correspondante est déduite du contexte (ce qui suit, sinon ce qui précède) */
window.FDR_CTX = [
 [/^\s*(?:de |d['’])?\s*(?:souche |Candida |candida )?fluconazole-?R|^\s*de résistance au fluconazole/,'flucoR'],
 [/^\s*(?:de |d['’])?\s*(?:BMR|bactéries? multi-?résistantes?)/,'bmr'],
 [/^\s*(?:de |d['’])?\s*(?:E-?BLSE|BLSE)/,'blse'],
 [/^\s*(?:de |d['’])?\s*SARM/,'sarm'],
 [/^\s*(?:de |d['’])?\s*(?:P\. aeruginosa|Pseudomonas)/,'pyo'],
 [/^\s*(?:de |d['’])?\s*(?:E\. faecium|entérocoque)/,'enteroR'],
 [/^\s*(?:de |d['’])?\s*(?:candidose|Candida(?! score))/,'candida'],
 [/^\s*(?:de |d['’])?\s*listériose/,'listeria'],
 [/^\s*(?:de |d['’])?\s*(?:BHRe|EPC)/,'bhre'],
 [/^\s*→\s*Candida score/,'candida'],
 [/^\s*(?:de |d['’])?\s*(?:EI\b|endocardite)/,'ei']
];
window.FDR_BEFORE = [[/(?:Précoce|précoce|Tardive|tardive)\b[^.;]*$/,'bmr'],[/anti-SARM|SARM/,'sarm'],[/entérocoque|E\. faecium/,'enteroR'],[/BMR/,'bmr'],[/BLSE/,'blse'],[/P\. aeruginosa|Pseudomonas/,'pyo'],[/fluconazole/,'flucoR'],[/candidose|Candida/,'candida']];
