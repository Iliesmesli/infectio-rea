/* PROTOCOLE DU SERVICE (NAR — Neuro-Anesthésie-Réanimation, CHU de Bordeaux, Protocoles médicaux 2025, § 1.3.6 Infectiologie)
   Règle de l'application : quand le protocole NAR existe, il est PRIORITAIRE ; les écarts avec les recommandations sont signalés (champ diff).
   n = fonction rénale normale / EER ; arc = hyperclairance > 150 mL/min ; seuil = seuil d'adaptation à l'insuffisance rénale (adaptation après 24 h de pleine dose, selon GPR) ;
   snc = doses méningées (tableau du § 1.3.6.3) ; cmax = concentration maximale ; stab = stabilité. */
window.NARP = {
 amox: {n:'2 g × 3/j IVL 1 h', arc:'2 g × 4–5/j IVL 1 h', seuil:'30 mL/min', snc:'2 g puis 200 mg/kg/j', cmax:'20 mg/mL', stab:'8 h à 25 °C',
  diff:'Recos (SPILF/SFPT/CA-SFM 2025) : forte posologie 100–200 mg/kg/j (q4h ou continu) pour Pseudomonas-like/anaérobies/entérocoque — le protocole NAR retient 6 g/j (8–10 g/j si hyperclairance) hors méningite.'},
 amoxclav: {n:'2 g × 3/j IVL 1 h', arc:'2 g × 4–5/j IVL 1 h', seuil:'30 mL/min', cmax:'20 mg/mL', stab:'8 h à 25 °C',
  diff:'Recos : 1 g q6–8h (2 g q8h en forte posologie) ; acide clavulanique ≤ 200 mg par injection (1,2 g/j).'},
 cloxa: {n:'10–12 g/24 h en continu (2 g/48 mL à 10–12 mL/h)', arc:'10–12 g/24 h en continu', seuil:'30 mL/min', snc:'2 g puis 200 mg/kg/j IVSE ou IVL en 4–6 prises', cmax:'50 mg/mL', stab:'24 h à 25 °C',
  diff:'Recos : 100–200 mg/kg/j — équivalent chez l\'adulte de 60–80 kg.'},
 pipetazo: {n:'Bolus 4 g IVL 1 h puis 16 g/24 h en continu (8 g/48 mL à 4 mL/h)', arc:'Bolus 4 g puis 20 g/24 h (8 g/48 mL à 5 mL/h)', seuil:'40 mL/min', cmax:'160 mg/mL', stab:'24 h à 25 °C',
  diff:'Concordant avec la RFE SFAR IIA 2026 (16 g/24 h ; 20 g si ClCr mesurée > 130).'},
 cefazoline: {n:'Bolus 2 g IVL 1 h puis 10–12 g/24 h (100 mg/kg/j) en continu (4 g/48 mL à 5 mL/h)', arc:'Bolus 2 g puis 12–14 g/24 h (150 mg/kg/j) (4 g/48 mL à 6 mL/h)', seuil:'60 mL/min', snc:'8–12 g/j IVSE', cmax:'100 mg/mL', stab:'24 h à 25 °C',
  diff:'Recos (RCP, SPILF) : 80–100 mg/kg/j, ≈ 6–8 g/24 h maximum — le protocole NAR va jusqu\'à 12–14 g/24 h. ⚠ Hypovitaminose K : TP 1×/semaine (NAR).'},
 cefotax: {n:'Bolus 2 g IVL 1 h puis 6 g/24 h en continu (1 g/48 mL à 12 mL/h)', arc:'Bolus 2 g puis 8 g/24 h (1 g/48 mL à 16 mL/h)', seuil:'60 mL/min', snc:'200 mg/kg/j IVSE ; 300 mg/kg/j si S. pneumoniae', cmax:'20 mg/mL', stab:'24 h à 25 °C',
  diff:'Méningite (SPILF 2018) : 300 mg/kg/j d\'emblée en probabiliste, réduit à 200 mg/kg/j si pneumocoque de CMI ≤ 0,5 — le protocole NAR part de 200 mg/kg/j (300 si pneumocoque).'},
 ceftriax: {n:'2 g × 1/j IVL 30 min', arc:'2 g × 2/j IVL 30 min', seuil:'pas d\'adaptation', snc:'2 g × 3/j IVL sur 10 min ; 100 mg/kg/j si S. pneumoniae', cmax:'20 mg/mL', stab:'24 h à 25 °C',
  diff:'Méningite (SPILF 2018) : 75–100 mg/kg/j en 1–2 injections (≈ 4 g/j) — le tableau NAR indique 2 g × 3/j (6 g/j) : écart à vérifier avec l\'équipe.'},
 ceftaz: {n:'Bolus 2 g IVL 1 h puis 6 g/24 h en continu (2 g/48 mL à 6 mL/h)', arc:'Bolus 2 g puis 6 g/24 h', seuil:'60 mL/min', snc:'2 g puis 100 mg/kg/j IVSE', cmax:'80 mg/mL', stab:'8 h à 25 °C',
  diff:'Concordant (forte posologie 6 g/24 h).'},
 cefepime: {n:'Bolus 2 g IVL 1 h puis 6 g/24 h en continu (2 g/48 mL à 6 mL/h)', arc:'Bolus 2 g puis 6 g/24 h', seuil:'50 mL/min', snc:'2 g puis 6 g/24 h IVSE ; dosage systématique à 48 h ± EEG', cmax:'100 mg/mL', stab:'24 h à 25 °C',
  diff:'Concordant ; neurotoxicité : dosage (NAR : systématique à 48 h en méningé).'},
 ceftolo: {n:'Bolus 2 g IVL 1 h puis 1 g × 3/j IVL 3 h (3 g/24 h)', arc:'Bolus 2 g puis 6 g/24 h en continu (2 g/48 mL à 6 mL/h)', seuil:'50 mL/min', cmax:'80 mg/mL', stab:'8 h à 25 °C',
  diff:'Recos/RCP : pneumonie nosocomiale/PAVM = 2 g/1 g q8h (dose double de celle des IIA/IU) — la dose « fonction normale » du protocole NAR correspond à la dose IIA/IU : en pneumonie, préférer 2 g/1 g q8h (avis référent).'},
 ceftaroline: {n:'600 mg × 2/j IVL 1 h', arc:'600 mg × 3/j IVL 1 h', seuil:'50 mL/min', cmax:'12 mg/mL', stab:'1 h à 25 °C', diff:'Concordant.'},
 aztreo: {n:'6 g/24 h en continu (2 g/48 mL à 6 mL/h)', arc:'8 g/24 h (4 g/48 mL à 4 mL/h)', seuil:'30 mL/min', cmax:'100 mg/mL', stab:'24 h à 25 °C', diff:'Concordant.'},
 merope: {n:'Bolus 2 g IVL 1 h puis 2 g × 3/j IVL 3 h', arc:'Bolus 2 g puis 2 g × 3/j IVL 3 h', seuil:'50 mL/min', snc:'2 g puis 2 g × 3/j IVL sur 3 h', cmax:'80 mg/mL', stab:'24 h à 25 °C (tableau NAR)',
  diff:'Stabilité : la RFE SFAR IIA 2026 et les données SPILF/SFPC 2025 imposent de renouveler toute solution de méropénème au plus toutes les 8 h à 25 °C — la mention « 24 h » du tableau NAR est à vérifier. Perfusion de 3 h : sans conséquence.'},
 vanco: {n:'Bolus 20 mg/kg puis 30 mg/kg/j IVSE ; plateau visé 20–30 mg/L', arc:'Bolus 20 mg/kg puis 35 mg/kg/j IVSE', seuil:'40 mL/min : « alternative à envisager (avis référent) » ; le tableau garde 20 mg/kg puis 30 mg/kg/j, adaptation sur dosage à H24', snc:'DC 30 mg/kg IVL 2 h puis 60 mg/kg/j IVSE ; cible 30–40 mg/L', cmax:'VVC 80 mg/mL ; VVP 5 mg/mL', stab:'24 h à 25 °C', admin:'Dilution 2 g/48 mL → vitesse (mL/h) = posologie/24 h. Dosage 24 h après introduction ou modification ; surdosage : arrêt transitoire à discuter.',
  diff:'Recos (CA-SFM 2025, ASHP/IDSA 2020) : DC 25–30 mg/kg, entretien selon ClCr (Matzke), cible Css 20–25 mg/L (ASC 400–600). Le protocole NAR : DC plus faible (20 mg/kg ; 30 mg/kg sur 2 h dans le chapitre cathéter), cible plus haute (20–30 mg/L). ⚠ ClCr < 40 : maintenir 30 mg/kg/j expose au surdosage — dosage à H24 indispensable.'},
 linez: {n:'600 mg × 2/j IVL 1 h (pas d\'adaptation rénale)', arc:'600 mg × 2/j', snc:'600 mg × 3/j IVL (ou IVSE)', admin:'Myélotoxicité si > 28 j : NFS 2×/semaine.',
  diff:'Méningé : IDSA 2017 = 600 mg q12h ; NAR = 600 mg q8h.'},
 dapto: {n:'10 mg/kg × 1/j IVL 10 min', arc:'10 mg/kg × 1/j', seuil:'30 mL/min : même dose 1 jour sur 2', admin:'Indications NAR : bactériémie, peau et tissus mous, endocardite. Inefficace en pneumopathie. Chapitre « infections liées aux cathéters » : 6 mg/kg/j si exposition à la vancomycine (> 1 sem dans les 3 mois) ou insuffisance rénale.',
  diff:'Recos selon l\'indication : RCP 4 mg/kg (IcPTM) et 6 mg/kg (bactériémie à S. aureus, EI droite) ; ePOPI 6 mg/kg en bactériémie ; SPILF/SFPT/CA-SFM 2025 8–12 mg/kg ; ESC 2023 10 mg/kg (endocardite) ; ERV, os, matériel : 10–12 mg/kg. Le protocole NAR retient 10 mg/kg pour toutes les indications (6 mg/kg dans le chapitre cathéter : incohérence interne à signaler).'},
 amika: {n:'30 mg/kg IVL 30 min ; pic 60–80 mg/L, vallée < 2,5 mg/L', arc:'30 mg/kg', admin:'Obèse : poids ajusté = PIT + 0,4 × (poids réel − PIT). Pic 30 min après la fin de l\'injection ; vallée avant réinjection (en règle à H24).'},
 genta: {n:'8 mg/kg IVL 30 min ; pic 30–40 mg/L, vallée < 0,5 mg/L', arc:'8 mg/kg', snc:'5 mg/kg/j', admin:'Obèse : poids ajusté. Pic 30 min après la fin de l\'injection.', diff:'Recos : 5–8 mg/kg (CA-SFM : 6–7) — NAR : 8 mg/kg.'},
 metro: {n:'500 mg × 3/j IVL 1 h', snc:'500 mg × 3/j IVL', diff:'Concordant.'},
 fosfo: {snc:'4 g × 3/j IVL', cmax:'20 mg/mL', diff:'Concordant.'},
 rifam: {snc:'600 mg × 2/j IVL ou PO', cmax:'600 mg/10 mL G5 %', diff:'Recos : 10 mg/kg/j (méningite : 600 mg q12h discuté) — NAR : 600 mg × 2/j.'},
 aciclo: {n:'10 mg/kg × 3/j', snc:'10 mg/kg × 3/j', cmax:'5 mg/mL', diff:'Concordant.'},
 caspo: {n:'J1 70 mg puis 50 mg/j (70 mg si > 80 kg ; 35 mg si Child B ; à éviter si Child C)', diff:'Concordant. EER continue : pas de membrane PAN (ANSM/EMA 2025, non mentionné dans le protocole 2025).'},
 mica: {n:'100 mg/j', diff:'Child B/C : à éviter (NAR).'},
 anidula: {n:'J1 200 mg puis 100 mg/j', diff:'Concordant.'},
 fluco: {n:'J1 800 mg puis 400 mg/j', arc:'J1 800 mg puis 400 mg/j', seuil:'CVVHF : 12 mg/kg J1 puis 6 mg/kg/j ; HDI : 6 mg/kg après la séance',
  diff:'Recos (IDSA/ESCMID) : DC 12 mg/kg puis 6 mg/kg/j ; en EER continue souvent 400 mg q12h (800 mg/j).'},
 vorico: {n:'IV : J1 6 mg/kg × 2 puis 3 mg/kg × 2/j ; PO : J1 400 mg puis 200 mg × 2/j', admin:'Dosage de la résiduelle (variabilité inter- et intra-individuelle).',
  diff:'RCP/ECMM (aspergillose) : entretien IV 4 mg/kg × 2/j — le protocole NAR indique 3 mg/kg × 2/j (dose « candidose » du RCP) : adapter au dosage.'},
 amphoL: {n:'3 mg/kg/j IVL 60 min (complexe lipidique : 5 mg/kg/j)', diff:'Mucormycose : 5–10 mg/kg/j (ECMM) — non traité dans le protocole NAR.'},
 '5fc': {n:'25–35 mg/kg × 4/j PO (en association, infections complexes)', diff:'Concordant (100 mg/kg/j).'}
};
/* Préférences de traitement du protocole NAR (prioritaires sur les recommandations) */
window.NAR_PREF = {
 sarm: 'PAVM : linézolide > vancomycine (daptomycine non indiquée). Bactériémie : vancomycine OU daptomycine (ex aequo) > linézolide. Méningo-ventriculite : vancomycine ou linézolide (linézolide 600 mg × 3/j en 1re intention en probabiliste).'
};
/* Protocoles NAR par pathologie (affichés en tête de fiche, avant les recommandations) */
window.NARPATHO = {
 pavm: {html:`<b>Prélèvements</b> avant toute antibiothérapie : ECBC (LBA si immunodéprimé, échec ou PAVM multiples) ; hémocultures ± PCR multiplex/COVID, germes atypiques selon le contexte.<br>
• <b>Précoce (≤ 5 j) sans FdR</b> (FdR = antibiothérapie < 90 j, dialyse) : céfotaxime, ou amoxicilline-acide clavulanique si inhalation suspectée (≤ J2 et sans antibioprophylaxie) ; ± gentamicine si choc.<br>
• <b>Tardive (> 5 j) et/ou FdR</b> : pipéracilline-tazobactam ou céfépime (risque d'encéphalopathie) ; ± amikacine si choc.<br>
• <b>+ linézolide</b> (anti-SARM) si colonisation récente à SARM, dialyse chronique ou lésion cutanée chronique.<br>
• <b>Carbapénème</b> seulement si portage de BLSE ET signe de gravité (choc, immunodépression).<br>
• <b>Durée</b> : 7 j si pneumopathie confirmée (foyer radiologique), hors abcès, pleuro-pneumopathie, immunodépression ; trachéobronchite (sans foyer) : 5 j envisageable.`,
  diff:`SFAR/SRLF 2017 : même logique ; anti-SARM « vancomycine ou linézolide » (NAR : linézolide), indications du carbapénème un peu plus larges (colonisation BLSE + gravité ou forte prévalence) ; durée 7 j concordante.`},
 iuas: {html:`ECBU <b>non systématique</b> : seulement si argument clinique, signes de gravité ou syndrome infectieux inexpliqué. Leucocyturie sans valeur sur sonde. <b>Seuil de bactériurie : > 10³ UFC/mL</b> (10² si urines pyéliques) ; en dessous, le diagnostic n'est pas éliminé (contrôle à 1–3 j).<br>
• Colonisation (bactériurie asymptomatique) : pas d'antibiotique.<br>
• <b>Choc septique ou P. aeruginosa, S. marcescens, A. baumannii</b> : bithérapie β-lactamine + aminoside ou fluoroquinolone (ex. pip-tazo ± amikacine), puis adaptation.<br>
• Sonde à maintenir : changement à 24 h d'antibiothérapie.<br>
• <b>Durée</b> : femme 10 j, homme 14 j ; 5 j possible (lévofloxacine, sans gravité) ; 3 j (femme ≤ 65 ans, sans PNA, après ablation de la sonde).`,
  diff:`SPILF 2015/2023 : seuil de bactériurie IUAS ≥ 10⁵ UFC/mL (≥ 10³ chez l'homme) ; durées plus courtes (cystite associée aux soins 5–7 j, PNA 7–10 j, IU masculine 14 j) ; bithérapie non systématique pour P. aeruginosa hors choc ; changement de sonde <b>avant</b> l'antibiothérapie (SF2H/SPILF 2015) — NAR : à 24 h d'antibiothérapie.`},
 bact_kt: {html:`<b>Choc septique</b> : probabiliste couvrant BGN dont non fermentants + CGP dont méti-R :<br>
• Pipéracilline-tazobactam 4 g puis 16 g/24 h IVSE (ou céfépime 2 g puis 6 g/24 h)<br>
• + vancomycine 30 mg/kg IVL 2 h puis 30 mg/kg/j — ou <b>daptomycine 6 mg/kg/j</b> si exposition à la vancomycine (> 1 sem dans les 3 mois) ou insuffisance rénale<br>
• + amikacine 30 mg/kg IVL 30 min<br>
• + caspofungine 70 mg puis 50 mg/j (70 mg si > 80 kg) si défaillance multiviscérale, mauvaise évolution à 72 h ou colonisation connue.<br>
<b>Retrait du KT</b> si ILC ; hémocultures (KT + périphériques ; rapport > 5 ou délai différentiel > 120 min). Persistance des hémocultures à 72 h : TDM-TAP, ETT ± ETO, écho-doppler vasculaire. ETO si S. aureus, Candida, entérocoque ou FdR d'EI ; <b>FO si Candida</b>.<br>
<b>Durées</b> (KT retiré) : S. aureus / Candida : hémocultures négatives 3–5 j ; positives non compliquées 7–14 j ; compliquées 4–6 sem. Entérobactéries, entérocoques, SCN : hémocultures négatives = pas d'antibiotique ; positives 7 j ; compliquées 4–6 sem. P. aeruginosa, A. baumannii : négatives 3–5 j ; positives 7 j ; compliquées 4–6 sem. TVP suppurée : 4–6 sem + anticoagulation 6 sem.`,
  diff:`IDSA/SRLF : S. aureus = au moins 14 j après la 1re hémoculture négative (le protocole NAR indique 7–14 j si non compliquée) ; Candida : 14 j après la 1re hémoculture négative. Daptomycine : NAR 6 mg/kg dans ce chapitre mais 10 mg/kg dans le tableau anti-SARM (incohérence interne) ; recos en réanimation 8–12 mg/kg.`},
 cdi: {html:`<b>Prélever</b> si > 3 selles molles/j (recherche de toxine) ; TDM/endoscopie selon gravité (fièvre, frissons, instabilité, abdomen chirurgical, hyperlactatémie, albumine < 30 g/L).<br>
• <b>1re intention : vancomycine per os 125 mg × 4/j 10 j</b> (jusqu'à 2 g/j dans les formes très sévères).<br>
• Alternative : fidaxomicine 200 mg × 2/j 10 j si contre-indication à la vancomycine, échec ou rechute (coût).<br>
• Métronidazole seul : formes peu sévères uniquement, non adapté en réanimation. Chirurgie si complication.<br>
• Isolement contact « Clostridium » (surblouse manches longues + gants), lavage des mains au savon ; levée 72 h après la fin des symptômes, sans nouveau prélèvement.`,
  diff:`ESCMID 2021 et IDSA 2021 : <b>fidaxomicine en 1re intention</b> (moins de récidives), vancomycine en alternative — le protocole NAR inverse cet ordre (vancomycine d'abord, fidaxomicine si échec/rechute).`},
 cand: {html:`<b>Probabiliste</b> : caspofungine (souches résistantes au fluconazole en augmentation) ; échinocandines <b>contre-indiquées si atteinte urinaire, oculaire ou méningée</b> (mauvaise diffusion) ; retrait des cathéters.<br>
<b>Décision</b> : sepsis malgré antibiothérapie ≥ 48 h + FdR → Candida score ≥ 2,5 ou Peritonitis score ≥ 3 → Ag mannane + Ac anti-mannane + β-D-glucane ; traitement si positifs.<br>
<b>Bilan d'extension</b> : hémocultures répétées, <b>fond d'œil</b> (atteinte oculaire ≈ 30 %), ETT.<br>
<b>Adaptation</b> : C. albicans, C. glabrata, C. krusei → caspofungine ou micafungine (si CI : amphotéricine B) ; <b>+ 5-fluorocytosine</b> si atteinte endocardique, oculaire ou méningée. C. parapsilosis → fluconazole.<br>
<b>Durée</b> : 2 sem après négativation des hémocultures (candidémie isolée, KT retiré) ; 6 mois si hépatosplénique ou ostéo-articulaire ; 6 sem si endocardite sur valve native.`,
  diff:`ECMM 2025 / IDSA 2016 : relais par fluconazole à J5–7 si souche S et patient stabilisé (non mentionné dans le protocole NAR) ; atteinte oculaire : fluconazole/voriconazole ou AmB-L ± 5-FC.`},
 aspergillose: {html:`<b>1re intention</b> : voriconazole IV, relais per os à J5 (dosage de la résiduelle : grande variabilité) — ou amphotéricine B liposomale.<br>
<b>Réfractaire à J7</b> : bithérapie caspofungine + voriconazole.<br>
<b>Durée</b> : 15 j après l'apyrexie et la résolution des signes cliniques.<br>
<b>Chirurgie</b> : lésion proche des gros vaisseaux, foyer résiduel, sinus ou cerveau.`,
  diff:`ECMM/ESCMID 2018 et IDSA 2016 : voriconazole ou isavuconazole en 1re intention (isavuconazole non cité par le protocole NAR) ; <b>durée minimale 6–12 semaines</b> selon l'évolution et l'immunodépression — la durée NAR (15 j après apyrexie) est nettement plus courte : à discuter avec l'équipe.`}
};
