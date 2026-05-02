// Country reference data — single source of truth for stats.html and any
// future modules that need country-level facts.
//
// Schema: ISO3 -> [continent, area_km2, name, population_M, lat, lng]
//
// continent: 'EU' | 'AS' | 'AF' | 'NA' | 'SA' | 'OC'
// area_km2 : land area in square kilometres
// name     : display name (UTF-8, accented characters preserved)
// pop_M    : population in millions
// lat, lng : centroid latitude / longitude in degrees
//
// Adding longitude as a 6th field was a one-time migration done so that future
// trophies (antipodal pair, distance-based hidden curiosities, hemisphere
// rules) have what they need without a second pass through this table.

export const COUNTRIES = {
  ALB:['EU',28748,'Albania',2.8,41,20],AND:['EU',468,'Andorra',0.08,42.5,1.5],AUT:['EU',83879,'Austria',9,47.5,14.5],BLR:['EU',207600,'Belarus',9.4,53.7,27.5],BEL:['EU',30528,'Belgium',11.7,50.5,4.5],BIH:['EU',51209,'Bosnia & Herzegovina',3.2,44,18],BGR:['EU',110879,'Bulgaria',6.7,43,25],HRV:['EU',56594,'Croatia',3.9,45.1,15.2],CYP:['EU',9251,'Cyprus',1.2,35,33],CZE:['EU',78867,'Czechia',10.7,49.8,15.5],DNK:['EU',43094,'Denmark',5.9,56,10],EST:['EU',45227,'Estonia',1.3,59,26],FIN:['EU',338424,'Finland',5.5,64,26],FRA:['EU',551695,'France',68,46.6,2.2],DEU:['EU',357114,'Germany',83.4,51.2,10.5],GRC:['EU',131957,'Greece',10.4,39,22],HUN:['EU',93028,'Hungary',9.6,47,19.5],ISL:['EU',103000,'Iceland',0.39,64.9,-19],IRL:['EU',70273,'Ireland',5.1,53.1,-7.7],ITA:['EU',301336,'Italy',58.8,42.8,12.8],XKX:['EU',10887,'Kosovo',1.8,42.6,20.9],LVA:['EU',64559,'Latvia',1.9,57,24.6],LIE:['EU',160,'Liechtenstein',0.04,47.2,9.5],LTU:['EU',65300,'Lithuania',2.8,55.2,23.9],LUX:['EU',2586,'Luxembourg',0.65,49.6,6.1],MLT:['EU',316,'Malta',0.55,35.9,14.4],MDA:['EU',33846,'Moldova',2.6,47.4,28.4],MCO:['EU',2,'Monaco',0.04,43.7,7.4],MNE:['EU',13812,'Montenegro',0.62,42.7,19.4],NLD:['EU',41850,'Netherlands',17.6,52.1,5.3],MKD:['EU',25713,'North Macedonia',1.83,41.6,21.7],NOR:['EU',323802,'Norway',5.5,62,10],POL:['EU',312696,'Poland',38,52,19],PRT:['EU',92090,'Portugal',10.4,39.4,-8.2],ROU:['EU',238397,'Romania',19,45.9,24.9],RUS:['EU',17098246,'Russia',144,61.5,105],SMR:['EU',61,'San Marino',0.034,43.9,12.4],SRB:['EU',77474,'Serbia',6.7,44,21],SVK:['EU',49035,'Slovakia',5.4,48.7,19.7],SVN:['EU',20273,'Slovenia',2.1,46.1,14.8],ESP:['EU',505992,'Spain',48.6,40.4,-3.7],SWE:['EU',450295,'Sweden',10.6,62,15],CHE:['EU',41285,'Switzerland',8.8,46.8,8.2],UKR:['EU',603628,'Ukraine',38,49,32],GBR:['EU',242495,'United Kingdom',67.7,55.4,-3.4],VAT:['EU',0.49,'Vatican City',0.001,41.9,12.5],
  AFG:['AS',652230,'Afghanistan',42.2,33.9,67.7],ARM:['AS',29743,'Armenia',2.78,40.1,45],AZE:['AS',86600,'Azerbaijan',10.4,40.1,47.6],BHR:['AS',778,'Bahrain',1.5,26,50.5],BGD:['AS',147570,'Bangladesh',172,23.7,90.4],BTN:['AS',38394,'Bhutan',0.78,27.5,90.4],BRN:['AS',5765,'Brunei',0.45,4.5,114.7],KHM:['AS',181035,'Cambodia',16.8,12.6,104.9],CHN:['AS',9596961,'China',1411,35,103],GEO:['AS',69700,'Georgia',3.7,42.3,43.4],IND:['AS',3287263,'India',1428,20.6,78.96],IDN:['AS',1904569,'Indonesia',278,-0.8,113.9],IRN:['AS',1648195,'Iran',88.5,32.4,53.7],IRQ:['AS',438317,'Iraq',45.5,33.2,43.7],ISR:['AS',20770,'Israel',9.7,31,34.85],JPN:['AS',377975,'Japan',124.9,36.2,138.3],JOR:['AS',89342,'Jordan',11.3,30.6,36.2],KAZ:['AS',2724900,'Kazakhstan',19.6,48,67],KWT:['AS',17818,'Kuwait',4.3,29.3,47.5],KGZ:['AS',199951,'Kyrgyzstan',6.7,41.2,74.8],LAO:['AS',236800,'Laos',7.6,19.9,102.5],LBN:['AS',10452,'Lebanon',5.5,33.9,35.9],MYS:['AS',330803,'Malaysia',34.3,4.2,109.7],MDV:['AS',300,'Maldives',0.52,3.2,73.2],MNG:['AS',1564110,'Mongolia',3.4,46.9,103.8],MMR:['AS',676578,'Myanmar',54.4,21.9,95.96],NPL:['AS',147181,'Nepal',30.9,28.4,84.1],PRK:['AS',120538,'North Korea',26,40.3,127.5],OMN:['AS',309500,'Oman',4.6,21.5,55.9],PAK:['AS',881913,'Pakistan',240,30.4,69.3],PSE:['AS',6020,'Palestine',5.5,31.9,35.2],PHL:['AS',300000,'Philippines',117,12.9,121.8],QAT:['AS',11586,'Qatar',2.7,25.4,51.2],SAU:['AS',2149690,'Saudi Arabia',36.9,23.9,45.1],SGP:['AS',728,'Singapore',5.9,1.35,103.8],KOR:['AS',100210,'South Korea',51.7,35.9,127.8],LKA:['AS',65610,'Sri Lanka',21.9,7.9,80.8],SYR:['AS',185180,'Syria',23.2,34.8,38.9],TWN:['AS',36193,'Taiwan',23.4,23.7,121],TJK:['AS',143100,'Tajikistan',10.1,38.9,71.3],THA:['AS',513120,'Thailand',71.7,15.9,100.99],TLS:['AS',14874,'Timor-Leste',1.4,-8.9,125.7],TUR:['AS',783562,'Turkey',85,38.96,35.2],TKM:['AS',488100,'Turkmenistan',6.4,38.97,59.6],ARE:['AS',83600,'UAE',9.5,24,54],UZB:['AS',447400,'Uzbekistan',35.6,41.4,64.6],VNM:['AS',331212,'Vietnam',98.9,14.06,108.3],YEM:['AS',527968,'Yemen',33.7,15.6,48.5],
  DZA:['AF',2381741,'Algeria',45.6,28,2.6],AGO:['AF',1246700,'Angola',36.7,-11.2,17.9],BEN:['AF',114763,'Benin',13.7,9.3,2.3],BWA:['AF',581730,'Botswana',2.6,-22.3,24.7],BFA:['AF',272967,'Burkina Faso',23.3,12.2,-1.6],BDI:['AF',27834,'Burundi',13.2,-3.4,29.9],CPV:['AF',4033,'Cabo Verde',0.6,16,-24],CMR:['AF',475442,'Cameroon',28.6,7.4,12.4],CAF:['AF',622984,'Central African Republic',5.6,6.6,20.9],TCD:['AF',1284000,'Chad',18.3,15.5,18.7],COM:['AF',1862,'Comoros',0.85,-11.9,43.9],COG:['AF',342000,'Congo',6.1,-0.2,15.8],COD:['AF',2344858,'DR Congo',102,-4.04,21.8],CIV:['AF',322463,'Côte d’Ivoire',28.9,7.5,-5.5],DJI:['AF',23200,'Djibouti',1.1,11.8,42.6],EGY:['AF',1001450,'Egypt',112,26.8,30.8],GNQ:['AF',28051,'Equatorial Guinea',1.7,1.7,10.3],ERI:['AF',117600,'Eritrea',3.7,15.2,39.8],SWZ:['AF',17364,'Eswatini',1.2,-26.5,31.5],ETH:['AF',1104300,'Ethiopia',126.5,9.15,40.5],GAB:['AF',267668,'Gabon',2.4,-0.8,11.6],GMB:['AF',11295,'Gambia',2.8,13.4,-15.5],GHA:['AF',238533,'Ghana',34.1,7.95,-1.03],GIN:['AF',245857,'Guinea',13.5,9.95,-9.7],GNB:['AF',36125,'Guinea-Bissau',2.1,11.8,-15.2],KEN:['AF',580367,'Kenya',55.1,-0.02,37.9],LSO:['AF',30355,'Lesotho',2.3,-29.6,28.2],LBR:['AF',111369,'Liberia',5.4,6.4,-9.4],LBY:['AF',1759540,'Libya',6.9,26.3,17.2],MDG:['AF',587041,'Madagascar',30.3,-18.8,46.9],MWI:['AF',118484,'Malawi',20.9,-13.3,34.3],MLI:['AF',1240192,'Mali',23.3,17.6,-4.0],MRT:['AF',1030700,'Mauritania',4.9,21.0,-10.9],MUS:['AF',2040,'Mauritius',1.3,-20.3,57.6],MAR:['AF',446550,'Morocco',37.5,31.8,-7.1],MOZ:['AF',801590,'Mozambique',33.9,-18.7,35.5],NAM:['AF',825615,'Namibia',2.6,-22.96,18.5],NER:['AF',1267000,'Niger',27.2,17.6,8.1],NGA:['AF',923768,'Nigeria',223.8,9.08,8.7],RWA:['AF',26338,'Rwanda',13.8,-2.0,29.9],STP:['AF',964,'São Tomé & Príncipe',0.23,0.2,6.6],SEN:['AF',196722,'Senegal',17.8,14.5,-14.5],SYC:['AF',459,'Seychelles',0.1,-4.7,55.5],SLE:['AF',71740,'Sierra Leone',8.6,8.5,-11.8],SOM:['AF',637657,'Somalia',17.6,5.2,46.2],ZAF:['AF',1221037,'South Africa',60.4,-30.6,22.9],SSD:['AF',619745,'South Sudan',11.1,7.86,29.7],SDN:['AF',1861484,'Sudan',48.1,12.86,30.2],TZA:['AF',945087,'Tanzania',67.4,-6.4,34.9],TGO:['AF',56785,'Togo',9,8.6,0.8],TUN:['AF',163610,'Tunisia',12.5,33.9,9.5],UGA:['AF',241038,'Uganda',47.2,1.4,32.3],ZMB:['AF',752612,'Zambia',20.6,-13.1,27.8],ZWE:['AF',390757,'Zimbabwe',16.7,-19.0,29.2],
  ATG:['NA',442,'Antigua & Barbuda',0.094,17.06,-61.8],BHS:['NA',13943,'Bahamas',0.41,25.0,-77.4],BRB:['NA',430,'Barbados',0.28,13.2,-59.5],BLZ:['NA',22966,'Belize',0.41,17.2,-88.5],CAN:['NA',9984670,'Canada',40.1,56.1,-106.3],CRI:['NA',51100,'Costa Rica',5.2,9.7,-83.8],CUB:['NA',109884,'Cuba',11.2,21.5,-77.8],DMA:['NA',751,'Dominica',0.073,15.4,-61.4],DOM:['NA',48671,'Dominican Republic',11.3,18.7,-70.2],SLV:['NA',21041,'El Salvador',6.4,13.8,-88.9],GRD:['NA',344,'Grenada',0.12,12.1,-61.7],GTM:['NA',108889,'Guatemala',17.6,15.8,-90.2],HTI:['NA',27750,'Haiti',11.7,18.97,-72.3],HND:['NA',112492,'Honduras',10.6,15.2,-86.2],JAM:['NA',10991,'Jamaica',2.8,18.1,-77.3],MEX:['NA',1964375,'Mexico',128.5,23.6,-102.5],NIC:['NA',130373,'Nicaragua',7,12.86,-85.2],PAN:['NA',75417,'Panama',4.5,8.5,-80.8],KNA:['NA',261,'St. Kitts & Nevis',0.048,17.4,-62.8],LCA:['NA',616,'Saint Lucia',0.18,13.9,-60.97],VCT:['NA',389,'St. Vincent',0.1,12.98,-61.3],TTO:['NA',5130,'Trinidad & Tobago',1.5,10.7,-61.2],USA:['NA',9833517,'United States',335,37.1,-95.7],
  ARG:['SA',2780400,'Argentina',46,-38.4,-63.6],BOL:['SA',1098581,'Bolivia',12.4,-16.3,-63.6],BRA:['SA',8515767,'Brazil',216.4,-14.2,-51.9],CHL:['SA',756102,'Chile',19.6,-35.7,-71.5],COL:['SA',1141748,'Colombia',52.1,4.6,-74.3],ECU:['SA',283561,'Ecuador',18,-1.8,-78.2],GUY:['SA',214969,'Guyana',0.81,4.86,-58.9],PRY:['SA',406752,'Paraguay',6.8,-23.4,-58.4],PER:['SA',1285216,'Peru',34.4,-9.2,-75],SUR:['SA',163820,'Suriname',0.62,3.9,-56.0],URY:['SA',176215,'Uruguay',3.4,-32.5,-55.8],VEN:['SA',912050,'Venezuela',28.8,6.4,-66.6],
  AUS:['OC',7692024,'Australia',26.6,-25.3,133.8],FJI:['OC',18272,'Fiji',0.94,-17.7,178],KIR:['OC',811,'Kiribati',0.13,1.9,-157.4],MHL:['OC',181,'Marshall Islands',0.04,7.1,171.2],FSM:['OC',702,'Micronesia',0.11,7.4,150.6],NRU:['OC',21,'Nauru',0.013,-0.5,166.9],NZL:['OC',270467,'New Zealand',5.2,-40.9,174.9],PLW:['OC',459,'Palau',0.018,7.5,134.6],PNG:['OC',462840,'Papua New Guinea',10.3,-6.3,143.96],WSM:['OC',2842,'Samoa',0.22,-13.76,-172.1],SLB:['OC',28896,'Solomon Islands',0.74,-9.6,160.2],TON:['OC',747,'Tonga',0.11,-21.2,-175.2],TUV:['OC',26,'Tuvalu',0.012,-7.5,177.6],VUT:['OC',12189,'Vanuatu',0.33,-15.4,166.9]
};

