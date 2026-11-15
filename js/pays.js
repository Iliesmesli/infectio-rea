/* RISQUE DE BMR / BHRe PAR PAYS — niveaux INDICATIFS (ordre de grandeur), pour l'analyse de risque à l'admission.
   Échelle : 1 faible · 2 modéré · 3 élevé · 4 très élevé · 0 = données insuffisantes.
   b  = entérobactéries BLSE / C3G-R (E. coli, K. pneumoniae)   c = EPC (entérobactéries productrices de carbapénémases), ct = enzymes dominantes
   a  = A. baumannii résistant aux carbapénèmes   m = SARM   v = E. faecium résistant aux glycopeptides (ERG)   k = C. auris (1 cas sporadiques, 2 épidémies, 3 transmission étendue/endémique)
   Seuils (souches invasives) : EPC/K. pneumoniae carba-R < 1 % / 1–10 / 10–25 / ≥ 25 % ; A. baumannii carba-R < 5 / 5–25 / 25–50 / ≥ 50 % ;
   SARM < 5 / 5–25 / 25–50 / ≥ 50 % ; ERG < 1 / 1–10 / 10–25 / ≥ 25 % ; C3G-R < 10 / 10–25 / 25–50 / ≥ 50 %.
   Sources : ECDC/OMS Europe (EARS-Net, CAESAR) données 2023–2024, OMS GLASS, CDC, Santé publique France (pays d'importation des EPC), littérature.
   Le HCSP (2019) ne publie volontairement PAS de liste de pays : toute hospitalisation ≥ 24 h à l'étranger dans l'année impose le dépistage, quel que soit le pays. */
