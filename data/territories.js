// Territories — the dependent-territory layer that complements data/countries.js.
//
// Schema: ISO3 -> [continent, area_km2, name, population_M, lat, lng, parentISO]
//
// continent : 'EU' | 'AS' | 'AF' | 'NA' | 'SA' | 'OC'
//             — the GEOGRAPHIC continent the territory sits in, NOT the
//             parent sovereign's continent. French Guiana is 'SA' even
//             though France is 'EU'. Réunion is 'AF' even though France
//             is 'EU'. This is the whole point of the territories layer:
//             a visit to Cayenne credits "South America" without crediting
//             "France".
// area_km2  : land area in square kilometres
// name      : display name (UTF-8, accented characters preserved)
// pop_M     : population in millions
// lat, lng  : centroid latitude / longitude in degrees
// parentISO : the ISO3 of the parent sovereign in COUNTRIES. Visiting the
//             territory does NOT credit the parent — but the territory's
//             governance lineage is recorded here so the UI can group
//             French overseas, British overseas, etc. coherently.
//
// Inclusion rule: ISO 3166-1 codes for inhabited dependent territories
// where there is a meaningful permanent population (≥ 1000 residents) or
// where the territory is a recognised travel destination. We exclude:
//   • Uninhabited or near-uninhabited (BVT, HMD, SGS, ATF, UMI)
//   • Antarctica (ATA — not a sovereign or dependent territory)
//   • British Indian Ocean Territory (IOT — military-only, no civilians)
//   • South Sudan-style dependencies that were resolved before the audit
//
// Note on ESH: Western Sahara is administered de facto mostly by Morocco
// but is not internationally recognised as Moroccan territory. We list
// it as a territory with parent = MAR for the practical "where do my
// visits to El Aaiún get filed" question, but the parent field should be
// understood as "current de facto administrator" not "sovereign claim".