export const TOTAL_LAND = Object.values(COUNTRIES).reduce((s,[,a]) => s+a, 0);
export const TOTAL_POP  = Object.values(COUNTRIES).reduce((s,c) => s+(c[3]||0), 0);
export const TOTAL_UN   = 195;

// Countries with no coastline. Kept for legacy stats and as a fact source.
export const LANDLOCKED = new Set([
  'AND','ARM','AUT','BLR','BTN','BOL','BWA','BFA','BDI','CAF','TCD','CZE','SWZ','ETH','HUN',
  'KAZ','XKX','KGZ','LAO','LSO','LIE','LUX','MWI','MLI','MDA','MNG','NPL','NER','MKD','PRY',
  'RWA','SMR','SRB','SVK','SSD','CHE','TJK','TKM','UGA','UZB','VAT','ZMB','ZWE','AZE'
]);

// Pure island nations — countries whose territory is one or more islands with
// no shared land borders (or whose identity is overwhelmingly island-based).
// Powers the Islander line. ~47 entries from Iceland in the Atlantic to the
// Pacific microstates. Inclusive: Hispaniola pair (HTI/DOM), Borneo/Brunei,
// and Timor-Leste are kept since they're functionally island nations.
export const ISLAND_NATIONS = new Set([
  // Atlantic / Mediterranean
  'ISL','IRL','GBR','MLT','CYP',
  // Asian + Indian-Ocean islands
  'JPN','PHL','IDN','LKA','MDV','TWN','BHR','SGP','BRN','TLS',
  // Oceania
  'NZL','AUS','PNG','FJI','KIR','TUV','PLW','MHL','FSM','NRU','TON','WSM','VUT','SLB',
  // Caribbean
  'BHS','CUB','JAM','HTI','DOM','GRD','BRB','TTO','LCA','VCT','ATG','KNA','DMA',
  // African islands
  'MDG','MUS','SYC','CPV','STP','COM',
]);

