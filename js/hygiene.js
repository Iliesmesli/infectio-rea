/* HYGIÈNE : isolements, BMR/BHRe, maladies à signalement obligatoire (MSO, ex-MDO), signalement des IAS.
   Sources : SF2H 2017 (précautions standard), SF2H 2009 (précautions contact), SF2H 2024 (précautions respiratoires, remplace le guide air/gouttelettes 2013),
   HCSP 2019 (BHRe), protocole NAR 2025 (C. difficile), Santé publique France (liste des MSO, mise à jour 22/04/2026), ARS Nouvelle-Aquitaine. */
window.HYG = {
 niveaux: `<b>Précautions standard (PS)</b> — pour tout patient, tout soin (SF2H 2017) : hygiène des mains par friction hydro-alcoolique (FHA) ; gants seulement si contact avec liquide biologique, muqueuse ou peau lésée ; tablier/surblouse si projection ; masque + lunettes si risque de projection ou d'aérosolisation ; masque chirurgical pour tout patient qui tousse ; gestion des excreta ; bionettoyage.
<b>Précautions complémentaires Contact (PCC)</b> (SF2H 2009) : chambre individuelle (ou regroupement) ; tablier/surblouse à usage unique pour les soins directs ; matériel dédié ; FHA ; signalisation sur la porte, le dossier et le plan de soins.
<b>Précautions spécifiques BHRe</b> (HCSP 2019) : PCC + chambre individuelle, marche en avant ou personnel dédié selon l'organisation de l'EOH, dépistage des patients contacts, information à la sortie et au transfert.
<b>Précautions complémentaires Respiratoires</b> (SF2H octobre 2024 — remplacent les précautions « Air » et « Gouttelettes ») : 3 niveaux choisis selon le groupe du pathogène, la ventilation de la chambre et le type d'exposition (proximité, durée, procédure générant des aérosols — PGA) :
• <b>Simples</b> : masque à usage médical pour le soignant ; masque pour le patient quand il sort de sa chambre ; porte fermée, aération (≥ 6 volumes/h sans recyclage).
• <b>Renforcées</b> : <b>FFP2</b> (essai d'ajustement / fit-check) pour le soignant ; masque médical pour le patient quand quelqu'un entre ; ventilation ≥ 6 volumes/h, CO2 ≤ 800 ppm.
• <b>Maximales</b> : FFP2 avant d'entrer, chambre en dépression (sas pour les risques épidémiques et biologiques, REB) ; sinon transfert vers un établissement équipé.
<b>PGA en réanimation</b> (intubation, aspiration trachéale à système ouvert, fibroscopie bronchique, VNI, kinésithérapie respiratoire, trachéotomie, réanimation cardio-pulmonaire…) : passer au niveau supérieur pour les pathogènes du groupe A. L'oxygénothérapie à haut débit nasal et l'écouvillonnage nasopharyngé ne sont pas considérés comme des PGA à risque démontré (FAQ SF2H 2025).
Prescription médicale de la mise en place <b>et de la levée</b> ; signalisation sur la porte, le dossier et le plan de soins.`,
 // [micro-organisme / situation, précautions, levée / durée, remarques]
 table: [
  ['<b>Bactéries et levures multirésistantes</b>','','',''],
  ['SARM, entérobactéries BLSE, P. aeruginosa et A. baumannii multirésistants (non BHRe)','Contact','Pendant tout le séjour (politique locale)','E. coli BLSE : PS seules dans certains établissements (politique EOH). Portage digestif : pas de décolonisation.'],
  ['<b>BHRe</b> : EPC (OXA-48, KPC, NDM…), E. faecium résistant aux glycopeptides (ERG)','Spécifiques BHRe','Séjour entier ; patient « porteur » à vie dans le dossier','Dépistage hebdomadaire des contacts ; signalement e-SIN si cas groupés ; prévenir l\'EOH dès la suspicion (hospitalisation à l\'étranger : <a href="#pays">page pays</a>).'],
  ['A. baumannii résistant aux carbapénèmes (CRAB)','Contact renforcées (selon EOH)','Séjour entier','Réservoir environnemental (surfaces, respirateurs) : bionettoyage renforcé.'],
  ['<i>Candida auris</i>','Contact renforcées + chambre individuelle','Séjour entier','Dépistage des contacts (aisselles, aines) ; désinfectant actif (chlore) ; signalement e-SIN.'],
  ['<b>Clostridioides difficile</b>','Contact « Clostridium » : surblouse à manches longues + gants ; <b>lavage des mains au savon puis FHA</b> ; bionettoyage sporicide (eau de Javel)','<b>NAR : 72 h après la fin des symptômes</b>, sans nouveau prélèvement (SF2H : 48 h)','Spores résistantes aux SHA ; matériel dédié.'],
  ['<b>Infections respiratoires — groupe A (SF2H 2024)</b>','','',''],
  ['Grippe','Respiratoires simples (renforcées si PGA)','7 jours après le début des signes (plus long si immunodéprimé : selon l\'évolution/PCR)','Vaccination des soignants : n\'exempte pas des précautions.'],
  ['COVID-19','Respiratoires simples (renforcées si PGA ou ventilation non conforme)','≈ 7 jours après le début des signes si immunocompétent ; immunodéprimé : selon l\'EOH (PCR, Ct)',''],
  ['VRS, métapneumovirus, rhinovirus, adénovirus','Respiratoires simples + Contact (VRS, adénovirus)','Fin des symptômes',''],
  ['Coqueluche','Respiratoires simples','5 jours après le début d\'un macrolide (3 semaines sans traitement)','Cas groupés : signalement à l\'ARS (non MSO).'],
  ['<b>Méningocoque</b> (IIM)','Respiratoires simples','<b>24 h après le début d\'une antibiothérapie efficace</b>','MSO : signalement immédiat ; prophylaxie des contacts (voir MSO).'],
  ['Streptocoque A invasif (choc toxique, DHBN)','Respiratoires simples + Contact (plaie)','24 h d\'antibiothérapie efficace','Cas groupés : signalement.'],
  ['<i>Mycoplasma pneumoniae</i>, Hib, pneumocoque, oreillons, rubéole','Respiratoires simples','Selon l\'agent (Hib : 24 h d\'antibiothérapie)','Pneumocoque : précautions simples (SF2H 2024).'],
  ['<b>Infections respiratoires — groupe B</b>','','',''],
  ['<b>Tuberculose pulmonaire</b> (souche sensible) — suspicion ou confirmée','<b>Respiratoires renforcées (FFP2)</b> dès la suspicion clinique ou radiologique','≥ <b>14 jours</b> de traitement efficace si : observance et tolérance, souche sensible, amélioration clinique et toux en baisse, pas de caverne ni d\'aggravation, faible charge bacillaire initiale, pas de contact avec des immunodéprimés ; sinon jusqu\'à J30','Suspicion avec examens microscopiques négatifs : levée selon l\'algorithme SF2H. MSO + enquête autour du cas (CLAT).'],
  ['Rougeole','Respiratoires renforcées (FFP2) ; soignants immunisés','5 jours après le début de l\'éruption (immunodéprimé : toute la durée de la maladie)','MSO. Contacts non immuns : vaccin < 72 h ou immunoglobulines < 6 jours (immunodéprimé, grossesse).'],
  ['Varicelle ; zona disséminé ou zona de l\'immunodéprimé','Respiratoires renforcées + Contact','Jusqu\'à ce que toutes les lésions soient croûteuses','Zona localisé de l\'immunocompétent : Contact, lésions couvertes. Soignants immunisés.'],
  ['<b>Groupe C — risque épidémique et biologique (REB)</b>','','',''],
  ['Tuberculose MDR/XDR, MERS-CoV, SRAS, peste pulmonaire, pathogène émergent ou inconnu, fièvres hémorragiques virales','<b>Respiratoires maximales</b> (+ Contact) ; chambre en dépression avec sas','TB XDR : 3 cultures négatives à 3 jours d\'intervalle','Alerte immédiate (ARS, infectiologue référent REB) ; transfert vers un établissement de référence si chambre non adaptée.'],
  ['<b>Autres situations fréquentes en réanimation</b>','','',''],
  ['Gastro-entérite virale (norovirus), diarrhée infectieuse','Contact + lavage des mains au savon','48 h après la fin des symptômes',''],
  ['Gale (commune / profuse)','Contact (profuse : renforcées, traitement des contacts)','24 h après le traitement (profuse : après 2e traitement et contrôle)','Cas groupés : signalement.'],
  ['Herpès cutanéo-muqueux étendu, Mpox','Contact (+ respiratoires si Mpox, FFP2 lors des PGA)','Jusqu\'à cicatrisation / croûtes','Mpox : MSO (orthopoxviroses).'],
  ['Légionellose, listériose, pneumocoque, VIH, VHB, VHC, aspergillose, mucormycose, cryptococcose','<b>Précautions standard</b>','—','Pas de transmission interhumaine significative. Pneumocystose : éviter la proximité avec des patients immunodéprimés.'],
  ['Maladie de Creutzfeldt-Jakob (suspicion)','Précautions standard + <b>procédure ATNC</b> (prions) pour les dispositifs et la ponction lombaire','—','Instruments à usage unique ou traitement spécifique ATNC ; MSO dès la suspicion.'],
  ['<b>Isolement protecteur</b> : neutropénie profonde, greffe de CSH, aplasie','Chambre individuelle, air filtré (HEPA) si possible ; masque pour les intervenants en période épidémique','Fin de la neutropénie','Pas de plantes/fleurs ; prévention de l\'aspergillose (travaux).']
 ],
 // Liste officielle : 38 MSO (Santé publique France, page mise à jour le 22/04/2026). r = intérêt fréquent en réanimation ; u = catégorie 1 (intervention urgente)
 mso: [
  ['Botulisme',1,1,'Antitoxine via l\'ARS/établissement de référence ; prélèvements (sérum, selles, aliment) au CNR ; enquête alimentaire.'],
  ['Brucellose',1,0,''],['Charbon',1,0,''],
  ['Chikungunya',1,1,'Portail des signalements ; lutte antivectorielle (moustique tigre en Nouvelle-Aquitaine).'],
  ['Choléra',1,0,''],
  ['COVID-19',0,0,'Surveillance seule : télétransmission par les laboratoires (pas d\'action du clinicien).'],
  ['Dengue',1,1,'Portail des signalements ; lutte antivectorielle.'],
  ['Diphtérie',1,1,'Antitoxine (avis ARS/CNR) ; précautions respiratoires ; prophylaxie et vaccination des contacts.'],
  ['Encéphalite à tiques',1,1,'Encéphalite / méningo-encéphalite estivale : sérologie, PCR.'],
  ['Fièvres hémorragiques africaines',1,1,'Alerte REB immédiate.'],
  ['Fièvre jaune',1,0,''],['Fièvre typhoïde et paratyphoïdes',1,0,''],
  ['Hépatite aiguë A',1,0,'Vaccination de l\'entourage.'],
  ['Infection aiguë symptomatique par le virus de l\'hépatite B',0,0,'Surveillance seule.'],
  ['Infection par le VIH, quel que soit le stade',0,1,'Surveillance seule : télédéclaration e-DO.'],
  ['<b>Infection invasive à méningocoque</b>',1,1,'<b>Signalement immédiat par téléphone</b>. Prophylaxie des contacts proches (le plus tôt possible, jusqu\'à 10 j après le dernier contact, sans attendre l\'antibiogramme) : <b>1re intention rifampicine per os 600 mg × 2/j pendant 2 j</b> ; 2e intention (contre-indication ou résistance à la rifampicine, cas répétés dans une collectivité) : ciprofloxacine 500 mg per os ou ceftriaxone dose unique (DGS 2018, doctrine CORRUSS 2025) ; vaccination des contacts selon le sérogroupe (ARS). Soignants : seulement si bouche-à-bouche, intubation ou aspiration sans masque.'],
  ['<b>Légionellose</b>',1,1,'Antigène urinaire ; <b>prélèvement respiratoire en culture pour le CNR</b> (typage, enquête environnementale) ; cas nosocomial : aussi e-SIN.'],
  ['Leptospirose',1,1,'Forme ictéro-hémorragique (Weil) en réanimation : PCR sang/urines, sérologie.'],
  ['<b>Listériose</b>',1,1,'Souche au CNR ; questionnaire alimentaire.'],
  ['Mésothéliomes',0,0,'Non infectieux.'],
  ['Orthopoxviroses dont la variole (Mpox)',1,0,''],
  ['Paludisme autochtone',1,0,'En métropole, le paludisme d\'importation n\'est pas une MSO (sauf dans les DROM).'],
  ['Paludisme d\'importation dans les DROM',1,0,''],
  ['Peste',1,0,'REB.'],
  ['Poliomyélite',1,0,''],
  ['Rage',1,1,'Centre antirabique ; précautions pour les soignants exposés (salive, LCR).'],
  ['Rougeole',1,1,'Portail des signalements ; contacts : vaccin < 72 h ou immunoglobulines < 6 j.'],
  ['Rubéole',1,0,''],
  ['Saturnisme chez les enfants mineurs',1,0,'Non infectieux.'],
  ['Schistosomiase (bilharziose) urogénitale autochtone',1,0,''],
  ['<b>Suspicion de maladie de Creutzfeldt-Jakob</b> et autres ESST',1,1,'<b>Dès la suspicion</b> (protéine 14-3-3, RT-QuIC, IRM) ; procédure ATNC.'],
  ['Tétanos',0,1,'Surveillance seule.'],
  ['Toxi-infection alimentaire collective',1,0,'≥ 2 cas groupés.'],
  ['<b>Tuberculose</b> (et issue de traitement)',1,1,'Cerfa ou e-DO ; enquête autour du cas (CLAT) ; déclaration de l\'issue de traitement à 12 mois.'],
  ['Tularémie',1,0,''],['Typhus exanthématique',1,0,''],
  ['Infection à virus West Nile',1,1,'Méningo-encéphalite / paralysie flasque estivale : portail des signalements toute l\'année.'],
  ['Zika',1,0,'Portail des signalements.']
 ],
 msoHow: `<b>Qui ?</b> Tout médecin (et biologiste) qui pose le diagnostic. <b>Quand ?</b> <b>Sans délai</b>, dès la suspicion pour les maladies nécessitant une intervention urgente (catégorie 1) ; ne pas attendre la confirmation pour l'IIM ou la suspicion de MCJ.
<b>ARS Nouvelle-Aquitaine — point focal régional, 24 h/24, 7 j/7</b> : ☎ <a href="tel:0809400004"><b>0 809 400 004</b></a> (toute situation urgente : par téléphone) · ✉ <a href="mailto:ars33-alerte@ars.sante.fr">ars33-alerte@ars.sante.fr</a> · fax 05 67 76 70 12.
<b>Formulaires</b> : fiche Cerfa propre à chaque maladie (site de Santé publique France), à transmettre à l'ARS par voie sécurisée ; <b>portail des signalements</b> (<a href="https://signalement.social-sante.gouv.fr/" target="_blank" rel="noopener">signalement.social-sante.gouv.fr</a>) pour rougeole, chikungunya, dengue, Zika et West Nile (depuis le 22/04/2026) ; <b>e-DO</b> pour le VIH et la tuberculose.
Nouvelle appellation : « maladies à <b>signalement</b> obligatoire » (MSO) ; 38 maladies, dont 5 en surveillance seule (VIH, hépatite B aiguë, tétanos, mésothéliomes, COVID-19).`,
 ias: `<b>Infections associées aux soins (IAS) — à signaler via e-SIN</b> (en lien avec l'EOH), indépendamment des MSO : cas de BHRe (EPC, ERG) et de <i>C. auris</i> ; cas groupés (BMR, C. difficile, gale, grippe/COVID nosocomiaux, légionellose nosocomiale…) ; IAS inhabituelle par l'agent, la localisation ou la gravité ; décès lié à une IAS ; IAS liée à un dispositif médical (aussi matériovigilance).
<b>Cas groupés hors MSO</b> (coqueluche, gale, IRA en collectivité) : point focal de l'ARS.
<b>Accident d'exposition au sang</b> : lavage, antisepsie, médecine du travail / référent AES dans les heures qui suivent (évaluation du risque VIH, VHB, VHC ; traitement post-exposition idéalement < 4 h).`
};
