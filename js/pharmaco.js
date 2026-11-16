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
