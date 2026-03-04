export interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
}

export interface CountryAttractions {
  [countryCode: string]: Attraction[];
}

export const attractions: CountryAttractions = {
  IN: [
    { id: 'ind-1', name: 'Taj Mahal', description: 'Iconic marble mausoleum in Agra', image: '/images/attractions/taj-mahal.jpg', category: 'Monument' },
    { id: 'ind-2', name: 'Varanasi Ghats', description: 'Sacred bathing ghats along the Ganges River', image: '/images/attractions/varanasi-ghats.jpg', category: 'Religious Site' },
    { id: 'ind-3', name: 'Jaipur City Palace', description: 'Magnificent pink-colored palace complex', image: '/images/attractions/jaipur-palace.jpg', category: 'Palace' },
  ],
  US: [
    { id: 'usa-1', name: 'Statue of Liberty', description: 'Iconic symbol of freedom in New York Harbor', image: '/images/attractions/statue-liberty.jpg', category: 'Monument' },
    { id: 'usa-2', name: 'Grand Canyon', description: 'Massive canyon carved by Colorado River', image: '/images/attractions/grand-canyon.jpg', category: 'Natural Wonder' },
    { id: 'usa-3', name: 'Golden Gate Bridge', description: 'Iconic red suspension bridge in San Francisco', image: '/images/attractions/golden-gate.jpg', category: 'Bridge' },
  ],
  FR: [
    { id: 'fra-1', name: 'Eiffel Tower', description: 'Iconic iron tower in Paris', image: '/images/attractions/eiffel-tower.jpg', category: 'Monument' },
    { id: 'fra-2', name: 'Louvre Museum', description: 'World-famous art museum', image: '/images/attractions/louvre.jpg', category: 'Museum' },
    { id: 'fra-3', name: 'Arc de Triomphe', description: 'Monumental arch celebrating military victories', image: '/images/attractions/arc-triomphe.jpg', category: 'Monument' },
  ],
  IT: [
    { id: 'ita-1', name: 'Colosseum', description: 'Ancient Roman amphitheater in Rome', image: '/images/attractions/colosseum.jpg', category: 'Ancient Site' },
    { id: 'ita-2', name: 'Vatican City', description: 'Center of Roman Catholic Church', image: '/images/attractions/vatican.jpg', category: 'Religious Site' },
    { id: 'ita-3', name: 'Venice Canals', description: 'Scenic waterways through Venice', image: '/images/attractions/venice-canals.jpg', category: 'City' },
  ],
  JP: [
    { id: 'jpn-1', name: 'Mount Fuji', description: 'Iconic snow-capped volcanic mountain', image: '/images/attractions/mount-fuji.jpg', category: 'Mountain' },
    { id: 'jpn-2', name: 'Fushimi Inari Shrine', description: 'Thousands of vermillion torii gates', image: '/images/attractions/fushimi-inari.jpg', category: 'Temple' },
    { id: 'jpn-3', name: 'Shibuya Crossing', description: 'World\'s busiest pedestrian crossing', image: '/images/attractions/shibuya.jpg', category: 'City' },
  ],
  EG: [
    { id: 'egy-1', name: 'Great Pyramids of Giza', description: 'Ancient wonder of the world', image: '/images/attractions/pyramids-giza.jpg', category: 'Ancient Site' },
    { id: 'egy-2', name: 'Sphinx', description: 'Legendary limestone statue', image: '/images/attractions/sphinx.jpg', category: 'Ancient Site' },
    { id: 'egy-3', name: 'Valley of the Kings', description: 'Burial site of pharaohs', image: '/images/attractions/valley-kings.jpg', category: 'Archaeological Site' },
  ],
  BR: [
    { id: 'bra-1', name: 'Christ the Redeemer', description: 'Iconic statue overlooking Rio', image: '/images/attractions/christ-redeemer.jpg', category: 'Monument' },
    { id: 'bra-2', name: 'Iguazu Falls', description: 'Massive waterfall system', image: '/images/attractions/iguazu-falls.jpg', category: 'Natural Wonder' },
    { id: 'bra-3', name: 'Amazon Rainforest', description: 'World\'s largest tropical rainforest', image: '/images/attractions/amazon.jpg', category: 'Natural Site' },
  ],
  AU: [
    { id: 'aus-1', name: 'Sydney Opera House', description: 'Iconic performing arts venue', image: '/images/attractions/sydney-opera.jpg', category: 'Architecture' },
    { id: 'aus-2', name: 'Great Barrier Reef', description: 'World\'s largest coral reef system', image: '/images/attractions/barrier-reef.jpg', category: 'Natural Wonder' },
    { id: 'aus-3', name: 'Uluru', description: 'Sacred Aboriginal rock formation', image: '/images/attractions/uluru.jpg', category: 'Natural Site' },
  ],
  CN: [
    { id: 'chn-1', name: 'Great Wall of China', description: 'Massive defensive wall spanning thousands of km', image: '/images/attractions/great-wall.jpg', category: 'Monument' },
    { id: 'chn-2', name: 'Forbidden City', description: 'Imperial palace complex in Beijing', image: '/images/attractions/forbidden-city.jpg', category: 'Palace' },
    { id: 'chn-3', name: 'Terracotta Army', description: 'Ancient clay soldiers in Xi\'an', image: '/images/attractions/terracotta.jpg', category: 'Archaeological Site' },
  ],
  MX: [
    { id: 'mex-1', name: 'Chichen Itza', description: 'Ancient Mayan ruins', image: '/images/attractions/chichen-itza.jpg', category: 'Archaeological Site' },
    { id: 'mex-2', name: 'Cancun Beach', description: 'Beautiful Caribbean beaches', image: '/images/attractions/cancun.jpg', category: 'Beach' },
    { id: 'mex-3', name: 'Mexico City Metropolitan', description: 'Historic city center with palaces', image: '/images/attractions/mexico-city.jpg', category: 'City' },
  ],
  PE: [
    { id: 'per-1', name: 'Machu Picchu', description: 'Ancient Incan citadel', image: '/images/attractions/machu-picchu.jpg', category: 'Archaeological Site' },
    { id: 'per-2', name: 'Sacred Valley', description: 'Valley of Incan heritage sites', image: '/images/attractions/sacred-valley.jpg', category: 'Region' },
    { id: 'per-3', name: 'Nazca Lines', description: 'Ancient geoglyphs in desert', image: '/images/attractions/nazca-lines.jpg', category: 'Archaeological Site' },
  ],
  GB: [
    { id: 'gbr-1', name: 'Big Ben & Parliament', description: 'Iconic clock tower and government building', image: '/images/attractions/big-ben.jpg', category: 'Monument' },
    { id: 'gbr-2', name: 'Tower of London', description: 'Historic fortress and royal palace', image: '/images/attractions/tower-london.jpg', category: 'Historical Site' },
    { id: 'gbr-3', name: 'Stonehenge', description: 'Mysterious prehistoric monument', image: '/images/attractions/stonehenge.jpg', category: 'Archaeological Site' },
  ],
  ES: [
    { id: 'esp-1', name: 'Sagrada Familia', description: 'Gaudi\'s masterpiece basilica', image: '/images/attractions/sagrada-familia.jpg', category: 'Architecture' },
    { id: 'esp-2', name: 'Alhambra', description: 'Islamic palace in Granada', image: '/images/attractions/alhambra.jpg', category: 'Palace' },
    { id: 'esp-3', name: 'Barcelona Park Guell', description: 'Colorful mosaic park by Gaudi', image: '/images/attractions/park-guell.jpg', category: 'Park' },
  ],
  NZ: [
    { id: 'nzl-1', name: 'Milford Sound', description: 'Scenic fjord with waterfalls', image: '/images/attractions/milford-sound.jpg', category: 'Natural Wonder' },
    { id: 'nzl-2', name: 'Hobbiton Movie Set', description: 'Lord of the Rings filming location', image: '/images/attractions/hobbiton.jpg', category: 'Film Location' },
    { id: 'nzl-3', name: 'Rotorua Geysers', description: 'Active geysers and hot springs', image: '/images/attractions/rotorua.jpg', category: 'Natural Site' },
  ],
  TH: [
    { id: 'tha-1', name: 'Grand Palace', description: 'Royal residence in Bangkok', image: '/images/attractions/grand-palace.jpg', category: 'Palace' },
    { id: 'tha-2', name: 'Angkor Wat', description: 'Largest religious monument in Cambodia', image: '/images/attractions/angkor-wat.jpg', category: 'Temple' },
    { id: 'tha-3', name: 'Phi Phi Islands', description: 'Scenic island group', image: '/images/attractions/phi-phi.jpg', category: 'Island' },
  ],
  DE: [
    { id: 'deu-1', name: 'Brandenburg Gate', description: 'Iconic gate in Berlin', image: '/images/attractions/brandenburg-gate.jpg', category: 'Monument' },
    { id: 'deu-2', name: 'Neuschwanstein Castle', description: 'Fairy-tale castle in Bavaria', image: '/images/attractions/neuschwanstein.jpg', category: 'Castle' },
    { id: 'deu-3', name: 'Berlin Wall Memorial', description: 'Historical remains of Berlin Wall', image: '/images/attractions/berlin-wall.jpg', category: 'Historical Site' },
  ],
};

export function getAttractionsByCountry(countryCode: string): Attraction[] {
  // Return attractions if they exist, otherwise generate default attractions for the country
  if (attractions[countryCode]) {
    return attractions[countryCode];
  }
  
  // Generate default attractions for any country not in the database
  return [
    {
      id: `${countryCode}-1`,
      name: 'Local Heritage Site',
      description: 'Discover the rich cultural heritage and historical landmarks of this destination',
      image: '/images/attractions/generic-heritage.jpg',
      category: 'Heritage',
    },
    {
      id: `${countryCode}-2`,
      name: 'Natural Scenic Spot',
      description: 'Experience the natural beauty and breathtaking landscapes of the region',
      image: '/images/attractions/generic-nature.jpg',
      category: 'Natural Wonder',
    },
    {
      id: `${countryCode}-3`,
      name: 'Cultural Market',
      description: 'Immerse yourself in local culture and traditional marketplace experiences',
      image: '/images/attractions/generic-market.jpg',
      category: 'Cultural Site',
    },
  ];
}
