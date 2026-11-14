/* PATHOLOGIES — div = divergences entre sociétés (SFAR/SRLF privilégiée, signalée) */
window.PATHO = [
{id:'pavm', cat:'Respiratoire', name:'Pneumonie acquise sous ventilation mécanique (PAVM) / pneumonie nosocomiale', site:'pulm',
 epi:'Infection la plus fréquente en réanimation (≈ 10–20 % des patients ventilés > 48 h). Précoce (< 5 j) : flore communautaire (S. aureus SAMS, pneumocoque, H. influenzae, entérobactéries sauvages). Tardive (≥ 5 j) ou FdR : P. aeruginosa, entérobactéries BLSE/AmpC, SARM, Acinetobacter, S. maltophilia.',
 semio:'Nouvel infiltrat radiologique + ≥ 2 parmi : fièvre > 38,3 °C ou hypothermie, hyperleucocytose ou leucopénie, sécrétions purulentes, dégradation de l\'oxygénation. Trachéobronchite (sans infiltrat) : pas d\'antibiothérapie recommandée (SFAR/SRLF 2017).',
 diag:'Prélèvement respiratoire AVANT toute (modification d\')antibiothérapie : aspiration trachéale quantitative (≥ 10⁵–10⁶ UFC/mL), mini-LBA/LBA (≥ 10⁴), brosse/PDP (≥ 10³). Examen direct (Gram) utile pour orienter. Hémocultures. PCR multiplex pneumonie (FilmArray®) : identification + gènes de résistance (mecA, CTX-M, carbapénémases) en 1 h — utile pour désescalade rapide.',
 proba:'<b>Monothérapie</b> par β-lactamine chez l\'immunocompétent, sauf choc septique ou risque élevé de BMR (SFAR/SRLF 2017).<ul><li><b>Précoce sans FdR</b> : céfotaxime/ceftriaxone ou amox-clav.</li><li><b>Tardive ou FdR de BMR</b> (antibiothérapie < 90 j, hospitalisation ≥ 5 j, colonisation connue, écologie locale) : β-lactamine anti-Pseudomonas (pip-tazo, céfépime, ceftazidime) ; <b>carbapénème</b> si colonisation/infection BLSE < 3 mois + gravité (HAS 2019).</li><li><b>+ amikacine</b> 1–3 j si choc septique ou forte prévalence de BMR.</li><li><b>+ anti-SARM</b> (vancomycine ou linézolide) si colonisation SARM ou forte prévalence locale.</li></ul>',
 doc:'Désescalade dès l\'antibiogramme (48–72 h), monothérapie y compris pour P. aeruginosa. Ne pas utiliser la daptomycine (inactivée par le surfactant), ni la tigécycline.',
 duree:'7 jours (SFAR/SRLF 2017 ; 8 j dans la RFE SRLF/SFAR 2014), y compris pour les BGN non fermentants si évolution favorable.',
 div:'Les RFE SFAR/SRLF 2017 et la HAS/SPILF/SRLF 2019 sont globalement concordantes. La procalcitonine pour raccourcir la durée : « accord faible » dans HAS 2019, jugée insuffisante seule par le comité des référentiels de la SPILF → l\'app retient la position SFAR/SRLF (PCT = aide, non critère unique).',
 refs:['sfar_pavm17','sfar_pavm17fr','has_carba19','srlf_atb14','spilf_durees21']},
{id:'pac', cat:'Respiratoire', name:'Pneumonie aiguë communautaire (PAC) grave', site:'pulm',
 epi:'S. pneumoniae (1re cause), Legionella (2e cause des formes graves), S. aureus (post-grippal, PVL), entérobactéries/H. influenzae (comorbidités), virus (grippe, VRS, SARS-CoV-2).',
 semio:'Critères de gravité (ATS/IDSA, SMART-COP) ; choc, IRA hypoxémiante.',
 diag:'Hémocultures, antigénuries pneumocoque et légionelle, prélèvement respiratoire (ECBC/AT), PCR multiplex respiratoire (cf. Examens : PCR multiplex bactérienne sur prélèvement bas, PCR bactéries atypiques Mycoplasma/Chlamydophila/Legionella) (virus, intracellulaires) dans les formes graves. CRP/PCT non recommandées pour décider de l\'antibiothérapie (SPILF/SPLF 2025).',
 proba:'<b>Réanimation</b> : C3G (céfotaxime 1–2 g q8h ou ceftriaxone 1–2 g/j) + macrolide (spiramycine 3 MUI q8h) — ou lévofloxacine en cas de suspicion forte de légionellose. FdR de P. aeruginosa (DDB, mucoviscidose, exacerbations BPCO colonisées) : β-lactamine anti-Pseudomonas. Carbapénèmes non recommandés en probabiliste quelle que soit la gravité (HAS 2019). Hydrocortisone 200 mg/j si PAC grave (SPILF/SPLF 2025).',
 doc:'Adaptation à la documentation ; arrêt du macrolide si légionellose exclue.',
 duree:'5–7 j (7 j en réanimation) ; légionellose grave 8–14 j (21 j immunodéprimé) ; S. aureus/BGN : 7–14 j selon évolution.',
 div:'Pas de recommandation SFAR spécifique ; texte SPILF/SPLF 2025 co-construit avec la SRLF.',
 refs:['spilf_pac25','has_carba19','spilf_durees21']},
{id:'inhal', cat:'Respiratoire', name:'Pneumopathie d\'inhalation', site:'pulm',
 epi:'Troubles de conscience (neuroréanimation ++), troubles de déglutition. Pneumopathie chimique (Mendelson) ≠ pneumonie bactérienne. Germes : flore oropharyngée, entérobactéries ; anaérobies rarement prépondérants hors abcès/empyème.',
 semio:'Infiltrat déclive (lobe inférieur droit, segments postérieurs).',
 diag:'Prélèvement respiratoire distal ; ne pas traiter une pneumopathie chimique isolée qui régresse en 24–48 h.',
 proba:'Communautaire : amox-clav (ou C3G). Associée aux soins/tardive : selon FdR de BMR (cf. PAVM). Couverture anti-anaérobie spécifique non nécessaire sauf abcès/empyème.',
 doc:'Selon documentation.', duree:'5–7 j.',
 div:'—', refs:['spilf_pac25','sfar_pavm17']},
{id:'iu', cat:'Urinaire', name:'Pyélonéphrite / infection urinaire grave (communautaire)', site:'uri',
 epi:'E. coli (≈ 70–80 %), autres entérobactéries, entérocoque. BLSE ≈ 5–10 %.',
 semio:'Sepsis/choc d\'origine urinaire, obstacle (urgence : drainage).',
 diag:'ECBU avant antibiotique (seuil ≥ 10³ UFC/mL E. coli ; ≥ 10⁴ autres), hémocultures, imagerie (échographie/uroscanner) à la recherche d\'un obstacle ou d\'un abcès dans les 24 h.',
 proba:'<b>Sepsis grave / choc</b> : C3G (céfotaxime de préférence) + amikacine ; si colonisation/infection BLSE < 3 mois : carbapénème + amikacine (HAS 2019). Drainage urgent d\'un obstacle.',
 doc:'Relais oral selon antibiogramme (FQ, cotrimoxazole, amox, amox-clav). BLSE : alternatives aux carbapénèmes (témocilline, pip-tazo si CMI ≤ 8, céfoxitine, aminosides, FQ/cotrimoxazole si S).',
 duree:'PNA : 7 j (FQ, C3G) ; 10 j autres molécules ; IU masculine : 14 j (raccourcissement discuté selon évolution) — SPILF 2021.',
 div:'—', refs:['spilf_recos','has_carba19','spilf_durees21']},
{id:'iuas', cat:'Urinaire', name:'ECBU positif sur sonde / infection urinaire associée aux soins', site:'uri',
 epi:'Bactériurie quasi constante après 30 j de sondage. E. coli, Enterococcus, Proteus, Klebsiella, P. aeruginosa, Candida.',
 semio:'IUAS sur sonde évoquée devant une fièvre sans autre cause identifiée, des douleurs sus-pubiennes/lombaires, ou un sepsis. La bandelette urinaire n\'est pas recommandée ; la leucocyturie n\'a pas de valeur sur sonde.',
 diag:'ECBU sur la sonde en place (ponction du site dédié après désinfection, pas de prélèvement dans le sac) ; seuil ≥ 10⁵ UFC/mL en présence d\'un dispositif endo-urinaire (SF2H/SPILF 2015). Changer la sonde avant de débuter l\'antibiothérapie (et prélever sur la nouvelle sonde).',
 proba:'<b>Colonisation (bactériurie asymptomatique) : ne pas traiter</b>, y compris en réanimation et avant ablation/changement de sonde (D-II). Ne pas dépister. Exceptions : grossesse, chirurgie urologique programmée. IUAS symptomatique : selon gravité et FdR de BMR (cf. PNA / PAVM pour les FdR). Candidurie asymptomatique : abstention.',
 doc:'Selon antibiogramme, spectre le plus étroit.',
 duree:'Cystite associée aux soins 5–7 j (3 j si < 75 ans et ablation de la sonde) ; PNA 7–10 j ; IU masculine 14 j ; IU sur matériel endo-urétéral 5–10 j.',
 div:'—', refs:['spilf_iuas15','spilf_durees21']},
{id:'bact_kt', cat:'Bactériémies', name:'Bactériémie / infection liée au cathéter (ILC)', site:'kt',
 epi:'SCN, S. aureus, entérobactéries, P. aeruginosa, Candida. Cathéters fémoraux et de dialyse à risque.',
 semio:'Signes locaux inconstants ; bactériémie sans autre foyer ; amélioration après retrait.',
 diag:'Hémocultures couplées (périphérique + cathéter) : délai différentiel de positivité ≥ 2 h en faveur d\'une ILC ; culture du cathéter retiré (≥ 10³ UFC/mL, méthode de Brun-Buisson). 2 hémocultures pour SCN.',
 proba:'Retrait du cathéter si : choc, S. aureus, P. aeruginosa, Candida, thrombophlébite suppurée, signes locaux, bactériémie persistante. Probabiliste en sepsis : vancomycine (Gram +) ± β-lactamine anti-BGN selon gravité/neutropénie/fémoral (SRLF 2020).',
 doc:'Selon germe ; verrous antibiotiques pour cathéters de longue durée conservés.',
 duree:'Après retrait : SCN 3–7 j (abstention possible si retrait et patient stable) ; entérobactéries/entérocoques 7 j ; P. aeruginosa 7–10 j ; S. aureus ≥ 14 j (4–6 sem si compliquée) ; Candida 14 j après hémocultures négatives ; thrombophlébite suppurée 3–6 sem.',
 div:'—', refs:['srlf_kt20','idsa_crbsi09','spilf_durees21']},
{id:'choc', cat:'Sepsis', name:'Sepsis / choc septique sans point d\'appel', site:'bact',
 epi:'—',
 semio:'Sepsis-3 : dysfonction d\'organe (SOFA ≥ 2) ; choc : vasopresseurs pour PAM ≥ 65 + lactate > 2 mmol/L.',
 diag:'2 paires d\'hémocultures (40–60 mL) avant antibiotiques sans retarder ; prélèvements orientés ; lactate.',
 proba:'Antibiothérapie dans l\'heure (choc). Communautaire : C3G + amikacine (± anti-anaérobie selon point d\'appel). Associée aux soins : β-lactamine anti-Pseudomonas (pip-tazo/céfépime) + amikacine ; carbapénème si colonisation BLSE < 3 mois (HAS 2019) ; ± anti-SARM selon FdR. Première dose pleine sans adaptation rénale ; pas de réduction de dose des β-lactamines les 24 premières heures (SFAR/SFPT 2019) ; perfusion prolongée/continue après dose de charge.',
 doc:'Réévaluation à 48–72 h obligatoire (désescalade, arrêt si non infectieux).',
 duree:'Selon foyer et germe (cf. fiches) ; 7 j pour la plupart des bactériémies à BGN non compliquées.',
 div:'Doses de β-lactamines : les tableaux CA-SFM/SPILF visent 100 % fT > CMI ; la SFAR/SFPT (2019) vise fC 4–8 × CMI chez le patient de réanimation → l\'app privilégie la cible SFAR (fortes posologies, perfusion prolongée/continue, STP) et le signale.',
 refs:['ssc21','has_carba19','sfar_bl2019','doses25']},
{id:'abces_pulm', cat:'Respiratoire', name:'Abcès pulmonaire / pneumonie nécrosante', site:'pulm',
 epi:'Cavité nécrotique (> 2 cm, souvent avec niveau hydro-aérique). <b>Primitif</b> : inhalation (troubles de conscience — neuroréanimation ++, alcool, troubles de déglutition, mauvais état dentaire). <b>Secondaire</b> : obstacle bronchique (cancer, corps étranger), emboles septiques (endocardite tricuspide, thrombophlébite jugulaire de Lemierre, cathéter), immunodépression, surinfection de cavité préexistante.<br><b>Germes les plus fréquents</b> : anaérobies (Prevotella, Fusobacterium, Peptostreptococcus, Bacteroides) souvent en flore mixte avec streptocoques du groupe milleri (S. anginosus) ; <b>Klebsiella pneumoniae</b> (souches hypervirulentes — diabète, alcool, origine asiatique ; rechercher d\'autres foyers : foie, œil, SNC) ; <b>S. aureus</b> (dont souches productrices de leucocidine de Panton-Valentine (PVL) chez le sujet jeune, post-grippal ; emboles septiques) ; P. aeruginosa et entérobactéries multirésistantes (nosocomial) ; plus rares : Nocardia, Actinomyces, Rhodococcus, mycobactéries (tuberculose ++), Aspergillus/Mucorales (immunodéprimé), amibe (rupture d\'abcès hépatique).',
 semio:'Fièvre prolongée, expectoration purulente parfois fétide (anaérobies), vomique, hémoptysie, altération de l\'état général ; tableau suraigu (fièvre élevée, hémoptysies, leucopénie, choc) évocateur de pneumonie nécrosante à S. aureus PVL+.',
 diag:'TDM thoracique injecté (diagnostic, empyème, différentiel avec cancer excavé, bulles infectées). Hémocultures. Prélèvements respiratoires profonds (aspiration, fibroscopie avec prélèvement protégé/LBA — recherche aussi d\'obstacle endobronchique). <b>Recherche de BK systématique</b> (3 examens + PCR ; isolement air jusqu\'au résultat). Cultures anaérobies prolongées, recherche de Nocardia/Actinomyces à signaler au labo. Ponction scanno-guidée si échec. Sérologie VIH. <b>Recherche de la toxine PVL</b> (PCR des gènes lukS/lukF-PV sur la souche, CNR des staphylocoques, Lyon) si S. aureus et : pneumonie nécrosante ou abcès multiples, sujet jeune sans comorbidité, hémoptysies, leucopénie, syndrome grippal préalable, infections cutanées récurrentes (furoncles) chez le patient ou l\'entourage — sans attendre le résultat pour débuter un antitoxinique si forte suspicion.',
 proba:'<b>Communautaire / inhalation</b> : amoxicilline-acide clavulanique (forte posologie) ; alternative : C3G + métronidazole ; allergie : clindamycine (ou moxifloxacine). La SPILF 2025 ne recommande plus le métronidazole systématique dans la pneumonie d\'inhalation simple, mais la couverture anaérobie reste justifiée en cas d\'abcès. <b>Associé aux soins / FdR de BMR</b> : pipéracilline-tazobactam (± amikacine si choc) ; carbapénème selon colonisation BLSE (HAS 2019). <b>Suspicion de S. aureus PVL</b> (tableau suraigu, nécrose, leucopénie) : β-lactamine anti-staphylococcique (ou vancomycine si SARM suspect) <b>+ antitoxinique : linézolide (préféré, actif sur SARM) ou clindamycine</b> ; IgIV discutées dans les formes graves (avis d\'expert). Lemierre : amox-clav ou C3G + métronidazole, anticoagulation discutée.',
 doc:'Adaptation à la documentation ; SAMS PVL+ : cloxacilline + linézolide/clindamycine ; SARM PVL+ : linézolide (seul ou + vancomycine). Klebsiella hypervirulente : C3G si S, chercher et drainer les autres foyers. <b>Drainage</b> : percutané/endoscopique si abcès volumineux (> 6 cm), sepsis persistant après 7–10 j d\'antibiothérapie adaptée, absence de communication bronchique ; chirurgie si hémoptysie grave, échec, nécrose étendue ; drainage de tout empyème associé.',
 duree:'Pas de durée consensuelle : classiquement <b>3 à 6 semaines</b>, guidée par l\'évolution clinique et radiologique (relais oral possible après apyrexie) ; la SPILF/SPLF 2025 réserve les durées > 7 j des PAC aux complications comme l\'abcès. Durée de l\'antitoxinique non établie (≥ 7 j / phase aiguë ; limiter le linézolide à ≤ 28 j).',
 div:'Pas de recommandation française dédiée à l\'abcès pulmonaire ; synthèse des recommandations PAC/inhalation (SPILF 2025), des données du CNR des staphylocoques et de mises au point (JNI).',
 refs:['spilf_pac25','spilf_inhal25','lorut_jni18','luyt_jni20','dumitrescu07','has_carba19']},
{id:'antitox', cat:'Transversal', name:'Antibiothérapie antitoxinique (choc toxique, DHBN, PVL) — puissance comparée', site:'peau',
 epi:'Indications : choc toxique streptococcique (SGA) ou staphylococcique (TSST-1), DHBN/fasciite nécrosante, pneumonie nécrosante à S. aureus PVL+, gangrène gazeuse (Clostridium). Principe : les β-lactamines seules ne bloquent pas la production de toxines (et, à concentration sub-inhibitrice, l\'oxacilline augmente la production de PVL in vitro) ; inhibiteurs de la synthèse protéique associés.',
 semio:'—',
 diag:'<table class="tbl tx"><tr><th>Molécule</th><th>Puissance antitoxinique</th><th>Commentaires</th></tr>'+
 '<tr><td><b>Linézolide</b></td><td>+++</td><td>Forte réduction de PVL, TSST-1, α-toxine in vitro ; actif sur SARM et indépendant de la résistance MLSb ; excellente diffusion pulmonaire. Préféré pour PVL/SARM ou si clindamycine R.</td></tr>'+
 '<tr><td><b>Clindamycine</b></td><td>+++</td><td>Référence pour le SGA (indépendante de l\'inoculum, « effet Eagle » — Stevens 1988) ; adjonction associée à une baisse de mortalité dans les infections invasives à streptocoque β-hémolytique (Babiker 2021). Inefficace si résistance (vérifier le test D : résistance inductible MLSb).</td></tr>'+
 '<tr><td>Tédizolide</td><td>++/+++</td><td>Données in vitro favorables (non validé cliniquement dans cette indication).</td></tr>'+
 '<tr><td>Rifampicine</td><td>++</td><td>Diminue la PVL in vitro (Dumitrescu 2007) ; jamais seule ; interactions (nimodipine CI).</td></tr>'+
 '<tr><td>Acide fusidique</td><td>++</td><td>Diminue la PVL in vitro ; usage limité en réanimation.</td></tr>'+
 '<tr><td>Macrolides (azithro/érythro)</td><td>+</td><td>Effet modeste, résistances fréquentes chez SGA/S. aureus.</td></tr>'+
 '<tr><td>Vancomycine</td><td>0</td><td>Pas d\'effet antitoxinique.</td></tr>'+
 '<tr><td>β-lactamines (oxacilline…)</td><td>0 / ↑</td><td>Bactéricides mais pas d\'effet sur la synthèse des toxines ; ↑ PVL à concentration sub-inhibitrice → toujours associer un antitoxinique dans les formes toxiniques.</td></tr></table>',
 proba:'SGA (DHBN, choc toxique) : amoxicilline (ou péni G) forte dose + <b>clindamycine</b> 600–900 mg q8h (linézolide si clindamycine R). S. aureus PVL+/TSST-1 : cloxacilline (SAMS) ou vancomycine (SARM) + <b>linézolide</b> 600 mg q12h (ou clindamycine si S). <b>IgIV</b> (avis d\'expert) : choc toxique streptococcique grave ; pneumonie PVL grave (≈ 1–2 g/kg — avis CNR/infectiologue). Chirurgie/débridement en urgence.',
 doc:'Arrêt de l\'antitoxinique après stabilisation (souvent 3–7 j) ; poursuite de la molécule bactéricide selon le foyer.',
 duree:'Antitoxinique : phase aiguë (≈ 3–7 j, durée non établie) ; antibiothérapie totale selon le foyer.',
 div:'—', refs:['dumitrescu07','stevens88','babiker21','luyt_jni20','doses25']},
{id:'immunodep', cat:'Sepsis', name:'Choc septique du patient immunodéprimé (neutropénie, greffe, hémopathie, biothérapies)', site:'bact',
 epi:'<b>Neutropénie (< 0,5 G/L)</b> : BGN dont P. aeruginosa et entérobactéries BLSE (colonisation), streptocoques oraux (mucite), SCN/S. aureus (cathéter), C. septicum (typhlite) ; fongique si neutropénie prolongée (Candida, Aspergillus). <b>Greffe d\'organe/CSH, corticothérapie, biothérapies</b> : + Listeria, Nocardia, Legionella, pneumocystose, CMV/HSV/adénovirus, Aspergillus/Mucorales, tuberculose, strongyloïdose disséminée (hyperinfection — originaires de zones d\'endémie sous corticoïdes). <b>Asplénie</b> : pneumocoque, méningocoque, H. influenzae, Capnocytophaga (morsure de chien) — purpura fulminans. <b>VIH (CD4 < 200)</b> : pneumocystose, tuberculose, cryptococcose, toxoplasmose.',
 semio:'Signes inflammatoires atténués (neutropénie, corticoïdes) ; fièvre parfois seul signe ; dégradation rapide.',
 diag:'Hémocultures sur cathéter et périphérie (avant antibiotiques), ECBU, prélèvements orientés, TDM thoracique précoce (± sinus/abdomen), LBA précoce si pneumopathie (bactéries, PCR Pneumocystis, galactomannane, virus, mycobactéries), β-D-glucane et galactomannane sériques, PCR CMV sang, antigène cryptococcique, sérologie/examen des selles anguillulose si exposition.',
 proba:'<b>Neutropénie + choc (ECIL-4, stratégie de désescalade)</b> : β-lactamine anti-Pseudomonas à forte posologie (pip-tazo ou céfépime) <b>+ amikacine</b> ; <b>carbapénème</b> si colonisation/infection BLSE < 3 mois (HAS 2019 : carbapénème non recommandé en aplasie fébrile en dehors de ce cas) ; <b>+ vancomycine</b> (ou autre anti-Gram +) si instabilité hémodynamique, suspicion d\'infection de cathéter, de peau/tissus mous, pneumonie, colonisation SARM, mucite sévère sous FQ prophylactique. <b>Antifongique</b> : échinocandine si choc avec FdR de candidose (colonisation, KT, nutrition parentérale) ; antifongique actif sur Aspergillus (voriconazole/isavuconazole ou amphotéricine B liposomale) si signes évocateurs (TDM, GM). <b>Greffé/corticothérapie</b> : selon foyer + amoxicilline si méningite/encéphalite (Listeria) ; cotrimoxazole forte dose si pneumocystose suspectée (+ corticoïdes selon contexte) ; ivermectine si risque d\'anguillulose. <b>Asplénie</b> : C3G forte dose (± vancomycine si méningite et pneumocoque à risque).',
 doc:'Réévaluation à 48–72 h : désescalade selon documentation ; arrêt possible des antibiotiques empiriques après 72 h si apyrexie ≥ 48 h, stabilité et absence de documentation (ECIL-4), même en neutropénie persistante.',
 duree:'Selon le foyer et le germe (cf. fiches) ; pneumocystose 21 j ; candidémie 14 j après hémocultures négatives et sortie d\'aplasie.',
 div:'HAS 2019 (carbapénèmes réservés au choc + colonisation BLSE) et ECIL-4 (désescalade en cas de choc) sont concordantes ; pas de RFE SFAR/SRLF spécifique.',
 refs:['ecil4','has_carba19','ecil5pjp','escmid_asp18','ecmm_cand25','ssc21']},
{id:'mening', cat:'Neuro', name:'Méningite bactérienne aiguë communautaire', site:'snc',
 epi:'S. pneumoniae, N. meningitidis, Listeria (âge > 50 ans, immunodépression, alcoolisme, grossesse), H. influenzae, S. agalactiae.',
 semio:'Fièvre, raideur, troubles de conscience (triade complète < 50 %) ; purpura (méningocoque).',
 diag:'PL immédiate sauf contre-indication (signes de focalisation, crise récente, Glasgow ≤ 11, anticoagulants) → alors hémocultures + antibiothérapie + dexaméthasone avant le scanner. LCS : cellularité, glucose (rapport LCS/sang < 0,4), protéines, lactate (> 3,8 mmol/L évoque bactérien), Gram, culture, PCR (pneumocoque, méningocoque, panel multiplex).',
 proba:'<b>Dexaméthasone</b> 10 mg q6h × 4 j juste avant/avec la 1re dose d\'antibiotique (si pneumocoque/méningocoque/H. influenzae). <b>Céfotaxime 300 mg/kg/j</b> (ou ceftriaxone 100 mg/kg/j) ; <b>+ amoxicilline 200 mg/kg/j</b> si Listeria suspectée (± gentamicine). Purpura fulminans : ceftriaxone immédiate.',
 doc:'Pneumocoque : réduction de dose ou amoxicilline selon CMI ; méningocoque : C3G ou amoxicilline ; Listeria : amoxicilline ± gentamicine.',
 duree:'Méningocoque 5 j ; H. influenzae 7 j ; pneumocoque 10 j (7 j si évolution rapidement favorable) ; S. agalactiae 14–21 j ; Listeria 21 j ; entérobactéries 21 j.',
 div:'—', refs:['spilf_mening18','spilf_durees21']},
{id:'ventri', cat:'Neuro', name:'Méningite / méningo-ventriculite nosocomiale (DVE, DVP, post-craniotomie) — protocole NAR', site:'snc',
 epi:'<b>À évoquer devant tout sepsis chez un patient à risque</b> (protocole NAR) : post-opératoire de neurochirurgie ; DVE (surtout si fuite de LCS), DVP/dérivation ; traumatisé crânien avec embarrure ou brèche ostéo-méningée. Incidence ≈ 8–10 % des DVE (2–27 %). Germes : SCN, Cutibacterium acnes, S. aureus (≈ 60 % de Gram +) ; BGN (≈ 30–40 % : Enterobacter, Klebsiella, Pseudomonas, Acinetobacter) — adapter à l\'écologie du service.',
 semio:'Diagnostic difficile : clinique aspécifique chez le cérébrolésé (fièvre, altération de conscience, dysfonction de dérivation) ; sang dans le LCS (HSA, chirurgie) ; la méningite aseptique post-opératoire/hémorragique mime l\'infection.',
 diag:'<b>Prélèvement</b> : LCS <b>distal</b> si DVE (prélevé par l\'IDE, jamais dans le sac) → bactériologie avec <b>cell-index</b> + biochimie avec <b>lactates (LCS frais)</b>. Si examen direct positif : prélèvement <b>proximal</b> pour éliminer une colonisation de la burette. Culture prolongée (≥ 10 j pour Cutibacterium).<br>'+
 '<b>Lactatorachie</b> : bonne VPP et VPN, seuil 4 à 5 mmol/L selon la littérature (moins fiable si HSA récente). <b>LCR score</b> : VPN élevée. <b>Cell-index</b> = [GB LCS / GR LCS] / [GB sang / GR sang] : c\'est sa <b>cinétique</b> qui compte (augmentation en faveur de l\'infection).<br>'+
 '<table class="tbl tx"><tr><th colspan="2">LCR score (1 point par item, protocole NAR)</th></tr>'+
 '<tr><td>Leucocytes LCS</td><td>≥ 500/mm³</td></tr><tr><td>Polynucléaires neutrophiles</td><td>≥ 80 %</td></tr><tr><td>Glucose LCS / sérum</td><td>≤ 0,40</td></tr><tr><td>Lactatorachie</td><td>≥ 4 mmol/L</td></tr></table>'+
 '<b>Algorithme NAR</b><br>'+
 '1. Contexte clinique évocateur → LCS distal (cell-index, lactates).<br>'+
 '2. <b>LCR score ≤ 1 et lactatorachie &lt; 4 mmol/L et autre point d\'appel</b> → <b>pas d\'antibiothérapie spécifique</b> (traiter l\'autre foyer).<br>'+
 '3. <b>LCR score ≥ 2 et/ou lactatorachie ≥ 4 mmol/L et/ou cell-index en augmentation</b> → discussion collégiale et avis du référent → antibiothérapie probabiliste <b>ceftazidime (ou méropénème) + linézolide (ou vancomycine)</b>.<br>'+
 '4. <b>Culture du LCS négative à J3</b> → arrêt de l\'anti-BGN, poursuite de l\'anti-Gram + .<br>'+
 '5. <b>Culture négative à J5</b> → méningite aseptique : arrêt des antibiotiques ; méningite non documentée (forte suspicion clinique) : poursuite de l\'anti-Gram + .<br>'+
 '6. <b>Culture positive</b> → avis du référent, antibiothérapie ≥ 14 j adaptée à l\'antibiogramme.<br>'+
 '<b>Mesures associées</b> : TDM injectée avec temps tardif à J5 (abcès, ventriculite, empyème) ; DVE : <b>changement dans les 48 h</b> suivant le début de l\'antibiothérapie, ou ablation si possible.',
 proba:'<b>Protocole NAR</b> — association :<br>• <b>Anti-BGN anti-Pseudomonas</b> : <b>ceftazidime</b> 2 g en dose de charge puis 100 mg/kg/j IVSE (1re intention) ou <b>méropénème</b> (2e intention : colonisation BLSE, écologie).<br>• <b>Anti-Gram +</b> : <b>linézolide 600 mg × 3/j</b> IVL (1re intention) ou <b>vancomycine</b>.<br>'+
 '<table class="tbl tx"><tr><th>Molécule</th><th>Doses méningées (NAR)</th><th>C max</th></tr>'+
 '<tr><td>Ceftazidime</td><td>2 g puis 100 mg/kg/j IVSE</td><td>80 mg/mL</td></tr>'+
 '<tr><td>Méropénème</td><td>2 g puis 2 g × 3/j IVL sur 3 h</td><td>80 mg/mL</td></tr>'+
 '<tr><td>Céfépime</td><td>2 g puis 6 g/24 h IVSE ; dosage systématique à 48 h ± EEG (neurotoxicité)</td><td>100 mg/mL</td></tr>'+
 '<tr><td>Linézolide</td><td>600 mg × 3/j IVL (ou IVSE)</td><td>Déjà dilué</td></tr>'+
 '<tr><td>Vancomycine</td><td>DC 30 mg/kg IVL sur 2 h puis 60 mg/kg/j IVSE ; cible plasmatique 30–40 mg/L (néphrotoxicité : surveillance rapprochée)</td><td>80 mg/mL (VVC)</td></tr>'+
 '<tr><td>Céfotaxime</td><td>200 mg/kg/j IVSE (300 mg/kg/j si S. pneumoniae)</td><td>20 mg/mL</td></tr>'+
 '<tr><td>Ceftriaxone</td><td>2 g × 3/j IVL 10 min (100 mg/kg/j si S. pneumoniae)</td><td>20 mg/mL</td></tr>'+
 '<tr><td>Amoxicilline</td><td>2 g puis 200 mg/kg/j</td><td>20 mg/mL</td></tr>'+
 '<tr><td>Cloxacilline</td><td>2 g puis 200 mg/kg/j IVSE ou IVL en 4–6 prises</td><td>50 mg/mL</td></tr></table>',
 doc:'Adaptation selon l\'antibiogramme. <b>Staphylocoque</b> : bithérapie si maintien de matériel (dont DVE) ou mauvaise évolution ; antibiogramme indispensable (résistance à la rifampicine non rare). <b>Voie intraventriculaire</b> (IDSA 2017) si échec clinique/microbiologique ou BGN multirésistant : vancomycine 5–20 mg/j (10 mg usuel) ; gentamicine 4–8 mg/j ; amikacine 5–50 mg/j (30 mg usuel) ; colistine 10 mg/j (125 000 UI) ; daptomycine 2–5 mg/j ; clamper la DVE 15–60 min ; fréquence selon le débit de la DVE (&lt; 50 mL/j → toutes les 72 h ; 50–100 → 48 h ; ≥ 100 → 24 h, avec majoration de dose au-delà de 150 mL/j).',
 duree:'<b>Protocole NAR</b> : arrêt précoce si LCS stérile (prélèvement réalisé hors antibiothérapie) — anti-BGN arrêté à J3, anti-Gram + à J5. Méningite documentée : <b>staphylocoque 14 j</b> et <b>BGN 21 j</b> après changement/ablation de la DVE. <b>Abcès ou empyème : 6 à 12 semaines</b>.',
 div:'Le protocole NAR (CHU de Bordeaux, 2025) diffère de l\'IDSA 2017 sur trois points : <b>linézolide en 1re intention</b> anti-Gram + (IDSA : vancomycine), <b>ceftazidime en continu</b> préférée au céfépime (neurotoxicité), et <b>cible de vancocinémie 30–40 mg/L</b> en doses méningées (au-dessus de la cible usuelle 20–25 mg/L). Il n\'existe pas de RFE SFAR/SPILF récente sur ce sujet ; l\'app retient le protocole NAR, conformément au choix de l\'équipe.',
 refs:['nar25','idsa_vent17','jni_neuro23','spilf_durees21']},
{id:'abces', cat:'Neuro', name:'Abcès cérébral', site:'snc',
 epi:'Contiguïté (ORL, dentaire : streptocoques groupe milleri, anaérobies), hématogène (endocardite, S. aureus), post-opératoire/traumatique (S. aureus, BGN, Cutibacterium), immunodéprimé (Nocardia, Toxoplasma, Aspergillus, Listeria).',
 semio:'Céphalées, déficit focal, crises, fièvre inconstante.',
 diag:'IRM (diffusion), ponction-aspiration stéréotaxique (culture aéro/anaérobie, PCR 16S) — avant antibiotique si possible sans retard excessif ; hémocultures ; ETT/ETO ; panoramique dentaire.',
 proba:'Communautaire : <b>céfotaxime (ou ceftriaxone) forte dose + métronidazole</b> (ESCMID 2024) ; post-neurochirurgical/traumatique : vancomycine + méropénème (ou céfépime/ceftazidime + métronidazole) ; immunodéprimé : + cotrimoxazole (Nocardia/toxoplasme), avis.',
 doc:'Selon documentation ; relais oral possible après 2 sem IV si évolution favorable (ESCMID 2024).',
 duree:'6 semaines (4 sem si excision chirurgicale complète) — ESCMID 2024.',
 div:'Pas de recommandation française dédiée récente.', refs:['escmid_abces24','spilf_durees21']},
{id:'enceph', cat:'Neuro', name:'Méningo-encéphalite infectieuse', site:'snc',
 epi:'HSV-1, VZV, Listeria, tuberculose, entérovirus ; arboviroses (TBE, West Nile), auto-immune (anti-NMDAR) en diagnostic différentiel.',
 semio:'Fièvre + troubles de conscience/comportement, crises, déficits focaux.',
 diag:'PL (PCR HSV/VZV, entérovirus, Listeria), IRM, EEG ; refaire la PCR HSV si négative précoce et forte suspicion.',
 proba:'<b>Aciclovir 10 mg/kg q8h</b> dès la suspicion (sans attendre la PCR) + <b>amoxicilline</b> si Listeria possible (SPILF 2017).',
 doc:'HSV : aciclovir 14–21 j ; VZV : 10–14 j (± corticoïdes si vascularite) ; Listeria : amoxicilline 21 j.',
 duree:'HSV 14–21 j (21 j si immunodéprimé).',
 div:'—', refs:['spilf_enceph17']},
{id:'iia', cat:'Abdominal', name:'Infection intra-abdominale (péritonite communautaire / associée aux soins / post-opératoire) — RFE SFAR 2026', site:'abdo',
 epi:'<b>Communautaire</b> : entérobactéries (E. coli), streptocoques, anaérobies (B. fragilis). <b>Associée aux soins / post-opératoire</b> : entérobactéries BLSE/AmpC, P. aeruginosa, entérocoques (dont E. faecium, ampicilline-R), Candida.<br>'+
 '<b>Facteurs de risque de bactéries résistantes (RFE 2026, Tableau 1)</b><br>'+
 '• <b>BLSE</b> (IIA communautaire) : infection/colonisation à BLSE &lt; 6 mois ; amox-clav, C2G/C3G ou FQ dans les 6 mois ; voyage en zone d\'endémie &lt; 3 mois ; EHPAD/SLD avec dispositif invasif permanent (sonde urinaire, gastrostomie) ; prévalence locale élevée.<br>'+
 '• <b>BMR</b> (IIA associée aux soins) : C3G ou FQ dans les 3 mois ; portage &lt; 3 mois d\'une BLSE ou d\'un P. aeruginosa ceftazidime-R (tout site) ; hospitalisation à l\'étranger dans les 12 mois ; EHPAD/SLD avec dispositif invasif permanent ; échec d\'un traitement par C3G, FQ ou pip-tazo ; récidive &lt; 15 j d\'une infection traitée ≥ 3 j par pip-tazo.<br>'+
 '• <b>Entérocoque ampicilline-R</b> : origine hépatobiliaire suspectée ; transplantation hépatique, immunodépression ; patient déjà sous antibiotiques ou C3G préalable.<br>'+
 '<b>Facteurs de risque de Candida fluconazole-R (Tableau 4)</b> : exposition récente aux azolés, écologie hospitalière, IRC, neutropénie, tumeur solide ; espèces naturellement R ou de sensibilité diminuée : N. glabratus (C. glabrata), P. kudriavzevii (C. krusei), C. auris…',
 semio:'<b>Contrôle de la source</b> : en urgence et par chirurgie avec lavage de toute la cavité si instabilité hémodynamique (R1.1.1, grade 1) ; « damage control » (laparotomie écourtée) si instabilité non contrôlée en peropératoire, reprise à 24–48 h (R1.1.2) ; cœlioscopie possible si hémodynamique stable et lésion accessible (R1.1.3) ; IIA post-opératoire avec collection accessible chez un patient stable : endoscopie interventionnelle ou drainage percutané en 1re intention (R1.1.4). Diverticulite Hinchey III sans sepsis : pas de lavage seul, résection sigmoïdienne avec anastomose ± iléostomie (R1.1.5).<br>'+
 '<b>Orientation</b> : soins critiques systématiques si sepsis ou choc septique (R1.3.1, grade 1) ; sinon décision selon âge &gt; 60 ans, comorbidités, péritonite généralisée (R1.3.2) ; scores CPIRO, WSES SSS ou PIPAS utilisables (R1.3.3).',
 diag:'Prélèvements per-opératoires (liquide péritonéal, pas d\'écouvillon) avec examen direct (levures !) ; hémocultures.<br><b>Surveillance (R2.1.1–2.1.2)</b> : pendant les 5 premiers jours post-opératoires, pas de PCT/CRP systématiques, pas de reprise systématique (hors damage control ou doute sur la vitalité digestive), pas de culture des liquides de drainage, pas de TDM systématique si évolution favorable.<br><b>Évolution défavorable</b> : phase précoce (≤ 72 h) — fièvre, iléus ou défaillance persistante → suspecter une complication ou un contrôle imparfait de la source, reprise en urgence (R3.2.1) ; TDM sur discussion multidisciplinaire, pas de CRP/PCT, pas de culture du drain (R3.2.2). Phase tardive (&gt; 72 h) : TDM TAP injecté (± opacification si chirurgie gastrique/colique) (R3.2.3). Approche mini-invasive si patient stable (R3.1.2).',
 proba:'<b>IIA communautaire (Figure 1)</b><br>'+
 '• Sans sepsis ni choc : <b>céfotaxime ou ceftriaxone + métronidazole</b> (R1.2.1) ; pas de prise en compte des BLSE (R1.2.2).<br>'+
 '• Sepsis : idem ; carbapénème seulement si antécédent documenté de colonisation/infection à BLSE dans les 6 mois (R1.2.3).<br>'+
 '• Choc septique sans FdR de BLSE : <b>pipéracilline-tazobactam</b> (R1.2.4) ; avec ≥ 1 FdR de BLSE : <b>carbapénème</b> selon la prévalence locale (R1.2.5).<br>'+
 '• Allergie avérée (céphalosporines et carbapénèmes impossibles) : lévofloxacine + métronidazole ou moxifloxacine seule (contrôle du QTc) ; si FQ contre-indiquées : tigécycline (préférée en communautaire) ou éravacycline, réévaluation à 48 h (R1.2.11).<br>'+
 '<b>IIA associée aux soins, 1er épisode (Figure 2)</b><br>'+
 '• Sans FdR de BMR, y compris sepsis/choc : <b>céfépime + métronidazole</b> (R1.2.6, grade 1) — STP du céfépime (neurotoxicité) ; si STP impossible et selon l\'écologie : <b>pipéracilline-tazobactam</b> (R1.2.7).<br>'+
 '• <b>≥ 2 FdR de BMR</b>, ou <b>≥ 1 FdR en cas de sepsis/choc</b> : <b>imipénème ou méropénème</b> (R1.2.10, grade 1).<br>'+
 '• Entérocoques : choc septique sous céfépime-métronidazole → ajouter <b>linézolide, vancomycine ou teicoplanine</b> (R1.2.8) ; sous pip-tazo et FdR d\'entérocoque ampicilline-R → ajouter linézolide, vancomycine ou teicoplanine (R1.2.9).<br>'+
 '• Allergie avérée : (1) ciprofloxacine + métronidazole ± linézolide/vancomycine/teicoplanine ; (2) aztréonam + métronidazole ± linézolide/vancomycine/teicoplanine ; (3) tigécycline + ciprofloxacine ou éravacycline + ciprofloxacine (R1.2.12).<br>'+
 '• <b>Plus d\'aminoside systématique</b> en probabiliste (pas de bénéfice démontré).<br>'+
 '<b>Antifongique (Figure 3, R1.2.13)</b> — IIA communautaire avec sepsis/choc ou associée aux soins : traiter si <b>levures à l\'examen direct</b> du liquide péritonéal ou si <b>≥ 3 critères</b> parmi : défaillance hémodynamique, sexe féminin, chirurgie sus-mésocolique, antibiothérapie &gt; 48 h (Peritonitis score). Puis si défaillance hémodynamique ou IIA associée aux soins : <b>échinocandine</b> si FdR de souche fluconazole-R ou complication post-opératoire, sinon <b>fluconazole</b>. Pas d\'antifongique en IIA communautaire sans gravité, même si levures à l\'examen direct.<br>'+
 '<b>Complication post-opératoire (R3.3.x)</b> : probabiliste couvrant entérobactéries multirésistantes (dont BLSE), P. aeruginosa et E. faecium, selon l\'écologie locale et du patient (R3.3.1) ; antifongique probabiliste systématique (échinocandine) si mauvaise évolution avec gravité hémodynamique ou levures à l\'examen direct (R3.3.5) ; STP (R3.3.3).',
 doc:'<b>Désescalade</b> après résultats bactériologiques si évolution favorable après contrôle de la source (R2.4.1) ; désescalade antifongique possible si non neutropénique, source contrôlée, prélèvements interprétables, amélioration à 48–72 h, traitement initial optimisé et &gt; 24 h restant (R2.4.2). Adaptation aux prélèvements de reprise ou aux hémocultures seules si prélèvements non contributifs (R3.3.2). Antifongique probabiliste avec culture négative ou indisponible : BDG à J0 et J3, arrêt précoce si les deux sont négatifs (R2.3.2).<br><br>'+
 '<b>Posologies proposées en réanimation (Annexe 1)</b> — fonction rénale normale / hyperclairance (ClCr mesurée &gt; 130 mL/min) :'+
 '<table class="tbl tx"><tr><th>Molécule</th><th>Réanimation</th><th>Hyperclairance</th></tr>'+
 '<tr><td>Céfépime</td><td>DC 2 g (30 min) puis 3–4 g/j en continu ; STP entre H24 et H36</td><td>DC 2 g puis 6 g/j en continu ; STP</td></tr>'+
 '<tr><td>Pip-tazo</td><td>DC 4 g (30 min) puis 16 g/j en continu</td><td>DC 4 g puis 20 g/j en continu</td></tr>'+
 '<tr><td>Méropénème</td><td>3 g/j en continu</td><td>6 g/j en continu</td></tr>'+
 '<tr><td>Imipénème</td><td>1 g q8h (30 min)</td><td>—</td></tr>'+
 '<tr><td>Céfotaxime</td><td>2 g q8h (30 min) ou continu</td><td>NA*</td></tr>'+
 '<tr><td>Ceftriaxone</td><td>2 g q12h (30 min)</td><td>NA*</td></tr>'+
 '<tr><td>Ertapénem</td><td>1 g q12h</td><td>—</td></tr>'+
 '<tr><td>Métronidazole</td><td>500 mg q8h</td><td>—</td></tr>'+
 '<tr><td>Amikacine</td><td>25–30 mg/kg de poids ajusté, 1 fois/j</td><td>—</td></tr>'+
 '<tr><td>Ciprofloxacine</td><td>400 mg q8h</td><td>NA*</td></tr>'+
 '<tr><td>Lévofloxacine</td><td>500 mg q12h</td><td>NA*</td></tr>'+
 '<tr><td>Moxifloxacine</td><td>400 mg/j</td><td>—</td></tr>'+
 '<tr><td>Tigécycline</td><td>DC 100 mg puis 100 mg q12h</td><td>—</td></tr>'+
 '<tr><td>Éravacycline</td><td>1 mg/kg q12h</td><td>—</td></tr>'+
 '<tr><td>Vancomycine</td><td>DC 30 mg/kg (1 h) puis 10–30 mg/kg/j en continu selon la fonction rénale</td><td>DC 30 mg/kg puis 40 mg/kg/j en continu</td></tr>'+
 '<tr><td>Teicoplanine</td><td>12 mg/kg q12h pendant 3–5 j puis 12 mg/kg/j</td><td>NA*</td></tr>'+
 '<tr><td>Linézolide</td><td>600 mg q8–12h ; continu chez l\'obèse</td><td>1800 mg/j en continu (STP)</td></tr>'+
 '<tr><td>Caspofungine</td><td>DC 140 mg puis 1 mg/kg/j</td><td>—</td></tr>'+
 '<tr><td>Micafungine</td><td>DC 150 mg puis 100 mg/j (150 mg si obèse ; 200 mg/j possible : sous-exposition fréquente)</td><td>—</td></tr>'+
 '<tr><td>Fluconazole</td><td>DC 12 mg/kg puis 6 mg/kg/j</td><td>NA*</td></tr></table>'+
 '<span class="muted small">* NA : pas de données ; débuter comme chez le normoclairant puis adapter selon les dosages. Obèse : abxbmi ; insuffisance rénale : GPR. Dilutions et perfusions prolongées/continues : recommandations SPILF/SFPC 2025 (Ourghanlian).</span>',
 duree:'<b>Appendicite non compliquée</b>, source contrôlée : antibioprophylaxie seule (R2.2.1). <b>Appendicite compliquée</b> : <b>2 j</b> (R2.2.2). <b>IIA communautaire compliquée</b> (hors appendicite), source contrôlée : <b>4 j</b>, y compris sepsis initial ou drainage percutané/endoscopique (R2.2.3, grade 1). <b>IIA associée aux soins</b> (hors post-opératoire) sans sepsis : <b>4 j</b> (R2.2.4) ; avec sepsis/choc : <b>8 j</b> (R2.2.5). <b>Complication post-opératoire</b> : <b>8 j</b> après contrôle de la source et amélioration ; au-delà, discussion multidisciplinaire (R3.3.4). <b>Antifongique</b> débuté d\'emblée, culture positive à Candida : <b>8 j</b> si source contrôlée rapidement, évolution favorable et pas de candidémie (R2.3.1) ; sinon pas de recommandation.',
 div:'RFE SFAR 2026 élaborée <b>avec la SPILF et la SFPT</b> (et SFM, SFR, chirurgiens, endoscopistes) : <b>pas de divergence SFAR/SPILF</b> ; elle <b>remplace la RFE SFAR 2015</b>. Changements par rapport à 2015 : céfépime + métronidazole en 1re intention dans l\'IIA associée aux soins (pip-tazo en alternative), abandon de l\'aminoside systématique, carbapénème selon le nombre de FdR de BMR et la gravité, durées raccourcies (4 j en communautaire, alignées sur la SPILF 2021 — l\'ancienne divergence 5 j/4 j disparaît), BDG J0/J3 pour arrêter l\'antifongique. La témocilline n\'est pas abordée par la RFE.',
 refs:['sfar_iia26','ourghanlian25','merino18','has_carba19','spilf_durees21','ecmm_cand25','fundicu24','sfar_bl2019','sfar_iia15']},
{id:'cdi', cat:'Abdominal', name:'Infection à Clostridioides difficile', site:'abdo',
 epi:'Cf. fiche germe.', semio:'Diarrhée ≥ 3 selles/24 h ; formes graves : leucocytes > 15 G/L, créatinine > 133 µmol/L, fièvre > 38,5 °C ; fulminante : choc, iléus, mégacôlon.',
 diag:'Algorithme en 2 temps : GDH ou PCR toxine B (sensibles) puis toxines libres A/B (spécifique de maladie).',
 proba:'Fidaxomicine 200 mg q12h (1re intention) ou vancomycine PO 125 mg q6h ; fulminante : vancomycine 500 mg q6h PO/sonde ± lavements + métronidazole IV.',
 doc:'—', duree:'10 j.', div:'—', refs:['escmid_cdi21']},
{id:'endoc', cat:'Cardiovasculaire', name:'Endocardite infectieuse', site:'endo',
 epi:'S. aureus (1re cause), streptocoques, entérocoques, SCN (prothèses), HACEK, hémocultures négatives (Coxiella, Bartonella).',
 semio:'Critères de Duke-ISCVID 2023 / ESC 2023 ; complications neurologiques (emboles, anévrismes mycotiques) fréquentes : IRM cérébrale.',
 diag:'3 paires d\'hémocultures, ETT puis ETO, TEP-TDM (prothèse).',
 proba:'Valve native, communautaire : amoxicilline + cloxacilline (ou céfazoline) ± gentamicine ; prothèse précoce/nosocomiale : vancomycine + gentamicine + rifampicine (après 3–5 j) — ESC 2023.',
 doc:'SAMS : cloxacilline/céfazoline 4–6 sem ; SARM : vancomycine ou daptomycine ; E. faecalis : amoxicilline + ceftriaxone ; streptocoques : péni G/amox/ceftriaxone. Relais oral possible (POET) chez le patient stabilisé.',
 duree:'4–6 sem (valve native/prothèse) ; 2 sem pour certaines EI à streptocoque.',
 div:'Position SPILF sur ESC 2023 globalement concordante ; antibioprophylaxie TAVI : RFE SFAR-SPILF prévalent sur ESC.', refs:['esc_ei23','spilf_recos']},
{id:'dhbn', cat:'Peau / tissus mous', name:'Dermohypodermite bactérienne nécrosante / fasciite nécrosante', site:'peau',
 epi:'SGA, polymicrobien (périnée — Fournier, abdominal), S. aureus, Clostridium, Vibrio/Aeromonas (eau).',
 semio:'Douleur disproportionnée, nécrose, crépitation, choc ; LRINEC peu fiable.',
 diag:'Chirurgie exploratrice = diagnostic et traitement ; TDM sans retarder.',
 proba:'Membres/cervical : amox-clav (ou C3G) + clindamycine ; périnée/abdomen : pip-tazo + clindamycine (± amikacine) ; associé aux soins/FdR : carbapénème + clindamycine ± anti-SARM. Chirurgie urgente.',
 doc:'Selon prélèvements per-opératoires.', duree:'≈ 10–15 j selon évolution chirurgicale.', div:'—', refs:['spilf_recos','doses25']},
{id:'cand', cat:'Fongique', name:'Candidémie / candidose invasive', site:'bact',
 epi:'FdR : séjour prolongé, CVC, antibiothérapie large spectre, nutrition parentérale, chirurgie abdominale (fistules), EER, colonisation multisite.',
 semio:'—',
 diag:'Hémocultures (Se ≈ 50 %) ; β-D-glucane (bonne VPN) ; mannane/anti-mannane ; index de colonisation. Définitions FUNDICU 2024.',
 proba:'Traitement empirique en réanimation à discuter si choc septique inexpliqué + colonisation multisite + FdR (bénéfice non démontré, essai EMPIRICUS) ; arrêt si β-D-glucane négatif. Traitement : <b>échinocandine</b> 1re intention (ECMM 2025).',
 doc:'Désescalade fluconazole à J5–7 si souche S, patient stable, hémocultures négatives. Retrait du CVC, hémocultures quotidiennes, fond d\'œil, ETO si persistance. ⚠ Caspofungine + EER sur membrane AN69/oXiris : à proscrire (ANSM 2025).',
 duree:'14 j après la 1re hémoculture négative (non compliquée).', div:'—', refs:['ecmm_cand25','idsa_cand16','fundicu24','ansm_caspo25','spilf_cand']},
{id:'aspergillose', cat:'Fongique', name:'Aspergillose invasive (dont IAPA / CAPA)', site:'pulm',
 epi:'Neutropénie, greffes, corticoïdes ; en réanimation : grippe grave (IAPA), COVID (CAPA), BPCO sous corticoïdes, cirrhose.',
 semio:'Aggravation respiratoire, nodules/excavations, trachéobronchite pseudo-membraneuse (fibroscopie).',
 diag:'Galactomannane LBA (index ≥ 1,0) et sérique (≥ 0,5), PCR Aspergillus, culture ; définitions FUNDICU 2024 / EORTC 2020 (immunodéprimés).',
 proba:'Voriconazole (STP) ou isavuconazole ; amphotéricine B liposomale si contre-indication/résistance.',
 doc:'—', duree:'≥ 6–12 sem selon évolution.', div:'—', refs:['escmid_asp18','fundicu24','eortc20']},
{id:'grippe', cat:'Viral', name:'Pneumopathie virale (grippe, COVID-19, VRS)', site:'pulm',
 epi:'Cf. fiches germes.', semio:'—', diag:'PCR multiplex (naso-pharyngée ; aspiration trachéale/LBA chez le ventilé). PCT : aide pour suspecter une co-infection bactérienne.',
 proba:'<b>Grippe</b> : oseltamivir 75 mg q12h 5 j dès la suspicion ; antibiothérapie si co-infection suspectée (C3G ± anti-SARM si pneumonie nécrosante). <b>COVID-19</b> : dexaméthasone si O₂ ; immunomodulateurs selon gravité. <b>VRS</b> : symptomatique.',
 doc:'Rechercher une aspergillose associée (IAPA/CAPA) si aggravation.', duree:'Oseltamivir 5 j.', div:'—', refs:['idsa_flu18','idsa_covid','epopi']}
];
