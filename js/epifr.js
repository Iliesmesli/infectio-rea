/* ÉPIDÉMIOLOGIE MICROBIENNE FRANÇAISE — uniquement des chiffres issus d'une source française identifiée.
   patho[id] : répartition des micro-organismes ; germ[id] : % de résistance (R = résistant, sauf mention).
   Chaque bloc : {t:titre/contexte, rows:[[libellé, valeur %, (n facultatif)]], note, ref}. */
window.EPIFR = {
 patho: {
  pavm: [
   {t:'Pneumopathies acquises en réanimation (liées ou non à l\'intubation) — 3 637 micro-organismes, 80 services, 2024', ref:'rearezo24',
    rows:[['P. aeruginosa','15,2'],['S. aureus','11,8'],['E. coli','7,9'],['K. pneumoniae','7,2'],['Enterobacter cloacae','6,4'],['S. maltophilia','4,8'],['Haemophilus','4,6'],['Serratia','4,4'],['Klebsiella aerogenes (ex-E. aerogenes)','2,8'],['Klebsiella oxytoca','2,3'],['E. faecalis','2,1'],['S. pneumoniae','1,3'],['A. baumannii','1,1'],['A. fumigatus','0,6']],
    fam:[['Entérobactéries','42,9'],['BGN non fermentants et apparentés','27,4'],['Cocci Gram +','18,8'],['Champignons','2,1']],
    note:'Examen non effectué : 5,4 % des épisodes. Pourcentages rapportés à l\'ensemble des micro-organismes isolés.'}
  ],
  bact_kt: [
   {t:'Bactériémies liées au cathéter (BLC) acquises en réanimation, 2024', ref:'rearezo24',
    rows:[['S. epidermidis','22'],['S. aureus','11'],['P. aeruginosa','7,6'],['Enterobacter cloacae','6,8'],['K. pneumoniae','5,9'],['C. albicans','5,9'],['C. parapsilosis','5,9'],['S. haemolyticus','5,1'],['Autres SCN identifiés','5,1'],['E. faecalis','5,1'],['E. faecium','3,4']],
    fam:[['Cocci Gram +','52,5'],['Entérobactéries','22,9'],['Champignons','13,6'],['BGN non fermentants','11,0']],
    note:'Effectifs faibles (quelques dizaines d\'épisodes par germe) : ordre de grandeur.'}
  ],
  choc: [
   {t:'Bactériémies acquises en réanimation, toutes portes d\'entrée — 1 159 micro-organismes, 2024', ref:'rearezo24',
    rows:[['S. epidermidis','12,6'],['P. aeruginosa','8,5'],['E. coli','7,6'],['K. pneumoniae','7,0'],['S. aureus','6,3'],['Enterobacter cloacae','5,9'],['E. faecalis','5,6'],['C. albicans','5,3'],['E. faecium','4,4'],['S. haemolyticus','4,0'],['Serratia','3,0'],['C. glabrata','1,8'],['S. maltophilia','1,5']],
    fam:[['Cocci Gram +','38,7'],['Entérobactéries','35,0'],['BGN non fermentants','12,3'],['Champignons','10,8'],['Anaérobies stricts','1,9']],
    note:'Concerne les bactériémies nosocomiales de réanimation, pas le sepsis communautaire. Aucune donnée nationale française de répartition pour le sepsis communautaire n\'a été identifiée.'}
  ],
  cand: [
   {t:'Candida isolés de bactériémies acquises en réanimation (n = 125), 2024', ref:'rearezo24',
    rows:[['C. albicans','49,6','62'],['C. glabrata (Nakaseomyces)','16,8','21'],['C. parapsilosis','12,8','16'],['C. tropicalis','7,2','9'],['C. krusei (Pichia)','4,0','5'],['Autres Candida','9,6','12']],
    note:'Pourcentages calculés à partir des effectifs publiés. Résistance au fluconazole par espèce : voir la fiche de chaque Candida.'}
  ],
  endoc: [
   {t:'Endocardites certaines (Duke-Li), population de 7 régions françaises, 2008 (n = 497)', ref:'selton12',
    rows:[['Staphylocoques (total)','36,2'],['S. aureus','26,6'],['Staphylocoques à coagulase négative','9,7']],
    note:'Le résumé publié ne détaille pas les autres germes. Dans la même enquête, 9,8 % des EI documentées étaient dues à des micro-organismes « inhabituels » (ni staphylocoque, ni streptocoque, ni entérocoque : anaérobies, levures, BGN).'},
   {t:'Micro-organismes inhabituels (même enquête, 471 EI documentées)', ref:'limonta20', rows:[['Hors staphylocoques, streptocoques et entérocoques','9,8']]}
  ],
  mening: [
   {t:'Méningites bactériennes communautaires de l\'adulte — cohorte prospective COMBAT (France)', ref:'combat22',
    rows:[['S. pneumoniae','48,2','131/272']], note:'Le résumé ne détaille pas les autres germes.'},
   {t:'Infections invasives à méningocoque, sérogroupes, France 2024', ref:'cnrmhi24',
    rows:[['B','43,7'],['W','29,1'],['Y','24,2'],['C','2,1']]},
   {t:'Pneumocoque : sensibilité aux β-lactamines chez l\'adulte, réseau des observatoires régionaux (ORP), 2021', ref:'orp21',
    rows:[['Sensibilité diminuée à la pénicilline (PSDP)','31,3'],['Amoxicilline I + R','14,5'],['Céfotaxime I + R','11,9']],
    note:'≈ 1 souche adulte sur 8 n\'est pas pleinement sensible au céfotaxime → dose méningée de C3G et CMI systématique.'}
  ],
  iu: [
   {t:'Entérobactéries urinaires en ville et en Ehpad (962 944 antibiogrammes), 2024', ref:'primo24',
    rows:[['E. coli (part des entérobactéries)','83,4'],['K. pneumoniae (part des entérobactéries)','11,5']],
    note:'Répartition parmi les entérobactéries seulement (entérocoques et autres germes non inclus).'},
   {t:'E. coli urinaires — résistances, 2024', ref:'primo24',
    rows:[['Domicile : C3G','4,3'],['Domicile : BLSE','3,7'],['Domicile : fluoroquinolones','10,8'],['Ehpad : C3G','8,9'],['Ehpad : BLSE','7,8'],['Ehpad : fluoroquinolones','14,2']]},
   {t:'K. pneumoniae urinaires — résistances, 2024', ref:'primo24',
    rows:[['Domicile : C3G','8,6'],['Domicile : BLSE','7,9'],['Domicile : fluoroquinolones','10,4'],['Ehpad : C3G','22,3'],['Ehpad : BLSE','20,0'],['Ehpad : fluoroquinolones','20,5']]}
  ],
  pac: [
   {t:'Pas de donnée nationale française de répartition des germes des PAC graves identifiée', rows:[], note:'Résistances utiles au choix probabiliste ci-dessous.'},
   {t:'S. pneumoniae invasifs (hémocultures, LCS), France 2024', ref:'ears24',
    rows:[['Pénicilline : non sauvage','36,6'],['Macrolides : R','28,6'],['Pénicilline non sauvage + macrolide R','24,7']]},
   {t:'S. pneumoniae adultes (ORP 2021)', ref:'orp21', rows:[['Amoxicilline I + R','14,5'],['Céfotaxime I + R','11,9']]},
   {t:'H. influenzae invasifs (CNR 2024)', ref:'cnrmhi24', rows:[['Amoxicilline R','26'],['Production de β-lactamase','20']]},
   {t:'PAC graves / inhalations documentées en réanimation — étude monocentrique (Toulon, 2018–2022, n = 104)', ref:'lostie26',
    rows:[['S. pneumoniae sensible à l\'amox-clav','81,5'],['S. pneumoniae sensible aux C3G','96,3'],['H. influenzae sensible à l\'amox-clav','78,0'],['H. influenzae sensible aux C3G','95,1'],['S. aureus sensible à l\'amox-clav et aux C3G','100']],
    note:'Ici les valeurs sont des % de SENSIBILITÉ. Monocentrique : à confirmer.'}
  ]
 },
 germ: {
  saureus: [
   {t:'Hémocultures, France 2024 (n = 12 060)', ref:'ears24', rows:[['Méticilline (SARM)','9,9']]},
   {t:'Tous prélèvements, établissements de santé, 2024', ref:'spares24', rows:[['Méticilline (SARM)','11,4']]},
   {t:'Infections acquises en réanimation, 2024 (n = 545)', ref:'rearezo24', rows:[['Oxacilline (SARM)','7,7'],['Glycopeptides','0,4']]}
  ],
  spneumo: [
   {t:'Infections invasives, France 2024 (n = 1 101)', ref:'ears24', rows:[['Pénicilline : non sauvage','36,6'],['Macrolides','28,6'],['Pénicilline non sauvage + macrolide R','24,7']]},
   {t:'Adultes, observatoires régionaux du pneumocoque, 2021', ref:'orp21', rows:[['PSDP','31,3'],['Amoxicilline I + R','14,5'],['Céfotaxime I + R','11,9']]}
  ],
  efaecalis: [
   {t:'Infections acquises en réanimation, 2024 (n = 170)', ref:'rearezo24', rows:[['Ampicilline','3,0'],['Glycopeptides (ERG)','1,2']]}
  ],
  efaecium: [
   {t:'Hémocultures, France 2024 (n = 2 056)', ref:'ears24', rows:[['Vancomycine','0,5']]},
   {t:'Infections acquises en réanimation, 2024 (n = 91)', ref:'rearezo24', rows:[['Ampicilline','72,5'],['Glycopeptides (ERG)','0']]}
  ],
  nmen: [
   {t:'Infections invasives, CNR 2024', ref:'cnrmhi24', rows:[['Pénicilline G R (EUCAST)','9,6'],['Céfotaxime','0'],['Rifampicine (EUCAST)','0,9'],['Ciprofloxacine','0,7']],
    note:'Avec les critères EMGM, 58,8 % des souches ont une sensibilité diminuée à la pénicilline G.'}
  ],
  hinf: [
   {t:'Souches invasives, CNR 2024', ref:'cnrmhi24', rows:[['Amoxicilline','26'],['β-lactamase produite','20'],['Ciprofloxacine','0,9']]},
   {t:'Souches non invasives adressées au CNR, 2024', ref:'cnrmhi24', rows:[['Amoxicilline','61'],['β-lactamase produite','28'],['Ciprofloxacine','14']], note:'Souches adressées au CNR : population sélectionnée, probablement plus résistante.'}
  ],
  ecoli: [
   {t:'Hémocultures, France 2024 (n ≈ 20 000)', ref:'ears24', rows:[['Amino-pénicillines','53,7'],['C3G','10,5'],['Carbapénèmes','0,2'],['Fluoroquinolones','13,8'],['Aminosides','7,0'],['C3G + FQ + aminosides','2,8']]},
   {t:'Urines, ville, 2024', ref:'primo24', rows:[['C3G','4,3'],['BLSE','3,7'],['Fluoroquinolones','10,8']]},
   {t:'Urines, Ehpad, 2024', ref:'primo24', rows:[['C3G','8,9'],['BLSE','7,8'],['Fluoroquinolones','14,2']]}
  ],
  kpneu: [
   {t:'Hémocultures, France 2024 (n ≈ 6 000)', ref:'ears24', rows:[['C3G','27,1'],['Carbapénèmes','1,2'],['Fluoroquinolones','22,6'],['Aminosides','15,6'],['C3G + FQ + aminosides','12,4']]},
   {t:'Urines, ville, 2024', ref:'primo24', rows:[['C3G','8,6'],['BLSE','7,9'],['Fluoroquinolones','10,4']]},
   {t:'Urines, Ehpad, 2024', ref:'primo24', rows:[['C3G','22,3'],['BLSE','20,0'],['Fluoroquinolones','20,5']]}
  ],
  paeru: [
   {t:'Hémocultures, France 2024 (n ≈ 3 700)', ref:'ears24', rows:[['Pipéracilline-tazobactam','15,4'],['Ceftazidime','11,9'],['Carbapénèmes','10,6'],['Fluoroquinolones','12,0'],['Aminosides','3,5'],['≥ 3 familles','6,3']]},
   {t:'Infections acquises en réanimation, 2024 (n = 814)', ref:'rearezo24', rows:[['Pipéracilline-tazobactam','30,8'],['Ceftazidime','23,7'],['Carbapénèmes','20,6'],['Ceftazidime + carbapénèmes','10,6'],['Colistine','1,4']],
    note:'En réanimation, la résistance est environ 2 fois plus fréquente que dans l\'ensemble des hémocultures.'}
  ],
  abaum: [
   {t:'Acinetobacter spp., hémocultures, France 2024 (n ≈ 1 200)', ref:'ears24', rows:[['Carbapénèmes','3,3'],['Fluoroquinolones','5,7'],['Aminosides','3,8'],['Carbapénèmes + FQ + aminosides','1,9']]},
   {t:'A. baumannii, infections acquises en réanimation, 2024 (n = 36)', ref:'rearezo24', rows:[['Ceftazidime','16,7'],['Carbapénèmes','14,3'],['Colistine','0']], note:'Effectif faible.'}
  ],
  steno: [
   {t:'Infections acquises en réanimation, 2024 (n = 183)', ref:'rearezo24', rows:[['Cotrimoxazole','5,5']]}
  ],
  _entero: [
   {t:'Toutes entérobactéries confondues, infections acquises en réanimation, 2024 (n = 1 947)', ref:'rearezo24', rows:[['Amoxicilline-acide clavulanique','62,8'],['C3G','25,3'],['BLSE','12,4'],['Carbapénèmes','2,3'],['Carbapénémase (EPC)','1,6']],
    note:'Chiffres globaux, toutes espèces confondues (résistances naturelles des groupes 3 incluses pour l\'amox-clav). Pas de donnée française par espèce identifiée pour cette entérobactérie.'}
  ],
  calbicans: [{t:'Isolats de réanimation, 2024 (n = 79)', ref:'rearezo24', rows:[['Fluconazole','0']]}],
  cglabrata: [{t:'Isolats de réanimation, 2024 (n = 25)', ref:'rearezo24', rows:[['Fluconazole','40,0']]}],
  cparapsilosis: [{t:'Isolats de réanimation, 2024 (n = 17)', ref:'rearezo24', rows:[['Fluconazole','11,8']]}],
  ckrusei: [{t:'Isolats de réanimation, 2024 (n = 11)', ref:'rearezo24', rows:[['Fluconazole','36,4']], note:'Résistance naturelle au fluconazole : toute souche doit être considérée comme résistante.'}]
 }
};
['ecloacae','kaerogenes','cfreundii','hafnia','serratia','morganella','pmirabilis'].forEach(k=>{ window.EPIFR.germ[k]=window.EPIFR.germ._entero; });
