/* TRAITEMENT HIÉRARCHISÉ PAR GERME ET PAR PHÉNOTYPE (adulte, réanimation)
   1 = 1re intention · 2 = alternative · A = allergie aux β-lactamines · R = dernier recours / sauvetage · X = à éviter
   Hiérarchie : recommandations françaises (SPILF/ePOPI, SFAR, HAS) > européennes (ESCMID, ESC, ECMM) > américaines (IDSA).
   Toujours adapter à l'antibiogramme, au site (diffusion) et à la fonction rénale (fiche molécule). */
window.HIER = {
 saureus: [
  {s:'SAMS (méti-S)', t:[
   ['1','<b>Protocole NAR</b> : souche sauvage (oxa-S, amox-S) → amoxicilline ; souche à pénicillinase (amox-R) → céfazoline (bolus 2 g puis 10–12 g/24 h) ou cloxacilline (10–12 g/24 h en continu).'],
   ['1','Recos : cloxacilline ou céfazoline (bactériémie, endocardite : efficacité équivalente, céfazoline mieux tolérée).'],
   ['1','SNC (méningite, abcès cérébral) : cloxacilline (céfazoline : diffusion insuffisante) — ou céfotaxime forte dose.'],
   ['2','Poumon : céfazoline ou amox-clav si polymicrobien ; os/matériel : + rifampicine après stérilisation des hémocultures.'],
   ['A','Allergie non grave : céfazoline. Allergie grave : daptomycine (bactériémie, endocardite) ou vancomycine ; linézolide (poumon, SNC).'],
   ['X','Vancomycine si β-lactamine possible (moins efficace sur SAMS).']]},
  {s:'SARM (méti-R)', t:[
   ['1','<b>Bactériémie, endocardite, cathéter — protocole NAR : daptomycine 10 mg/kg/j OU vancomycine (ex aequo)</b>, puis linézolide. Recos : daptomycine 6 mg/kg (RCP, ePOPI) à 8–12 mg/kg (SPILF/SFPT/CA-SFM 2025), 10 mg/kg en endocardite (ESC 2023) ; vancomycine ASC 400–600.'],
   ['1','<b>Pneumonie / PAVM (y compris bactériémiante) — NAR : linézolide > vancomycine</b> ; daptomycine non indiquée.'],
   ['1','<b>Méningo-ventriculite — NAR : linézolide 600 mg × 3/j ou vancomycine</b> (60 mg/kg/j, cible 30–40 mg/L).'],
   ['2','Teicoplanine (forte dose de charge) ; ceftaroline ; cotrimoxazole (os, relais) ; os/matériel : + rifampicine ou acide fusidique.'],
   ['R','Bactériémie persistante : daptomycine + ceftaroline (ou + fosfomycine) — avis infectiologue.']]}
 ],
 scn: [
  {s:'Méti-R (le plus fréquent)', t:[
   ['1','Vancomycine ; retrait du cathéter (souvent suffisant si non compliqué).'],
   ['2','Daptomycine (bactériémie, matériel), linézolide (SNC/DVE, poumon), teicoplanine.'],
   ['X','S. lugdunensis : traiter comme S. aureus.']]},
  {s:'Méti-S', t:[['1','Cloxacilline ou céfazoline.'],['A','Vancomycine, daptomycine.']]}
 ],
 spneumo: [
  {s:'Méningite', t:[
   ['1','Céfotaxime 300 mg/kg/j ou ceftriaxone 100 mg/kg/j (± dexaméthasone), puis adapter à la CMI : amoxicilline 200 mg/kg/j si CMI amox ≤ 0,5 mg/L.'],
   ['A','Allergie grave : avis infectiologue (méropénème si allergie non grave aux pénicillines ; vancomycine + rifampicine).']]},
  {s:'Pneumonie', t:[
   ['1','Amoxicilline 1–2 g q8h (forte dose si CMI ≥ 1) ; forme grave : céfotaxime ou ceftriaxone ± macrolide (ou lévofloxacine) en probabiliste.'],
   ['A','Lévofloxacine ; linézolide ; vancomycine.']]}
 ],
 strepA: [
  {s:'S. pyogenes, S. agalactiae, C/G', t:[
   ['1','Amoxicilline ou pénicilline G forte dose.'],
   ['1','Choc toxique, dermohypodermite nécrosante : + clindamycine 600–900 mg q8h (ou linézolide) pour l\'effet anti-toxinique ; immunoglobulines IV discutées.'],
   ['2','Céfotaxime, ceftriaxone (méningite à S. agalactiae, endocardite).'],
   ['A','Clindamycine (si S), vancomycine, linézolide.']]}
 ],
 strepOral: [
  {s:'Endocardite (péni-S)', t:[
   ['1','Pénicilline G ou amoxicilline, ou ceftriaxone 2 g/j (4 sem ; 2 sem + gentamicine si non compliquée — ESC 2023).'],
   ['2','CMI péni augmentée : amoxicilline forte dose ou ceftriaxone + gentamicine 2 sem.'],
   ['A','Vancomycine (± gentamicine).']]},
  {s:'Autres infections', t:[['1','Amoxicilline ou C3G.'],['A','Vancomycine, linézolide, lévofloxacine (selon site).']]}
 ],
 efaecalis: [
  {s:'Amoxicilline-S', t:[
   ['1','Amoxicilline forte dose (200 mg/kg/j si endocardite/méningite).'],
   ['1','Endocardite : amoxicilline + ceftriaxone 2 g q12h (double β-lactamine, sans néphrotoxicité) ≥ amoxicilline + gentamicine 2 sem (ESC 2023).'],
   ['A','Vancomycine (± gentamicine), daptomycine 10–12 mg/kg, linézolide.'],
   ['X','Céphalosporines seules (résistance naturelle), clindamycine, cotrimoxazole.']]}
 ],
 efaecium: [
  {s:'Amoxicilline-R, vancomycine-S', t:[['1','Vancomycine.'],['2','Daptomycine 10–12 mg/kg, linézolide, teicoplanine.']]},
  {s:'ERV / ERG (vancomycine-R)', t:[
   ['1','Linézolide (pneumonie, SNC, IIA, peau) ; daptomycine 10–12 mg/kg (bactériémie, endocardite ; ± ampicilline ou ceftaroline).'],
   ['2','Teicoplanine si phénotype vanB (téico-S) ; tigécycline (IIA, peau ; pas en bactériémie isolée).'],
   ['R','Tédizolide, oritavancine (avis spécialisé).']]}
 ],
 cuti: [
  {s:'Matériel (DVE, prothèse), méningite post-opératoire', t:[
   ['1','Pénicilline G, amoxicilline ou ceftriaxone ; retrait/changement du matériel.'],
   ['2','Vancomycine, linézolide (SNC) ; rifampicine en association pour le matériel ostéo-articulaire.'],
   ['X','Métronidazole (résistance naturelle).']]}
 ],
 listeria: [
  {s:'Méningo-encéphalite, bactériémie', t:[
   ['1','Amoxicilline 200 mg/kg/j + gentamicine 3–5 mg/kg/j les 3–5 premiers jours (21 j au total si neuroméningé).'],
   ['A','Cotrimoxazole forte dose (TMP 10–20 mg/kg/j).'],
   ['2','Méropénème (si allergie non grave), linézolide (données limitées).'],
   ['X','Céphalosporines (résistance naturelle).']]}
 ],
 nmen: [
  {s:'Méningite, purpura fulminans', t:[
   ['1','Céfotaxime 200 mg/kg/j ou ceftriaxone 75–100 mg/kg/j ; 5–7 j. Signalement immédiat à l\'ARS ; prophylaxie des contacts : rifampicine 600 mg × 2/j 2 j (onglet Hygiène → MSO).'],
   ['2','Amoxicilline si CMI basse (relais).'],
   ['A','Avis infectiologue : méropénème (allergie non grave), ciprofloxacine ou chloramphénicol (données anciennes).']]}
 ],
 hinf: [
  {s:'β-lactamase négative', t:[['1','Amoxicilline.'],['2','C3G (méningite, forme grave).'],['A','Lévofloxacine, cotrimoxazole.']]},
  {s:'β-lactamase positive / BLNAR', t:[['1','Céfotaxime ou ceftriaxone (forme grave, méningite) ; amox-clav (pneumonie non grave, si S).'],['A','Lévofloxacine.']]}
 ],
 legio: [
  {s:'Légionellose', t:[
   ['1','Forme grave (réanimation) : lévofloxacine 500 mg q12h (ou bithérapie FQ + macrolide IV dans les formes les plus graves), 14–21 j.'],
   ['2','Forme non grave : azithromycine (5 j) ; spiramycine IV.'],
   ['X','β-lactamines (inactives).']]}
 ],
 mycoplasma: [
  {s:'M. pneumoniae / Chlamydophila', t:[
   ['1','Macrolide (azithromycine 3–5 j ; spiramycine IV).'],
   ['2','Doxycycline ; lévofloxacine (souches résistantes aux macrolides, fréquentes en Asie).']]}
 ],
 ecoli: [
  {s:'Sauvage / pénicillinase', t:[
   ['1','Amoxicilline si S ; sinon céfotaxime ou ceftriaxone (forme grave, SNC).'],
   ['2','Amox-clav (hors forme grave), cotrimoxazole, FQ (relais oral), aminoside (IU, en association).']]},
  {s:'BLSE', t:[
   ['1','Forme grave, bactériémie, pneumonie, SNC : carbapénème — méropénème (ertapénème si non grave et albumine normale).'],
   ['2','Épargne des carbapénèmes (non grave, source contrôlée) : témocilline (IU), pip-tazo si CMI ≤ 8 (IU, biliaire), céfoxitine (IU, E. coli), aminoside (IU), FQ/cotrimoxazole si S (relais).'],
   ['X','Pip-tazo en bactériémie grave (MERINO).']]},
  {s:'EPC (carbapénémase)', t:[
   ['1','OXA-48 : ceftazidime-avibactam. KPC : ceftazidime-avibactam, méropénème-vaborbactam ou imipénème-relebactam.'],
   ['1','Métallo-β-lactamase (NDM, VIM, IMP) : ceftazidime-avibactam + aztréonam (ou aztréonam-avibactam) ; céfidérocol.'],
   ['2','Selon l\'antibiogramme : aminoside, colistine, tigécycline (IIA), fosfomycine IV — en association.'],
   ['R','Avis infectiologue systématique.']]}
 ],
 pmirabilis: [
  {s:'Sauvage', t:[['1','Amoxicilline si S ; C3G.'],['2','Amox-clav, cotrimoxazole, FQ.']]},
  {s:'BLSE / EPC', t:[['1','Comme E. coli (carbapénème ; EPC selon l\'enzyme).'],['X','Colistine, tigécycline, éravacycline, cyclines (résistance naturelle).']]}
 ],
 kpneu: [
  {s:'Sauvage (pénicillinase naturelle)', t:[['1','Céfotaxime ou ceftriaxone.'],['2','Amox-clav (non grave), FQ, cotrimoxazole.'],['X','Amoxicilline (résistance naturelle).']]},
  {s:'BLSE', t:[['1','Méropénème (forme grave) ; ertapénème si non grave.'],['2','Témocilline (IU), aminoside (IU), pip-tazo si CMI ≤ 8 et non grave.']]},
  {s:'EPC (carbapénémase)', t:[
   ['1','OXA-48 : ceftazidime-avibactam. KPC : ceftazidime-avibactam, méropénème-vaborbactam, imipénème-relebactam.'],
   ['1','NDM/VIM/IMP : ceftazidime-avibactam + aztréonam (ou aztréonam-avibactam), céfidérocol.'],
   ['2','Aminoside, colistine, tigécycline, fosfomycine IV en association selon l\'antibiogramme.'],
   ['R','Avis infectiologue ; précautions BHRe.']]}
 ],
 ecloacae: [
  {s:'Céphalosporinase basale (sauvage)', t:[
   ['1','Céfépime (NAR : bolus 2 g puis 6 g/24 h en continu).'],
   ['2','Protocole NAR : pipéracilline ou pipéracilline-tazobactam, « voire maintien d\'une C3G » (si déjà débutée et évolution favorable).'],
   ['2','Pip-tazo (infection non grave, source contrôlée), FQ, cotrimoxazole, aminoside (IU).'],
   ['X','Recos (IDSA 2024, CA-SFM) : éviter les C3G (sélection de mutants hyperproducteurs ; espèce fortement mutante) — le protocole NAR tolère leur maintien : à réserver aux infections contrôlées sans bactériémie.']]},
  {s:'Céphalosporinase hyperproduite', t:[
   ['1','Céfépime si S (CMI ≤ 1 mg/L), sinon carbapénème (méropénème ; ertapénème si non grave).'],
   ['2','Témocilline (IU), FQ/cotrimoxazole si S.']]},
  {s:'BLSE / EPC', t:[['1','BLSE : méropénème. EPC : selon l\'enzyme (voir E. coli).']]}
 ],
 kaerogenes: [
  {s:'Céphalosporinase basale', t:[['1','Céfépime.'],['2','Pip-tazo (non grave), FQ, cotrimoxazole.'],['X','C3G (espèce fortement mutante).']]},
  {s:'Céphalosporinase hyperproduite / BLSE', t:[['1','Céfépime si S ; sinon méropénème.'],['2','Témocilline (IU).']]}
 ],
 cfreundii: [
  {s:'Céphalosporinase basale', t:[['1','Céfépime.'],['2','Pip-tazo (non grave), FQ, cotrimoxazole.'],['X','C3G (espèce fortement mutante).']]},
  {s:'Céphalosporinase hyperproduite / BLSE', t:[['1','Céfépime si S ; sinon méropénème.'],['2','Témocilline (IU).']]}
 ],
 hafnia: [
  {s:'Céphalosporinase basale (faiblement mutant)', t:[['1','C3G possible (risque de mutant faible) ou céfépime.'],['2','FQ, cotrimoxazole.']]},
  {s:'Céphalosporinase hyperproduite / BLSE', t:[['1','Céfépime si S ; sinon méropénème.']]}
 ],
 serratia: [
  {s:'Céphalosporinase basale (faiblement mutant)', t:[['1','Céfotaxime/ceftriaxone ou céfépime.'],['2','FQ, cotrimoxazole, aminoside.'],['X','Colistine, cyclines (résistance naturelle).']]},
  {s:'Céphalosporinase hyperproduite / BLSE', t:[['1','Céfépime si S ; sinon méropénème.']]}
 ],
 morganella: [
  {s:'Céphalosporinase basale (faiblement mutant)', t:[['1','C3G ou céfépime.'],['2','FQ, cotrimoxazole.'],['X','Colistine, tigécycline, amox-clav, imipénème (CMI élevées) : préférer le méropénème.']]},
  {s:'Céphalosporinase hyperproduite / BLSE', t:[['1','Céfépime si S ; sinon méropénème.']]}
 ],
 paeru: [
  {s:'Sauvage', t:[
   ['1','Céfépime, ceftazidime ou pip-tazo en forte posologie et perfusion prolongée/continue.'],
   ['1','Choc septique : + amikacine 25–30 mg/kg pour 1 à 3 injections (bithérapie initiale), puis monothérapie.'],
   ['2','Méropénème/imipénème (épargne : réserver aux souches R aux autres β-lactamines) ; ciprofloxacine (relais, os).'],
   ['A','Aztréonam (+ amikacine), ciprofloxacine.']]},
  {s:'Résistant (céphalosporinase hyperproduite, efflux, OprD)', t:[
   ['1','Selon l\'antibiogramme : la β-lactamine S la plus « ancienne » (céfépime, ceftazidime, pip-tazo, méropénème).']]},
  {s:'DTR (difficile à traiter : R pip-tazo, céfépime, ceftazidime, carbapénèmes, FQ)', t:[
   ['1','Ceftolozane-tazobactam (forte posologie : 3 g q8h en pneumonie).'],
   ['2','Ceftazidime-avibactam ; imipénème-relebactam.'],
   ['R','Céfidérocol ; colistine (± aminoside) ; carbapénémase de type MBL : céfidérocol ou aztréonam (+ avibactam) selon l\'antibiogramme. Avis infectiologue.']]}
 ],
 abaum: [
  {s:'Sensible aux carbapénèmes', t:[
   ['1','Imipénème 1 g q6h (référence ePOPI) ; méningite : méropénème 2 g q8h en 3 h.'],
   ['1','Choc septique : + aminoside (si S).'],
   ['2','Selon l\'antibiogramme : ampicilline-sulbactam, aminoside (IU), cotrimoxazole, FQ (peu de données).']]},
  {s:'Résistant aux carbapénèmes (CRAB / ABRI) — groupe SPILF (ePOPI 2025)', t:[
   ['1','Infection grave ou à haut risque : <b>association d\'au moins 2 antibiotiques actifs in vitro, à base d\'ampicilline-sulbactam</b> (6 g + 3 g q8h en 4 h), associé à : colistine, tigécycline forte dose, ou méropénème (seulement si CMI < 8 mg/L, forte dose, perfusion prolongée).'],
   ['1','Infection non grave : monothérapie possible — <b>ampicilline-sulbactam</b> = référence.'],
   ['2','Non grave, si ampicilline-sulbactam impossible : colistine (DC 9 MU puis 4,5 MU q12h, STP) ou tigécycline forte dose (DC 200 mg puis 100 mg q12h).'],
   ['R','Céfidérocol : uniquement en l\'absence d\'alternative. Sulbactam-durlobactam : non disponible en France (IDSA 2024 : 1er choix avec un carbapénème).'],
   ['X','Associations colistine-carbapénème et colistine-rifampicine : non recommandées.']]}
 ],
 steno: [
  {s:'Stenotrophomonas maltophilia', t:[
   ['1','Cotrimoxazole forte dose (TMP 15 mg/kg/j).'],
   ['1','Infection grave : association de 2 molécules actives (cotrimoxazole + lévofloxacine, ou + céfidérocol) — IDSA 2024.'],
   ['2','Lévofloxacine ; céfidérocol ; aztréonam-avibactam (ou ceftazidime-avibactam + aztréonam).'],
   ['R','Tigécycline (pas de concentration critique ; sauvetage).'],
   ['X','Carbapénèmes (résistance naturelle : métallo-β-lactamase L1).']]}
 ],
 bfragilis: [
  {s:'Anaérobies stricts', t:[
   ['1','Métronidazole 500 mg q8h (en association si polymicrobien).'],
   ['1','Infection intra-abdominale polymicrobienne : pip-tazo ou amox-clav (communautaire) couvrent aussi les anaérobies.'],
   ['2','Carbapénème ; tigécycline/éravacycline (IIA).'],
   ['X','Clindamycine (résistance fréquente), C3G seules.']]}
 ],
 nocardia: [
  {s:'Forme grave, disséminée, cérébrale', t:[
   ['1','Cotrimoxazole forte dose (TMP 15 mg/kg/j) + imipénème (± amikacine) en induction 3–6 sem.'],
   ['2','Linézolide (actif sur quasi toutes les espèces ; toxicité au long cours).'],
   ['2','Relais par cotrimoxazole ≥ 6–12 mois (cérébral, immunodéprimé).']]},
  {s:'Forme localisée pulmonaire ou cutanée', t:[['1','Cotrimoxazole.'],['2','Linézolide, amox-clav, minocycline selon l\'antibiogramme (N. farcinica : souvent R aux C3G).']]}
 ],
 cdiff: [
  {s:'Infection à C. difficile', t:[
   ['1','<b>Protocole NAR : vancomycine per os 125 mg × 4/j 10 j</b> (jusqu\'à 2 g/j si très sévère).'],
   ['2','Fidaxomicine 200 mg × 2/j 10 j : NAR = si contre-indication à la vancomycine, échec ou rechute (coût). <i>Recos ESCMID/IDSA 2021 : fidaxomicine en 1re intention (moins de récidives).</i>'],
   ['1','Forme fulminante (choc, iléus, mégacôlon) : vancomycine per os/sonde 500 mg q6h (± lavements) + métronidazole IV 500 mg q8h ; avis chirurgical.'],
   ['R','Récidives multiples : transplantation de microbiote fécal.'],
   ['X','Métronidazole seul (NAR : formes peu sévères uniquement, pas en réanimation).']]}
 ],
 calbicans: [
  {s:'Candidémie / candidose invasive', t:[
   ['1','<b>Protocole NAR</b> : caspofungine en probabiliste puis caspofungine ou micafungine ; retrait des cathéters ; fond d\'œil, ETT, hémocultures répétées.'],
   ['1','<b>+ 5-fluorocytosine</b> si atteinte endocardique, oculaire ou méningée (NAR) ; échinocandines contre-indiquées si atteinte urinaire, oculaire ou méningée → fluconazole ou AmB liposomale.'],
   ['2','Recos (ECMM 2025, IDSA 2016) : relais fluconazole à J5–7 si souche S, patient stable, hémocultures négatives (non mentionné par le protocole NAR).'],
   ['A','Contre-indication aux échinocandines : amphotéricine B liposomale 3 mg/kg/j.']]}
 ],
 cglabrata: [
  {s:'C. (N.) glabrata', t:[
   ['1','Caspofungine ou micafungine (NAR, recos).'],
   ['2','AmB liposomale (± 5-FC si endocarde, œil, méninges) ; fluconazole 800 mg/j seulement si souche S (dose-dépendante) et en relais.'],
   ['X','Fluconazole standard en 1re intention (sensibilité diminuée fréquente).']]}
 ],
 cparapsilosis: [
  {s:'C. parapsilosis', t:[
   ['1','<b>Fluconazole</b> (NAR ; CMI des échinocandines élevées) — J1 800 mg puis 400 mg/j.'],
   ['2','Si échinocandine débutée et évolution favorable : poursuite possible (recos) ; AmB liposomale ; retrait du cathéter.']]}
 ],
 ckrusei: [
  {s:'C. (P.) krusei', t:[['1','Caspofungine ou micafungine (NAR).'],['2','Voriconazole (relais), AmB liposomale.'],['X','Fluconazole (résistance naturelle).']]}
 ],
 cauris: [
  {s:'C. (C.) auris', t:[
   ['1','Échinocandine (vérifier la CMI) ; précautions contact renforcées, EOH.'],
   ['2','AmB liposomale (± flucytosine) si échec ou résistance.'],
   ['X','Fluconazole (résistance quasi constante).']]}
 ],
 asp: [
  {s:'Aspergillose invasive', t:[
   ['1','<b>Protocole NAR : voriconazole IV</b> (J1 6 mg/kg × 2 puis 3 mg/kg × 2/j ; relais per os à J5 ; dosage résiduel) <b>ou amphotéricine B liposomale</b> 3 mg/kg/j.'],
   ['2','Recos (ECMM/ESCMID 2018, IDSA 2016) : isavuconazole équivalent au voriconazole (moins d\'interactions et de toxicité) ; voriconazole d\'entretien 4 mg/kg × 2/j (RCP) ; posaconazole.'],
   ['R','<b>Réfractaire à J7 (NAR) : caspofungine + voriconazole</b> ; avis spécialisé.'],
   ['X','Durée : NAR 15 j après apyrexie et résolution clinique — recos ≥ 6–12 semaines (écart à discuter).']]}
 ],
 mucor: [
  {s:'Mucormycose', t:[
   ['1','AmB liposomale 5–10 mg/kg/j + chirurgie de débridement précoce + correction du terrain.'],
   ['2','Isavuconazole ou posaconazole (intolérance, relais).'],
   ['X','Voriconazole, échinocandines, fluconazole (inactifs).']]}
 ],
 pcp: [
  {s:'Pneumocystose', t:[
   ['1','Cotrimoxazole (TMP 15–20 mg/kg/j) 21 j ; corticoïdes si VIH et PaO2 < 70 mmHg (discutés hors VIH).'],
   ['2','Pentamidine IV 4 mg/kg/j ; primaquine + clindamycine ; atovaquone (formes légères).']]}
 ],
 fusarium: [
  {s:'Fusariose', t:[['1','Voriconazole et/ou AmB liposomale (association fréquente en 1re intention selon l\'espèce).'],['2','Posaconazole, isavuconazole.'],['X','Échinocandines, fluconazole.']]}
 ],
 scedo: [
  {s:'Scedosporium / Lomentospora', t:[['1','Voriconazole (+ chirurgie).'],['2','L. prolificans : voriconazole + terbinafine ; olorofim (accès compassionnel).'],['X','AmB (souvent résistant), échinocandines, fluconazole.']]}
 ],
 crypto: [
  {s:'Cryptococcose neuroméningée', t:[
   ['1','Induction : AmB liposomale 3–4 mg/kg/j + flucytosine 100 mg/kg/j 2 sem ; ponctions lombaires évacuatrices si hypertension intracrânienne.'],
   ['2','Consolidation fluconazole 400–800 mg/j 8 sem, puis entretien 200 mg/j. OMS (VIH) : AmB-L 10 mg/kg dose unique + flucytosine + fluconazole 14 j.'],
   ['X','Échinocandines (inactives).']]}
 ],
 hsv: [
  {s:'Encéphalite herpétique', t:[['1','Aciclovir 10 mg/kg q8h 14–21 j (adapter à la fonction rénale ; hydratation).'],['R','Souche résistante (immunodéprimé) : foscarnet.']]}
 ],
 vzv: [
  {s:'VZV (encéphalite, forme disséminée, immunodéprimé)', t:[['1','Aciclovir 10–15 mg/kg q8h.'],['2','Relais valaciclovir.'],['R','Résistance : foscarnet.']]}
 ],
 cmv: [
  {s:'Infection / maladie à CMV', t:[
   ['1','Ganciclovir 5 mg/kg q12h (induction), relais valganciclovir.'],
   ['2','Foscarnet (cytopénie, résistance UL97).'],
   ['R','CMV réfractaire ou résistant (greffe) : maribavir ; cidofovir. Avis spécialisé.']]}
 ],
 flu: [
  {s:'Grippe grave / hospitalisée', t:[['1','Oséltamivir 75 mg q12h 5 j (prolonger si immunodéprimé ou ventilé), le plus tôt possible.'],['2','Zanamivir IV (résistance, voie digestive impossible) si disponible.']]}
 ],
 covid: [
  {s:'COVID-19 sévère (oxygène)', t:[
   ['1','Dexaméthasone 6 mg/j 10 j ; anticoagulation préventive.'],
   ['2','Tocilizumab ou baricitinib si aggravation inflammatoire ; remdesivir (immunodéprimé, début de maladie).'],
   ['1','Immunodéprimé, forme non grave : nirmatrelvir/ritonavir (interactions !) ou remdesivir précoce.']]}
 ],
 rsv: [
  {s:'VRS', t:[['1','Traitement symptomatique.'],['2','Immunodéprimé (greffe) : ribavirine discutée — avis spécialisé. Prévention : vaccin (≥ 60 ans), nirsévimab (nourrissons).']]}
 ]
};
