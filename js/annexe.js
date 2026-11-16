/* MESURES ASSOCIÉES (hors anti-infectieux) PAR PATHOLOGIE — chaque item sourcé ; « (pas de recommandation) » quand aucune société savante ne tranche.
   ANNEXE[pathoId] = [{t:'titre', items:['html', …], refs:[…]}] */
window.ANNEXE = {
 pac: [
  {t:'Pneumonie nécrosante à S. aureus PVL', refs:[], items:['Associer un antitoxinique : voir <a href="#pharmaco-atx">Antibiothérapie antitoxinique</a>.']},
  {t:'Corticothérapie', refs:['spilf_pac25','capecod23','sccm_cs24'], items:[
   '<b>Hydrocortisone indiquée dans la PAC grave</b>, à débuter rapidement (SPILF/SPLF 2025). En dehors de cette indication, pas de corticothérapie systémique.',
   'Schéma de l\'essai CAPE COD : <b>200 mg/j IV</b> pendant 4 ou 7 j selon l\'amélioration clinique, puis décroissance ; <b>durée totale 8 ou 14 j</b>.',
   'Résultat de CAPE COD : mortalité à J28 de 6,2 % sous hydrocortisone contre 11,9 % sous placebo ; moins d\'intubations et moins de recours aux vasopresseurs.',
   'SCCM 2024 : recommandation forte pour les corticoïdes dans la PAC grave hospitalisée.']},
  {t:'Prévention', refs:['calvac26'], items:['Vaccination pneumococcique et grippale : voir l\'onglet <a href="#vaccins">Vaccins</a>.']}
 ],
 choc: [
  {t:'Choc toxique (streptocoque, staphylocoque)', refs:[], items:['Antitoxinique + chirurgie de la porte d\'entrée : voir <a href="#pharmaco-atx">Antibiothérapie antitoxinique</a>.']},
  {t:'Corticothérapie', refs:['ssc21','sccm_cs24'], items:[
   '<b>Hydrocortisone 200 mg/j</b> (50 mg q6h ou en continu) suggérée dans le choc septique avec besoin persistant de vasopresseurs, typiquement à partir de noradrénaline ≥ 0,25 µg/kg/min depuis ≥ 4 h (SSC 2021, recommandation faible).',
   'SCCM 2024 : corticoïdes suggérés dans le choc septique (recommandation conditionnelle) ; pas de fortes doses sur une courte durée.']},
  {t:'Contrôle de la source', refs:['ssc21'], items:['Identifier et contrôler rapidement la source (drainage, ablation de matériel, chirurgie), dès que c\'est médicalement et logistiquement possible.']}
 ],
 mening: [
  {t:'Dexaméthasone', refs:['spilf_mening18'], items:[
   '<b>10 mg toutes les 6 h pendant 4 jours</b> chez l\'adulte, juste avant ou avec la 1re dose d\'antibiotique.',
   '<b>Non recommandée</b> chez l\'immunodéprimé et dans la listériose neuroméningée.']},
  {t:'Mesures neurologiques', refs:['spilf_mening18','mourvillier13'], items:[
   '<b>Anticonvulsivants : non recommandés en prévention primaire</b> (SPILF 2018).',
   'Hors réanimation : unité permettant une surveillance de la conscience et de l\'hémodynamique <b>toutes les heures pendant au moins 24 h</b>.',
   '<b>Hypothermie thérapeutique délétère</b> : l\'essai français chez les méningites comateuses a été arrêté pour surmortalité (51 % contre 31 %).']},
  {t:'Suivi', refs:['combat22'], items:['Cohorte COMBAT : 29,9 % de handicap neuro-fonctionnel à 12 mois, plus fréquent après pneumocoque ; examen neurologique détaillé à la sortie pour organiser le suivi.']},
  {t:'Santé publique', refs:['corruss_iim25','spf_mso26'], items:['Méningocoque : signalement immédiat à l\'ARS et antibioprophylaxie des contacts (rifampicine en 1re intention) — voir <a href="#hygiene">Hygiène & signalement</a>.']}
 ],
 abces: [
  {t:'Neurochirurgie et adjuvants (ESCMID 2024)', refs:['escmid_abces24'], items:[
   '<b>Ponction-aspiration ou exérèse dès que possible</b> si techniquement faisable, sauf toxoplasmose (recommandation forte).',
   'Sans forme grave, si la chirurgie est possible dans un délai raisonnable (de préférence < 24 h), les antibiotiques peuvent être différés jusqu\'au prélèvement (conditionnel).',
   '<b>Corticoïdes</b> en cas de symptômes sévères liés à l\'œdème périlésionnel ou d\'engagement imminent (fort).',
   '<b>Pas d\'antiépileptique en prophylaxie primaire</b> (conditionnel, niveau très faible).',
   'IRM cérébrale pour le diagnostic (fort) ; durée d\'antibiothérapie 6–8 semaines (conditionnel).']}
 ],
 endoc: [
  {t:'Antithrombotiques (ESC 2023, tableau 22)', refs:['esc_ei23'], items:[
   '<b>Saignement majeur, dont hémorragie intracrânienne : arrêter antiagrégants et anticoagulants</b> (classe I, C).',
   'Hémorragie intracrânienne + <b>valve mécanique</b> : reprendre l\'HNF dès que possible après discussion multidisciplinaire (IIa, C).',
   'Sans AVC, si une chirurgie est probable (ex. EI à S. aureus) : remplacer l\'anticoagulant oral par de l\'HNF sous surveillance étroite (IIa, C).',
   '<b>Thrombolyse non recommandée</b> dans l\'EI (ESC 2023, III C).']},
  {t:'Chirurgie cardiaque après complication neurologique (ESC 2023)', refs:['esc_ei23'], items:[
   'Après un AIT : chirurgie sans délai si elle est indiquée (I, B).',
   'Après un AVC ischémique : chirurgie sans délai si insuffisance cardiaque, infection non contrôlée, abcès ou risque embolique élevé persistant, <b>en l\'absence de coma et après exclusion d\'une hémorragie</b> au scanner/IRM (I, B).',
   'Hémorragie intracrânienne significative : délai d\'<b>au moins 4 semaines</b> en général ; si instabilité (insuffisance cardiaque, infection non contrôlée), chirurgie urgente à discuter en pesant le pronostic neurologique (IIa, C).']},
  {t:'Autres', refs:['esc_ei23'], items:[
   'Chirurgie urgente (3–5 j) si végétation ≥ 10 mm et autre indication chirurgicale (I, C).',
   'Imagerie cérébrale et corps entier (TDM, TEP-FDG et/ou IRM) chez les patients symptomatiques (I, B).',
   'EI compliquée : prise en charge par une « Endocarditis Team » avec chirurgie cardiaque sur place (I, B).']}
 ],
 bact_kt: [
  {t:'Thrombophlébite suppurée (septique) sur cathéter', refs:['idsa_crbsi09'], items:[
   'IDSA 2009 : <b>le rôle de l\'héparine n\'est pas établi</b> (C-III) — pas de recommandation pour ou contre l\'anticoagulation curative.',
   'Antibiothérapie <b>d\'au moins 3–4 semaines</b> (B-III). Détails : fiche <a href="#p-thrombo">Thromboses septiques</a>.']},
  {t:'Thrombose sur cathéter veineux central non suppurée (SPLF 2019)', refs:['splf_mtev19'], items:[
   'Anticoagulation <b>pendant au moins 3 mois, que le cathéter soit retiré ou non</b> (R232, grade 2+).',
   'Poursuivre au-delà de 3 mois tant que le cathéter reste en place (R233, 2+).',
   'HBPM ou AVK plutôt qu\'AOD (R234, 2+).',
   'Garder le cathéter s\'il est fonctionnel (bon reflux) ; sinon le retirer (R235, 2+).']},
  {t:'TVP du membre supérieur (SPLF 2019)', refs:['splf_mtev19'], items:[
   'Symptomatique, axillaire ou sous-clavière : anticoagulation (R313, 1+), mêmes molécules et doses qu\'au membre inférieur (R315).',
   'Durée de 3 mois en l\'absence de facteur favorisant persistant (R317) ; pas de thrombolyse (R316).']}
 ],
 thrombo: [
  {t:'Anticoagulation : thrombophlébite suppurée sur cathéter', refs:['idsa_crbsi09','splf_mtev19'], items:[
   '<b>Pas de recommandation</b> : IDSA 2009 juge le rôle de l\'héparine « non établi » (C-III). Aucune recommandation française spécifique.',
   'Repère disponible pour une thrombose sur cathéter non infectée (SPLF 2019) : anticoagulation ≥ 3 mois, prolongée tant que le cathéter est en place (R232–R233).',
   'Décision individuelle : extension du thrombus, embolie pulmonaire, risque hémorragique (thrombopénie, chirurgie récente, lésion cérébrale).']},
  {t:'Anticoagulation : syndrome de Lemierre', refs:['valerio21','adedeji21'], items:[
   '<b>Pas de recommandation</b> ; données observationnelles uniquement.',
   'Série de 712 cas (2000–2017) : nouvelle thrombose ou nouvelle localisation septique moins fréquente sous anticoagulation (OR 0,59 ; IC 95 % 0,36–0,94) ; saignement majeur 2,9 % ; risque plus élevé en cas d\'atteinte intracrânienne initiale (OR 2,35).',
   'Revue systématique (14 patients) : si l\'anticoagulation est choisie, durée de <b>6 à 12 semaines</b> proposée par les auteurs (avis, non validé).']},
  {t:'Antibiothérapie', refs:['idsa_crbsi09'], items:['Thrombophlébite suppurée sur cathéter : <b>au moins 3–4 semaines</b> (IDSA 2009, B-III), après retrait du cathéter.']}
 ],
 abces_pulm: [
  {t:'Lemierre (thrombophlébite jugulaire septique)', refs:['valerio21'], items:['Anticoagulation : pas de recommandation — voir la fiche <a href="#p-thrombo">Thromboses septiques</a>.']}
 ],
 cand: [
  {t:'Mesures associées à l\'antifongique', refs:['ecmm_cand25','idsa_cand16'], items:[
   '<b>Retrait du CVC</b>, hémocultures quotidiennes jusqu\'à négativation.',
   '<b>Fond d\'œil dilaté</b> dans la 1re semaine (après sortie d\'aplasie si neutropénie).',
   'Échographie cardiaque (ETO) si hémocultures persistantes.']}
 ],
 cdi: [
  {t:'Mesures associées (ESCMID 2021)', refs:['escmid_cdi21'], items:[
   'Arrêter les antibiotiques non indispensables et les IPP.',
   'Forme fulminante : avis chirurgical précoce ; colectomie subtotale ou iléostomie de dérivation avec lavage colique si perforation, mégacôlon, choc réfractaire.',
   'Récidives multiples : transplantation de microbiote fécal.',
   'Hygiène : précautions contact, lavage des mains à l\'eau et au savon (SHA inactives sur les spores), bionettoyage sporicide — voir <a href="#hygiene">Hygiène</a>.']}
 ],
 dhbn: [
  {t:'Chirurgie et adjuvants', refs:['wses_nsti18','idsa_ssti14'], items:[
   '<b>Débridement chirurgical en urgence</b> de tous les tissus nécrosés, reprise systématique à 24–48 h puis itérative.',
   'IgIV : à discuter dans le choc toxique streptococcique (avis d\'expert ; pas de bénéfice fonctionnel dans l\'essai INSTINCT, infections nécrosantes toutes causes).',
   'Oxygénothérapie hyperbare : non validée, ne doit jamais retarder la chirurgie.',
   'Antibiotique antitoxinique (clindamycine, linézolide) : voir <a href="#pharmaco-atx">Antibiothérapie antitoxinique</a>.',
   'Contrôle glycémique, nutrition hyperprotidique, pansements par pression négative puis reconstruction.']}
 ],
 fournier: [
  {t:'Mesures associées', refs:['fournier_cur25'], items:['Débridement chirurgical urgent et itératif.','<b>Arrêter les inhibiteurs de SGLT2 (gliflozines)</b> (alerte de pharmacovigilance).']}
 ],
 aspergillose: [
  {t:'Mesures associées', refs:['escmid_asp18'], items:['Réduire l\'immunosuppression et les corticoïdes si possible.','Chirurgie : hémoptysie grave, lésion au contact des gros vaisseaux.']}
 ],
 mucormycose: [
  {t:'Mesures associées (ECMM/MSG-ERC 2019)', refs:['cornely_muco19'], items:['<b>Chirurgie de débridement urgente et itérative</b>.','Équilibre glycémique et correction de l\'acidocétose ; réduction de l\'immunosuppression et des corticoïdes ; arrêt de la déféroxamine ; G-CSF si neutropénie.']}
 ],
 pneumocystose: [
  {t:'Corticothérapie adjuvante', refs:['nih_oi_pcp','ecil5pjp','pic25'], items:[
   '<b>VIH</b> avec PaO₂ < 70 mmHg : prednisone 40 mg × 2/j 5 j, puis 40 mg/j 5 j, puis 20 mg/j 11 j, débutée dans les 72 h.',
   '<b>Non-VIH</b> : essai randomisé français PIC (2025, insuffisance respiratoire aiguë) — pas de réduction de la mortalité à J28 sous corticoïdes ; ECIL-5 : bénéfice non démontré, au cas par cas.']}
 ],
 cryptococcose: [
  {t:'Hypertension intracrânienne', refs:['ecmm_crypto24','who_crypto22'], items:[
   'Pression d\'ouverture ≥ 25 cmH₂O : <b>PL évacuatrices répétées</b> (quotidiennes jusqu\'à stabilisation ; retirer 20–30 mL jusqu\'à pression < 20 cmH₂O ou baisse de 50 %).',
   'Drain lombaire ou DVE si réfractaire.',
   '<b>Pas d\'acétazolamide, de mannitol ni de corticoïdes</b> (sauf IRIS).']}
 ],
 grippe: [
  {t:'Mesures associées', refs:['idsa_flu18','idsa_covid','sf2h_resp24'], items:[
   'Grippe : <b>pas de corticoïdes pour la grippe elle-même</b> (hors hydrocortisone du choc septique).',
   'COVID-19 oxygéno-requérant : dexaméthasone 6 mg/j 10 j ; anticoagulation préventive.',
   'Précautions respiratoires : voir <a href="#hygiene">Hygiène</a>.']}
 ],
 iia: [
  {t:'Contrôle de la source (RFE SFAR 2026)', refs:['sfar_iia26'], items:[
   'En urgence et par chirurgie avec lavage de toute la cavité si instabilité hémodynamique (R1.1.1, grade 1) ; « damage control » si instabilité non contrôlée.',
   'Collection post-opératoire accessible chez un patient stable : drainage percutané ou endoscopique en 1re intention (R1.1.4).']}
 ],
 iu: [
  {t:'Mesures associées', refs:['spilf_recos'], items:['Imagerie dans les 24 h (échographie ou uroscanner) et <b>drainage urgent de tout obstacle</b> (sonde JJ ou néphrostomie).']}
 ],
 iuas: [
  {t:'Mesures associées (SF2H/SPILF 2015)', refs:['spilf_iuas15'], items:['Changer la sonde avant de débuter l\'antibiothérapie et prélever sur la nouvelle sonde.','Retirer toute sonde non indispensable.']}
 ],
 sinusite: [
  {t:'Mesures non anti-infectieuses (base du traitement)', refs:['holzapfel99','rouby94'], items:[
   'Retirer les sondes nasales (intubation et sonde gastrique par voie orale).',
   'DRP : NaCl 0,9 % 10–20 mL par narine 3–4 fois/j, puis aspiration douce.',
   'Ponction-drainage ORL si fièvre persistante 48–72 h après ces mesures ou sinus bloqué (détails dans « Traitement »).']}
 ]
};