export const TERRITORIES = {
  // === French overseas (parent: FRA) =================================
  // The five DROM (Départements et Régions d'Outre-Mer) + the COM and
  // Sui generis collectivities. Treated for travel purposes as separate
  // visitable places even though they are constitutionally part of the
  // French Republic.
  GLP:['NA',1628,    'Guadeloupe',                 0.395, 16.27,  -61.55,'FRA'],
  MTQ:['NA',1128,    'Martinique',                 0.36,  14.65,  -61.0, 'FRA'],
  GUF:['SA',83534,   'French Guiana',              0.302,  4.0,   -53.0, 'FRA'],
  REU:['AF',2511,    'Réunion',                    0.873,-21.1,    55.5, 'FRA'],
  MYT:['AF',374,     'Mayotte',                    0.31, -12.83,   45.17,'FRA'],
  NCL:['OC',18575,   'New Caledonia',              0.27, -21.5,   165.5, 'FRA'],
  PYF:['OC',4167,    'French Polynesia',           0.30, -17.5,  -149.5, 'FRA'],
  WLF:['OC',142,     'Wallis & Futuna',            0.011,-13.3,  -176.2, 'FRA'],
  SPM:['NA',242,     'Saint-Pierre & Miquelon',    0.005, 46.83,  -56.33,'FRA'],
  BLM:['NA',25,      'Saint-Barthélemy',           0.011, 17.9,   -62.83,'FRA'],
  MAF:['NA',53,      'Saint-Martin (FR)',          0.039, 18.08,  -63.05,'FRA'],

  // === British Overseas Territories + Crown Dependencies (parent: GBR)
  // Crown Dependencies (IMN/JEY/GGY) are not technically Overseas
  // Territories — they're self-governing dependencies of the Crown — but
  // for the user-facing distinction "did I visit the UK or just one of
  // these places?" they behave the same way.
  AIA:['NA',91,      'Anguilla',                   0.016, 18.22,  -63.07,'GBR'],
  BMU:['NA',54,      'Bermuda',                    0.064, 32.32,  -64.78,'GBR'],
  VGB:['NA',151,     'British Virgin Islands',     0.031, 18.42,  -64.62,'GBR'],
  CYM:['NA',264,     'Cayman Islands',             0.069, 19.32,  -81.25,'GBR'],
  FLK:['SA',12173,   'Falkland Islands',           0.004,-51.75,  -59.0, 'GBR'],
  GIB:['EU',6.5,     'Gibraltar',                  0.034, 36.13,   -5.35,'GBR'],
  MSR:['NA',102,     'Montserrat',                 0.005, 16.75,  -62.2, 'GBR'],
  PCN:['OC',47,      'Pitcairn',                   0.00005,-25.07,-130.1,'GBR'],
  SHN:['AF',394,     'St Helena, Ascension & Tristan',0.005,-15.97,-5.7, 'GBR'],
  TCA:['NA',948,     'Turks & Caicos',             0.046, 21.75,  -71.58,'GBR'],
  IMN:['EU',572,     'Isle of Man',                0.085, 54.25,   -4.5, 'GBR'],
  JEY:['EU',116,     'Jersey',                     0.103, 49.21,   -2.13,'GBR'],
  GGY:['EU',78,      'Guernsey',                   0.063, 49.45,   -2.58,'GBR'],

  // === Dutch Caribbean (parent: NLD) ==================================
  // Three constituent countries of the Kingdom of the Netherlands
  // (ABW, CUW, SXM) plus the BES (Caribbean Netherlands) special
  // municipalities. All four are visitable and culturally distinct from
  // the European Netherlands.
  ABW:['NA',180,     'Aruba',                      0.108, 12.52,  -69.97,'NLD'],
  CUW:['NA',444,     'Curaçao',                    0.156, 12.17,  -68.99,'NLD'],
  SXM:['NA',34,      'Sint Maarten (NL)',          0.044, 18.05,  -63.05,'NLD'],
  BES:['NA',322,     'Bonaire, St Eustatius & Saba',0.027,12.18,  -68.25,'NLD'],

  // === US territories (parent: USA) ===================================
  // The five inhabited unincorporated territories. UMI (US Minor
  // Outlying Islands) is excluded — it's largely uninhabited atolls and
  // a couple of military installations.
  PRI:['NA',9104,    'Puerto Rico',                3.2,   18.22,  -66.59,'USA'],
  GUM:['OC',549,     'Guam',                       0.171, 13.44,  144.79,'USA'],
  ASM:['OC',199,     'American Samoa',             0.045,-14.27, -170.71,'USA'],
  MNP:['OC',464,     'Northern Mariana Islands',   0.047, 17.33,  145.38,'USA'],
  VIR:['NA',347,     'US Virgin Islands',          0.087, 18.34,  -64.93,'USA'],

  // === Danish Realm (parent: DNK) =====================================
  // Greenland and the Faroes are autonomous countries of the Danish
  // Realm. Greenland's population is small but its area is enormous —
  // it dominates any "polar visit" question.
  GRL:['NA',2166086, 'Greenland',                  0.057, 71.7,   -42.6, 'DNK'],
  FRO:['EU',1393,    'Faroe Islands',              0.054, 62.0,    -6.79,'DNK'],

  // === Norwegian (parent: NOR) ========================================
  // Svalbard sits at 78°N — extreme polar territory. Combined with Jan
  // Mayen under one ISO code per ISO 3166-1.
  SJM:['EU',62422,   'Svalbard & Jan Mayen',       0.003, 78.0,    16.0, 'NOR'],

  // === Australian external (parent: AUS) ==============================
  // CCK and CXR sit in the Indian Ocean closer to Indonesia/Java than
  // to mainland Australia, so they get continent code 'AS' (geographic
  // Asia / Indian Ocean rim). NFK is in the Tasman Sea between AUS and
  // NZL — coded 'OC' since it's part of Polynesia/Melanesia adjacent.
  CCK:['AS',14,      'Cocos (Keeling) Islands',    0.0006,-12.17,  96.83,'AUS'],
  CXR:['AS',135,     'Christmas Island',           0.002, -10.5,  105.67,'AUS'],
  NFK:['OC',36,      'Norfolk Island',             0.002, -29.03, 167.95,'AUS'],

  // === New Zealand realm (parent: NZL) ================================
  // Cook Islands and Niue are in free association with NZ (self-
  // governing) but have no UN seat. Tokelau is a non-self-governing
  // territory administered by NZ.
  COK:['OC',236,     'Cook Islands',               0.018,-21.23, -159.78,'NZL'],
  NIU:['OC',261,     'Niue',                       0.002,-19.05, -169.87,'NZL'],
  TKL:['OC',12,      'Tokelau',                    0.0017,-9.17, -171.83,'NZL'],

  // === Chinese Special Administrative Regions (parent: CHN) ==========
  HKG:['AS',1106,    'Hong Kong',                  7.4,   22.3,   114.17,'CHN'],
  MAC:['AS',33,      'Macau',                      0.68,  22.17,  113.55,'CHN'],

  // === Finnish autonomous (parent: FIN) ===============================
  ALA:['EU',1580,    'Åland Islands',              0.030, 60.13,   19.95,'FIN'],

  // === Disputed / de facto =============================================
  // Western Sahara — most of the territory is administered by Morocco;
  // the SADR claims sovereignty over the same territory. We file ESH
  // here with parent = MAR to answer the practical "where does my
  // El Aaiún visit go", not as a political endorsement of MAR's claim.
  ESH:['AF',266000,  'Western Sahara',             0.567, 24.5,   -13.0, 'MAR'],
};

// Quick totals — useful for the new stat card and for verification.
export const TOTAL_TERRITORIES = Object.keys(TERRITORIES).length;
export const TOTAL_TERRITORY_AREA = Object.values(TERRITORIES).reduce((s,[,a]) => s+a, 0);
export const TOTAL_TERRITORY_POP  = Object.values(TERRITORIES).reduce((s,t) => s+(t[3]||0), 0);

// Parent → list of territories. Useful for grouping in UI ("French
// overseas: 11 places · 3/11 visited").
export const TERRITORIES_BY_PARENT = (() => {
  const m = {};
  for (const [iso, t] of Object.entries(TERRITORIES)) {
    const p = t[6];
    (m[p] ||= []).push(iso);
  }
  return m;
})();
