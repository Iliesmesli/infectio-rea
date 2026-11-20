/* Fiches transversales de pharmacologie (onglet Pharmaco) */
window.ANTITOX = {id:'antitox', cat:'Transversal', name:'Antibiothérapie antitoxinique (choc toxique, DHBN, PVL) — puissance comparée', site:'peau',
 epi:'Indications : choc toxique streptococcique (SGA) ou staphylococcique (TSST-1), DHBN/fasciite nécrosante, pneumonie nécrosante à S. aureus PVL+, gangrène gazeuse (Clostridium). Principe : les β-lactamines seules ne bloquent pas la production de toxines (et, à concentration sub-inhibitrice, l\'oxacilline augmente la production de PVL in vitro) ; inhibiteurs de la synthèse protéique associés.',
 semio:'—',
 diag:'<table class="tbl tx"><tr><th>Molécule</th><th>Puissance antitoxinique</th><th>Commentaires</th></tr>'+
 '<tr><td><b>Linézolide</b></td><td>+++</td><td>Forte réduction de PVL, TSST-1, α-toxine in vitro ; actif sur SARM et indépendant de la résistance MLSb ; excellente diffusion pulmonaire. Préféré pour PVL/SARM ou si clindamycine R.</td></tr>'+
 '<tr><td><b>Clindamycine</b></td><td>+++</td><td>Référence pour le SGA (indépendante de l\'inoculum, « effet Eagle » — Stevens 1988) ; adjonction associée à une baisse de mortalité dans les infections invasives à streptocoque β-hémolytique (Babiker 2021). Inefficace si résistance (vérifier le test D : résistance inductible MLSb).</td></tr>'+
 '<tr><td>Tédizolide</td><td>++/+++</td><td>Données in vitro favorables (non validé cliniquement dans cette indication).</td></tr>'+
 '<tr><td>Rifampicine</td><td>++</td><td>Diminue la PVL in vitro (Dumitrescu 2007) ; jamais seule ; interactions (nimodipine : CI per os, déconseillée IV).</td></tr>'+
 '<tr><td>Acide fusidique</td><td>++</td><td>Diminue la PVL in vitro ; usage limité en réanimation.</td></tr>'+
 '<tr><td>Macrolides (azithro/érythro)</td><td>+</td><td>Effet modeste, résistances fréquentes chez SGA/S. aureus.</td></tr>'+
 '<tr><td>Vancomycine</td><td>0</td><td>Pas d\'effet antitoxinique.</td></tr>'+
 '<tr><td>β-lactamines (oxacilline…)</td><td>0 / ↑</td><td>Bactéricides mais pas d\'effet sur la synthèse des toxines ; ↑ PVL à concentration sub-inhibitrice → toujours associer un antitoxinique dans les formes toxiniques.</td></tr></table>',
 proba:'SGA (DHBN, choc toxique) : amoxicilline (ou péni G) forte dose + <b>clindamycine</b> 600–900 mg q8h (linézolide si clindamycine R). S. aureus PVL+/TSST-1 : cloxacilline (SAMS) ou vancomycine (SARM) + <b>linézolide</b> 600 mg q12h (ou clindamycine si S). <b>IgIV</b> (avis d\'expert) : choc toxique streptococcique grave ; pneumonie PVL grave (≈ 1–2 g/kg — avis CNR/infectiologue). Chirurgie/débridement en urgence.',
 doc:'Arrêt de l\'antitoxinique après stabilisation (souvent 3–7 j) ; poursuite de la molécule bactéricide selon le foyer.',
 duree:'Antitoxinique : phase aiguë (≈ 3–7 j, durée non établie) ; antibiothérapie totale selon le foyer.',
 div:'—', refs:['dumitrescu07','stevens88','babiker21','luyt_jni20','doses25']};