(function(){
const R = { // profils régionaux par défaut
 NORD:{b:1,c:1,ct:'importés',a:1,m:1,v:1,k:1},
 OUEST:{b:2,c:1,ct:'OXA-48, importés',a:1,m:2,v:1,k:1},
 SUD:{b:3,c:3,ct:'KPC, VIM, OXA-48',a:4,m:3,v:2,k:2},
 EST:{b:4,c:3,ct:'OXA-48, NDM, KPC',a:4,m:2,v:3,k:1},
 BALK:{b:4,c:4,ct:'NDM, OXA-48, KPC',a:4,m:3,v:3,k:1},
 EXURSS:{b:4,c:4,ct:'OXA-48, NDM, KPC',a:4,m:2,v:2,k:1},
 MAGH:{b:4,c:4,ct:'OXA-48, NDM',a:4,m:2,v:1,k:1},
 MO:{b:4,c:4,ct:'OXA-48, NDM',a:4,m:3,v:2,k:2},
 GOLFE:{b:4,c:4,ct:'OXA-48, NDM',a:4,m:3,v:2,k:3},
 AFR:{b:4,c:3,ct:'NDM, OXA-48, OXA-181',a:3,m:3,v:2,k:1,lim:true},
 ASUD:{b:4,c:4,ct:'NDM, OXA-181, OXA-232',a:4,m:3,v:3,k:3},
 ASE:{b:4,c:4,ct:'NDM, OXA-48, KPC',a:4,m:3,v:2,k:2},
 AEST:{b:3,c:3,ct:'KPC, NDM',a:4,m:3,v:2,k:2},
 AMN:{b:2,c:3,ct:'KPC, NDM',a:3,m:3,v:4,k:3},
 AMLAT:{b:4,c:4,ct:'KPC, NDM',a:4,m:3,v:3,k:2},
 OCE:{b:2,c:1,ct:'IMP, importés',a:1,m:2,v:2,k:1},
 PAC:{b:3,c:2,ct:'NDM, importés',a:2,m:3,v:1,k:1,lim:true},
 FR:{b:2,c:2,ct:'OXA-48 (majoritaire), NDM',a:1,m:2,v:1,k:1}
};
// [id, nom, région, alias, surcharges]
const L = [
 ['fr','France métropolitaine','FR','france',{dom:1}],
 ['gp','Guadeloupe','FR','',{dom:1,b:3}], ['mq','Martinique','FR','',{dom:1,b:3}], ['gf','Guyane','FR','guyane francaise',{dom:1,b:3,n:'Proximité Brésil/Suriname : EPC KPC/NDM rapportées.'}],
 ['re','La Réunion','FR','reunion',{dom:1,b:3,n:'Évacuations sanitaires depuis Mayotte, Madagascar, Comores, Maurice.'}], ['yt','Mayotte','FR','',{dom:1,b:4,c:3,n:'Prévalence élevée de BLSE ; EPC rapportées ; flux depuis Comores/Madagascar.'}],
 ['pf','Polynésie française','FR','tahiti'], ['nc','Nouvelle-Calédonie','FR','caledonie'],
 // Europe
 ['be','Belgique','OUEST','belgium',{c:2}], ['nl','Pays-Bas','NORD','hollande netherlands'], ['lu','Luxembourg','OUEST',''], ['ch','Suisse','OUEST','switzerland',{m:1}],
 ['de','Allemagne','OUEST','germany',{a:2,v:3,k:2}], ['at','Autriche','OUEST','austria',{a:2,m:1,v:2}], ['gb','Royaume-Uni','OUEST','angleterre uk united kingdom ecosse pays de galles',{m:1,v:2,k:2}],
 ['ie','Irlande','OUEST','ireland',{v:4}], ['dk','Danemark','NORD','denmark',{v:2}], ['no','Norvège','NORD','norway'], ['se','Suède','NORD','sweden'], ['fi','Finlande','NORD','finland'], ['is','Islande','NORD','iceland'],
 ['es','Espagne','SUD','spain canaries baleares',{b:2,c:2,ct:'OXA-48, VIM, KPC',a:3,m:2,v:1,k:3,n:'C. auris : transmission régionale (Valence notamment).'}],
 ['pt','Portugal','SUD','',{b:3,c:3,ct:'KPC',a:2,m:3,v:2,k:1}],
 ['it','Italie','SUD','italy sicile sardaigne',{c:4,ct:'KPC, NDM, VIM',a:4,m:3,v:4,k:3,n:'C. auris endémique dans le nord (Ligurie, Piémont, Émilie-Romagne).'}],
 ['gr','Grèce','SUD','greece crete',{b:4,c:4,ct:'KPC, NDM, VIM, OXA-48',a:4,m:3,v:3,k:3,n:'Parmi les prévalences les plus élevées d\'Europe pour les BGN résistants aux carbapénèmes.'}],
 ['mt','Malte','SUD','malta',{b:2,c:2,a:2,v:2}], ['cy','Chypre','SUD','cyprus',{c:3,v:4,k:3}],
 ['ro','Roumanie','EST','romania',{c:4,ct:'OXA-48, NDM, KPC',m:3,v:4,k:2}], ['bg','Bulgarie','EST','bulgaria',{c:4,ct:'KPC, NDM, OXA-48',m:2,v:3}],
 ['hr','Croatie','EST','croatia',{b:3,ct:'OXA-48, NDM, KPC',v:3}], ['si','Slovénie','EST','slovenia',{b:2,c:1,a:2,m:2,v:1}], ['cz','Tchéquie','EST','republique tcheque czechia',{b:3,c:1,a:2,m:2,v:3}],
 ['sk','Slovaquie','EST','slovakia',{c:2,a:3,m:3,v:3}], ['hu','Hongrie','EST','hungary',{b:3,c:2,m:3,v:4}], ['pl','Pologne','EST','poland',{c:3,ct:'NDM, KPC, OXA-48',v:4}],
 ['lt','Lituanie','EST','lithuania',{b:3,c:2,v:4}], ['lv','Lettonie','EST','latvia',{b:3,c:2}], ['ee','Estonie','EST','estonia',{b:2,c:1,a:2,m:1,v:1}],
 ['rs','Serbie','BALK','serbia'], ['ba','Bosnie-Herzégovine','BALK','bosnie bosnia',{c:3}], ['me','Monténégro','BALK','montenegro'], ['mk','Macédoine du Nord','BALK','macedoine macedonia'],
 ['al','Albanie','BALK','albania',{c:3,v:2}], ['xk','Kosovo','BALK','',{c:3}],
 ['ua','Ukraine','EXURSS','',{m:3,v:3,n:'Patients blessés de guerre / évacués : portage très fréquent de BGN BHRe (NDM, OXA-48, A. baumannii OXA-23/72) — précautions BHRe d\'emblée (alertes ECDC 2022–2024).'}],
 ['md','Moldavie','EXURSS','moldova',{m:3,v:3}], ['by','Biélorussie','EXURSS','belarus bielorussie'], ['ru','Russie','EXURSS','russia federation de russie'],
 ['ge','Géorgie','EXURSS','georgia',{c:3}], ['am','Arménie','EXURSS','armenia',{c:3}], ['az','Azerbaïdjan','EXURSS','azerbaijan',{c:3}],
 ['kz','Kazakhstan','EXURSS','',{c:3}], ['uz','Ouzbékistan','EXURSS','uzbekistan',{c:3}], ['tj','Tadjikistan','EXURSS','',{c:3,lim:true}], ['kg','Kirghizistan','EXURSS','kyrgyzstan',{c:3,lim:true}], ['tm','Turkménistan','EXURSS','',{c:3,lim:true}],
 ['tr','Turquie','MO','turkey turkiye',{m:3,v:2,k:2,n:'1er pays d\'origine des EPC OXA-48 ; souvent cité dans les rapatriements sanitaires (chirurgie esthétique, dentaire).'}],
 // Maghreb, Proche et Moyen-Orient
 ['ma','Maroc','MAGH','morocco',{n:'1er pays cité dans les épisodes d\'EPC importés en France (OXA-48, NDM).'}], ['dz','Algérie','MAGH','algeria',{m:3}], ['tn','Tunisie','MAGH','tunisia',{v:2}],
 ['ly','Libye','MAGH','libya',{ct:'NDM, OXA-48',m:3,v:2,n:'Blessés de guerre : BHRe multiples fréquentes.'}], ['eg','Égypte','MO','egypt',{ct:'NDM, OXA-48',m:4,v:3}], ['mr','Mauritanie','AFR','mauritania'],
 ['lb','Liban','MO','lebanon',{k:3}], ['il','Israël','MO','israel',{b:3,c:3,ct:'KPC, OXA-48, NDM',v:3}], ['ps','Palestine (Gaza, Cisjordanie)','MO','palestine gaza cisjordanie',{m:4,lim:true,n:'Blessés de guerre : BHRe multiples très fréquentes.'}],
 ['jo','Jordanie','MO','jordan',{m:4}], ['sy','Syrie','MO','syria',{m:4,lim:true,n:'Blessés de guerre : BHRe multiples fréquentes.'}], ['iq','Irak','MO','iraq',{ct:'NDM, OXA-48',m:4,n:'Blessés de guerre : A. baumannii et EPC très fréquents.'}],
 ['ir','Iran','MO','iran',{v:3}], ['ye','Yémen','MO','yemen',{m:4,lim:true}],
 ['sa','Arabie saoudite','GOLFE','saudi arabia arabie',{k:3}], ['ae','Émirats arabes unis','GOLFE','eau emirats dubai abu dhabi uae',{k:3}], ['qa','Qatar','GOLFE','',{c:3,a:3}], ['kw','Koweït','GOLFE','kuwait'], ['om','Oman','GOLFE',''], ['bh','Bahreïn','GOLFE','bahrain',{c:3}],
 // Afrique subsaharienne
 ['za','Afrique du Sud','AFR','south africa',{c:4,ct:'OXA-48/OXA-181, NDM, KPC',a:4,m:2,k:3,lim:false,n:'C. auris endémique dans les hôpitaux.'}],
 ['sn','Sénégal','AFR','senegal'], ['ci','Côte d\'Ivoire','AFR','cote d ivoire ivory coast abidjan'], ['ml','Mali','AFR',''], ['bf','Burkina Faso','AFR',''], ['ne','Niger','AFR',''], ['td','Tchad','AFR','chad'],
 ['gn','Guinée','AFR','guinea conakry'], ['cm','Cameroun','AFR','cameroon'], ['ga','Gabon','AFR',''], ['cg','Congo','AFR','congo brazzaville'], ['cd','RD Congo','AFR','rdc republique democratique du congo kinshasa'],
 ['bj','Bénin','AFR','benin'], ['tg','Togo','AFR',''], ['gh','Ghana','AFR',''], ['ng','Nigeria','AFR','nigéria',{a:4}], ['cf','Centrafrique','AFR','republique centrafricaine'],
 ['mg','Madagascar','AFR',''], ['km','Comores','AFR','comoros'], ['mu','Maurice','AFR','ile maurice mauritius',{c:3}], ['sc','Seychelles','AFR',''], ['dj','Djibouti','AFR',''],
 ['et','Éthiopie','AFR','ethiopia'], ['ke','Kenya','AFR','',{k:3}], ['tz','Tanzanie','AFR','tanzania zanzibar'], ['ug','Ouganda','AFR','uganda'], ['rw','Rwanda','AFR',''], ['sd','Soudan','AFR','sudan'],
 ['ao','Angola','AFR',''], ['mz','Mozambique','AFR',''], ['zm','Zambie','AFR','zambia'], ['zw','Zimbabwe','AFR',''], ['cv','Cap-Vert','AFR','cap vert cape verde'],
 // Asie
 ['in','Inde','ASUD','india',{m:3,v:3,k:3,n:'Berceau de NDM-1 ; C. auris endémique ; portage d\'EPC fréquent même après simple voyage.'}], ['pk','Pakistan','ASUD','',{m:4}], ['bd','Bangladesh','ASUD',''], ['np','Népal','ASUD','nepal'], ['lk','Sri Lanka','ASUD','',{k:2}], ['af','Afghanistan','ASUD','',{lim:true}],
 ['cn','Chine','AEST','china',{b:4,c:4,ct:'KPC-2, NDM',v:2}], ['hk','Hong Kong','AEST','',{b:4,k:3}], ['tw','Taïwan','AEST','taiwan',{b:4,m:4,v:3}], ['jp','Japon','AEST','japan',{b:2,c:1,ct:'IMP',a:1,m:3,v:1,k:1}],
 ['kr','Corée du Sud','AEST','coree south korea',{m:4,v:3}], ['mn','Mongolie','AEST','mongolia',{b:4,lim:true}],
 ['vn','Vietnam','ASE','viet nam',{m:4}], ['th','Thaïlande','ASE','thailand',{m:2}], ['kh','Cambodge','ASE','cambodia',{c:3}], ['la','Laos','ASE','',{c:3,a:3,lim:true}], ['mm','Myanmar','ASE','birmanie burma'],
 ['my','Malaisie','ASE','malaysia',{c:3,m:2}], ['sg','Singapour','ASE','singapore',{b:3,c:3,m:2}], ['id','Indonésie','ASE','indonesia bali',{m:2,k:1}], ['ph','Philippines','ASE','',{m:4,k:1}],
 // Amériques
 ['us','États-Unis','AMN','usa etats unis united states amerique',{n:'ERG très fréquents ; KPC endémique dans plusieurs États, NDM en hausse ; C. auris en extension.'}], ['ca','Canada','AMN','',{c:2,a:1,m:2,v:2,k:2}],
 ['mx','Mexique','AMLAT','mexico',{c:3,ct:'NDM, KPC',m:2,v:2,k:3}], ['gt','Guatemala','AMLAT','',{c:3,lim:true}], ['cr','Costa Rica','AMLAT','',{c:3}], ['pa','Panama','AMLAT','',{c:3,k:3}],
 ['cu','Cuba','AMLAT','',{c:3,lim:true}], ['ht','Haïti','AMLAT','haiti',{c:3,lim:true}], ['do','République dominicaine','AMLAT','dominicaine santo domingo',{c:3,lim:true}],
 ['br','Brésil','AMLAT','brazil'], ['ar','Argentine','AMLAT','argentina'], ['co','Colombie','AMLAT','colombia',{ct:'KPC, VIM, NDM',k:3}], ['ve','Venezuela','AMLAT','',{k:3,lim:true}],
 ['pe','Pérou','AMLAT','peru',{c:3,m:4}], ['cl','Chili','AMLAT','chile',{c:3}], ['ec','Équateur','AMLAT','ecuador'], ['bo','Bolivie','AMLAT','bolivia',{c:3,lim:true}], ['py','Paraguay','AMLAT','',{c:3}], ['uy','Uruguay','AMLAT','',{b:3,c:3,a:3,m:2}],
 ['sr','Suriname','AMLAT','',{c:3,lim:true}],
 // Océanie
 ['au','Australie','OCE','australia',{v:4,n:'ERG (vanB et vanA) très fréquents chez E. faecium.'}], ['nz','Nouvelle-Zélande','OCE','new zealand',{v:1}],
 ['pg','Papouasie-Nouvelle-Guinée','PAC','papouasie papua'], ['fj','Fidji','PAC','fiji'], ['vu','Vanuatu','PAC','']
];
const LV = ['données insuffisantes','faible','modéré','élevé','très élevé'];
const N = s => (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();
const C = L.map(([id,name,reg,al,ov])=>{ const o=Object.assign({}, R[reg], ov||{}); o.id=id; o.name=name; o.reg=reg; o.keys=[N(name), ...N(al).split(' ').length? [N(al)] : []]; o.al=N(al); return o; });
function find(q){
 const n=N(q); if(n.length<3) return [];
 return C.filter(c=>{ const nm=N(c.name); return nm.startsWith(n) || nm.split(' ').some(w=>w.length>=3 && w.startsWith(n)) || (n.length>=4 && nm.includes(n)) || (c.al && c.al.split(' ').some(w=>w.length>=3 && (w.startsWith(n) || (n.length>=5 && w.includes(n))))); });
}
function overall(c){ return Math.max(c.c||0, c.a||0, c.v>=3?c.v:0, c.b>=4?3:0); }
window.PAYS = {list:C, find, LV, overall, byId:id=>C.find(c=>c.id===id)};
})();
