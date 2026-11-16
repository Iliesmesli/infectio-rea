/* FACTEURS DE RISQUE DE GERMES À COUVRIR (affichés en touchant le nom du germe dans les textes, et listés dans Hygiène).
   FDR[clé] = {t, germ (id fiche), blocks:[{ctx, items:[…], s:'NAR'|refId}]} ; FDR_TERMS : terme du texte → clé. */
window.FDR = {
 sarm: {t:'Facteurs de risque de SARM', germ:'saureus', blocks:[
  {ctx:'Pneumopathie acquise en réanimation — protocole NAR (ajouter le linézolide si ≥ 1)', s:'NAR', items:['Colonisation récente à SARM','Dialyse chronique','Lésion cutanée chronique']},
  {ctx:'PAVM — FdR de BMR (SFAR/SRLF 2017)', s:'sfar_pavm17', items:['Antibiothérapie dans les 90 jours','Hospitalisation ≥ 5 jours','Colonisation connue','Écologie locale']}
 ]},
 pyo: {t:'Facteurs de risque de Pseudomonas aeruginosa', germ:'paeru', blocks:[
  {ctx:'Pneumopathie acquise en réanimation — protocole NAR (couvrir P. aeruginosa)', s:'NAR', items:['Pneumopathie tardive (> 5 j)','Antibiothérapie dans les 90 jours','Dialyse']},
  {ctx:'PAC (SPILF/SPLF 2025)', s:'spilf_pac25', items:['Dilatation des bronches','Mucoviscidose','Exacerbation de BPCO colonisée à P. aeruginosa']},
  {ctx:'PAVM — FdR de BMR (SFAR/SRLF 2017)', s:'sfar_pavm17', items:['Antibiothérapie dans les 90 jours','Hospitalisation ≥ 5 jours','Colonisation connue','Écologie locale']}
 ]},
 blse: {t:'Facteurs de risque d\'entérobactérie BLSE', germ:'ecoli', blocks:[
  {ctx:'Protocole NAR (pneumopathie) : carbapénème seulement si', s:'NAR', items:['Portage de BLSE connu <b>et</b> signes de gravité (choc, immunodépression)']},
  {ctx:'Infections urinaires (SPILF 2015, actualisation 2018)', s:'spilf_recos', items:['Antécédent de colonisation ou d\'IU à E-BLSE < 6 mois','Amoxicilline-acide clavulanique, C2G, C3G ou fluoroquinolone < 6 mois','Voyage récent en zone d\'endémie','Hospitalisation < 3 mois','Vie en long séjour'], note:'Le référentiel national d\'urologie (LiSA 2024) retient 3 mois pour la colonisation et les antibiotiques.'},
  {ctx:'Carbapénème probabiliste (HAS 2019 ; RFE SFAR IIA 2026)', s:'has_carba19', items:['Colonisation ou infection à BLSE documentée (< 3 mois HAS ; < 6 mois SFAR, R1.2.3) + gravité']}
 ]},
 bhre: {t:'Facteurs de risque de BHRe (EPC, ERG) — patients à dépister à l\'admission', germ:'', blocks:[
  {ctx:'HCSP 2019', s:'hcsp_bhre19', items:['Hospitalisation ≥ 24 h à l\'étranger dans les 12 derniers mois (dont rapatriement sanitaire) — y compris dialyse à l\'étranger','Séjour à l\'étranger < 3 mois sans hospitalisation : selon analyse de risque (durée, pays, antibiotiques, modalités du voyage)','Patient contact à risque élevé réhospitalisé','Porteur connu réhospitalisé'], note:'Isolement (précautions spécifiques BHRe) et écouvillonnage rectal dès l\'admission : voir Hygiène.'}
 ]},
 candida: {t:'Facteurs de risque de candidose invasive', germ:'calbicans', blocks:[
  {ctx:'Protocole NAR', s:'NAR', items:['Antibiothérapie préalable ; accès vasculaires ; ventilation invasive ; réanimation > 7 j ; nutrition parentérale exclusive','Colonisation fongique ; chirurgie abdominale récente ; insuffisance rénale ; hémodialyse','Score APACHE II > 20 ; hémopathie maligne, cancer solide, neutropénie ; corticothérapie prolongée, immunosuppresseurs, chimiothérapie'], note:'Candida score ≥ 2,5 (NPE exclusive 1, colonisation 1, sepsis sévère 2, chirurgie à l\'admission 1) ou Peritonitis score ≥ 3 → mannane/anti-mannane + β-D-glucane.'}
 ]}
};
window.FDR_TERMS = {'SARM':'sarm','anti-SARM':'sarm','P. aeruginosa':'pyo','Pseudomonas aeruginosa':'pyo','anti-Pseudomonas':'pyo','BLSE':'blse','E-BLSE':'blse','EBLSE':'blse','BHRe':'bhre','EPC':'bhre','ERG':'bhre','candidose':'candida','candidose invasive':'candida'};