/* Antibiothérapie anti-biofilm (infections sur matériel) — onglet Pharmaco > Anti-biofilm */
window.ANTIBIOFILM = {
 principe:`<ul class="pts">
  <li><b>Biofilm</b> : bactéries adhérentes au matériel (cathéter, DVE, dérivation, ostéosynthèse, prothèse valvulaire) dans une matrice, en grande partie à croissance ralentie → persistance et rechutes malgré une antibiothérapie active in vitro.</li>
  <li><b>Le geste sur le matériel prime</b> : retrait du cathéter obligatoire si bactériémie à <i>S. aureus</i> ou <i>Candida</i> (IDSA 2009, A-II) ; retrait du matériel de dérivation/DVE infecté (voir la fiche <a href="#p-ventri">Ventriculite</a>). La molécule anti-biofilm ne se discute que si le matériel est <b>conservé</b> (ou en attente de retrait).</li>
  <li><b>Rifampicine</b> : bloque la transcription indépendamment de la division bactérienne → activité sur les bactéries dormantes et bonne diffusion dans le biofilm (revue française 2012).</li>
  <li><b>Sans matériel, pas de rifampicine</b> : dans l'essai ARREST (758 bactériémies à <i>S. aureus</i>), son ajout n'apporte aucun bénéfice et augmente les effets indésirables imposant un changement de traitement et les interactions (6 % contre 2 %). ESC 2023 : rifampicine réservée aux endocardites sur matériel.</li>
 </ul>`,
 tab:`<table class="tbl tx"><tr><th>Molécule</th><th>Rôle anti-biofilm</th><th>Données</th></tr>
  <tr><td><b>Rifampicine</b> (staphylocoques)</td><td>+++ — molécule de référence, <b>toujours associée</b></td><td>Essai randomisé Zimmerli 1998 (33 patients, implants orthopédiques stables, symptômes courts) : guérison 12/12 avec ciprofloxacine + rifampicine contre 7/12 sans rifampicine. SPILF 2009 : à privilégier dans l'association si souche sensible (grade B).</td></tr>
  <tr><td><b>Fluoroquinolones</b> (ciprofloxacine, lévofloxacine)</td><td>++ — partenaire de la rifampicine (staphylocoques) ; molécule clé des <b>BGN</b> sur matériel</td><td>Prothèses articulaires à BGN traitées par lavage + ciprofloxacine, matériel conservé : 79 % de succès si souche sensible (cohorte multicentrique, Rodríguez-Pardo 2014). SPILF 2009 : β-lactamine + fluoroquinolone si BGN sensible.</td></tr>
  <tr><td>Daptomycine, fosfomycine</td><td>± — options d'association</td><td>Données surtout expérimentales (modèles animaux, avec rifampicine), citées dans la revue française de réanimation (Lebeaux 2016). Pas de validation clinique comparative.</td></tr>
  <tr><td>Clindamycine, acide fusidique, cotrimoxazole</td><td>Partenaires oraux de la rifampicine</td><td>SPILF 2009. Rifampicine : concentrations de clindamycine divisées par 2 (dosage conseillé) ; cotrimoxazole seulement faute d'alternative.</td></tr>
  <tr><td>Antifongiques (<i>Candida</i>)</td><td>Pas de molécule « anti-biofilm » validée</td><td>Retrait du cathéter (IDSA 2009, A-II) ou du dispositif (IDSA 2016). Prothèse articulaire non retirable : suppression prolongée par fluconazole si souche sensible (IDSA 2016).</td></tr></table>`,
 situ:`<table class="tbl tx"><tr><th>Situation</th><th>Conduite</th><th>Source</th></tr>
  <tr><td><b>DVE, dérivation, matériel intracrânien ou rachidien</b> à staphylocoque</td><td>Rifampicine <b>en association</b> recommandée chez tout patient porteur de matériel intracrânien ou rachidien (recommandation forte, faible niveau de preuve) ; « peut être envisagée » dans la ventriculite à staphylocoque sans matériel (faible). Retrait/remplacement du matériel.</td><td>IDSA 2017</td></tr>
  <tr><td><b>DVE, dérivation, matériel intracrânien</b> à <b>BGN</b> : ajout d'une fluoroquinolone ?</td><td><b>Pas de recommandation, pas de donnée clinique propre</b> aux ventriculites/méningites à BGN. IDSA 2017 : fluoroquinolone = <b>alternative</b> à la β-lactamine (aztréonam ou FQ active in vitro, ciprofloxacine si β-lactamine contre-indiquée), association rifampicine réservée aux staphylocoques. <a class="recolink noabbr" href="https://www.infectiologie.com/UserFiles/File/jni/2023/com/sp01-02-dahyotfizelier.pdf" target="_blank" rel="noopener">JNI 2023</a> (SFAR) : association pour les BGN posée comme question ouverte.<br><b>Arguments indirects</b> : prothèses articulaires à BGN conservées (Rodríguez-Pardo 2014) ; extrapolation au matériel neurochirurgical par avis d'experts (Conen 2017, 2020), sans validation.<br><b>DVE</b> : changement ou ablation = la règle → l'argument anti-biofilm ne tient plus une fois la DVE changée.<br><b>À discuter avec le référent</b>, souche S : ajout de ciprofloxacine 400 mg × 3/j si matériel non retirable (dérivation interne, matériel intracrânien), DVE non changeable, ou cultures du LCS persistantes sous β-lactamine active. Contre : seuil épileptogène abaissé, sélection de résistances. En cas d'échec, la voie intraventriculaire est mieux étayée (<a href="#pharmaco-ivt">Intraventriculaire</a>).</td><td>IDSA 2017 ; <a class="recolink noabbr" href="https://www.infectiologie.com/UserFiles/File/jni/2023/com/sp01-02-dahyotfizelier.pdf" target="_blank" rel="noopener">JNI 2023</a> ; Rodríguez-Pardo 2014 ; Conen 2017, 2020 (avis d'experts)</td></tr>
  <tr><td><b>Endocardite sur prothèse valvulaire</b> à staphylocoque</td><td>β-lactamine antistaphylococcique (ou daptomycine) + <b>rifampicine</b>, ≥ 6 semaines ; gentamicine remplacée par la rifampicine <b>après stérilisation des hémocultures</b>.</td><td>ESC 2023 ; SPILF/AEPEI 2025</td></tr>
  <tr><td><b>Ostéosynthèse / prothèse ostéo-articulaire</b> conservée (staphylocoque)</td><td>Rifampicine + fluoroquinolone (ou clindamycine, acide fusidique, cotrimoxazole) ; IV ≈ 15 jours puis relais oral.</td><td>SPILF 2009</td></tr>
  <tr><td>Même situation, <b>BGN</b></td><td>β-lactamine + fluoroquinolone si souche sensible ; <i>P. aeruginosa</i> : β-lactamine antipyocyanique associée ≥ 3 semaines, relais ciprofloxacine possible (avis d'experts).</td><td>SPILF 2009</td></tr>
  <tr><td><b>Cathéter de longue durée</b> conservé (sans infection du trajet ni de l'orifice)</td><td><b>Verrou antibiotique</b> + antibiothérapie systémique, 10–14 jours (B-II) ; jamais le verrou seul ; renouvellement au moins toutes les 48 h (24 h de préférence) ou après chaque dialyse. Pas de verrou si <i>S. aureus</i> ou <i>Candida</i> : retrait (A-II). Concentrations : tableau 9 de la recommandation (ex. vancomycine 2,5 mg/mL, éthanol 70 %).</td><td>IDSA 2009</td></tr>
  <tr><td>Cathéter de dialyse de courte durée (réanimation)</td><td>Verrou éthanol de 2 minutes en prévention : <b>pas de bénéfice</b> (1 460 patients, 16 réanimations françaises).</td><td>Souweine 2015</td></tr>
  <tr><td>Bactériémie à <i>S. aureus</i> <b>sans matériel</b></td><td>Pas de rifampicine.</td><td>ARREST 2018 ; ESC 2023</td></tr></table>`,
 regles:`<ul class="pts">
  <li><b>Jamais en monothérapie</b> : rifampicine, acide fusidique, fluoroquinolones, fosfomycine (SPILF 2009).</li>
  <li><b>Moment d'introduction</b> : après stérilisation des hémocultures (SPILF/AEPEI 2025) — en pratique après 3–5 jours de traitement efficace — pour limiter la sélection de mutants résistants sous forte charge bactérienne.</li>
  <li><b>Antibiogramme</b> : vérifier la sensibilité à la rifampicine (et aux fluoroquinolones) du partenaire.</li>
  <li><b>Interactions en neuroréanimation</b> : inducteur puissant — nimodipine (contre-indiquée per os, déconseillée IV), antiépileptiques, voriconazole (contre-indiqué), clindamycine. Voir <a href="#pharmaco-tox:interneuro">Toxicités → interactions neuroréa</a> et la <a href="#m-rifam">fiche rifampicine</a> (posologies, protocole NAR).</li>
  <li><b>Disponibilité</b> : tensions d'approvisionnement répétées sur les formes orales (restriction des indications par l'ANSM d'avril 2024 au 3 février 2025) — vérifier auprès de la pharmacie.</li>
 </ul>`,
 duree:`<ul class="pts">
  <li><b>Infection ostéo-articulaire sur matériel</b> : au moins 6 semaines, habituellement 6–12 ; au-delà de 12 semaines, à argumenter. Prothèse conservée après lavage : 6 semaines, inutile de prolonger (SPILF 2009).</li>
  <li><b>Endocardite sur prothèse</b> : ≥ 6 semaines (ESC 2023).</li>
  <li><b>Verrou antibiotique</b> : 10–14 jours avec le traitement systémique ; hémocultures de contrôle 1 semaine après la fin si le cathéter est conservé (IDSA 2009).</li>
 </ul>`,
 refs:['spilf_ioa09','zimmerli98','rodriguez14','arrest18','esc_ei23','spilf_aepei25','idsa_vent17','jni_neuro23','conen17','conen20','fq_biofilm24','idsa_crbsi09','idsa_cand16','souweine15','lebeaux16','rifam_rhum12','ansm_rifam24']
};

