/* Fiches transversales de pharmacologie (onglet Pharmaco) */
window.ANTITOX = {id:'antitox', cat:'Transversal', name:'Antibiothérapie antitoxinique (choc toxique, DHBN, PVL) — puissance comparée', site:'peau',
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
  <li><b>Interactions en neuroréanimation</b> : inducteur puissant — nimodipine (contre-indiquée), antiépileptiques, voriconazole (contre-indiqué), clindamycine. Voir <a href="#pharmaco-tox:interneuro">Toxicités → interactions neuroréa</a> et la <a href="#m-rifam">fiche rifampicine</a> (posologies, protocole NAR).</li>
  <li><b>Disponibilité</b> : tensions d'approvisionnement répétées sur les formes orales (restriction des indications par l'ANSM d'avril 2024 au 3 février 2025) — vérifier auprès de la pharmacie.</li>
 </ul>`,
 duree:`<ul class="pts">
  <li><b>Infection ostéo-articulaire sur matériel</b> : au moins 6 semaines, habituellement 6–12 ; au-delà de 12 semaines, à argumenter. Prothèse conservée après lavage : 6 semaines, inutile de prolonger (SPILF 2009).</li>
  <li><b>Endocardite sur prothèse</b> : ≥ 6 semaines (ESC 2023).</li>
  <li><b>Verrou antibiotique</b> : 10–14 jours avec le traitement systémique ; hémocultures de contrôle 1 semaine après la fin si le cathéter est conservé (IDSA 2009).</li>
 </ul>`,
 refs:['spilf_ioa09','zimmerli98','rodriguez14','arrest18','esc_ei23','spilf_aepei25','idsa_vent17','idsa_crbsi09','idsa_cand16','souweine15','lebeaux16','rifam_rhum12','ansm_rifam24']
};
