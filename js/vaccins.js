/* VACCINS UTILES EN RÉANIMATION (adulte) — Calendrier des vaccinations 2026 (ministère de la Santé), HCSP 2014 (immunodéprimés et aspléniques),
   RCP des anti-complément, recommandations HAS. Toujours vérifier le calendrier en vigueur et les antécédents vaccinaux (carnet, Mon espace santé). */
window.VAC = [
 {id:'v-asplenie', ico:'🩸', t:'Asplénie, splénectomie (dont post-traumatique), hyposplénie', open:true, html:`
<b>Vaccins</b> (Calendrier 2026 ; HCSP 2014) :
• <b>Pneumocoque</b> : 1 dose de <b>Prevenar20</b> ou <b>Capvaxive</b> ; si VPC13 + VPP23 antérieurs : 1 dose ≥ 5 ans après le VPP23. Pas de rappel établi.
• <b>Méningocoque ACWY conjugué</b> (Nimenrix, MenQuadfi ou Menveo, 1 dose) <b>+ méningocoque B</b> (Bexsero : 2 doses à ≥ 1 mois ; ou Trumenba) ; <b>rappel ACWY et B tous les 5 ans</b>.
• <b>Haemophilus influenzae b</b> : 1 dose (HCSP 2014).
• <b>Grippe</b> chaque année ; COVID-19 selon le calendrier.
<b>Quand ?</b> Splénectomie programmée : <b>≥ 2 semaines avant</b>. Splénectomie en urgence (traumatisme) : <b>≥ 2 semaines après</b> l'intervention — en pratique avant la sortie de réanimation/de l'hôpital si le patient risque d'être perdu de vue.
<b>Autres mesures</b> : antibioprophylaxie par pénicilline V (Oracilline 1 MUI × 2/j ; allergie : macrolide) au moins 2 ans après la splénectomie (HCSP 2014 ; durée discutée chez l'adulte) ; éducation (toute fièvre = urgence, amoxicilline-acide clavulanique de réserve), carte de splénectomisé ; précautions en voyage (paludisme, morsures).`},
 {id:'v-breche', ico:'🧠', t:'Traumatisme crânien avec brèche ostéoméningée, rhinorrhée/otorrhée de LCR, implant cochléaire', open:true, html:`
• <b>Pneumocoque : 1 dose de Prevenar20 ou Capvaxive</b> — la brèche ostéoméningée et l'implant cochléaire (ou candidat) font partie des situations à risque élevé du calendrier 2026. Vacciner dès que possible pendant l'hospitalisation, sans attendre la fermeture de la brèche.
• <b>Pas d'antibioprophylaxie</b> pour une fracture de la base du crâne, avec ou sans fuite de LCR (RFE SFAR/SPILF 2024 — voir l'onglet Antibioprophylaxie).
• Grippe annuelle conseillée (la grippe favorise les surinfections pneumococciques).
• Tétanos selon la plaie (voir ci-dessous).`},
 {id:'v-complement', ico:'🧬', t:'Traitements anti-complément (éculizumab, ravulizumab, zilucoplan… — myasthénie, NMOSD, HPN, SHU atypique) et déficits du complément', html:`
• Risque d'infection invasive à méningocoque très fortement augmenté (× 1 000 à 2 000) : <b>méningocoque ACWY conjugué + méningocoque B</b>, au moins 2 semaines avant la 1re dose ; <b>rappels ACWY et B tous les 5 ans</b> (Calendrier 2026).
• Traitement débuté en urgence (crise myasthénique, poussée de NMOSD) : <b>antibioprophylaxie</b> (selon le RCP : jusqu'à 2 semaines après la vaccination ; certains centres la poursuivent pendant tout le traitement) — avis infectiologue.
• La vaccination ne protège pas complètement : <b>toute fièvre = urgence</b> (hémocultures, C3G sans délai) ; carte patient.
• Pneumocoque (Prevenar20/Capvaxive) et Hib souvent associés (patients immunodéprimés par ailleurs).`},
 {id:'v-immunodep', ico:'🛡', t:'Immunodépression : corticoïdes, biothérapies, anti-CD20, chimiothérapie, greffe, VIH', html:`
<b>Vaccins recommandés</b> : pneumocoque (Prevenar20 ou Capvaxive, 1 dose) ; grippe annuelle (vaccin inactivé) ; COVID-19 chaque automne (délai depuis la dernière dose ou infection réductible à 3 mois) ; <b>zona : Shingrix 2 doses à M0 et M2 dès 18 ans</b> (intervalle réductible à 1 mois avant un traitement immunosuppresseur, schéma complété idéalement 14 j avant) ; hépatite B selon le risque ; dTcaP à jour.
<b>Vaccins vivants contre-indiqués</b> : ROR, varicelle, fièvre jaune, BCG, dengue, grippe nasale, rotavirus — notamment si corticoïdes > 10 mg/j d'équivalent prednisone depuis plus de 2 semaines, et pendant 3 mois après des bolus de corticoïdes ; vivants à faire ≥ 4 semaines (ROR) à 6 semaines (varicelle) avant le début du traitement.
<b>Moment</b> : vacciner <b>le plus tôt possible avant</b> l'immunosuppression (≥ 2 semaines pour les vaccins inertes) ; <b>anti-CD20</b> (rituximab, ocrélizumab, ofatumumab) : réponse vaccinale très diminuée jusqu'à ≈ 6 mois après la dernière perfusion — vacciner avant si possible (grippe et COVID quand même pendant le traitement).
<b>Neuroréanimation</b> : SEP sous anti-CD20, natalizumab, fingolimod (sérologie varicelle avant traitement) ; NMOSD, myasthénie (anti-complément : voir ci-dessus) ; corticothérapie prolongée (œdème, tumeurs cérébrales).`},
 {id:'v-tetanos', ico:'🩹', t:'Tétanos : plaies, polytraumatisme, brûlures', open:true, html:`
<table class="tbl"><tr><th>Plaie</th><th>Patient à jour*</th><th>Patient non à jour ou statut inconnu</th></tr>
<tr><td>Mineure, propre</td><td>Pas d'injection (préciser la date du prochain rappel)</td><td>1 dose de vaccin contenant la valence tétanique (dTP ou dTcaP)</td></tr>
<tr><td><b>Majeure</b> (étendue, pénétrante, avec corps étranger ou traitée tardivement) <b>ou souillure tellurique</b></td><td>Pas d'injection (préciser la date du prochain rappel)</td><td><b>Immunoglobulines tétaniques humaines 250 UI</b> dans un bras + <b>vaccin</b> dans l'autre bras ; compléter le schéma ensuite</td></tr></table>
* À jour = dernière dose contenant la valence tétanique depuis moins de 20 ans avant 65 ans, ou moins de 10 ans à partir de 65 ans (Calendrier 2026, tableau 4.9). Rappels de l'adulte à 25, 45 et 65 ans puis tous les 10 ans. En pratique en réanimation (polytraumatisé, statut inconnu) : considérer comme non à jour.`},
 {id:'v-rage', ico:'🐕', t:'Rage : morsure, griffure, léchage sur peau lésée, chauve-souris', html:`
• Lavage immédiat et prolongé de la plaie à l'eau et au savon (≥ 15 min), rinçage, antiseptique ; prophylaxie antitétanique et antibiotique selon la plaie.
• <b>Contacter le centre antirabique</b> (CHU de Bordeaux) sans délai : décision de vaccination ± immunoglobulines antirabiques selon l'animal, le pays et le type d'exposition ; la rage est une MSO.
• Contact avec une chauve-souris en France : toujours avis du centre antirabique.`},
 {id:'v-saison', ico:'🌬', t:'Grippe, COVID-19, VRS : patients à risque et soignants', html:`
• <b>Grippe</b> : chaque année dès 65 ans (Efluelda ou Fluad privilégiés) et pour les patients à risque (immunodépression, maladies chroniques, obésité morbide, grossesse…) ; soignants.
• <b>COVID-19</b> : chaque automne dès 65 ans, immunodéprimés, femmes enceintes, résidents d'EHPAD/USLD ; dose supplémentaire au printemps dès 80 ans ; délai minimal de 6 mois depuis la dernière dose ou infection (3 mois dès 80 ans et chez l'immunodéprimé).
• <b>VRS</b> : 1 dose dès 75 ans, et dès 65 ans en cas de pathologie respiratoire chronique (BPCO notamment) ou cardiaque (Abrysvo, Arexvy ou mResvia, sans préférence).
• Hospitalisation en réanimation : bon moment pour faire le point et proposer les vaccins manquants à distance de la phase aiguë (pas de contre-indication liée à la réanimation pour les vaccins inertes ; reporter si fièvre élevée ou instabilité).`},
 {id:'v-vhb', ico:'💧', t:'Hépatite B : insuffisance rénale, dialyse, exposition', html:`
• Insuffisant rénal chronique / dialysé : <b>Engerix B20 à 40 µg</b> par injection, 4 injections (M0, M1, M2, M6) ; anti-HBs annuel et rappel si < 10 UI/L.
• Accident d'exposition au sang chez un soignant non immunisé : immunoglobulines anti-HBs + vaccination (référent AES / médecine du travail).`},
 {id:'v-postexpo', ico:'⏱', t:'Prophylaxie post-exposition chez l\'immunodéprimé ou la femme enceinte', html:`
• <b>Rougeole</b> : contact non immun → vaccin ROR dans les 72 h (si non contre-indiqué) ; immunodéprimé ou femme enceinte non immune : immunoglobulines polyvalentes IV dans les 6 jours.
• <b>Varicelle</b> : immunodéprimé ou femme enceinte non immun → immunoglobulines spécifiques anti-VZV dès que possible (jusqu'à 10 jours) ; à défaut, aciclovir/valaciclovir préemptif — avis infectiologue.
• <b>Méningocoque</b> : antibioprophylaxie des contacts ± vaccination selon le sérogroupe (onglet Hygiène → MSO).
• Syndrome de Guillain-Barré survenu dans les 6 semaines suivant une vaccination : ne pas réadministrer ce vaccin sans avis spécialisé.`}
];