/* Antibiothérapie intrathécale / intraventriculaire — onglet Pharmaco > Intraventriculaire */
window.IVTH = {
 indic:`<ul class="pts">
  <li><b>Toujours en complément</b> d'une antibiothérapie IV à dose méningée, jamais seule.</li>
  <li><b>Indications</b> : ventriculite ou méningite associée aux soins qui <b>répond mal au traitement systémique seul</b> (IDSA 2017, recommandation forte, faible niveau de preuve) ; en pratique, BGN multi- ou ultrarésistant (<i>A. baumannii</i>, <i>P. aeruginosa</i>, entérobactérie carbapénèmase) sensible seulement à la colistine ou aux aminosides, ou échec clinique ou microbiologique.</li>
  <li><b>Traitement de sauvetage / dernier recours</b> : aucune molécule n'a d'AMM pour cette voie, hors colistiméthate (<a class="recolink noabbr" href="https://base-donnees-publique.medicaments.gouv.fr/medicament/65283158/extrait" target="_blank" rel="noopener">RCP</a> : « données limitées »).</li>
  <li><b>Pas de protocole NAR spécifique</b> : décision au cas par cas avec neurochirurgien, infectiologue et pharmacien.</li>
 </ul>`,
 doses:`<table class="tbl tx"><tr><th>Molécule</th><th>Dose intraventriculaire quotidienne (adulte)</th><th>Remarques</th></tr>
  <tr><td><b>Colistiméthate sodique</b></td><td><b>125 000 UI/j</b> (= 10 mg de colistiméthate ≈ 4 mg de colistine base)</td><td><a class="recolink noabbr" href="https://base-donnees-publique.medicaments.gouv.fr/medicament/65283158/extrait" target="_blank" rel="noopener">RCP</a> : flacon de 1 MUI, solution reconstituée à 125 000 UI/mL, volume injecté ≤ 1 mL ; voie intrathécale lombaire : ne pas dépasser la dose intraventriculaire. IDSA 2017 : « colistine (colistiméthate) 10 mg ».</td></tr>
  <tr><td>Polymyxine B</td><td>5 mg/j</td><td>IDSA 2017.</td></tr>
  <tr><td><b>Amikacine</b></td><td>5–50 mg/j (usuel 30 mg)</td><td>IDSA 2017.</td></tr>
  <tr><td><b>Gentamicine</b></td><td>4–8 mg/j</td><td>IDSA 2017. Une série sans rechute avec gentamicine intraventriculaire + méropénème IV.</td></tr>
  <tr><td>Tobramycine</td><td>5–20 mg/j</td><td>IDSA 2017.</td></tr>
  <tr><td><b>Vancomycine</b></td><td>5–20 mg/j (10 ou 20 mg dans la plupart des études)</td><td>IDSA 2017 ; revue systématique : sûre et efficace (méthodologie limitée).</td></tr>
  <tr><td>Daptomycine</td><td>2–5 mg/j</td><td>IDSA 2017 : cas isolés (Gram + résistants).</td></tr>
  <tr><td>Amphotéricine B désoxycholate</td><td>0,01–0,5 mg dans 2 mL de G5 %</td><td>IDSA 2017 : rarement nécessaire (retrait du matériel trop risqué ou échec du traitement systémique).</td></tr>
  <tr><td><b>β-lactamines</b></td><td><b>Non</b></td><td>Pénicillines et céphalosporines : neurotoxicité importante par voie intrathécale (IDSA 2017). Méropénem : données pharmacocinétiques seulement (10 mg q12h), injection unique quotidienne probablement insuffisante (revue 2023).</td></tr></table>
  <p class="muted small">Autres molécules rapportées (tigécycline, ceftazidime, lévofloxacine…) : cas isolés, effets indésirables décrits — hors recommandations.</p>`,
 adapt:`<table class="tbl tx"><tr><th>Débit de la DVE (mL/24 h)</th><th>Fréquence (IDSA 2017)</th></tr>
  <tr><td>&lt; 50</td><td>Toutes les 72 h</td></tr>
  <tr><td>50–100</td><td>Toutes les 48 h</td></tr>
  <tr><td>100–150</td><td>Toutes les 24 h</td></tr>
  <tr><td>150–200</td><td>Toutes les 24 h, dose + 5 mg (vancomycine) ou + 1 mg (gentamicine)</td></tr>
  <tr><td>200–250</td><td>Toutes les 24 h, dose + 10 mg (vancomycine) ou + 2 mg (gentamicine)</td></tr></table>
  <table class="tbl tx"><tr><th>Taille des ventricules (adulte)</th><th>Vancomycine</th><th>Gentamicine</th></tr>
  <tr><td>Fentes (« slit »)</td><td>5 mg</td><td>2 mg</td></tr>
  <tr><td>Normale</td><td>10 mg</td><td>3 mg</td></tr>
  <tr><td>Dilatés</td><td>15–20 mg</td><td>4–5 mg</td></tr></table>
  <ul class="pts"><li><b>Dosage dans le LCS</b> : ajuster dose et intervalle pour une concentration résiduelle de <b>10–20 × la CMI</b> (IDSA 2017, forte/faible) — mais cibles mal définies et dosage non disponible en routine pour toutes les molécules (revue 2023).</li></ul>`,
 tech:`<ul class="pts">
  <li><b>Voie</b> : DVE ou réservoir d'Ommaya. Préférer l'intraventriculaire à l'intrathécal lombaire : concentrations ventriculaires 2 à 10 fois plus élevées ; pic lombaire retardé et variable (GERICCO 2024).</li>
  <li><b>Préparation</b> : produit <b>sans conservateur</b> (IDSA 2017), asepsie stricte (chaque manipulation de la DVE expose au risque infectieux), double contrôle de la dilution — des erreurs de dilution ont causé des accidents graves (revue 2023).</li>
  <li><b>Injection</b> (GERICCO 2024) : prélever 5 mL de LCS, injecter 5 mL (NaCl 0,9 % ou eau), sauf colistiméthate (≤ 1 mL de solution à 125 000 UI/mL, <a class="recolink noabbr" href="https://base-donnees-publique.medicaments.gouv.fr/medicament/65283158/extrait" target="_blank" rel="noopener">RCP</a>).</li>
  <li><b>Clampage de la DVE 15–60 min</b> après l'injection (IDSA 2017), selon la tolérance de la PIC.</li>
  <li><b>Rythme</b> : en général une injection par jour (demi-vie longue dans le LCS), à espacer si faible débit de drainage (tableau ci-dessus).</li>
 </ul>`,
 tox:`<ul class="pts">
  <li><b>Ventriculite ou méningite chimique</b> (aseptique) : complication la plus fréquente (≈ 13 % dans une méta-analyse citée par la revue de 2023) ; colistine : 11 % dans la revue de Karaiskos 2013, réversible. <a class="recolink noabbr" href="https://base-donnees-publique.medicaments.gouv.fr/medicament/65283158/extrait" target="_blank" rel="noopener">RCP colistiméthate</a> : signes d'irritation méningée possibles.</li>
  <li>Piège : la ventriculite chimique imite une rechute (cellularité, protéinorachie) → s'appuyer sur la culture du LCS.</li>
  <li><b>Convulsions</b> : β-lactamines contre-indiquées par cette voie (IDSA 2017).</li>
  <li>Polymyxines, gentamicine, vancomycine : pas de toxicité grave ou irréversible rapportée aux doses recommandées (IDSA 2017).</li>
 </ul>`,
 duree:`<ul class="pts">
  <li><b>Arrêt après 48–72 h si le LCS est stérilisé</b> ; sinon jusqu'à 10–14 jours ; plus long pour les infections fongiques (GERICCO 2024, d'après Nau 2020). Durée de l'antibiothérapie IV : voir la fiche Ventriculite.</li>
  <li>En pratique, durée médiane observée inférieure à une semaine (étude de pratiques).</li>
  <li>Cultures du LCS de contrôle quotidiennes ou rapprochées jusqu'à stérilisation.</li>
 </ul>`,
 preuves:`<ul class="pts">
  <li><b>Méta-analyse 2024</b> (18 études, 602 patients, BGN post-neurochirurgicaux) : bénéfice sur la mortalité et la stérilisation, <b>surtout pour les BGN ultrarésistants</b> ; pas plus d'effets indésirables aux doses recommandées.</li>
  <li><b>Méta-analyse 2018</b> (Karvouniaris, BGN) : pas de supériorité globale de l'association intraventriculaire + IV ; preuve faible d'un intérêt pour les bactéries résistantes aux carbapénèmes.</li>
  <li><b>Colistine et <i>A. baumannii</i></b> (Karaiskos 2013, 83 épisodes) : 89 % de succès.</li>
  <li>Uniquement des études observationnelles, hétérogènes, avec biais d'indication. Question ouverte à l'ère des nouvelles β-lactamines (2024).</li>
 </ul>`,
 refs:['idsa_vent17','rcp_colis_ivt','gericco24','muller23','li24_ivt','karvouniaris18','karaiskos13']
};
