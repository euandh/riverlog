// lib/constants.ts

export const UK_REGIONS = [
  { id: 'all', name: 'All UK', coords: [54.5, -4.0], zoom: 6 },
  { id: 'scotland', name: 'Scotland', coords: [56.8, -4.2], zoom: 8 },
  { id: 'northern_england', name: 'Northern England', coords: [54.5, -2.5], zoom: 8 }, // Perfectly frames Lakes & Pennines
  { id: 'north_wales', name: 'North Wales', coords: [53.0612457517563, -3.539188965017361], zoom: 9 },           // Snowdonia / Eryri
  { id: 'south_wales', name: 'South Wales', coords: [52.3, -3.5], zoom: 9 },           // Brecon Beacons / Bannau Brycheiniog
  { id: 'dartmoor', name: 'Dartmoor', coords: [50.57, -3.99], zoom: 10 },              // Tighter zoom just for the moor
];