// Curated geographic groupings used by the legacy "geo" badges. The v2 plan
// will move these into Sets, but we keep them here for now so the existing
// badge wall keeps rendering during the staged refactor.
export const GEO_SETS = {
  equator:  ['BRA','COL','ECU','STP','GAB','COG','COD','UGA','KEN','SOM','IDN'],
  arctic:   ['NOR','RUS','CAN','USA','ISL','FIN','SWE'],
  himalaya: ['NPL','BTN','IND','CHN','PAK','AFG'],
  andes:    ['ARG','BOL','CHL','COL','ECU','PER','VEN'],
  sahara:   ['DZA','EGY','LBY','MLI','MRT','MAR','NER','SDN','TCD','TUN'],
};

export const GEO_LABEL = {
  equator: 'a country crossing the equator (Brazil, Colombia, Ecuador, Indonesia, Kenya, Uganda, etc.)',
  arctic:  'a country crossing the Arctic Circle (Norway, Russia, Canada, USA, Iceland, Finland, Sweden)',
  himalaya:'a Himalayan nation (Nepal, Bhutan, India, China, Pakistan, Afghanistan)',
  andes:   'an Andean nation (Argentina, Bolivia, Chile, Colombia, Ecuador, Peru, Venezuela)',
  sahara:  'a Saharan nation (Algeria, Egypt, Libya, Mali, Morocco, Niger, Sudan, Chad, Tunisia, Mauritania)',
};

// Demo visit list — used by the empty-state preview / share artwork. Kept here
// because it references country codes and naturally lives next to COUNTRIES.
export const DEMO_VISITS = ['FRA','ESP','PRT','ITA','GRC','MAR','TUN','EGY','TUR','GEO','JPN','THA','VNM','IDN','IND','LKA','MEX','USA','CAN','CRI','BRA','ARG','CHL','PER','ISL','NOR','GBR','CHE','DEU','NLD','BEL','HRV','CZE'];
