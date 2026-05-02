// Badge definitions — the legacy flat list of 47 threshold-based achievements.
//
// This file will be partially deprecated as the v2 redesign rolls out:
//   • Threshold badges (count, land, pop, coast, climate, hemi, cont) collapse
//     into the 7 tiered "lines" defined in data/lines.js (when that lands).
//   • Geo badges (equator/arctic/himalaya/andes/sahara) become Sets.
//   • The hemisphere/easy-continent freebies disappear entirely.
//
// For now the wall still renders from this list — the staged refactor lets us
// replace sections incrementally without breaking what works.
//
// Schema:
//   id      stable identifier, also used as the localStorage key for "seen" state
//   group   visual grouping in the wall ("Countries", "Land", "Continents", ...)
//   axis    one of: 'count' | 'land' | 'cont' | 'hemi' | 'climate' | 'pop' | 'coast' | 'geo'
//   t       threshold (number for count/land/pop/coast, code/string for cont/hemi/climate/geo)
//   name    display name (short, evocative)
//   palette key into PALETTE — picks the [bg, ink] pair when unlocked
//   art     key into the badge-art renderer (currently stats.html's badgeArt switch)
//   meta    one-line caption shown below the name
export const BADGES = [
  { id:'c5',   group:'Countries',  axis:'count', t:5,   name:'First Footprints', palette:'sage',       art:'footprint-pair', meta:'5 countries' },
  { id:'c10',  group:'Countries',  axis:'count', t:10,  name:'Tenfold',         palette:'butter',     art:'compass',         meta:'10 countries' },
  { id:'c25',  group:'Countries',  axis:'count', t:25,  name:'Quarter Hundred', palette:'terracotta', art:'sextant',         meta:'25 countries' },
  { id:'c50',  group:'Countries',  axis:'count', t:50,  name:'Half Century',    palette:'sage',       art:'wreath',          meta:'50 countries' },
  { id:'c75',  group:'Countries',  axis:'count', t:75,  name:'Three-Quarter',   palette:'rose',       art:'quarter-arc',     meta:'75 countries' },
  { id:'c100', group:'Countries',  axis:'count', t:100, name:'Centurion',       palette:'plum',       art:'sun',             meta:'100 countries' },
  { id:'c195', group:'Countries',  axis:'count', t:195, name:'Completist',      palette:'rose',       art:'world',           meta:'all UN states' },

  { id:'l1',   group:'Land',       axis:'land', t:1,    name:'First Steps',     palette:'sky',        art:'star',            meta:'1% of land' },
  { id:'l5',   group:'Land',       axis:'land', t:5,    name:'Walked Far',      palette:'butter',     art:'mountains',       meta:'5% of land' },
  { id:'l10',  group:'Land',       axis:'land', t:10,   name:'Far Reaches',     palette:'sage',       art:'flag',            meta:'10% of land' },
  { id:'l25',  group:'Land',       axis:'land', t:25,   name:'Quartermaster',   palette:'terracotta', art:'rope',            meta:'25% of land' },
  { id:'l50',  group:'Land',       axis:'land', t:50,   name:'Halfway Home',    palette:'plum',       art:'anchor',          meta:'50% of land' },

  { id:'cont-EU', group:'Continents', axis:'cont', t:'EU', name:'Europe',     palette:'sky',        art:'cont-EU', meta:'visit any country' },
  { id:'cont-AS', group:'Continents', axis:'cont', t:'AS', name:'Asia',       palette:'butter',     art:'cont-AS', meta:'visit any country' },
  { id:'cont-AF', group:'Continents', axis:'cont', t:'AF', name:'Africa',     palette:'terracotta', art:'cont-AF', meta:'visit any country' },
  { id:'cont-NA', group:'Continents', axis:'cont', t:'NA', name:'N. America', palette:'sage',       art:'cont-NA', meta:'visit any country' },
  { id:'cont-SA', group:'Continents', axis:'cont', t:'SA', name:'S. America', palette:'plum',       art:'cont-SA', meta:'visit any country' },
  { id:'cont-OC', group:'Continents', axis:'cont', t:'OC', name:'Oceania',    palette:'rose',       art:'cont-OC', meta:'visit any country' },

  { id:'h-N', group:'Hemispheres', axis:'hemi', t:'N', name:'Northerner', palette:'sky',     art:'hemi-N', meta:'northern hemi' },
  { id:'h-S', group:'Hemispheres', axis:'hemi', t:'S', name:'Southerner', palette:'sage',    art:'hemi-S', meta:'southern hemi' },
  { id:'h-E', group:'Hemispheres', axis:'hemi', t:'E', name:'Easterner',  palette:'butter',  art:'hemi-E', meta:'eastern hemi' },
  { id:'h-W', group:'Hemispheres', axis:'hemi', t:'W', name:'Westerner',  palette:'rose',    art:'hemi-W', meta:'western hemi' },

  { id:'clim-tropical',    group:'Climate', axis:'climate', t:'Tropical',    name:'In the Tropics',  palette:'sage',       art:'palm-circle', meta:'tropical zone' },
  { id:'clim-subtropical', group:'Climate', axis:'climate', t:'Subtropical', name:'Sun Belt',        palette:'butter',     art:'cactus-sun',  meta:'subtropical zone' },
  { id:'clim-temperate',   group:'Climate', axis:'climate', t:'Temperate',   name:'Four Seasons',    palette:'terracotta', art:'leaf-quad',   meta:'temperate zone' },
  { id:'clim-subarctic',   group:'Climate', axis:'climate', t:'Subarctic',   name:'Pine Latitudes',  palette:'sky',        art:'pine-row',    meta:'subarctic zone' },
  { id:'clim-polar',       group:'Climate', axis:'climate', t:'Polar',       name:'Polar Marker',    palette:'blue',       art:'iceberg',     meta:'polar zone' },

  { id:'pop-100m', group:'People',  axis:'pop', t:100,  name:'A Hundred Million', palette:'rose',       art:'crowd-3',     meta:'100M people' },
  { id:'pop-500m', group:'People',  axis:'pop', t:500,  name:'Half a Billion',    palette:'terracotta', art:'crowd-5',     meta:'500M people' },
  { id:'pop-1b',   group:'People',  axis:'pop', t:1000, name:'A Billion',         palette:'plum',       art:'globe-pulse', meta:'1B people' },
  { id:'pop-2b',   group:'People',  axis:'pop', t:2000, name:'Two Billion',       palette:'butter',     art:'globe-crowd', meta:'2B people' },

  { id:'coast-5',  group:'Coast', axis:'coast', t:5,  name:'Tide Watcher',         palette:'sky',  art:'wave-single', meta:'5 coastal' },
  { id:'coast-15', group:'Coast', axis:'coast', t:15, name:'Sea Wanderer',         palette:'blue', art:'wave-trio',   meta:'15 coastal' },
  { id:'coast-30', group:'Coast', axis:'coast', t:30, name:'Cartographer of Shores', palette:'sage', art:'coast-map', meta:'30 coastal' },

  { id:'geo-equator',  group:'Geo', axis:'geo', t:'equator',  name:'Across the Line',   palette:'butter',     art:'equator-line', meta:'crossed the equator' },
  { id:'geo-arctic',   group:'Geo', axis:'geo', t:'arctic',   name:'Above the Circle',  palette:'sky',        art:'aurora',       meta:'Arctic Circle' },
  { id:'geo-himalaya', group:'Geo', axis:'geo', t:'himalaya', name:'Roof of the World', palette:'bone',       art:'peaks-three',  meta:'Himalayan nation' },
  { id:'geo-andes',    group:'Geo', axis:'geo', t:'andes',    name:'Spine of America',  palette:'terracotta', art:'ridge-line',   meta:'Andean nation' },
  { id:'geo-sahara',   group:'Geo', axis:'geo', t:'sahara',   name:'Sand Reckoning',    palette:'butter',     art:'dunes-sun',    meta:'Sahara nation' },
];

// Eight named palettes — each [background, ink]. Used by both the badge wall
// (one palette per badge) and the climate icons (single shared ink).
// v2's tier system will introduce a separate TIER_INKS map (bronze/silver/
// gold/indigo) that overlays on top of these palettes for the 7 "lines".
export const PALETTE = {
  terracotta: ['#E9C9B6','#5A2E1A'],
  blue:       ['#BFD0DD','#1F3B55'],
  sage:       ['#C7D2B8','#2D3E1F'],
  butter:     ['#ECDFA7','#4A3C0E'],
  plum:       ['#C9B4C2','#3C1F38'],
  rose:       ['#E2BAB6','#561F22'],
  sky:        ['#C6D8E2','#1B3A4F'],
  bone:       ['#DCD3BB','#2A2410'],
};
